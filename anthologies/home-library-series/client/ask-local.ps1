<#
Hands one piece of work to a local model on lemonpepper and prints the reply.

Meant to be run by a frontier harness (Claude Code, or any agent with a
shell) so token-heavy work is done at home and only the result comes back.

  powershell -NoProfile -ExecutionPolicy Bypass -File ask-local.ps1 -Prompt "Summarize this file in five bullets." -File notes.md

  -Prompt     The instruction. If omitted, it is read from standard input.
  -File       One or more files whose text is attached after the instruction.
  -Route      local-fast (general work, the default) or local-coder (code).
  -System     Optional system message.
  -Task       Short label for this job. Shows as a tag in Langfuse.
  -Caller     Who is asking. Shows as the user in Langfuse. Defaults to this
              machine's tailnet-style name, or WHL_CALLER if set.
  -MaxTokens  Upper limit on the reply. Default 2000.
  -Out        Write the reply to this file instead of standard output.
  -Stats      Also print one JSON line of numbers to standard error.

The reply goes to standard output. Exit code 0 means a reply came back.

The key is read from the WHL_LITELLM_KEY environment variable. On the desktop
it falls back to LITELLM_MASTER_KEY in E:\WHL\compose\.env. It is never printed.
#>
param(
    [string]$Prompt,
    [string[]]$File,
    [ValidateSet("local-fast", "local-coder")][string]$Route = "local-fast",
    [string]$System,
    [string]$Task = "untagged",
    [string]$Caller,
    [int]$MaxTokens = 2000,
    [string]$Out,
    [switch]$Stats,
    [string]$Relay = "http://lemonpepper:4000/v1"
)

$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = $utf8

# The context window of both routes. Leave room for the reply.
$contextTokens = 16384

if (-not $Prompt) {
    if ([Console]::IsInputRedirected) {
        $reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput(), $utf8)
        $Prompt = $reader.ReadToEnd()
    }
    if (-not $Prompt) { [Console]::Error.WriteLine("ask-local: no prompt given"); exit 2 }
}

$content = $Prompt
foreach ($f in $File) {
    if (-not (Test-Path -LiteralPath $f)) { [Console]::Error.WriteLine("ask-local: file not found: $f"); exit 2 }
    $text = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $f).Path, $utf8)
    $name = Split-Path -Leaf $f
    $content += "`n`n===== FILE: $name =====`n$text`n===== END OF FILE: $name ====="
}

# A rough count: about four characters to a token. Refuse work that cannot fit,
# because a silently cut-off prompt gives a confident wrong answer.
$estimate = [int]($content.Length / 4) + [int]($System.Length / 4)
if ($estimate + $MaxTokens -gt $contextTokens) {
    [Console]::Error.WriteLine("ask-local: too large. About $estimate tokens in, $MaxTokens reserved for the reply, and the window is $contextTokens. Split the input and ask again.")
    exit 3
}

$key = $env:WHL_LITELLM_KEY
if (-not $key -and (Test-Path "E:\WHL\compose\.env")) {
    $line = Get-Content "E:\WHL\compose\.env" | Where-Object { $_ -match '^LITELLM_MASTER_KEY=' } | Select-Object -First 1
    if ($line) { $key = ($line -split '=', 2)[1].Trim() }
}
if (-not $key) { [Console]::Error.WriteLine("ask-local: no key. Set WHL_LITELLM_KEY."); exit 2 }

if (-not $Caller) { $Caller = $env:WHL_CALLER }
if (-not $Caller) {
    $Caller = $env:COMPUTERNAME.ToLower()
    if ($Caller -eq "win-mpisa5dbmqf") { $Caller = "lemonpepper" }
}

$messages = @()
if ($System) { $messages += @{ role = "system"; content = $System } }
$messages += @{ role = "user"; content = $content }

$body = @{
    model      = $Route
    messages   = $messages
    max_tokens = $MaxTokens
    user       = $Caller
    metadata   = @{ tags = @("ask-local", $Task) }
} | ConvertTo-Json -Depth 6
$bytes = $utf8.GetBytes($body)

$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    $resp = Invoke-WebRequest -Uri "$Relay/chat/completions" -Method Post -Body $bytes `
        -ContentType "application/json; charset=utf-8" `
        -Headers @{ Authorization = "Bearer $key" } -UseBasicParsing -TimeoutSec 900
} catch {
    [Console]::Error.WriteLine("ask-local: request failed: $($_.Exception.Message)")
    exit 1
}
$sw.Stop()

# Windows PowerShell guesses the wrong text encoding for JSON, so decode the bytes.
$resp.RawContentStream.Position = 0
$json = (New-Object System.IO.StreamReader($resp.RawContentStream, $utf8)).ReadToEnd()
$data = $json | ConvertFrom-Json
$reply = $data.choices[0].message.content
if (-not $reply) {
    [Console]::Error.WriteLine("ask-local: the model returned no text (finish reason: $($data.choices[0].finish_reason)). Raise -MaxTokens or shorten the input.")
    exit 1
}

if ($Out) {
    [System.IO.File]::WriteAllText($Out, $reply, $utf8)
} else {
    [Console]::Out.WriteLine($reply)
}

if ($Stats) {
    $line = @{
        route      = $Route
        caller     = $Caller
        task       = $Task
        tokens_in  = $data.usage.prompt_tokens
        tokens_out = $data.usage.completion_tokens
        seconds    = [math]::Round($sw.Elapsed.TotalSeconds, 1)
        finish     = $data.choices[0].finish_reason
    } | ConvertTo-Json -Compress
    [Console]::Error.WriteLine($line)
}
exit 0
