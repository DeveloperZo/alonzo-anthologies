# Nightly backup of E:\WHL. Written by 01-setup-backup.ps1; edit that, not this copy.
$env:RESTIC_REPOSITORY = '__REPO__'
$env:RESTIC_PASSWORD_FILE = 'C:\Users\awill\.restic\whl.pass'
$log = 'C:\Users\awill\.restic\backup.log'
$dumps = 'C:\Users\awill\.restic\dumps'
New-Item -ItemType Directory $dumps -Force | Out-Null
"=== $(Get-Date -Format s) start" | Add-Content $log
if (docker ps -q -f 'name=^whl-litellm-db$') { cmd /c "docker exec whl-litellm-db pg_dumpall -U litellm > `"$dumps\litellm.sql`"" }
& '__RESTIC__' backup E:\WHL $dumps --use-fs-snapshot --exclude-caches --tag nightly __EXCLUDES__ *>> $log
$rc = $LASTEXITCODE
& '__RESTIC__' forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune *>> $log
if ((Get-Date).DayOfWeek -eq 'Sunday') { & '__RESTIC__' check *>> $log }
"=== $(Get-Date -Format s) end, backup exit $rc" | Add-Content $log
exit $rc
