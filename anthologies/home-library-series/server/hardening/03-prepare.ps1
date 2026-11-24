# Step 3a-3b (first half). Finds both doors, reports whether they have a database, adds three secrets to .env
# if missing, and copies docker-compose.yml aside. Prints no secret.
. "$PSScriptRoot\_lib.ps1"
$front = Get-DoorContainer 4000; $priv = Get-DoorContainer 4001
Write-Host "front door container: $front"
Write-Host "private door container: $priv"
foreach ($c in $front, $priv) {
    $u = docker exec $c printenv DATABASE_URL 2>$null
    Write-Host ("{0} DATABASE_URL set: {1}" -f $c, [bool]$u)
}
$added = @()
foreach ($n in 'LITELLM_DB_PASSWORD', 'LITELLM_SALT_KEY', 'LITELLM_PRIVATE_SALT_KEY') {
    if (-not (Get-EnvValue $n)) {
        $v = New-Secret; if ($n -like '*SALT*') { $v = "sk-salt-$v" }
        Add-Content $WhlEnv "$n=$v"; $added += $n
    }
}
$bak = "$WhlCompose\docker-compose.yml.bak-hardening"
if (-not (Test-Path $bak)) { Copy-Item "$WhlCompose\docker-compose.yml" $bak }
Log '3-prepare' 'PASS' "front=$front private=$priv; added to .env: $($added -join ', '); compose copy at $bak"
