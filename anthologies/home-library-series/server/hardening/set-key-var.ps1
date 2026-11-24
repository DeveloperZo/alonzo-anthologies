# Asks for a key and saves it as a user environment variable. Prints nothing secret.
# Usage: set-key-var.ps1 -Name WHL_FACTORY_KEY   (or WHL_LITELLM_KEY)
param([Parameter(Mandatory)][string]$Name)
$k = (Read-Host "Paste the key for $Name and press Enter").Trim()
if (-not $k.StartsWith('sk-')) { Write-Host 'That does not look like a key (should start with sk-). Nothing saved.'; Read-Host 'Press Enter to close'; exit 1 }
[Environment]::SetEnvironmentVariable($Name, $k, 'User')
Write-Host "$Name saved for user $env:USERNAME. Open a new terminal for it to take effect."
Read-Host 'Press Enter to close'
