<#
Runs the same instruction over many files on a local model, one file per
request, and writes one reply file per input. This is the hand-off that saves
the most frontier tokens: the harness never reads the inputs, only the short
summary printed at the end (and whichever replies it chooses to open).

  powershell -NoProfile -ExecutionPolicy Bypass -File ask-local-batch.ps1 `
      -Prompt "Summarize this file in five bullets. Output only the bullets." `
      -Path docs\*.md -OutDir out\summaries -Task doc-summaries

  -Prompt     The instruction applied to every file.
  -Path       One or more files or wildcards.
  -OutDir     Folder for the replies. One file per input, named <input>.reply.md.
  -Route      local-fast (default) or local-think (slower, thinks first).
  -System     Optional system message.
  -Task       Label for the batch. Shows as a tag in Langfuse.
  -MaxTokens  Upper limit on each reply. Default 1000.
  -Combine    After the per-file pass, also ask for one combined digest of all
              the replies, written to <OutDir>\_combined.md.

Prints one line per file and a final JSON line with totals. A file too large
for the model's window is skipped and listed, never silently cut.
Exit code is the number of files that failed or were skipped.
#>
param(
    [Parameter(Mandatory = $true)][string]$Prompt,
    [Parameter(Mandatory = $true)][string[]]$Path,
    [Parameter(Mandatory = $true)][string]$OutDir,
    [string]$Route = "local-fast",
    [string]$System,
    [string]$Task = "batch",
    [int]$MaxTokens = 1000,
    [string]$Combine
)

$ErrorActionPreference = "Stop"
$one = Join-Path $PSScriptRoot "ask-local.ps1"
$null = New-Item -ItemType Directory -Force -Path $OutDir

$files = @()
foreach ($p in $Path) { $files += @(Get-ChildItem -Path $p -File -ErrorAction SilentlyContinue) }
$files = $files | Sort-Object FullName -Unique
if (-not $files) { [Console]::Error.WriteLine("ask-local-batch: no files matched"); exit 2 }

# Runs ask-local.ps1 once and returns its exit code and standard error text.
# A plain process is used because Windows PowerShell mangles a child's
# standard error when it is redirected with 2>.
function Invoke-One([string[]]$ArgList) {
    $quoted = $ArgList | ForEach-Object { '"' + ($_ -replace '"', '\"') + '"' }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "powershell.exe"
    $psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -File " + ($quoted -join " ")
    $psi.UseShellExecute = $false
    $psi.RedirectStandardError = $true
    $psi.RedirectStandardOutput = $true
    $psi.CreateNoWindow = $true
    $proc = [System.Diagnostics.Process]::Start($psi)
    $errTask = $proc.StandardError.ReadToEndAsync()
    $null = $proc.StandardOutput.ReadToEnd()
    $proc.WaitForExit()
    return @{ Code = $proc.ExitCode; Err = $errTask.Result }
}

function Read-Stat([string]$Err) {
    foreach ($line in ($Err -split "`n")) { if ($line.Trim().StartsWith("{")) { try { return ($line | ConvertFrom-Json) } catch {} } }
    return $null
}

$totalIn = 0; $totalOut = 0; $ok = 0
$skipped = New-Object System.Collections.Generic.List[string]
$failed = New-Object System.Collections.Generic.List[string]
$sw = [Diagnostics.Stopwatch]::StartNew()

foreach ($f in $files) {
    $out = Join-Path $OutDir ($f.Name + ".reply.md")
    $argList = @($one, "-Prompt", $Prompt, "-File", $f.FullName, "-Route", $Route,
        "-Task", $Task, "-MaxTokens", "$MaxTokens", "-Out", $out, "-Stats")
    if ($System) { $argList += @("-System", $System) }
    $run = Invoke-One $argList
    $code = $run.Code
    $err = $run.Err
    if ($code -eq 0) {
        $ok++
        $stat = Read-Stat $err
        if ($stat) { $totalIn += $stat.tokens_in; $totalOut += $stat.tokens_out }
        Write-Host ("ok       {0}  ({1} in, {2} out, {3} s)" -f $f.Name, $stat.tokens_in, $stat.tokens_out, $stat.seconds)
    } elseif ($code -eq 3) {
        $skipped.Add($f.Name); Write-Host ("TOO BIG  {0}" -f $f.Name)
    } else {
        $failed.Add($f.Name); Write-Host ("FAILED   {0}  {1}" -f $f.Name, ($err -replace "\s+", " ").Trim())
    }
}

$combined = $null
if ($Combine -and $ok -gt 0) {
    $replyFiles = @(Get-ChildItem -Path $OutDir -Filter "*.reply.md" -File | ForEach-Object { $_.FullName })
    $combined = Join-Path $OutDir "_combined.md"
    $argList = @($one, "-Prompt", $Combine, "-Route", $Route, "-Task", "$Task-combine",
        "-Out", $combined, "-Stats")
    $argList += @("-File", ($replyFiles -join ";"))
    $run = Invoke-One $argList
    if ($run.Code -ne 0) {
        $combined = $null
        Write-Host ("COMBINE FAILED  " + (($run.Err -replace "\s+", " ").Trim()))
    } else {
        $s = Read-Stat $run.Err
        if ($s) { $totalIn += $s.tokens_in; $totalOut += $s.tokens_out }
    }
}
$sw.Stop()

$summary = [ordered]@{
    route      = $Route
    task       = $Task
    files      = $files.Count
    ok         = $ok
    too_big    = @($skipped)
    failed     = @($failed)
    tokens_in  = $totalIn
    tokens_out = $totalOut
    seconds    = [math]::Round($sw.Elapsed.TotalSeconds, 1)
    out_dir    = (Resolve-Path $OutDir).Path
    combined   = $combined
}
$json = $summary | ConvertTo-Json -Compress
[System.IO.File]::WriteAllText((Join-Path $OutDir "_summary.json"), $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Host $json
exit ($skipped.Count + $failed.Count)
