# Step 3d. Makes one key per caller. Keys go to a file only Zo opens; this prints aliases, never keys.
# Also sets WHL_LITELLM_KEY and WHL_PRIVATE_KEY for the awill account.
. "$PSScriptRoot\_lib.ps1"
$out = 'C:\Users\awill\whl-keys.txt'
if (Test-Path $out) { Log '3-keys' 'FAIL' "$out already exists; keys were made before. Delete it only if they were never handed out."; exit 1 }
$front = Get-EnvValue 'LITELLM_MASTER_KEY'; $priv = Get-EnvValue 'LITELLM_PRIVATE_KEY'
$frontAll = @((Invoke-RestMethod http://localhost:4000/v1/models -Headers @{ Authorization = "Bearer $front" }).data.id)
$privAll = @((Invoke-RestMethod http://localhost:4001/v1/models -Headers @{ Authorization = "Bearer $priv" }).data.id)
$tools = @($frontAll | Where-Object { $_ -like 'local-*' -or $_ -eq 'paid' })
$plan = @(
    @{ port = 4000; m = $front; alias = 'everyday-page'; models = $frontAll; dest = 'Everyday page, Admin Panel > Settings > Connections' },
    @{ port = 4000; m = $front; alias = 'ask-local-awill'; models = $tools; dest = 'set here as WHL_LITELLM_KEY for awill' },
    @{ port = 4000; m = $front; alias = 'claude-agent'; models = $tools; dest = 'WHL_LITELLM_KEY user variable, signed in as claude_agent' },
    @{ port = 4000; m = $front; alias = 'limesalt'; models = $tools; dest = 'WHL_LITELLM_KEY user variable on limesalt' },
    @{ port = 4000; m = $front; alias = 'factory'; models = $tools; dest = 'software factory runner and Aider on lemonpepper' },
    @{ port = 4001; m = $priv; alias = 'private-page'; models = $privAll; dest = 'Private page, Admin Panel > Settings > Connections' },
    @{ port = 4001; m = $priv; alias = 'n8n-cloud'; models = @('local-fast', 'local-think'); rpm = 20; dest = 'n8n credential Home AI (private door)' },
    @{ port = 4001; m = $priv; alias = 'ask-local-private'; models = @($privAll | Where-Object { $_ -like 'local-*' }); dest = 'set here as WHL_PRIVATE_KEY for awill' }
)
$lines = @("# Made $(Get-Date -Format s). Paste each key where it says, then delete this file.")
$made = @{}
foreach ($k in $plan) {
    $body = @{ key_alias = $k.alias; models = $k.models; metadata = @{ caller = $k.alias } }
    if ($k.rpm) { $body.rpm_limit = $k.rpm }
    try {
        $r = Invoke-RestMethod "http://localhost:$($k.port)/key/generate" -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $($k.m)" } -Body ($body | ConvertTo-Json -Depth 4)
    } catch { Set-Content $out $lines; Log '3-keys' 'FAIL' "could not make $($k.alias): $($_.Exception.Message)"; exit 1 }
    $made[$k.alias] = $r.key
    $lines += "$($k.alias) (port $($k.port)) -> $($k.dest)"; $lines += "  $($r.key)"; $lines += ''
}
Set-Content $out $lines
[Environment]::SetEnvironmentVariable('WHL_LITELLM_KEY', $made['ask-local-awill'], 'User')
[Environment]::SetEnvironmentVariable('WHL_PRIVATE_KEY', $made['ask-local-private'], 'User')
Log '3-keys' 'PASS' "$($made.Count) keys made: $($made.Keys -join ', '). File: $out. awill variables set."
