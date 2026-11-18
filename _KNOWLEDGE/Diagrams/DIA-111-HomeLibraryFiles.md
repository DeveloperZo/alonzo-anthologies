# DIA-111: Files and state
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-111-HomeLibraryFiles.svg`
- **Theme:** Where the home library keeps its files, secrets and saved state, and what has no backup
- **Primary audience takeaway:** Almost everything is in `E:\WHL`, which has no history and no backup. Only the Langfuse compose files are in git. Secrets are in two `.env` files, and Langfuse's records are inside Docker.

## What The Diagram Shows
Three columns, one per place. Each column is read top to bottom. Nothing flows between them.

The left column is `E:\WHL` on the desktop (lemonpepper). It is not a git repository and nothing copies it, so its frame is amber. It holds the compose files that start the relay, the chat page and the media server, the LiteLLM config file with the routes, one secrets file, the `data\` folder and the `media\` folder.

The middle column is the repo, which is in git and pushed to GitHub, so its frame is green. It holds the `server\` folder that says how Langfuse starts, and a second secrets file. Git ignores that secrets file, so it exists on this disk only even though it sits inside the green frame. The node says so.

The right column is state that is not a folder you can open in Explorer or that sits outside both places: the Docker volumes of the `whl-langfuse` project, which hold every recorded request, and the Ollama model files on the C: drive. Neither has a backup, so the frame is amber. The models can be downloaded again. The records cannot.

One red dotted line joins the two secrets files. The Langfuse keys in both must be the same, or recording stops without an error.

No secret value appears on the diagram or in this spec. Secrets are shown by path and file name only.

## Elements And Flow
- **Components:**
  - Frame `E:\WHL · NO HISTORY, NO BACKUP` (amber). What: the folder the WHL stack runs from. Why: it is where most of the system lives, and it is the largest unprotected thing. Full path `E:\WHL`, on a single hard disk with no mirror.
  - `compose\*.yml`. What: how relay, chat and media start. Full paths `E:\WHL\compose\docker-compose.yml` (LiteLLM and Open WebUI), `E:\WHL\compose\docker-compose.media.yml` (Jellyfin) and `E:\WHL\compose\docker-compose.data.yml` (parts that do not run). If lost: rebuild by hand.
  - `config\litellm\config.yaml`. What: the routes. Full path `E:\WHL\config\litellm\config.yaml`, read by LiteLLM. If lost: rebuild by hand.
  - `compose\.env` (secret style). What: the relay key and the Langfuse keys. Full path `E:\WHL\compose\.env`, read by LiteLLM and Open WebUI. If lost: make new keys and update every tool that holds the relay key.
  - `data\`. What: chats, accounts and the media index. Full path `E:\WHL\data`, with `openwebui\` (Open WebUI's database) and `jellyfin\` (Jellyfin's config and cache). If lost: gone.
  - `media\`. What: movies, shows and music, empty today. Full path `E:\WHL\media`, mounted read-only into Jellyfin. If lost: gone.
  - Frame `THE REPO · IN GIT, PUSHED TO GITHUB` (green). What: this repository. Why: it is the only place with history and a remote copy.
  - `home-library-series\server\`. What: how Langfuse starts. Full path `anthologies\home-library-series\server\`, holding `langfuse.compose.yml`, `langfuse.override.yml` and the template `env.example`. If lost: clone the repo again.
  - `server\.env` (secret style). What: the Langfuse keys and login. Full path `anthologies\home-library-series\server\.env`. Git ignores it, so it is on this disk only. If lost: make new keys.
  - Frame `DOCKER AND OLLAMA · NO BACKUP` (amber). What: state kept by the programs themselves, outside `E:\WHL` and the repo.
  - `whl-langfuse volumes`. What: every recorded request. Five Docker named volumes of the compose project `whl-langfuse` (ClickHouse data and logs, Postgres, MinIO, Redis), inside Docker Desktop's WSL2 disk. Copying `E:\WHL` or the repo does not move them. If lost: gone.
  - `.ollama\models`. What: the downloaded models, on C:. Full path `%USERPROFILE%\.ollama\models`. If lost: download again.
- **Relationships:**
  - One red dotted line between `compose\.env` and `server\.env`, with the note "The Langfuse keys in both .env files must match." If either file changes alone, recording silently stops.
  - Containment only otherwise: a node inside a frame lives in that place.
- **Notable labels or metrics:**
  - "no history, no backup" on `E:\WHL`: it is not a git repository and no Windows backup service runs.
  - "git ignores it: this disk only" on `server\.env`.
  - "empty today" on `media\`: its three subfolders hold 0 files.
  - No numbers are drawn. Sources for every fact: the verified component fact sheet of 2026-11-18 (sections 5, 6, 9 to 13 and 16), plus the changes recorded the same day (LM Studio retired, Ollama the only model runtime).
  - Counts: 9 nodes, 3 frames, 1 line, 1 note. 14 marks.
  - Left off the picture on purpose: the three `.bak-2026-11-17` copies beside the edited files in `E:\WHL`, the empty data folders for parts that do not run (`data\litellm`, `data\qdrant`, `data\n8n`, `data\postgres`), sizes on disk, and which program reads which file (DIA-109 has the flow).

## How To Read It
1. Read the three frame headers first. Amber means no backup, green means in git.
2. Read the left column top to bottom. Each node gives the path, what it holds, and what happens if it is lost.
3. Find the two red nodes. Those are the only files that hold secrets.
4. Follow the red dotted line between them: the Langfuse keys in the two files must match.
5. Read the right column last. It is the state that neither `E:\WHL` nor the repo carries.

## Home Library Relevance
This is the picture to open before a disk failure, a move to Linux, or an edit to a config file. It shows that a copy of the repo restores only how Langfuse starts, that a copy of `E:\WHL` restores the rest of the configuration but not the request record, and that the two secrets files must be carried by hand and kept in step. Version control for `E:\WHL` is deferred and appears as "later" in DIA-107.

## Suggested Caption
DIA-111 · Files and state: only the Langfuse compose files are in git; E:\WHL and all saved state have no backup.
