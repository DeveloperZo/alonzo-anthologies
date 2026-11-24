# Makes a private-door key for limesalt (alias limesalt-private, home routes only) and sends it to limesalt
# with Taildrop. Prints no key. On limesalt: tailscale file get $HOME\Downloads, then set-key-var.ps1 -Name WHL_PRIVATE_KEY.
. "$PSScriptRoot\_lib.ps1"
$m = Get-EnvValue 'LITELLM_PRIVATE_KEY'
try { $all = @((Invoke-RestMethod http://localhost:4001/v1/models -Headers @{ Authorization = "Bearer $m" } -TimeoutSec 30).data.id) }
catch { Log '3-limesalt-private' 'FAIL' "could not list models: $($_.Exception.Message)"; exit 1 }
$models = @($all | Where-Object { $_ -like 'local-*' })   # same routes as ask-local-private
$body = @{ key_alias = 'limesalt-private'; models = $models; metadata = @{ caller = 'limesalt' } } | ConvertTo-Json -Depth 4
try { $r = Invoke-RestMethod http://localhost:4001/key/generate -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $m" } -Body $body -TimeoutSec 30 }
catch { Log '3-limesalt-private' 'FAIL' "could not make the key: $($_.Exception.Message)"; exit 1 }
$code = Get-Code 'http://localhost:4001/v1/models' $r.key
if ($code -ne 200) { Log '3-limesalt-private' 'FAIL' "new key answered $code"; exit 1 }
$f = Join-Path $env:TEMP 'limesalt-private-key.txt'
Set-Content $f $r.key -NoNewline
$r = $null
$ts = (Get-Command tailscale -ErrorAction SilentlyContinue).Source; if (-not $ts) { $ts = Join-Path $env:ProgramFiles 'Tailscale\tailscale.exe' }
& $ts file cp $f 'limesalt:' 2>&1 | Out-Null
$sent = ($LASTEXITCODE -eq 0)
Remove-Item $f -Force
if (-not $sent) { Log '3-limesalt-private' 'FAIL' "key made (routes $($models -join ', ')) but Taildrop to limesalt failed; revoke it or resend"; exit 1 }
Log '3-limesalt-private' 'PASS' "limesalt-private made on 4001 with routes $($models -join ', '); sent to limesalt by Taildrop; copy on lemonpepper deleted"
