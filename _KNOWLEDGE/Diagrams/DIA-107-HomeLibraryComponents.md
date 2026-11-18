# DIA-107: Components
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-107-HomeLibraryComponents.svg`
- **Theme:** What each piece of the home library is, and why the system has it
- **Primary audience takeaway:** Every piece has one plain job and one reason to be here: a frontier tool sends the work, Ollama runs the models on one 16 GB graphics card, LiteLLM is the single front door, three pages are there to be opened, and Tailscale and Docker Desktop sit underneath.

## What The Diagram Shows
A typeset table, not a picture with arrows. It is the second diagram of the home library set (DIA-106 to DIA-112) and answers one question: what is each piece, and why is it here?

There are four columns. NAME carries a small shape swatch for the kind of thing, then the product name. WHAT IT IS says what the thing is in plain words. WHY IT IS HERE (in italics) says what the system would lack without it. WHERE gives the kind of thing, its port number as a chip where it has one, and one short flag.

The nine rows sit in five groups, read top to bottom from the caller down to the plumbing: who sends the work (Claude Code, the harness), the models (Ollama and the graphics card), the front door (LiteLLM, the relay), things you open (Open WebUI, Langfuse, Jellyfin), and underneath (Tailscale, Docker Desktop). Two muted note rows close the table: LM Studio, retired, and the parts planned for later.

## Elements And Flow
- **Components:**
  - **Claude Code (the harness).** What: a frontier tool that plans the work, decides, and checks the results. Why: it hands token-heavy work to the local models to cut frontier token cost. Where: a caller, on either machine (`limesalt` or `lemonpepper`). Claude Code is an example of a frontier tool, not the only possible one. Examples of token-heavy work, from the owner's brief: summarizing long files, first drafts, pulling fields out of text, sorting items into categories, bulk rewrites.
  - **Ollama.** What: the model runtime. It loads a local model and writes the answers. Why: it is the only thing here that runs models, and every relay route (`local-fast` and `local-think`, both `gpt-oss:20b`) end at it. Where: a native Windows program on port 11434, with no key.
  - **Graphics card.** What: an RTX 5080 with 16 GB of graphics memory. Why: it is where models run, and a model must fit in 16 GB to run at full speed. Where: hardware, inside `lemonpepper`.
  - **LiteLLM (the relay).** What: one address that takes every request and passes it to a model by route. Why: one address and one key for every tool, and one place to record use. Where: a Docker container on port 4000, which needs a key.
  - **Open WebUI.** What: a chat page in the browser for talking to the local models. Why: it lets a person use the local models without code or a terminal. Where: a Docker container on port 3000.
  - **Langfuse.** What: a dashboard that stores every request sent through the relay. Why: it shows what was asked, which model answered and how long it took. Where: Docker, seven containers, dashboard on port 3001. The swatch is a stacked outline because it is several containers drawn as one.
  - **Jellyfin.** What: a media server for movies, shows and music. Why: your own media on your other devices; nothing else here depends on it. Where: a Docker container on port 8096.
  - **Tailscale.** What: a private network between your own machines (the tailnet). Why: it is the laptop's way in when away, and gives the desktop one name at home and away. Where: a native Windows program on both machines.
  - **Docker Desktop.** What: the program that runs containers (packaged services) on Windows. Why: LiteLLM, Open WebUI, Langfuse and Jellyfin ship as containers, and this is what runs them here. Where: a native Windows program, started by hand.
  - **Note row, RETIRED.** LM Studio was a second model runtime that did the same job as Ollama. It was retired on 2026-11-18 and replaced by Ollama. The app is still installed, its server is stopped, and nothing uses it.
  - **Note row, LATER.** A memory layer (Qdrant, n8n) and version control for `E:\WHL`. Neither is built.
- **Relationships:**
  - None are drawn. This diagram has no arrows. How the pieces connect is in DIA-106 and DIA-109.
  - The five group bands are the only structure: WHO SENDS THE WORK, THE MODELS, THE FRONT DOOR, THINGS YOU OPEN, UNDERNEATH.
  - Swatch shapes follow the set's grammar: a blue pill is a caller, a green square-cornered box is a native Windows program, a green round-cornered box is a Docker container, a heavy gray box is hardware, a dashed gray box is retired or later.
- **Notable labels or metrics:**
  - Port chips `:11434`, `:4000`, `:3000`, `:3001`, `:8096`. Source: the fact sheet summary table (`Get-NetTCPConnection`, `docker inspect`).
  - "no key" on Ollama and "needs a key" on LiteLLM. Source: fact sheet, Ollama field 4 and LiteLLM field 4 (a request with no key got a 401).
  - "16 GB of graphics memory". Source: fact sheet, hardware (`nvidia-smi`, 16303 MiB).
  - "7 containers" on Langfuse. Source: fact sheet, "The seven containers".
  - "started by hand" on Docker Desktop. Source: fact sheet, Docker Desktop field 6 (`autoStart` is false).
  - "Retired on 2026-11-18" and "Both relay routes end at it". Source: the changes list in the drawing brief, which overrides the fact sheet.
  - Not on the picture, but true when checked on 2026-11-18: Jellyfin has never been set up and its media folder is empty, and Open WebUI has no account yet. These are weak points and belong to ARCH-006, not to the catalogue.

## How To Read It
1. Pick the row for the thing you are wondering about. The group band above it says what part of the system it belongs to.
2. Read WHAT IT IS, then WHY IT IS HERE. Together they are one sentence: "it is this, and the system has it because of that".
3. Read WHERE for the kind of thing it is and, where there is a chip, the port it answers on.
4. Read the two muted rows last. They are not running: one is retired, one is not built.
5. For how the pieces connect, go to DIA-106 (who does what work) and DIA-109 (one request).

## Home Library Relevance
The owner asked for a what and a why for every component, starting with "What is LM Studio, why is it needed". The earlier DIA-106 gave where each thing ran and never what it was, so it could not prompt the question "why two model runtimes?". This table is the answer for the whole set: every other diagram in DIA-106 to DIA-112 uses a short WHAT line on its nodes, and the full WHY for each node is here. It is embedded in ARCH-006 under "Components that matter here", ahead of DIA-108.

## Suggested Caption
DIA-107 · Components: what each piece of the home library is, and why it is there.
