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
- `anthologies/home-library-series/server/` asks for ports 4000 and
  3000. Both are held by the WHL stack. How the two become one is an
  open decision recorded in the series README.

The picture is DIA-106 in `_KNOWLEDGE/Diagrams/`.

## Machine names

The desktop is `win-mpisa5dbmqf` on the tailnet. The laptop is
`limesalt`.

## Docker Desktop will not start: stale socket

Docker Desktop 4.33.1 on this desktop can crash on launch with "removing
stale socket ... userAnalyticsOtlpHttp.sock: The file cannot be accessed
by the system". Fix used on 2026-11-17: quit Docker Desktop, rename
`%LOCALAPPDATA%\Docker\run` to another name, start it again. The WHL
containers restart on their own once the engine is up. Updating Docker
Desktop is the lasting fix and has not been done.
