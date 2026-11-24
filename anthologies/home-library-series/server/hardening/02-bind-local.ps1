# Step 2b-2c. Binds Ollama to 127.0.0.1, restarts it, and checks both doors still answer.
# Undoes itself if anything fails. Ollama is down for 10-60 seconds while this runs.
. "$PSScriptRoot\_lib.ps1"
$prevFile = Join-Path $PSScriptRoot 'ollama_host.prev'
$prev = [Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'User')
if (-not (Test-Path $prevFile)) { Set-Content $prevFile ([string]$prev) }
if ([Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'Machine')) {
    if (-not (Test-Admin)) { Log '2-bind' 'FAIL' 'OLLAMA_HOST is set machine-wide; rerun as administrator'; exit 1 }
    [Environment]::SetEnvironmentVariable('OLLAMA_HOST', $null, 'Machine')
}
function Restart-Ollama([string]$HostValue) {
    $env:OLLAMA_HOST = $HostValue
    Get-Process 'ollama app', 'ollama' -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep 3
    Start-Process "$env:LOCALAPPDATA\Programs\Ollama\ollama app.exe"
    return (Wait-Url 'http://127.0.0.1:11434/api/version' 90)
}
function Undo([string]$Why) {
    $old = (Get-Content $prevFile -Raw).Trim()
    if ($old) { [Environment]::SetEnvironmentVariable('OLLAMA_HOST', $old, 'User') } else { [Environment]::SetEnvironmentVariable('OLLAMA_HOST', $null, 'User') }
    $null = Restart-Ollama $old
    Log '2-bind' 'FAIL' "$Why. Undone: OLLAMA_HOST back to '$old'"
    exit 1
}
[Environment]::SetEnvironmentVariable('OLLAMA_HOST', '127.0.0.1:11434', 'User')
if (-not (Restart-Ollama '127.0.0.1:11434')) { Undo 'Ollama did not come back' }
$addrs = @((Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue).LocalAddress | Sort-Object -Unique)
if ($addrs.Count -ne 1 -or $addrs[0] -ne '127.0.0.1') { Undo "listening on $($addrs -join ', ')" }
foreach ($port in 4000, 4001) {
    $c = Get-DoorContainer $port
    if (-not $c) { Undo "no container on port $port" }
    $out = docker exec $c python -c "import urllib.request;print(urllib.request.urlopen('http://host.docker.internal:11434/api/version',timeout=10).status)" 2>&1
    if ("$out" -notmatch '200') { Undo "$c cannot reach Ollama: $out" }
}
if (-not (Test-Chat 4000 (Get-EnvValue 'LITELLM_MASTER_KEY'))) { Undo 'front door chat failed' }
if (-not (Test-Chat 4001 (Get-EnvValue 'LITELLM_PRIVATE_KEY'))) { Undo 'private door chat failed' }
Log '2-bind' 'PASS' 'Ollama on 127.0.0.1 only; both doors reach it and answered a chat'
