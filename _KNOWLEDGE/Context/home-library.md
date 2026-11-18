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
  hand-off is `anthologies/home-library-series/client/ask-local.ps1`;
  what is safe to hand over is in `client/ROUTING.md` beside it. No
  fallback is wanted for when the desktop is off. A memory layer and
  moving `E:\WHL` into a repo are both deferred.
- **Tools added 2026-11-18**, all under
  `anthologies/home-library-series/`: `client/ask-local-batch.ps1`
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
- **Langfuse** runs from `anthologies/home-library-series/server/` on
  port 3001, as compose project `whl-langfuse`, attached to the `whl`
  Docker network. Port 3000 is Open WebUI.
- Edits made in `E:\WHL` that day: `config/litellm/config.yaml`,
  `compose/docker-compose.yml`, `compose/.env`, `compose/.env.example`
  and `README.md`. The first three have `.bak-2026-11-17` copies beside
  them, since nothing there is under version control.
- Langfuse 4 has no `/api/public/traces`. To read records back, use
  `/api/public/v2/observations` with the project keys.
- To check the whole system, run
  `anthologies/home-library-series/client/verify.ps1`.

The picture is DIA-106 in `_KNOWLEDGE/Diagrams/`.

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
