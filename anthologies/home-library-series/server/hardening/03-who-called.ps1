# Before 3g. Lists, per key alias, how many requests each door logged today and the latest time. Prints no key.
. "$PSScriptRoot\_lib.ps1"
$today = (Get-Date).ToUniversalTime().Date
foreach ($d in @(@{ port = 4000; k = (Get-EnvValue 'LITELLM_MASTER_KEY') }, @{ port = 4001; k = (Get-EnvValue 'LITELLM_PRIVATE_KEY') })) {
    try {
        $logs = @(Invoke-RestMethod "http://localhost:$($d.port)/spend/logs" -Headers @{ Authorization = "Bearer $($d.k)" } -TimeoutSec 60 | ForEach-Object { $_ })
    } catch { Write-Host "port $($d.port): spend logs failed: $($_.Exception.Message)"; continue }
    $rows = foreach ($l in $logs) {
        $t = [datetime]$l.startTime
        if ($t.ToUniversalTime() -ge $today) {
            $alias = $l.metadata.user_api_key_alias; if (-not $alias) { $alias = '(master or no alias)' }
            [pscustomobject]@{ alias = $alias; t = $t }
        }
    }
    Write-Host "port $($d.port): $(@($logs).Count) log rows in total, $(@($rows).Count) today (UTC)"
    $rows | Group-Object alias | ForEach-Object {
        [pscustomobject]@{ Port = $d.port; Alias = $_.Name; Requests = $_.Count; Latest = ($_.Group.t | Sort-Object | Select-Object -Last 1).ToString('HH:mm') }
    } | Format-Table -AutoSize | Out-String | Write-Host
}
foreach ($n in 'WHL_FACTORY_KEY', 'WHL_LITELLM_KEY', 'WHL_PRIVATE_KEY') {
    Write-Host ("{0} set for awill: {1}" -f $n, [bool][Environment]::GetEnvironmentVariable($n, 'User'))
}
