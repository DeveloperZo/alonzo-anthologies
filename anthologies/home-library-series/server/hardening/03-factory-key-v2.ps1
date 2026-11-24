# Makes a second factory key (alias factory-v2) that also reaches claude-sonnet, with a 25 USD budget,
# and saves it as WHL_FACTORY_KEY for awill. Prints no key. Leaves the old 'factory' key in place.
. "$PSScriptRoot\_lib.ps1"
$m = Get-EnvValue 'LITELLM_MASTER_KEY'
try { $all = @((Invoke-RestMethod http://localhost:4000/v1/models -Headers @{ Authorization = "Bearer $m" } -TimeoutSec 30).data.id) }
catch { Log '3-factory-v2' 'FAIL' "could not list models: $($_.Exception.Message)"; exit 1 }
if ($all -notcontains 'claude-sonnet') { Log '3-factory-v2' 'FAIL' 'no claude-sonnet route'; exit 1 }
$models = @('local-fast', 'local-think', 'local-coder', 'paid', 'claude-sonnet' | Where-Object { $all -contains $_ })
$body = @{ key_alias = 'factory-v2'; models = $models; max_budget = 25; metadata = @{ caller = 'factory' } } | ConvertTo-Json -Depth 4
try {
    $r = Invoke-RestMethod http://localhost:4000/key/generate -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $m" } -Body $body -TimeoutSec 30
} catch { Log '3-factory-v2' 'FAIL' "could not make factory-v2: $($_.Exception.Message)"; exit 1 }
$key = $r.key
if (-not $key) { Log '3-factory-v2' 'FAIL' 'key/generate returned no key'; exit 1 }
[Environment]::SetEnvironmentVariable('WHL_FACTORY_KEY', $key, 'User')
$code = Get-Code 'http://localhost:4000/v1/models' $key
$seen = @()
try { $seen = @((Invoke-RestMethod http://localhost:4000/v1/models -Headers @{ Authorization = "Bearer $key" } -TimeoutSec 30).data.id) } catch {}
$key = $null; $r = $null
if ($code -ne 200 -or $seen -notcontains 'claude-sonnet') { Log '3-factory-v2' 'FAIL' "new key /v1/models answered $code, lists claude-sonnet: $($seen -contains 'claude-sonnet')"; exit 1 }
Log '3-factory-v2' 'PASS' "factory-v2 made (budget 25) with routes $($models -join ', '); saved as WHL_FACTORY_KEY for awill; /v1/models 200 with claude-sonnet; old factory key kept"
