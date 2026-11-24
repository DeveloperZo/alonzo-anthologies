# Step 1e. Restores the LiteLLM config from the latest snapshot and compares it with the live file. Prints MATCH or MISMATCH.
param([Parameter(Mandatory)][string]$Repo)
. "$PSScriptRoot\_lib.ps1"
$restic = Get-Content "$SafeDir\restic.path"
$env:RESTIC_REPOSITORY = $Repo; $env:RESTIC_PASSWORD_FILE = "$SafeDir\whl.pass"
$target = Join-Path (Split-Path $Repo -Qualifier) '\whl-restore-test'
& $restic restore latest --target $target --include 'config.yaml' *> $null
$copy = Get-ChildItem $target -Recurse -Filter config.yaml -ErrorAction SilentlyContinue | Where-Object FullName -like '*\config\litellm\*' | Select-Object -First 1
$same = $copy -and ((Get-FileHash E:\WHL\config\litellm\config.yaml).Hash -eq (Get-FileHash $copy.FullName).Hash)
Remove-Item $target -Recurse -Force -ErrorAction SilentlyContinue
if ($same) { Log '1-restore' 'PASS' 'MATCH' } else { Log '1-restore' 'FAIL' 'MISMATCH or not restored'; exit 1 }
