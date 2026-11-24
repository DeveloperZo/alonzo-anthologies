# Home library: what a session cannot see from the repo

Facts about the desktop that the repo does not show. A sandboxed session
that only sees this folder will miss them, which is how a duplicate
relay got written on 2026-11-17.

## Two stacks, one desktop

- **The "whl project" is `E:\WHL`**, not the series folder in this
  repo. It is a home lab built on 2026-10-02: Open WebUI (port 3000),
  LiteLLM (port 4000), Jellyfin (port 8096) in Docker Desktop, and LM
  Studio running natively on port 1234. It is not a git repository. It
  has its own `README.md` and `docs/Architecture/Architecture.md`.
- **Ollama** runs natively on port 11434 and is what the thin version
  proved from limesalt.
- **The two were joined on 2026-11-17** (Zo's decision). The WHL
  LiteLLM on port 4000 is the one relay and reports every request to
  Langfuse.
- **Ollama is the only model runtime since 2026-11-18** (Zo's decision:
  drop whichever of the two was worse). LM Studio's server is stopped;
  the app is still installed. One model, `gpt-oss:20b`, answers every
  route at context 16384, the largest that keeps it fully on the 16 GB
  card. `local-fast` asks it to think briefly, `local-think` lets it
  think first, and `local-coder` is an old alias of `local-fast`. This
  was chosen by scoring: it beat `qwen2.5-coder:14b` and two newer 9B
  models (table in `client/ROUTING.md`). Measured the same
  day: gpt-oss 20b ran at 165 tokens per second in LM Studio and 155 in
  Ollama; at context 32768 it drops to 62; Devstral Small 2 does not
  fit and was removed.
- **Intended use (Zo, 2026-11-18):** a frontier tool is the harness and
  hands token-heavy work to the local models to cut frontier cost. The
  hand-off is `../williams-home-library/client/ask-local.ps1`;
  what is safe to hand over is in `client/ROUTING.md` beside it. No
  fallback is wanted for when the desktop is off. A memory layer and
  moving `E:\WHL` into a repo are both deferred.
- **Tools added 2026-11-18**, all under
  `../williams-home-library/`: `client/ask-local-batch.ps1`
  (one instruction over many files), `client/eval/run_eval.py` (rerun
  after any model change), `board/` (live board on port 8088; its
  collector is a Python process that does not start by itself), and
  `server/start.ps1` (brings everything up after a restart and runs the
  checks).
- **Do not ask Ollama directly with a different context size.** Ollama
  reloads the model when the size differs, and the next relay request
  then waits for another load. `verify.ps1` asks at 16384 for this
  reason.
- **Never call the relay's `GET /health`.** It sends a real chat to
  every route and forces a model swap. Use `/health/liveliness`.
- **Langfuse** runs from `../williams-home-library/server/` on
  port 3001, as compose project `whl-langfuse`, attached to the `whl`
  Docker network. Port 3000 is Open WebUI.
- Edits made in `E:\WHL` that day: `config/litellm/config.yaml`,
  `compose/docker-compose.yml`, `compose/.env`, `compose/.env.example`
  and `README.md`. The first three have `.bak-2026-11-17` copies beside
  them, since nothing there is under version control.
- Langfuse 4 has no `/api/public/traces`. To read records back, use
  `/api/public/v2/observations` with the project keys.
- To check the whole system, run
  `../williams-home-library/client/verify.ps1`.

The pictures are DIA-100 to DIA-105 and DIA-200 in
`../williams-home-library/diagrams/`, most general first.

## Machine names

The desktop is `lemonpepper` on the tailnet (renamed on 2026-11-18 with
`tailscale set --hostname=lemonpepper`). The laptop is `limesalt`.

The Windows computer name of the desktop is still `WIN-MPISA5DBMQF`.
Only the tailnet name changed, so the old name no longer resolves from
limesalt. Changing the Windows name needs an administrator and a
restart, and nothing depends on it.

## Docker Desktop will not start: stale socket

Docker Desktop 4.33.1 on this desktop can crash on launch with "removing
stale socket ... userAnalyticsOtlpHttp.sock: The file cannot be accessed
by the system". Fix used on 2026-11-17: quit Docker Desktop, rename
`%LOCALAPPDATA%\Docker\run` to another name, start it again. The WHL
containers restart on their own once the engine is up. Updating Docker
Desktop is the lasting fix and has not been done.

## The Arbiter, and what must stay in the house

Decided by Zo on 2026-11-18. The AI that plans a job and checks the
result is called the Arbiter. It is named for its role, not its vendor:
today it is a paid AI (Claude Code), later it may be Zo's own model.

Why: some material must never be within a paid company's reach. Zo's
examples were personal medical details and the children's health
records.

How to apply: while the Arbiter is a paid AI, it receives every answer
the home AI writes for it, so handing a private document to the home AI
through the Arbiter still leaks its substance. Private material goes
through the chat page (Open WebUI), which stays on the computer at home.
An Arbiter that is Zo's own model would remove the limit. It is not
built. The pictures say this in DIA-100 and DIA-200.

## The home AI is in front (corrects the section above)

Zo's correction on 2026-11-18, after I proposed two lanes with the paid
model in front for work: "No, completely wrong. home AI is in front."

The design he wants: every request enters at the front door and meets the
home AI first. The home AI is the Arbiter, and the Arbiter is a decider
model. It answers the request itself, or it sends it down a channel that
is a plain pass-through to a paid model. The paid model sits behind the
front door as one more route. It is never in front.

How to apply: do not draw or build anything with a paid model as the
entry point. The diagrams made earlier that day (DIA-100, DIA-102,
DIA-103, DIA-200) still show the Arbiter as Claude Code in front and are
out of date on this point. Not yet built: the paid route, the decider
step, and any test of how well the home AI decides.

Refined by Zo the same day: the home AI is not one piece. It has two
functions, kept separate even if they run on the same setup:

- **The decider (router).** It answers one question: should this go to
  paid or not. Middleware sits here to log each decision and to tune it.
  The delay it adds is accepted.
- **The worker.** The model hosted on Ollama that does the job.

The decider may use the same Ollama model as the worker. What matters is
that the functions are segmented: its own route, prompt and log, so
either can change without touching the other.

## Version 1 of paid access (decided 2026-11-18)

Zo's decision, replacing the decider idea for now:

1. **A toggle for pass-through.** The person chooses home or paid. No
   model decides.
2. **Directories are segmented.** Paid AI cannot see into private
   directories. The local AI can see both.
3. **A rule on the local AI:** it must not drop private information into
   public directories.

Why this and not a decider: it is simpler, and the boundary is a place
on disk, which can be enforced, not a judgement, which can be wrong. Zo
was astounded I did not arrive here myself: I kept adding a deciding
model where a switch and a folder boundary were enough. Next time, look
for the simplest enforceable boundary before proposing a model to judge.

A decider or router can come later as tuning. It is not version 1.

## Built on 2026-11-18: private side, working side, paid route

Zo's decisions: private is drives `C:` and `D:` on lemonpepper, the
working drive is `F:`, paid is Claude, and file permissions keep paid
tools off the private drives for now (a separate Windows account is
planned).

What exists: a private door (second LiteLLM, port 4001, home routes only,
no paid key, logbook without words), a private chat page (port 3002,
chats stored in `D:\WHL-private`), a `paid` route on the front door
(needs `ANTHROPIC_API_KEY` in `E:\WHL\compose\.env`), drive rules in
`client/ask-local.ps1` (exit 5), and deny rules in
`C:\Users\awill\.claude\settings.json`.

How to apply, for any paid AI working here: do not read, list or search
`C:` or `D:` outside Claude Code's own folders, by any tool or shell
command. To have a private file handled, pass its path to
`ask-local.ps1` with `-Out` on a private drive and do not open the
result. The rules and their limits are in
`../williams-home-library/client/PRIVATE.md`.

The separate account exists as of 2026-11-18: a standard Windows account
`claude_agent` for paid AI tools. Windows already closes `C:\Users\awill`
to it. `D:` needs one deny command that Zo runs (in PRIVATE.md). Zo also
has an n8n Cloud subscription: it is on the paid side with Claude, to be
used with the working drive and the `paid` route only, and to be replaced
by a self-hosted n8n later.

Changed by Zo later on 2026-11-18: n8n Cloud MAY be used with private
material; Claude may not. He does not want to self-host n8n yet. n8n is
to reach the home AI through the private door only (no paid route
there), which needs that port opened to the internet with Tailscale
Funnel. Not wired yet. I told him once that private text then passes
through n8n's servers; he accepted that. Do not re-argue it.

Wired on 2026-11-18: Tailscale Funnel publishes the private door (port
4001) at `https://lemonpepper.tailef54bd.ts.net`, and n8n Cloud (instance
`anthology-solutions`) has a credential "Home AI (private door)" that
uses it. The front door is not published. To close: `tailscale funnel reset`.

Naming, from Zo on 2026-11-18: the system is the "Williams Home Lab" to the
people who use it, and the two doors must be clearly told apart. The chat
pages are named "Williams Home Lab · PRIVATE" and "Williams Home Lab ·
Everyday", each with a banner saying which side it is.

Goal restated by Zo on 2026-11-18: a maximally functioning home AI that
gives frontier model companies no access, or as little as possible. The
aims are ease of use and control of his own data. Web search is allowed
on the private page too ("searching blood type is different than a model
company knowing your blood type"). Blocking it was overkill.

## Chat pages rebuilt for a full feature set (2026-11-18, evening)

Zo's complaint, in his words: "i stated i wanted a rich feature set and
experience and we are missing rudimentary capabilities". What changed:

- **Chat models are now `home-best` (bonsai-2:27b) and `home-quick`
  (bonsai-2:9b)**, on both doors. `home-best` is the default on both pages.
  `local-fast`, `local-think` and `local-coder` (gpt-oss:20b) are unchanged
  and still serve the hand-off tools; they are hidden from the chat lists.
- **Why:** gpt-oss:20b cannot see images, and with a game open the desktop
  apps hold about 7.3 GB of the 16 GB card, so it spilled into system memory
  (4 tokens a second). Measured with the game open: bonsai-2:27b 73 tokens a
  second at 9.1 GB, bonsai-2:9b 163 at 3.4 GB. Ten reasoning questions:
  27b 10 of 10 in 29 s, gpt-oss 10 of 10 in 345 s, 9b 9 of 10.
- **`home-quick` is not the default** because it searched for the wrong year
  ("who won midterms" became a 2024 search). `home-best` picked 2026.
- **Home search service:** `whl-searxng` (SearXNG) in `E:\WHL\compose`, no
  host port, config in `E:\WHL\config\searxng`. Both pages use it instead
  of calling DuckDuckGo themselves. Fetched pages are capped at 12,000
  characters so they fit the model's window.
- **Per-model settings live inside each page**, not in the compose file:
  system prompt (date, search first, assume latest year, US units), web
  search on by default, tool list cut to time, web search, files, knowledge,
  memory. The page ignores most startup variables once it has saved settings.
- **Tested in real chats on 2026-11-18:** search with sources (both pages),
  image reading (both pages, both models), a question about an uploaded
  document (both pages), chat titles.
- **Code running works since later the same evening.** The page's
  in-browser runner (pyodide) failed with "loadPyodide is not defined", so
  it was replaced with two Jupyter containers in `E:\WHL\compose`:
  `whl-code` (everyday) and `whl-code-private` (private). Each is on its own
  Docker network marked internal, shared only with its chat page. Checked
  from inside a runner: internet, both doors, Ollama, search and the other
  runner are all unreachable. Tokens are `JUPYTER_TOKEN` and
  `JUPYTER_PRIVATE_TOKEN` in `compose/.env`. The engine setting is saved
  inside each page (Admin, Settings, Code Execution). On by default for the
  home models. Tested in a chat on each page with correct results.
- **The title helper is `home-best`**, the same model as the chat, so no
  second model loads. With `home-quick` some chats stayed "New Chat".
- **Scripts that sign in to a chat page must not retry in a loop.** The
  page rate-limits sign-in (429) and a failed sign-in once left a script
  holding the other page's session, which wrote the everyday runner's
  address into the private page. The sealed network made it fail closed.
  To act without signing in, run inside the page's container and mint a
  session with `open_webui.utils.auth.create_token`.
- **Not built:** image generation. Voice was declined by Zo ("no need to
  turn on voice"); nothing was changed there.
- **Still untested:** the Claude option (no API key), memory across chats.

### Claude given the same tools (2026-11-19)

- Zo noticed the paid entry on the everyday page had no tools. It had no
  default features, no tool list and no standing instruction, because only
  the home models were set up on 2026-11-18.
- The `paid` entry now copies `home-best`: web search and code running on
  by default, the same short tool list, the same standing instruction with
  a first line saying it is a paid outside model.
- Tools are a setting on each model entry inside the page (Admin, Settings,
  Models), so any route added later needs the same step. The script is
  `incontainer_paid.py` in the pattern of `incontainer_code.py`.
- An Anthropic key is in place (found on 2026-11-19 when a gateway check
  to `paid` answered). Tested in a chat on the everyday page: Claude used
  search and code and answered with links in about 30 seconds.
- The `paid` route in `E:\WHL\config\litellm\config.yaml` now sets high
  effort, summarized thinking, a 64000 token reply limit and prompt
  caching. Claude's standing instruction on the page is short (date, the
  tools, US units) and no longer the home models' one, which told it its
  knowledge was old and to keep answers short.
- Zo's bar, stated 2026-11-19: talking to Claude behind the home AI should
  feel next to no different from the Claude app. Known gaps: no agent
  abilities on the computer (files, shell, browser), no artifacts panel
  check, no connectors, model is Opus 5.5 where the app uses Fable 5.2.
- Zo's complaint the same day: it was not made clear that Claude had no
  tools. It was written in a note but left out of the summary. When work
  is scoped to part of the system, say in the summary what was left out.

### Claude model switcher (2026-11-19)

- Zo asked for a model switcher. The everyday page now lists four Claude
  models next to the two home ones. Routes on the front door only:
  `claude-fable`, `claude-opus`, `claude-sonnet`, `claude-haiku`. The old
  `paid` route stays for `ask-local.ps1` and is hidden on the page.
- Each page entry is a copy of the old Claude entry (same tools), with a
  first line naming the model and a line saying earlier replies may be
  from another model. Without those, Claude could not say which model it
  was, and after a switch it called the earlier model's answer wrong.
- Tested in a chat: Fable searched and answered, then the same chat was
  switched to Haiku, which answered as Haiku. The private door still
  lists only home routes.
- `ask-local.ps1` refuses private input on any route not named `local-*`,
  so the new routes are covered by that guard.

### Cost under each Claude reply (2026-11-19)

- Zo asked for usage and dollar cost in the chat page. The gateway now has
  `include_cost_in_streaming_usage: true`, so each Claude reply's usage
  carries a `cost` from LiteLLM's price table (checked: it matches
  Anthropic's prices for all four models).
- A filter function `claude_cost` on the everyday page, attached only to
  the four Claude entries, shows a status line under each reply: tokens,
  cost of the reply, the chat's total and the month's total. Each Claude
  entry also has the `usage` capability on, which makes the page ask for
  token counts. Source copy: `../williams-home-library/server/chat-page/claude_cost_filter.py`.
  To change it, edit that file and paste it in under Admin Panel,
  Functions.
- The month total is a ledger file inside the page's data folder
  (`E:\WHL\data\openwebui\claude_spend.json`), one entry per reply. It
  does not count the hand-off tool's `paid` calls.
- Tested in a chat with Sonnet: a searched answer cost $0.02, a follow-up
  $0.0068, and the line stayed after a page reload.

### Spend ring instead of a line of figures (2026-11-19)

- Zo's feedback on the first version, a long status line of figures under
  each reply: "i'll be looking at this thousands of times", and wanted a
  graphic with a tooltip like the usage ring in the Claude app.
- Now: a ring beside the microphone shows the month's Claude spend
  against a $100 gauge (Zo set it on 2026-11-19), with the detail in a
  tooltip. Under each reply only the price shows ("$0.02").
- How it is wired: Open WebUI runs `/static/loader.js` on every screen.
  The file is `E:\WHL\config\openwebui\loader.js`, mounted read-only at
  `/app/build/static/loader.js` (the page copies it into `/static` at
  start-up; mounting straight into `/static` would be overwritten). The
  `claude_cost` filter writes `/static/claude_spend.json` (month and
  total) after each Claude reply; the ring reads the chat's own replies
  for the chat total. Only the everyday page has the mount.
- `/static` needs no sign-in, so the month total is visible to anything
  that can reach port 3000. Nothing else is in that file.
- Repo copies: `../williams-home-library/server/chat-page/`
  (`spend-ring.js`, `claude_cost_filter.py`).
- Checked in dark and light: the ring updated from $0.03 to $0.05 on its
  own after a reply, and the tooltip reads cleanly.

### Token count on the private page (2026-11-19)

- Zo asked for the private page to show tokens only. A filter function
  `home_tokens` on the private page, attached to its two home models
  (with the `usage` capability on), shows "N in · N out" under each reply.
  It writes nothing anywhere and the private page has no ring or
  `/static` file. Source copy:
  `../williams-home-library/server/chat-page/home_tokens_filter.py`.
- Tested in a private chat: "3,455 in · 225 out" under a home-best reply.

### Savings meter replaces token counts (2026-11-19)

- Zo on "N in · N out": "more confusing than enlightening", "a chrome dev
  tools insight rather than a dashboard insight". What Zo wants to see is
  how much the home AI saves. Rule for this UI: show money and plain
  outcomes, keep token counts out of sight.
- One filter, `whl_meter` ("Home Lab meter"), on both pages and every
  model, replaces `claude_cost` and `home_tokens` (both deleted). Claude
  reply: its price. Home reply: "saved $X", priced as Claude Opus 5.5 at
  list price with no reuse discount. Ledger per page:
  `/app/backend/data/whl_meter.json` (the private one is on `D:`).
- Month totals go into the signed-in user's settings under `whl`
  (`Users.update_user_settings_by_id`), read by the script with
  `/api/v1/users/user/settings?raw=true`. The earlier public
  `/static/claude_spend.json` is removed.
- One script, `E:\WHL\config\openwebui\loader.js`, now mounted on both
  pages. It reads the page name from `/api/config` and shows the ring
  (everyday) or the green "saved" figure (private). Repo copies in
  `../williams-home-library/server/chat-page/` (`meter.js`,
  `meter_filter.py`).
- Earlier replies this month that carried token counts were added to the
  month totals. Replies from before the page asked for token counts
  (before 2026-11-19 afternoon) are not counted.

### Company names and Home or Paid marks (2026-11-19)

- Zo: "I dont need to see paid, seeing a company name suffices". The Claude
  entries are now just "Claude Fable 5.2" and so on, with no PAID wording
  in the name or description.
- Model pictures: a green house for the home models (both pages), an
  amber banknote for the Claude models.
- Everyday page sidebar: each chat carries a small house or banknote mark.
  A chat is Paid once any reply in it came from Claude (a route starting
  `claude` or the old `paid`); the meter filter keeps that list in the
  user's settings under `whl.paid_chats`. A folder takes `meta.whl_side`
  ("home" or "paid") if set, otherwise Paid if any of its chats is. The
  private page shows no marks: everything there is Home.
- Folder buttons are `#folder-<id>-button`; chat links are
  `a#sidebar-chat-item` with `href="/c/<id>"`. These are Open WebUI's own
  ids and could change in an update.

### Projects ported, and moving chats between pages (2026-11-19)

- Zo asked to bring their projects into the chat pages and continue
  there. Subagents analysed the Claude Code project folders: five folders
  are three projects. "Zo Garden eCafe" is the old name of
  alonzo-anthologies. Both Gatekeeper folders are the Unity game
  Gatekeeper's Protocol, whose repo is `F:\Programming\Gatekeeper Bastion`;
  `F:\Programming\Gatekeeper Protocol` holds a side Factorio mod.
- Folders made: Alonzo's Anthologies and Gatekeeper's Protocol (everyday,
  `meta.whl_side` "paid"); Williams Home Lab and Job search (private,
  "home"). Each folder has `data.system_prompt` and one knowledge
  collection in `data.files` (`{"type":"collection","id":...}`).
  Catch-up chats were written by subagents from the transcripts and repos.
- Kept off the Paid side: the home lab documents (home network detail)
  and the job applications and cover letters, which were copied into the
  private page's knowledge without being opened.
- Tool: `../williams-home-library/server/chat-page/port_tool.py`
  runs inside a page container from `/tmp/port/spec.json` and
  `/tmp/port/files`. Rerunning replaces that project's folder,
  knowledge and catch-up chats.
- Move button: action function `whl_move` (global) on both pages,
  `server/chat-page/move_action.py`. Valves hold `this_page`, the other
  page's Docker address and a sign-in token for the other page's admin
  (minted with `create_token`, no expiry, never printed). So each page's
  database holds a key to the other page. To revoke: change
  `WEBUI_SECRET_KEY` or `WEBUI_PRIVATE_SECRET_KEY` and rerun the setup.
  Tested both ways with a throwaway chat; two home lab catch-up chats were
  moved from the Anthologies folder to the private Home Lab folder.
- Tested continuing: a Gatekeeper follow-up on Claude Opus searched the
  folder's documents and answered from M117's milestone file; a Home Lab
  follow-up on the private home AI answered correctly. New folders only
  show in an open page after a reload.
