<#
Sets a new password for an account on one of the two chat pages, when the old
one is forgotten. Run it yourself in a terminal: it asks you to type the new
password, and the password is never shown, saved to a file or put on the
command line.

  powershell -NoProfile -ExecutionPolicy Bypass -File reset-chat-password.ps1 -Page everyday
  powershell -NoProfile -ExecutionPolicy Bypass -File reset-chat-password.ps1 -Page private

  -Page   everyday (http://lemonpepper:3000) or private (http://lemonpepper:3002)
  -Email  The account to change. Not needed when the page has only one account.

Chats, settings and model names are not touched.
#>
param(
    [Parameter(Mandatory = $true)][ValidateSet("everyday", "private")][string]$Page,
    [string]$Email
)

$ErrorActionPreference = "Stop"
$container = if ($Page -eq "private") { "whl-openwebui-private" } else { "whl-openwebui" }
$db = "/app/backend/data/webui.db"

$list = "import sqlite3; print('\n'.join(r[0] for r in sqlite3.connect('$db').execute('select email from auth')))"
$emails = @(docker exec $container python -c $list | Where-Object { $_ })
if ($emails.Count -eq 0) { Write-Host "No account exists on the $Page page yet. Open it and create one."; exit 1 }
if (-not $Email) {
    if ($emails.Count -gt 1) { Write-Host "More than one account. Run again with -Email, one of:"; $emails | ForEach-Object { Write-Host "  $_" }; exit 2 }
    $Email = $emails[0]
}
if ($emails -notcontains $Email) { Write-Host "No account '$Email' on the $Page page."; exit 2 }

Write-Host "Setting a new password for $Email on the $Page chat page."
$first = Read-Host "New password" -AsSecureString
$second = Read-Host "Type it again" -AsSecureString
$toText = { param($s) [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)) }
$plain = & $toText $first
if ($plain -ne (& $toText $second)) { Write-Host "The two did not match. Nothing was changed."; exit 3 }
if ($plain.Length -lt 8) { Write-Host "Use at least 8 characters. Nothing was changed."; exit 3 }

# The password travels on standard input to the page's own container, which
# hashes it the same way the page does and stores only the hash.
$set = "import sys,sqlite3,bcrypt; pw=sys.stdin.readline().rstrip('\r\n').lstrip(chr(65279)); c=sqlite3.connect('$db'); n=c.execute('update auth set password=? where email=?',(bcrypt.hashpw(pw.encode(),bcrypt.gensalt()).decode(),sys.argv[1])).rowcount; c.commit(); print(n)"
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$changed = $plain | docker exec -i $container python -c $set $Email
$plain = $null
if ("$changed".Trim() -eq "1") { Write-Host "Done. Sign in with the new password." -ForegroundColor Green; exit 0 }
Write-Host "Nothing was changed (the page reported: $changed)."; exit 1
