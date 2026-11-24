# Step 3c. Run after docker-compose.yml has the litellm-db service and the DATABASE_URL lines.
# Both doors restart (30-120 s). Restores the compose copy and restarts if anything fails.
. "$PSScriptRoot\_lib.ps1"
function Undo([string]$Why) {
    Copy-Item "$WhlCompose\docker-compose.yml" "$WhlCompose\docker-compose.yml.failed" -Force
    Copy-Item "$WhlCompose\docker-compose.yml.bak-hardening" "$WhlCompose\docker-compose.yml" -Force
    Push-Location $WhlCompose; docker compose up -d 2>&1 | Out-Null; Pop-Location
    $back = Wait-Doors 180
    Log '3-db' 'FAIL' "$Why. Compose restored (failed copy kept as docker-compose.yml.failed); doors back: $back"
    exit 1
}
Push-Location $WhlCompose
docker compose config -q 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { Pop-Location; Undo 'docker compose config rejects the edited file' }
docker compose up -d litellm-db 2>&1 | Out-Null
$ready = $false
foreach ($i in 1..30) { docker exec whl-litellm-db pg_isready -U litellm 2>&1 | Out-Null; if ($LASTEXITCODE -eq 0) { $ready = $true; break }; Start-Sleep 2 }
if (-not $ready) { Pop-Location; Undo 'database did not become ready' }
$dbs = docker exec whl-litellm-db psql -U litellm -d litellm_front -tAc "select datname from pg_database" 2>&1
if ("$dbs" -notmatch 'litellm_private') { docker exec whl-litellm-db createdb -U litellm litellm_private 2>&1 | Out-Null }
docker compose up -d 2>&1 | Out-Null
Pop-Location
if (-not (Wait-Doors 240)) { Undo 'a door did not come back' }
foreach ($port in 4000, 4001) {
    $c = Get-DoorContainer $port
    if (-not (docker exec $c printenv DATABASE_URL 2>$null)) { Undo "$c has no DATABASE_URL" }
}
if (Select-String -Path E:\WHL\config\litellm\*.yaml -Pattern 'store_prompts_in_spend_logs:\s*true' -Quiet) { Undo 'a config stores prompts in spend logs' }
$f = Get-Code 'http://localhost:4000/key/list' (Get-EnvValue 'LITELLM_MASTER_KEY')
$p = Get-Code 'http://localhost:4001/key/list' (Get-EnvValue 'LITELLM_PRIVATE_KEY')
if ($f -ne 200 -or $p -ne 200) { Undo "key list answered $f / $p, expected 200 / 200" }
$ui = Get-Code 'http://localhost:4001/ui/'
Log '3-db' 'PASS' "both doors have a database; private door /ui answered $ui (expect 404 or not 200)"
