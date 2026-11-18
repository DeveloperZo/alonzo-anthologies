<#
Brings the whole home library server up on the desktop and checks it.
Safe to run at any time: anything already running is left alone.

  powershell -NoProfile -ExecutionPolicy Bypass -File start.ps1

Run it after a restart of the desktop, once you have logged in. It:
  1. waits for Ollama (which starts by itself at login)
  2. starts Docker Desktop if its engine is not answering
  3. starts the relay, chat page, media server, dashboard and board containers
  4. starts the board's collector if it is not running
  5. runs the client check and prints the result

It changes no settings. Exit code 0 means every check passed.
#>
param(
    [string]$WhlRoot = "E:\WHL",
    [switch]$SkipVerify
)

$ErrorActionPreference = "Continue"
$series = Split-Path -Parent $PSScriptRoot
$serverDir = $PSScriptRoot
$boardDir = Join-Path $series "board"
$clientDir = Join-Path $series "client"

function Say([string]$Text) { Write-Host ("[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Text) }

function Test-Url([string]$Url) {
    try { $null = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5; return $true } catch { return $false }
}

function Test-Engine {
    $v = (& docker info --format "{{.ServerVersion}}" 2>$null)
    return [bool]$v
}

# 1. Ollama
Say "Checking Ollama"
if (-not (Test-Url "http://localhost:11434/")) {
    $app = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama app.exe"
    if (Test-Path $app) {
        Say "Ollama is not answering. Starting it."
        Start-Process $app
        foreach ($i in 1..20) { Start-Sleep -Seconds 2; if (Test-Url "http://localhost:11434/") { break } }
    }
}
if (Test-Url "http://localhost:11434/") { Say "Ollama is up" } else { Say "Ollama is NOT up. Start it from the Start menu, then run this again." }

# 2. Docker Desktop
Say "Checking the Docker engine"
if (-not (Test-Engine)) {
    $running = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue
    if (-not $running) {
        # Docker Desktop 4.33 can crash on launch when a socket file from the
        # last run is left behind. Moving the folder aside is the known fix.
        $run = Join-Path $env:LOCALAPPDATA "Docker\run"
        if ((Test-Path $run) -and (Get-ChildItem $run -Force -ErrorAction SilentlyContinue)) {
            $aside = "run.stale-" + (Get-Date -Format "yyyyMMdd-HHmmss")
            try { Rename-Item $run $aside -ErrorAction Stop; Say "Moved a leftover Docker socket folder aside ($aside)" } catch { Say "Could not move the leftover socket folder: $($_.Exception.Message)" }
        }
        Say "Starting Docker Desktop"
        Start-Process (Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe")
    }
    foreach ($i in 1..90) { Start-Sleep -Seconds 2; if (Test-Engine) { break } }
}
if (-not (Test-Engine)) {
    Say "The Docker engine did not come up within 3 minutes. Open Docker Desktop and look for an error, then run this again."
    exit 1
}
Say "Docker engine is up"

# 3. Containers. `up -d` leaves running containers alone.
function Start-Compose([string]$Dir, [string[]]$Files, [string]$Label) {
    if (-not (Test-Path $Dir)) { Say "Skipping ${Label}: $Dir not found"; return }
    foreach ($f in $Files) { if (-not (Test-Path (Join-Path $Dir $f))) { Say "Skipping ${Label}: $f not found"; return } }
    $fileArgs = @(); foreach ($f in $Files) { $fileArgs += @("-f", $f) }
    Push-Location $Dir
    try {
        & docker compose @fileArgs up -d 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) { Say "$Label is up" } else { Say "$Label FAILED to start (docker compose exit $LASTEXITCODE)" }
    } finally { Pop-Location }
}

Start-Compose (Join-Path $WhlRoot "compose") @("docker-compose.yml") "Relay and chat page"
Start-Compose (Join-Path $WhlRoot "compose") @("docker-compose.media.yml") "Media server"
Start-Compose $serverDir @("langfuse.compose.yml", "langfuse.override.yml") "Langfuse"
Start-Compose $boardDir @("board.compose.yml") "Board page"

# 4. The board's collector, a plain Python script that must run on Windows
# itself because it reads the graphics card.
$collector = Join-Path $boardDir "collector.py"
if (Test-Path $collector) {
    $already = Get-CimInstance Win32_Process -Filter "Name like 'python%'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like "*collector.py*" }
    if ($already) {
        Say "Board collector is already running (pid $($already[0].ProcessId))"
    } else {
        $py = (Get-Command pythonw -ErrorAction SilentlyContinue).Source
        if (-not $py) { $py = (Get-Command python -ErrorAction SilentlyContinue).Source }
        if ($py) {
            Start-Process -FilePath $py -ArgumentList "`"$collector`"" -WorkingDirectory $boardDir -WindowStyle Hidden
            Say "Board collector started"
        } else {
            Say "Python not found, so the board will show NO DATA"
        }
    }
}

# 5. Check everything.
if ($SkipVerify) { exit 0 }
Say "Waiting for the relay and Langfuse to answer"
foreach ($i in 1..40) {
    if ((Test-Url "http://localhost:3001/api/public/health") -and (Test-Url "http://localhost:4000/health/liveliness")) { break }
    Start-Sleep -Seconds 3
}
$envFile = Join-Path $WhlRoot "compose\.env"
if (-not $env:WHL_LITELLM_KEY -and (Test-Path $envFile)) {
    $line = Get-Content $envFile | Where-Object { $_ -match '^LITELLM_MASTER_KEY=' } | Select-Object -First 1
    if ($line) { $env:WHL_LITELLM_KEY = ($line -split '=', 2)[1].Trim() }
}
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $clientDir "verify.ps1")
exit $LASTEXITCODE
