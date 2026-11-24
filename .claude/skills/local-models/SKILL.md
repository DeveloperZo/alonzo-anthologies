---
name: local-models
description: Hand token-heavy grunt work to the free local models on the home server (lemonpepper) instead of doing it yourself. Use BEFORE reading several files or one long file just to summarize, extract fields, label, answer lookup questions, or make a mechanical edit, and before writing a small self-contained function. Also use when the user says "use the local models", "offload this", "ask local", or asks to save frontier tokens. Do not use for planning, design judgement, or final published wording.
---

# Local models: you are the harness, they do the volume

Zo runs a local model at home behind a relay. It costs nothing per
token. You (the frontier model) plan, judge and check. It reads and
drafts. The point is that the bulk text never enters your context: you
send a file path, it reads the file, and only a short reply comes back.

Full evidence and failure cases: `../williams-home-library/client/ROUTING.md`.
Read it once before a large hand-off.

## The two commands

Both live in `../williams-home-library/client/`. Run them from the
repo root with the Bash or PowerShell tool.

One job:

```
powershell -NoProfile -ExecutionPolicy Bypass -File ../williams-home-library/client/ask-local.ps1 -Prompt "<instruction>" -File "<path>[;<path>]" -Task <label> -Stats
```

The same instruction over many files (the big saver). Replies go to a
folder, one per input, and you get one summary line:

```
powershell -NoProfile -ExecutionPolicy Bypass -File ../williams-home-library/client/ask-local-batch.ps1 -Prompt "<instruction>" -Path "<glob>" -OutDir <folder> -Task <label>
```

Do NOT read the input files yourself first. That spends the tokens you
are trying to save. Pass paths.

## Which route

One model answers every route. The route only sets how much it thinks.

| Work | Route |
| --- | --- |
| Summaries, questions about documents, checking statements against a document, bug spotting, sorting into categories, fields into JSON, strict output formats, a small function from a numbered spec, an exact small edit to a whole file | `local-fast` (the default). 1 to 3 seconds for a short answer |
| Ordering, counting, comparing, a rewrite to a strict style rule, or a retry of something `local-fast` got wrong | `local-think`. About three times slower |
| Planning, design judgement, rules that interact, published wording | keep it yourself |

## Limits you must respect

- **Window: 16,384 tokens, input plus reply.** The tool refuses an input
  that is too large (exit code 3). Split it and ask per part, or use the
  batch command so each file is its own request.
- **A cold start costs 6 to 30 seconds.** The model unloads after 60
  idle minutes. Changing route costs nothing.
- **The desktop must be on.** If the relay does not answer, do the work
  yourself and say so. There is no fallback and none is wanted.

## Private drives and the paid route

On lemonpepper, drives `C:` and `D:` are private and `F:` is the working
drive. Full rules: `../williams-home-library/client/PRIVATE.md`.

- Never read, list or search `C:` or `D:` yourself, with any tool or shell
  command. You are a paid AI and those drives are not for you.
- To have a private file handled, pass its path to `ask-local.ps1` with
  `-Out` on a private drive. The reply is saved there and not shown. Do
  not open it. Report only that it was written.
- `-Route paid` sends the request to Claude through the front door. It
  costs money and is refused for private input. Use it only when Zo asks.

## Exit codes

- `0` complete reply.
- `3` input too large, nothing sent. Split it.
- `4` reply cut off or input truncated. Do not use the partial text.
  Raise `-MaxTokens`, split the input, or move to `local-think`.
- `1` request failed (relay down, bad route). `2` bad arguments or no key.
- `5` refused by the drive rules. Nothing was sent. Do not work around it.

On limesalt the key must be in the `WHL_LITELLM_KEY` environment
variable. On the desktop the tool finds it. Never print it.

## Always check what comes back

| Reply | Check before you trust it |
| --- | --- |
| Summary | It is a pointer to what to read, not a source. Verify any name, date or id you will repeat. About one claim in 25 was wrong in testing |
| JSON | Strip a code fence, parse, check keys and count |
| New code | Run tests. Send failures back once on `local-think`. If it still fails, write it yourself |
| Whole-file edit | Diff against the original. Reject if any other line changed |
| Rewrite to a style rule | Search for the banned characters. Send it back once, naming what is left |

## How to brief them

- State the exact output shape: a JSON skeleton, or one example line.
- Give a word for "cannot tell": "Use the exact string NOT STATED".
- Number the rules and include one worked example for code.
- On a retry, say what failed, and use `local-think`.
- Say "plain ASCII punctuation only" when the reply will be matched or
  pasted.

## Tell Zo what you offloaded

When you finish, say in one line what went local and roughly how many
tokens (the `-Stats` line and the batch summary give the counts). That
is how the saving gets measured.
