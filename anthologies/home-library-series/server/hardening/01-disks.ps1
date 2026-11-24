# Step 1a. Shows each drive's physical disk and the size of each folder in E:\WHL. Reads no file contents.
$parts = Get-Partition | Where-Object DriveLetter
$parts | ForEach-Object {
    $v = Get-Volume -DriveLetter $_.DriveLetter
    [pscustomobject]@{ Drive = $_.DriveLetter; Disk = $_.DiskNumber; Model = (Get-Disk -Number $_.DiskNumber).FriendlyName; FreeGB = [math]::Round($v.SizeRemaining / 1GB) }
} | Format-Table -AutoSize | Out-String | Write-Host
$eDisk = ($parts | Where-Object DriveLetter -eq 'E').DiskNumber
$ok = ($parts | Where-Object { $_.DiskNumber -ne $eDisk -and $_.DriveLetter -ne 'C' }).DriveLetter
Write-Host ("Drives on a different disk from E: (excluding C:): " + ($ok -join ', '))
Get-ChildItem E:\WHL -Directory | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    [pscustomobject]@{ Folder = $_.FullName; GB = [math]::Round($s / 1GB, 2) }
} | Sort-Object GB -Descending | Format-Table -AutoSize | Out-String | Write-Host
