<#
Hands one piece of work to a local model on lemonpepper and prints the reply.

Meant to be run by a frontier harness (Claude Code, or any agent with a
shell) so token-heavy work is done at home and only the result comes back.
Read ROUTING.md beside this file for what is safe to hand over.

  powershell -NoProfile -ExecutionPolicy Bypass -File ask-local.ps1 -Prompt "Summarize this file in five bullets." -File notes.md

  -Prompt     The instruction. If omitted, it is read from standard input.
  -File       A file whose text is attached. For several, give them in one
              value separated by semicolons: -File "a.md;b.md". (PowerShell
              does not allow -File to be given twice.) The instruction is
              sent before the files and repeated after them, because the
              models answer long inputs better when the question comes last.
  -Route      local-fast (the default: thinks briefly, then answers) or
              local-think (same model, thinks properly first; about three
              times slower; for reasoning, ordering, counting, strict rewrites).
  -System     Optional system message.
  -Task       Short label for this job. Shows as a tag in Langfuse.
  -Caller     Who is asking. Shows as the user in Langfuse. Defaults to this
              machine's name, or WHL_CALLER if set.
  -MaxTokens  Upper limit on the reply, thinking included. Default 3000 on
              local-fast and 8000 on local-think. A whole file back needs
              about 12 tokens a line.
  -Effort     low, medium or high: overrides how much the model thinks.
              Normally leave it unset and pick the route instead.
  -Out        Write the reply to this file instead of standard output.
  -Stats      Also print one JSON line of numbers to standard error.
  -KeepUnicode  Leave non-breaking hyphens, narrow spaces and curly quotes
              in the reply. By default they are replaced with plain ones,
              because they break exact matching on dates and ids.

Exit codes:
  0  a complete reply came back
  1  the request failed
  2  bad arguments, missing file or missing key
  3  the input is too large for the model's window. Nothing was sent
  4  a reply came back but cannot be trusted: it was cut off at the reply
     limit, or the model did not see the whole input. The partial text is
     written to standard error, never to standard output or -Out

The key is read from the WHL_LITELLM_KEY environment variable. On the desktop
it falls back to LITELLM_MASTER_KEY in E:\WHL\compose\.env. It is never printed.
#>
param(
    [string]$Prompt,
    [string[]]$File,
    [string]$Route = "local-fast",
    [string]$System,
    [string]$Task = "untagged",
    [string]$Caller,
    [int]$MaxTokens = 0,
    [ValidateSet("", "low", "medium", "high")][string]$Effort = "",
    [string]$Out,
    [switch]$Stats,
    [switch]$KeepUnicode,
    [int]$ContextTokens = 16384,
    [string]$Relay = "http://lemonpepper:4000/v1"
)

$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = $utf8

function Fail([int]$Code, [string]$Text) { [Console]::Error.WriteLine("ask-local: $Text"); exit $Code }

if ($MaxTokens -le 0) { if ($Route -eq "local-think") { $MaxTokens = 8000 } else { $MaxTokens = 3000 } }

if (-not $Prompt) {
    if ([Console]::IsInputRedirected) {
        $reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput(), $utf8)
        $Prompt = $reader.ReadToEnd()
    }
    if (-not $Prompt) { Fail 2 "no prompt given" }
}

$content = $Prompt
if ($File) {
    $File = @($File | ForEach-Object { $_ -split ';' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    foreach ($f in $File) {
        if (-not (Test-Path -LiteralPath $f)) { Fail 2 "file not found: $f" }
        $text = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $f).Path, $utf8)
        $name = Split-Path -Leaf $f
        $content += "`n`n===== FILE: $name =====`n$text`n===== END OF FILE: $name ====="
    }
    $content += "`n`nThe instruction again, now that you have read the file content above:`n$Prompt"
}

# Estimate tokens on the safe side. Measured on this setup: prose and code run
# about 3.4 characters to a token, and runs of digits nearer 1.2. An input that
# does not fit is cut silently by the model server, which gives a confident
# answer to a different question, so refuse instead of sending.
$all = $content + $System
$digits = ([regex]::Matches($all, '\d')).Count
$estimate = [int](($all.Length - $digits) / 3.0 + $digits / 1.2)
if ($estimate + $MaxTokens -gt $ContextTokens) {
    Fail 3 "too large. About $estimate tokens in, $MaxTokens reserved for the reply, and the window is $ContextTokens. Split the input, or lower -MaxTokens if a short answer is enough."
}

$key = $env:WHL_LITELLM_KEY
if (-not $key -and (Test-Path "E:\WHL\compose\.env")) {
    $line = Get-Content "E:\WHL\compose\.env" | Where-Object { $_ -match '^LITELLM_MASTER_KEY=' } | Select-Object -First 1
    if ($line) { $key = ($line -split '=', 2)[1].Trim() }
}
if (-not $key) { Fail 2 "no key. Set WHL_LITELLM_KEY." }

if (-not $Caller) { $Caller = $env:WHL_CALLER }
if (-not $Caller) {
    $Caller = $env:COMPUTERNAME.ToLower()
    if ($Caller -eq "win-mpisa5dbmqf") { $Caller = "lemonpepper" }
}

$messages = @()
if ($System) { $messages += @{ role = "system"; content = $System } }
$messages += @{ role = "user"; content = $content }

if (-not $Effort -and $env:WHL_EFFORT) { $Effort = $env:WHL_EFFORT }

function Send-Request([bool]$WithEffort) {
    $body = @{
        model      = $Route
        messages   = $messages
        max_tokens = $MaxTokens
        user       = $Caller
        metadata   = @{ tags = @("ask-local", $Task) }
    }
    if ($WithEffort) { $body.reasoning_effort = $Effort }
    $bytes = $utf8.GetBytes(($body | ConvertTo-Json -Depth 6))
    return Invoke-WebRequest -Uri "$Relay/chat/completions" -Method Post -Body $bytes `
        -ContentType "application/json; charset=utf-8" `
        -Headers @{ Authorization = "Bearer $key" } -UseBasicParsing -TimeoutSec 900
}

$sw = [Diagnostics.Stopwatch]::StartNew()
$resp = $null
try {
    $resp = Send-Request ([bool]$Effort)
} catch {
    $first = $_
    # A model that does not think rejects the effort setting. Ask again without it.
    if ($Effort) { try { $resp = Send-Request $false } catch { $first = $_ } }
    if (-not $resp) {
        $detail = $first.Exception.Message
        try {
            $stream = $first.Exception.Response.GetResponseStream()
            $detail += " " + ((New-Object System.IO.StreamReader($stream, $utf8)).ReadToEnd() -replace "\s+", " ")
        } catch {}
        if ($detail.Length -gt 400) { $detail = $detail.Substring(0, 400) }
        Fail 1 "request failed: $detail"
    }
}
$sw.Stop()

# Windows PowerShell guesses the wrong text encoding for JSON, so decode the bytes.
$resp.RawContentStream.Position = 0
$json = (New-Object System.IO.StreamReader($resp.RawContentStream, $utf8)).ReadToEnd()
$data = $json | ConvertFrom-Json
$reply = $data.choices[0].message.content
$finish = $data.choices[0].finish_reason
$tokensIn = [int]$data.usage.prompt_tokens
$tokensOut = [int]$data.usage.completion_tokens

if ($reply -and -not $KeepUnicode) {
    $map = @{ 0x2011 = "-"; 0x2010 = "-"; 0x202F = " "; 0x00A0 = " "; 0x2009 = " "; 0x2019 = "'"; 0x2018 = "'"; 0x201C = '"'; 0x201D = '"' }
    foreach ($k in $map.Keys) { $reply = $reply.Replace([string][char]$k, $map[$k]) }
}

function Write-Stats([string]$Verdict) {
    if (-not $Stats) { return }
    $line = [ordered]@{
        route      = $Route
        caller     = $Caller
        task       = $Task
        tokens_in  = $tokensIn
        tokens_out = $tokensOut
        seconds    = [math]::Round($sw.Elapsed.TotalSeconds, 1)
        finish     = $finish
        verdict    = $Verdict
    } | ConvertTo-Json -Compress
    [Console]::Error.WriteLine($line)
}

# Guard 1: the model did not see the whole input. The server cuts an input
# that overflows the window without saying so. Two signs: it reports far fewer
# tokens than this many characters can be, or the request filled the window.
$leastPossible = [int]($all.Length / 6.0)
if ($tokensIn -gt 0 -and ($tokensIn -lt $leastPossible -or ($tokensIn + $tokensOut) -ge ($ContextTokens - 16))) {
    Write-Stats "input-cut"
    if ($reply) { [Console]::Error.WriteLine("----- untrusted reply -----`n$reply") }
    Fail 4 "the model saw $tokensIn tokens of an input of $($all.Length) characters, so part of it was cut off. Split the input and ask again."
}

# Guard 2: the reply was cut off. On local-fast, thinking counts against the limit.
if ($finish -ne "stop" -or -not $reply) {
    Write-Stats "reply-cut"
    if ($reply) { [Console]::Error.WriteLine("----- partial reply -----`n$reply") }
    Fail 4 "the reply was cut off (finish: $finish, $tokensOut tokens used of $MaxTokens). Raise -MaxTokens and ask again."
}

if ($Out) { [System.IO.File]::WriteAllText($Out, $reply, $utf8) } else { [Console]::Out.WriteLine($reply) }
Write-Stats "ok"
exit 0
