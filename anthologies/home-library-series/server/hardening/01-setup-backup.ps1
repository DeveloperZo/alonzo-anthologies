# Step 1b-1d. Needs an administrator shell (VSS snapshot, scheduled task at highest level).
# Usage: 01-setup-backup.ps1 -Repo D:\Backups\whl-restic [-Exclude 'E:\WHL\x','E:\WHL\y']
# Prints only status lines. Never prints the password.
param([Parameter(Mandatory)][string]$Repo, [string[]]$Exclude = @())
. "$PSScriptRoot\_lib.ps1"
if (-not (Test-Admin)) { Log '1-backup' 'FAIL' 'not an administrator shell'; exit 1 }
if ((Split-Path $Repo -Qualifier) -eq 'E:') { Log '1-backup' 'FAIL' 'repository must not be on E:'; exit 1 }
New-Item -ItemType Directory $SafeDir -Force | Out-Null
$restic = (Get-Command restic -ErrorAction SilentlyContinue).Source
if (-not $restic) { $restic = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\restic.exe' }
if (-not (Test-Path $restic)) {
    winget install --id restic.restic -e --silent --accept-source-agreements --accept-package-agreements | Out-Null
    $restic = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\restic.exe'
    if (-not (Test-Path $restic)) { $restic = (Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages') -Recurse -Filter 'restic*.exe' -ErrorAction SilentlyContinue | Select-Object -First 1).FullName }
}
if (-not $restic -or -not (Test-Path $restic)) { Log '1-backup' 'FAIL' 'restic not installed'; exit 1 }
Set-Content "$SafeDir\restic.path" $restic
$pass = "$SafeDir\whl.pass"
$newPass = -not (Test-Path $pass)
if ($newPass) { $b = New-Object byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes($b); [Convert]::ToBase64String($b) | Set-Content -NoNewline $pass }
$env:RESTIC_REPOSITORY = $Repo; $env:RESTIC_PASSWORD_FILE = $pass
& $restic cat config *> $null
if ($LASTEXITCODE -ne 0) { & $restic init *> $null; if ($LASTEXITCODE -ne 0) { Log '1-backup' 'FAIL' 'restic init failed'; exit 1 } }
$ex = ($Exclude | Where-Object { $_ } | ForEach-Object { "--exclude '$_'" }) -join ' '
$tpl = Get-Content "$PSScriptRoot\whl-backup.template.ps1" -Raw
$tpl.Replace('__RESTIC__', $restic).Replace('__REPO__', $Repo).Replace('__EXCLUDES__', $ex) | Set-Content "$SafeDir\whl-backup.ps1"
& powershell -NoProfile -ExecutionPolicy Bypass -File "$SafeDir\whl-backup.ps1"
$rc = $LASTEXITCODE
$snaps = @(& $restic snapshots --json | ConvertFrom-Json)
if ($snaps.Count -lt 1 -or ($rc -ne 0 -and $rc -ne 3)) { Log '1-backup' 'FAIL' "first backup exit $rc, snapshots $($snaps.Count)"; exit 1 }
$a = New-ScheduledTaskAction -Execute powershell.exe -Argument "-NoProfile -ExecutionPolicy Bypass -File $SafeDir\whl-backup.ps1"
$t = New-ScheduledTaskTrigger -Daily -At 4:00am
$p = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest
$s = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 2)
Register-ScheduledTask -TaskName 'WHL backup' -Action $a -Trigger $t -Principal $p -Settings $s -Force | Out-Null
$note = "snapshots $($snaps.Count), first backup exit $rc, task registered 04:00"
if ($newPass) { $note += ', NEW PASSWORD: copy whl.pass to the password manager' }
Log '1-backup' 'PASS' $note
