# DIA-108: What runs where
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-108-HomeLibraryRunsWhere.svg`
- **Theme:** What runs on what in the home library, and which models fit on the graphics card
- **Primary audience takeaway:** Ollama and Tailscale run directly on Windows, four services run inside Docker Desktop, and Ollama loads models onto one 16 GB graphics card, so a model larger than that will not run at full speed.

## What The Diagram Shows
The picture reads bottom to top: each thing stands on what is beneath it. The laptop, `limesalt`, is the narrow frame on the left and holds only the tools that ask for work. The desktop, `lemonpepper`, is the wide frame on the right. At its base is the hardware layer: the processor, the memory and one graphics card. Windows 11 sits on the hardware. On Windows stand two programs that run directly on it (Tailscale and Ollama) and Docker Desktop, which in turn holds four containers (LiteLLM, Open WebUI, Langfuse and Jellyfin). The one line on the picture runs from Ollama straight down to the graphics card, because that is where Ollama loads models. Beside the card, a small bar chart shows the two models the relay routes use, drawn to scale against the 16 GB limit. Both fit, one at a time.

## Elements And Flow
- **Components:**
  - Laptop frame, `LAPTOP · limesalt`. What: the laptop. Why: it is the client the desktop serves.
  - Your tools (blue pill). What: Claude Code, a browser, plus Tailscale. Why: these are what ask the desktop for work. Blue means the asking side.
  - Desktop frame, `DESKTOP · lemonpepper`. What: the desktop PC, by its tailnet name. Why: everything else in the picture runs on it.
  - Hardware band, `HARDWARE · i9-13900K · 64 GB memory`. What: the processor and system memory. Why: the bottom layer everything stands on.
  - Graphics card (heavy square node). What: an RTX 5080 with 16 GB of graphics memory. Why: it is where models run, and its size sets which models can run at full speed.
  - Model bars (bar chart). What: one bar per relay route, showing the graphics memory its model takes when loaded. Why: it answers "which models fit".
  - Windows band, `WINDOWS 11 · sleep set to never`. What: the operating system. Why: every program on the desktop runs on it, and it does not go to sleep.
  - Tailscale (square-cornered green node). What: the private network to the laptop. Why: it is how `limesalt` finds the desktop. It runs directly on Windows.
  - Ollama (square-cornered green node). What: the model runtime. Why: it loads a model when a request asks. It runs directly on Windows, and is the only model runtime.
  - Docker Desktop (dashed frame). What: a program on Windows that runs containers. Why: the four services below are packaged as containers.
  - LiteLLM (round-cornered green node). What: the relay.
  - Open WebUI (round-cornered green node). What: the chat page.
  - Langfuse (round-cornered green node with a second outline). What: the request record. It is seven containers drawn as one: web, worker, AI gateway, Postgres, ClickHouse, Redis and MinIO.
  - Jellyfin (round-cornered green node). What: the media server.
- **Relationships:**
  - Containment is the main relationship. A thing inside a frame runs on that machine or inside that program. A thing above a band stands on that layer.
  - One solid blue line, from Ollama down to the graphics card, labelled `loads models here`. It crosses the Windows band because Ollama reaches the card through Windows.
  - There are no lines between services. Those are in DIA-109.
- **Notable labels or metrics:**
  - The bar scale is 16 GB = 300 units (1 GB = 18.75 units). The vertical rule marked `16 GB` is the size of the card.
  - `local-fast` uses `gpt-oss:20b`: 12 GB when loaded, fully on the graphics card, context 16384, about 155 tokens per second. It is 13 GB on disk.
  - `local-coder` uses `qwen2.5-coder:14b`: 11 GB when loaded, fully on the card, context 16384. It is 9 GB on disk.
  - `one model loaded at a time; a swap takes 6 to 30 s`: Ollama holds one of the two models at a time. Asking for the other swaps them. A loaded model stays for 30 minutes after its last use.
  - `Devstral Small 2 (15 GB) was too big: removed`: 15 percent of it ran in system memory, at 27 tokens per second, so it was removed. It is a note and not a bar, because its loaded size was not measured.
  - Not drawn: `gpt-oss:20b` at context 32768 still loads but drops to 62 tokens per second.
  - Sources: the hardware, Windows, Tailscale, Docker and the seven Langfuse containers come from the component fact sheet checked on lemonpepper on 2026-11-18 (`nvidia-smi`, `Get-CimInstance`, `powercfg`, `docker ps -a`). The routes, model sizes, swap time and the Devstral result are the measurements taken on 2026-11-18 after LM Studio was retired. The card reports 16303 MiB, drawn as 16 GB.

## How To Read It
1. Start at the bottom of the desktop: the hardware band and the graphics card.
2. Move up to the Windows band, then to what stands on it: two programs on the left, Docker Desktop on the right.
3. Read the corners. Square corners run directly on Windows. Round corners are containers inside Docker Desktop.
4. Follow the one blue line from Ollama down to the graphics card.
5. Read the bars beside the card. A bar that ends left of the `16 GB` rule fits.
6. Finish with the laptop on the left: it runs no part of the system, only the tools that use it.

## Home Library Relevance
This is the picture to look at before restarting something or choosing a model. It shows that stopping Docker Desktop takes four services with it but leaves Ollama and Tailscale running, and that a new model has to fit in 16 GB of graphics memory, with room for its context, to be worth a route. It leaves out ports (DIA-112), the calls between services (DIA-109), what starts by itself (DIA-110) and folders (DIA-111). Ollama's other models (`nomic-embed-text` and four unused models from two years ago) have no route and are not drawn.

## Suggested Caption
DIA-108 · What runs where: Ollama runs on Windows and loads models onto one 16 GB graphics card; the rest runs in Docker.
