# Nightly backup of the photo folders on D: to a restic repository on E:. Written by 01-setup-photo-backup.ps1; edit that, not this copy.
$env:RESTIC_REPOSITORY = '__REPO__'
$env:RESTIC_PASSWORD_FILE = 'C:\Users\awill\.restic\whl.pass'
$log = 'C:\Users\awill\.restic\photo-backup.log'
$paths = @(__PATHS__) | Where-Object { Test-Path -LiteralPath $_ }
"=== $(Get-Date -Format s) start, $($paths.Count) folder(s)" | Add-Content $log
if ($paths.Count -eq 0) { "=== nothing to back up yet" | Add-Content $log; exit 0 }
& '__RESTIC__' backup @paths --use-fs-snapshot --exclude-caches --tag photos *>> $log
$rc = $LASTEXITCODE
& '__RESTIC__' forget --tag photos --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune *>> $log
if ((Get-Date).DayOfWeek -eq 'Sunday') { & '__RESTIC__' check *>> $log }
"=== $(Get-Date -Format s) end, backup exit $rc" | Add-Content $log
exit $rc
