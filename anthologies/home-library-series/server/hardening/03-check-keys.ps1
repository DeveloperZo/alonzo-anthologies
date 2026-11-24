# Step 3e check. Tries each key in the keys file on its door. Prints alias and status code only.
. "$PSScriptRoot\_lib.ps1"
$file = 'C:\Users\awill\whl-keys.txt'
if (-not (Test-Path $file)) { Log '3-check-keys' 'FAIL' 'keys file not found'; exit 1 }
$rows = Get-Content $file; $bad = 0; $n = 0
for ($i = 0; $i -lt $rows.Count; $i++) {
    if ($rows[$i] -match '^(\S+) \(port (\d+)\)') {
        $alias = $Matches[1]; $port = $Matches[2]; $key = $rows[$i + 1].Trim(); $n++
        $code = Get-Code "http://localhost:$port/v1/models" $key
        Write-Host "$alias $code"; if ($code -ne 200) { $bad++ }
    }
}
if ($bad -gt 0 -or $n -eq 0) { Log '3-check-keys' 'FAIL' "$bad of $n keys refused"; exit 1 }
Log '3-check-keys' 'PASS' "$n of $n keys accepted"
