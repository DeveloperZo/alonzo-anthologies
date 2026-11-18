# setup-quartz.ps1
# Clones Quartz 4 framework files around the existing content/ scaffold.
# Safe to run once. Re-running will re-clone Quartz over framework files but leaves content/ untouched.

$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$staging = Join-Path $env:TEMP ("quartz-staging-" + [System.Guid]::NewGuid().ToString("N").Substring(0, 8))

Write-Host "Site root:    $siteRoot"
Write-Host "Staging dir:  $staging"
Write-Host ""

if (-not (Test-Path (Join-Path $siteRoot "content"))) {
    Write-Error "content/ does not exist under $siteRoot. Aborting — this script expects the doc scaffold to be in place."
}

Write-Host "Cloning Quartz 4 into staging..."
git clone --depth 1 https://github.com/jackyzha0/quartz.git $staging

Write-Host ""
Write-Host "Copying Quartz framework files into site/ (preserving your content/)..."

# Use robocopy to sync everything except .git and content into the site root.
# /E = include subdirs (incl. empty); /XD = exclude dirs; /NFL /NDL /NJH /NJS = quiet output
robocopy $staging $siteRoot /E /XD ".git" "content" /NFL /NDL /NJH /NJS | Out-Null

# robocopy returns non-zero on success; swallow that.
if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy failed with exit code $LASTEXITCODE"
}

Write-Host "Cleaning up staging..."
Remove-Item $staging -Recurse -Force

Write-Host ""
Write-Host "Done. Next steps:"
Write-Host "  cd `"$siteRoot`""
Write-Host "  npm ci"
Write-Host "  npx quartz build --serve"
Write-Host ""
Write-Host "Site will serve on http://localhost:8080"
