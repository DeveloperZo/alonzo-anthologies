# Step 2d. Administrator. Blocks inbound 11434 as a second layer, then rechecks a chat.
. "$PSScriptRoot\_lib.ps1"
if (-not (Test-Admin)) { Log '2-firewall' 'FAIL' 'not an administrator shell'; exit 1 }
$name = 'WHL: block Ollama 11434 inbound'
if (-not (Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName $name -Direction Inbound -Protocol TCP -LocalPort 11434 -Action Block -Profile Any | Out-Null
}
$models = (Get-Code 'http://localhost:4000/v1/models' (Get-EnvValue 'LITELLM_MASTER_KEY')) -eq 200
$c = Get-DoorContainer 4000
$out = if ($c) { docker exec $c python -c "import urllib.request;print(urllib.request.urlopen('http://host.docker.internal:11434/api/version',timeout=10).status)" 2>&1 } else { 'no container' }
if (-not $models -or "$out" -notmatch '200') {
    Remove-NetFirewallRule -DisplayName $name
    Log '2-firewall' 'FAIL' "with the rule on: models list ok=$models, front door to Ollama: $out; rule removed"; exit 1
}
Log '2-firewall' 'PASS' 'block rule on, front door lists models and reaches Ollama'
