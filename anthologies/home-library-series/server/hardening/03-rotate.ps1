# Step 3g. Run only after Zo confirms every caller has its new key. Replaces both master keys,
# restarts the doors, and proves the old keys are refused and the new caller keys still work.
. "$PSScriptRoot\_lib.ps1"
$oldF = Get-EnvValue 'LITELLM_MASTER_KEY'; $oldP = Get-EnvValue 'LITELLM_PRIVATE_KEY'
Copy-Item $WhlEnv "$WhlEnv.bak-rotate" -Force
(Get-Content $WhlEnv) -replace '^LITELLM_MASTER_KEY=.*', "LITELLM_MASTER_KEY=sk-$(New-Secret)" -replace '^LITELLM_PRIVATE_KEY=.*', "LITELLM_PRIVATE_KEY=sk-$(New-Secret)" | Set-Content $WhlEnv
Push-Location $WhlCompose; docker compose up -d 2>&1 | Out-Null; Pop-Location
if (-not (Wait-Doors 240)) { Log '3-rotate' 'FAIL' "doors did not come back; old .env at $WhlEnv.bak-rotate"; exit 1 }
$of = Get-Code 'http://localhost:4000/v1/models' $oldF; $op = Get-Code 'http://localhost:4001/v1/models' $oldP
$nf = Get-Code 'http://localhost:4000/v1/models' (Get-EnvValue 'LITELLM_MASTER_KEY'); $np = Get-Code 'http://localhost:4001/v1/models' (Get-EnvValue 'LITELLM_PRIVATE_KEY')
if ($of -ne 401 -or $op -ne 401 -or $nf -ne 200 -or $np -ne 200) { Log '3-rotate' 'FAIL' "old $of/$op (want 401/401), new $nf/$np (want 200/200)"; exit 1 }
Get-CimInstance Win32_Process -Filter "Name like 'python%'" | Where-Object { $_.CommandLine -like '*collector.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path (Split-Path $PSScriptRoot) 'start.ps1') -SkipVerify | Out-Null
Remove-Item "$WhlEnv.bak-rotate" -Force
Log '3-rotate' 'PASS' 'old master keys refused, new ones work, board collector restarted'
