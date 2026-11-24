# Step 3f. Administrator. Closes E:\WHL to the claude_agent account.
. "$PSScriptRoot\_lib.ps1"
if (-not (Test-Admin)) { Log '3-deny' 'FAIL' 'not an administrator shell'; exit 1 }
icacls E:\WHL /deny "claude_agent:(OI)(CI)F" | Out-Null
$acl = (Get-Acl E:\WHL).Access | Where-Object { $_.IdentityReference -like '*claude_agent' -and $_.AccessControlType -eq 'Deny' }
if (-not $acl) { Log '3-deny' 'FAIL' 'deny entry not present'; exit 1 }
Log '3-deny' 'PASS' 'claude_agent denied on E:\WHL (undo: icacls E:\WHL /remove:d claude_agent)'
