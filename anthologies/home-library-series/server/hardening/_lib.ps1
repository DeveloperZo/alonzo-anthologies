# Shared helpers for the hardening scripts. Dot-source it: . "$PSScriptRoot\_lib.ps1"
# Nothing here prints a secret.
$ErrorActionPreference = 'Continue'
$Global:WhlEnv = 'E:\WHL\compose\.env'
$Global:WhlCompose = 'E:\WHL\compose'
$Global:RunLog = Join-Path $PSScriptRoot 'run-log.md'
$Global:SafeDir = 'C:\Users\awill\.restic'

function Log([string]$Step, [string]$Result, [string]$Note = '') {
    $line = "- {0} {1} {2} {3}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Step, $Result, $Note
    Add-Content $Global:RunLog $line
    Write-Host $line
}

function Get-EnvValue([string]$Name) {
    $l = Get-Content $Global:WhlEnv | Where-Object { $_ -match "^$Name=" } | Select-Object -First 1
    if ($l) { return ($l -split '=', 2)[1].Trim() } else { return $null }
}

function New-Secret {
    $b = New-Object byte[] 24
    [Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($b)
    return ([Convert]::ToBase64String($b) -replace '[+/=]', '')
}

function Test-Admin {
    $p = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-Code([string]$Url, [string]$Key) {
    $h = @{}; if ($Key) { $h.Authorization = "Bearer $Key" }
    try { return (Invoke-WebRequest $Url -Headers $h -UseBasicParsing -TimeoutSec 20).StatusCode }
    catch { if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode } else { return 0 } }
}

function Wait-Url([string]$Url, [int]$Seconds = 180) {
    $end = (Get-Date).AddSeconds($Seconds)
    while ((Get-Date) -lt $end) {
        if ((Get-Code $Url) -eq 200) { return $true }
        Start-Sleep 3
    }
    return $false
}

function Wait-Doors([int]$Seconds = 180) {
    return ((Wait-Url 'http://localhost:4000/health/liveliness' $Seconds) -and (Wait-Url 'http://localhost:4001/health/liveliness' $Seconds))
}

# One short chat through a door. Returns $true if a reply came back.
function Test-Chat([int]$Port, [string]$Key, [string]$Model = 'local-fast') {
    $body = @{ model = $Model; messages = @(@{ role = 'user'; content = 'Reply with one word: ready' }); max_tokens = 300; user = 'hardening' } | ConvertTo-Json -Depth 4
    try {
        $r = Invoke-RestMethod "http://localhost:$Port/v1/chat/completions" -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $Key" } -Body $body -TimeoutSec 240
        return [bool]$r.choices[0].message
    } catch { return $false }
}

function Get-DoorContainer([int]$Port) {
    $row = docker ps --format '{{.Names}}|{{.Ports}}' | Where-Object { $_ -match ":$Port->" } | Select-Object -First 1
    if ($row) { return ($row -split '\|')[0] } else { return $null }
}
