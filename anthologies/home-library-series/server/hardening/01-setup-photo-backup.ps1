# Photo backup. Administrator. Backs up the photo folders on D: to a restic repository on E:, nightly at 04:30.
# Uses the same password file as the E:\WHL backup, so there is still one password to keep.
# Closes the repository folder to claude_agent. Never reads, lists or prints the photos.
# Usage: 01-setup-photo-backup.ps1 [-Repo E:\Backups\photos-restic]
param([string]$Repo = 'E:\Backups\photos-restic',
      [string[]]$Paths = @('D:\Media\Family Photos', 'D:\Media\Adult Photos'))
. "$PSScriptRoot\_lib.ps1"
if (-not (Test-Admin)) { Log '1-photos' 'FAIL' 'not an administrator shell'; exit 1 }
if ((Split-Path $Repo -Qualifier) -eq 'D:') { Log '1-photos' 'FAIL' 'repository must not be on D:, the same disk as the photos'; exit 1 }
$restic = Get-Content "$SafeDir\restic.path" -ErrorAction SilentlyContinue
$pass = "$SafeDir\whl.pass"
if (-not $restic -or -not (Test-Path $restic) -or -not (Test-Path $pass)) { Log '1-photos' 'FAIL' 'run 01-setup-backup.ps1 first (restic and its password)'; exit 1 }
New-Item -ItemType Directory $Repo -Force | Out-Null
icacls (Split-Path $Repo -Parent) /deny "claude_agent:(OI)(CI)F" | Out-Null
$env:RESTIC_REPOSITORY = $Repo; $env:RESTIC_PASSWORD_FILE = $pass
& $restic cat config *> $null
if ($LASTEXITCODE -ne 0) { & $restic init *> $null; if ($LASTEXITCODE -ne 0) { Log '1-photos' 'FAIL' 'restic init failed'; exit 1 } }
$quoted = ($Paths | ForEach-Object { "'" + $_.Replace("'", "''") + "'" }) -join ', '
$tpl = Get-Content "$PSScriptRoot\photo-backup.template.ps1" -Raw
$tpl.Replace('__RESTIC__', $restic).Replace('__REPO__', $Repo).Replace('__PATHS__', $quoted) | Set-Content "$SafeDir\photo-backup.ps1"
& powershell -NoProfile -ExecutionPolicy Bypass -File "$SafeDir\photo-backup.ps1"
$rc = $LASTEXITCODE
$found = @($Paths | Where-Object { Test-Path -LiteralPath $_ }).Count
$snaps = @(& $restic snapshots --tag photos --json | ConvertFrom-Json)
if ($found -gt 0 -and ($snaps.Count -lt 1 -or ($rc -ne 0 -and $rc -ne 3))) { Log '1-photos' 'FAIL' "first backup exit $rc, snapshots $($snaps.Count)"; exit 1 }
$a = New-ScheduledTaskAction -Execute powershell.exe -Argument "-NoProfile -ExecutionPolicy Bypass -File $SafeDir\photo-backup.ps1"
$t = New-ScheduledTaskTrigger -Daily -At 4:30am
$p = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest
$s = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 8)
Register-ScheduledTask -TaskName 'Photo backup' -Action $a -Trigger $t -Principal $p -Settings $s -Force | Out-Null
Log '1-photos' 'PASS' "$found of $($Paths.Count) photo folders present, snapshots $($snaps.Count), first backup exit $rc, task registered 04:30, repo $Repo closed to claude_agent"
