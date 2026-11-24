# Step 2a. Shows where Ollama listens and whether every WHL file reaches it by host.docker.internal.
. "$PSScriptRoot\_lib.ps1"
Write-Host ("OLLAMA_HOST user:    " + [Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'User'))
Write-Host ("OLLAMA_HOST machine: " + [Environment]::GetEnvironmentVariable('OLLAMA_HOST', 'Machine'))
Write-Host ("Listening on: " + ((Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue).LocalAddress -join ', '))
$hits = Select-String -Path E:\WHL\config\litellm\*.yaml, E:\WHL\compose\*.yml -Pattern '11434|OLLAMA_BASE_URL' -ErrorAction SilentlyContinue
$bad = @($hits | Where-Object { $_.Line -notmatch 'host\.docker\.internal' -and $_.Line -notmatch '^\s*#' })
foreach ($h in $hits) { Write-Host ("  {0}:{1}: {2}" -f (Split-Path $h.Path -Leaf), $h.LineNumber, $h.Line.Trim()) }
if ($bad.Count -gt 0) { Log '2-check' 'FAIL' "UNSAFE: $($bad.Count) line(s) reach Ollama by another address"; exit 1 }
Log '2-check' 'PASS' "SAFE: $(@($hits).Count) reference(s), all host.docker.internal"
