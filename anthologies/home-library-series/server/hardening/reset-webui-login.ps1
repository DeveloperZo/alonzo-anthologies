# Resets the admin password on both chat pages (Open WebUI on 3000 and 3002).
# Zo runs this; it asks for the new password and never prints or stores it.
$pw = Read-Host 'New chat page password' -AsSecureString
$pw2 = Read-Host 'Type it again' -AsSecureString
$a = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pw))
$b = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pw2))
if ($a -ne $b -or $a.Length -lt 8) { Write-Host 'Passwords differ or shorter than 8 characters. Nothing changed.'; exit 1 }
$py = "import sys,bcrypt,sqlite3;p=sys.stdin.read().rstrip('\r\n').encode();c=sqlite3.connect('/app/backend/data/webui.db');n=c.execute('update auth set password=?, active=1 where id in (select id from user where role=?)',(bcrypt.hashpw(p,bcrypt.gensalt()).decode(),'admin')).rowcount;c.commit();print(n)"
foreach ($c in 'whl-openwebui', 'whl-openwebui-private') {
    $n = $a | docker exec -i $c python -c $py
    Write-Host "$c : admin accounts updated: $n"
}
$a = $null; $b = $null
Write-Host 'Sign in at http://lemonpepper:3000 and http://lemonpepper:3002 with your usual email and the new password.'
