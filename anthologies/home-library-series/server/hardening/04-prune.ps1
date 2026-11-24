# Step 4. Deletes the unused models after checking nothing names them. Prints GB freed.
. "$PSScriptRoot\_lib.ps1"
$targets = 'dolphin-mixtral', 'wizard-vicuna-uncensored:30b', 'llama2', 'llama2-uncensored', 'qwen2.5-coder:14b', 'ornith-1.5:9b', 'mimo-v2.6:9b'
$keep = 'gpt-oss:20b', 'bonsai-2:27b', 'bonsai-2:9b'
if (Select-String -Path E:\WHL\config\litellm\*.yaml, E:\WHL\compose\*.yml -Pattern 'dolphin|wizard|llama2|qwen2\.5|ornith|mimo' | Where-Object { $_.Line -notmatch '^\s*#' }) { Log '4-prune' 'FAIL' 'a WHL file still names one of the models'; exit 1 }
$have = @(ollama list | Select-Object -Skip 1 | ForEach-Object { ($_ -split '\s+')[0] })
$missing = @($keep | Where-Object { $k = $_; -not ($have | Where-Object { $_ -eq $k }) })
if ($missing) { Log '4-prune' 'FAIL' "models in use are missing: $($missing -join ', ')"; exit 1 }
$dir = if ($env:OLLAMA_MODELS) { $env:OLLAMA_MODELS } else { "$env:USERPROFILE\.ollama\models" }
$drive = (Get-Item $dir).PSDrive.Name
$before = (Get-PSDrive $drive).Free
$removed = @()
foreach ($t in $targets) {
    $name = $have | Where-Object { $_ -eq $t -or $_ -eq "${t}:latest" } | Select-Object -First 1
    if ($name) { ollama rm $name 2>&1 | Out-Null; if ($LASTEXITCODE -eq 0) { $removed += $name } }
}
$freed = [math]::Round(((Get-PSDrive $drive).Free - $before) / 1GB, 1)
$after = @(ollama list | Select-Object -Skip 1 | ForEach-Object { ($_ -split '\s+')[0] })
$lost = @($keep | Where-Object { $k = $_; -not ($after | Where-Object { $_ -eq $k }) })
if ($lost) { Log '4-prune' 'FAIL' "removed $($removed -join ', ') ($freed GB) but kept models are missing: $($lost -join ', ')"; exit 1 }
Log '4-prune' 'PASS' "removed $($removed -join ', '); freed $freed GB on ${drive}:; kept models still listed"
