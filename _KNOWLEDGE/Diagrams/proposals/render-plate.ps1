# Renders a working plate to a PNG with headless Edge, so it can be looked at.
#
#   powershell -File render-plate.ps1 -Svg PLATE-005-governor.svg -Out C:\tmp\gov.png
#   powershell -File render-plate.ps1 -Svg PLATE-005-governor.svg -Out C:\tmp\gov-dark.png -Scheme dark
#   powershell -File render-plate.ps1 -Svg PLATE-005-governor.svg -Out C:\tmp\zoom.png -ViewBox "380 80 360 300"
#
# -Scheme forces the light or dark palette regardless of the system setting.
# -ViewBox zooms into a region of the plate (x y width height, in plate units)
#  for checking small details such as figures, joints and label collisions.
param(
  [Parameter(Mandatory = $true)][string]$Svg,
  [Parameter(Mandatory = $true)][string]$Out,
  [ValidateSet('light', 'dark')][string]$Scheme = 'light',
  [int]$Width = 1440,
  [string]$ViewBox
)

$edge = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw "msedge.exe not found" }

$text = [IO.File]::ReadAllText((Resolve-Path $Svg).Path, [Text.Encoding]::UTF8)
if ($Scheme -eq 'dark') {
  $text = $text.Replace('@media (prefers-color-scheme: dark)', '@media all')
} else {
  $text = $text.Replace('@media (prefers-color-scheme: dark)', '@media not all')
}
if ($ViewBox) {
  $text = [regex]::new('viewBox="[^"]*"').Replace($text, "viewBox=`"$ViewBox`"", 1)
}
$m = [regex]::Match($text, 'viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*"')
if (-not $m.Success) { throw "no viewBox in $Svg" }
$height = [int][math]::Ceiling($Width * [double]$m.Groups[2].Value / [double]$m.Groups[1].Value)

$work = Join-Path $env:TEMP ("plate-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work | Out-Null
$bg = if ($Scheme -eq 'dark') { '#1E2128' } else { '#F2EEE3' }
$html = '<!doctype html><html><head><meta charset="utf-8">' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap">' +
  "<style>body{margin:0;background:$bg}svg{display:block;width:100%;height:auto}</style></head><body>" +
  $text + '</body></html>'
[IO.File]::WriteAllText("$work\plate.html", $html, (New-Object Text.UTF8Encoding $false))

$outFull = [IO.Path]::GetFullPath($Out)
Start-Process -FilePath $edge -Wait -ArgumentList @(
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  "--user-data-dir=$work\profile",
  "--window-size=$Width,$height",
  '--virtual-time-budget=6000',
  "--screenshot=$outFull",
  ("file:///" + ("$work\plate.html" -replace '\\', '/'))
)
Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
if (-not (Test-Path $outFull)) { throw "Edge did not write $outFull" }
"$outFull ($Width x $height, $Scheme)"
