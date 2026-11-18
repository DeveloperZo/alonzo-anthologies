<#
Checks that this machine can use the home library server on the desktop.
Run it on limesalt (or on the desktop itself). It changes nothing.

  powershell -NoProfile -ExecutionPolicy Bypass -File verify.ps1

Optional: set WHL_LITELLM_KEY to the LiteLLM master key (LITELLM_MASTER_KEY in
E:\WHL\compose\.env on the desktop) to also run a chat through the relay and
confirm it. Without the key those checks are skipped, not failed.

Exit code 0 means every check that ran passed.
#>
param(
    [string]$Desktop = "win-mpisa5dbmqf",
    [string]$OllamaModel = "qwen2.5-coder:14b",
    [string]$RelayModel = "ollama-coder"
)

$ErrorActionPreference = "Stop"
$results = New-Object System.Collections.Generic.List[object]

function Add-Result([string]$Name, [string]$Status, [string]$Detail) {
    $results.Add([pscustomobject]@{ Check = $Name; Result = $Status; Detail = $Detail })
}

function Test-Step([string]$Name, [scriptblock]$Body) {
    try {
        $detail = & $Body
        Add-Result $Name "PASS" "$detail"
    } catch {
        Add-Result $Name "FAIL" $_.Exception.Message
    }
}

function Get-StatusCode([string]$Url, [hashtable]$Headers = @{}) {
    try {
        return [int](Invoke-WebRequest -Uri $Url -Headers $Headers -UseBasicParsing -TimeoutSec 20).StatusCode
    } catch {
        if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode }
        throw
    }
}

function Send-Chat([string]$Url, [string]$Model, [hashtable]$Headers = @{}) {
    $body = @{
        model      = $Model
        messages   = @(@{ role = "user"; content = "Reply with one word: ready" })
        max_tokens = 200
    } | ConvertTo-Json -Depth 5
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $r = Invoke-RestMethod -Uri $Url -Method Post -Headers $Headers -ContentType "application/json" -Body $body -TimeoutSec 180
    $reply = $r.choices[0].message.content
    if (-not $reply) { throw "empty reply" }
    return "replied '$($reply.Trim())' in $([math]::Round($sw.Elapsed.TotalSeconds, 1)) s"
}

$base = "http://$Desktop"

# 1. The tunnel. Also records whether the path is direct or relayed.
# The Tailscale command is often missing from PATH in a non-interactive shell,
# so fall back to the default install folder. If it cannot be found at all the
# check is skipped: the service checks below prove the tunnel on their own.
$tailscale = (Get-Command tailscale -ErrorAction SilentlyContinue).Source
if (-not $tailscale) {
    $default = Join-Path $env:ProgramFiles "Tailscale\tailscale.exe"
    if (Test-Path $default) { $tailscale = $default }
}
if ($tailscale) {
    Test-Step "Tailscale reaches the desktop" {
        $out = (& $tailscale ping --c 1 $Desktop 2>&1 | Out-String).Trim()
        if ($out -match "is local Tailscale IP") { return "this machine is the desktop, so there is no tunnel to test" }
        if ($out -notmatch "pong") { throw $out }
        $out
    }
} else {
    Add-Result "Tailscale reaches the desktop" "SKIP" "tailscale command not found"
}

# 2 and 3. Ollama, the thin version exit test.
Test-Step "Ollama lists models (port 11434)" {
    $ids = (Invoke-RestMethod -Uri "${base}:11434/v1/models" -TimeoutSec 20).data.id
    if (-not $ids) { throw "no models listed" }
    "$(@($ids).Count) models"
}
Test-Step "Ollama answers a chat" {
    Send-Chat "${base}:11434/v1/chat/completions" $OllamaModel
}

# 4. The relay must be reachable and must refuse a caller with no key.
Test-Step "Relay refuses a request with no key (port 4000)" {
    $code = Get-StatusCode "${base}:4000/v1/models"
    if ($code -ne 401) { throw "expected 401, got $code" }
    "401 as expected"
}

# 5 and 6. The relay with the key, if one was provided.
$key = $env:WHL_LITELLM_KEY
if ($key) {
    $auth = @{ Authorization = "Bearer $key" }
    Test-Step "Relay lists its routes" {
        $ids = (Invoke-RestMethod -Uri "${base}:4000/v1/models" -Headers $auth -TimeoutSec 20).data.id
        if ($ids -notcontains $RelayModel) { throw "route '$RelayModel' missing. Got: $($ids -join ', ')" }
        $ids -join ", "
    }
    Test-Step "Relay answers a chat on '$RelayModel'" {
        Send-Chat "${base}:4000/v1/chat/completions" $RelayModel $auth
    }
} else {
    Add-Result "Relay lists its routes" "SKIP" "WHL_LITELLM_KEY not set"
    Add-Result "Relay answers a chat on '$RelayModel'" "SKIP" "WHL_LITELLM_KEY not set"
}

# 7 to 9. The three web pages.
Test-Step "Langfuse dashboard is up (port 3001)" {
    $r = Invoke-RestMethod -Uri "${base}:3001/api/public/health" -TimeoutSec 20
    if ($r.status -ne "OK") { throw "status was '$($r.status)'" }
    "version $($r.version)"
}
Test-Step "Open WebUI is up (port 3000)" {
    $code = Get-StatusCode "${base}:3000/health"
    if ($code -ne 200) { throw "got $code" }
    "200"
}
Test-Step "Jellyfin is up (port 8096)" {
    $code = Get-StatusCode "${base}:8096/health"
    if ($code -ne 200) { throw "got $code" }
    "200"
}

$results | Format-Table -AutoSize -Wrap | Out-String -Width 160 | Write-Host
$failed = @($results | Where-Object { $_.Result -eq "FAIL" }).Count
$skipped = @($results | Where-Object { $_.Result -eq "SKIP" }).Count
$passed = $results.Count - $failed - $skipped
Write-Host "$passed passed, $failed failed, $skipped skipped. Run from $env:COMPUTERNAME at $(Get-Date -Format 'yyyy-MM-dd HH:mm')."
exit $failed
