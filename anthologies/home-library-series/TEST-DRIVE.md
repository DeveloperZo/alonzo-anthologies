# Test drive

<!--
Purpose: Things to try on the home library system, in order, with the result each should give.
Status: working
Owner: zo
Human id: home-library-test-drive
Update trigger: when a route, port, tool or the board changes
Last updated: 2026-11-18
-->

Eight things to try, quickest first. Each says what you should see. All
commands run from the repo root. The first six work on the desktop
(lemonpepper) with nothing to set up.

## 1. Look at the board

Open `http://lemonpepper:8088`.

You should see: a `LIVE` badge, a sentence saying what the system is
doing, `gpt-oss:20b` filling about 12 of the 16 cells of the graphics
card with a countdown to unload, and every service light up. If the
badge says `NO DATA`, the collector is not running: run test 8's command.

Press "Play a DEMO request". A hollow dot travels laptop, tunnel, relay,
model and back, the badge says `DEMO: not real activity`, and no number
changes.

Keep the board open on one side for the rest.

## 2. Hand one file to the local model

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Prompt "Summarize this in three bullets. Output only the bullets." -File anthologies/home-library-series/README.md -Task test-drive -Stats
```

You should see: three bullets in 2 to 5 seconds, then one line of
numbers ending `"verdict":"ok"`. On the board a dot travels the path and
a row appears with caller `lemonpepper` and tag `test-drive`. If the
model had unloaded, the first call takes up to 30 seconds.

## 3. Make it think

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Route local-think -Prompt "Three switches A, B, C. A is on if B is off. B is on if C is on. C is off. Which are on? Explain in two sentences." -Task test-drive -Stats
```

You should see: A is on, B and C are off. It takes a few seconds longer
than test 2 and `tokens_out` is several times larger, because the model
thinks first. That difference is the whole distinction between the two
routes.

## 4. Hand over a folder

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local-batch.ps1 -Prompt "State this document's purpose in one sentence. Output only the sentence." -Path "_KNOWLEDGE/Stories/*.md" -OutDir "$env:TEMP\stories-purpose" -Task test-drive-batch
```

You should see: 13 lines starting `ok`, then one line of totals with
about 22,000 `tokens_in`. Those tokens were read at home. The replies
are in the folder named at the end of that line.

## 5. See the safety catches

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Prompt "Summarize." -File _KNOWLEDGE/Documents/Videos/VID-002-GovernanceLong.md
```

You should see: `ask-local: too large`, and nothing sent (that file is
about 20,000 tokens and the window is 16,384). The tool
refuses an input the model cannot hold whole, because the model server
would otherwise cut it silently and answer a different question.

## 6. Use it the way it is meant to be used

Open Claude Code in this repo and say:

> Using the local models, tell me which Stories are still planned and what each one is for. Do not read the files yourself.

You should see: it runs `ask-local-batch.ps1`, reads only the replies,
answers, and says how many tokens went local. The board shows 13 dots.

If it reads the files itself, the `local-models` skill was not picked
up. Say "use the local-models skill" and tell me, because that discovery
could not be tested overnight (the Claude command line on the desktop is
not logged in).

## 7. Read the record

Open `http://lemonpepper:3001` and sign in.

You should see: every request from tests 2 to 6, each with a user
(`lemonpepper`) and tags (`ask-local`, `test-drive`). Filter by tag to
see one job. This is where the prompt and reply text live; the board
shows none.

## 8. Break it and bring it back

```powershell
docker stop whl-litellm
```

The board's relay light goes hollow with a cross within seconds, and
test 2 fails with `request failed`. Then:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/server/start.ps1
```

You should see: each piece reported up, then `9 passed, 0 failed`. This
is also the one command to run after restarting the desktop and logging
in.

## From limesalt

1. `git pull` in the repo.
2. Set the key for the session. Get the value on the desktop from the
   `LITELLM_MASTER_KEY` line of `E:\WHL\compose\.env`:
   `$env:WHL_LITELLM_KEY = "<value>"`
3. Run `anthologies/home-library-series/client/verify.ps1`. Expect 9
   passed (8 and one skip if Tailscale is not on the path).
4. Run tests 2 to 6 there. The board rows will say caller `limesalt`.

To keep the key between sessions on limesalt, set it as a user
environment variable. That is your call, since it stores the key on the
laptop.

## Only you can do these

| Step | Why it matters |
| --- | --- |
| Create your account at `http://lemonpepper:3000` | Open WebUI has no account yet. The first person to sign up on your network becomes its administrator and gets use of the relay |
| Finish the setup wizard at `http://lemonpepper:8096` | Same for Jellyfin: the first visitor claims it. The media folder is also empty |
| Decide whether things start by themselves | Docker Desktop is not set to start at login, and the board's collector needs a logon task. Until then, run `server/start.ps1` after a restart |
| Delete unused models if you want the disk back | `ollama rm dolphin-mixtral wizard-vicuna-uncensored:30b llama2 llama2-uncensored qwen2.5-coder:14b` frees about 61 GB. None is used by any route |
| Log in to the Claude command line on the desktop | `claude` then `/login`. Needed only if you want headless runs there |
