# DIA-106: Home library
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-106-HomeLibrary.svg`
- **Theme:** What runs on the desktop for the home library, and how the laptop reaches it, as of 2026-11-17
- **Primary audience takeaway:** Two model stacks run side by side on the desktop. Ollama is the one proven from limesalt away from home. The older WHL stack (Open WebUI, LiteLLM, LM Studio, Jellyfin) holds ports 3000 and 4000, so the relay and Langfuse dashboard written in the repo cannot start as written.

## What The Diagram Shows
The laptop, limesalt, sits on the left. The desktop, `win-mpisa5dbmqf`, fills the right. Both are on the same Tailscale network, which is how every arrow from the laptop travels.

The top row is the Ollama path. Ollama runs natively on Windows, listens on all addresses on port 11434, and has six models pulled. A request from limesalt on a phone hotspot was answered on 2026-11-17, so this arrow is drawn in blue as proven. To the right of Ollama, dashed, are the relay (LiteLLM) and the Langfuse dashboard defined in `anthologies/home-library-series/server/`. Neither is started and Langfuse is not installed. The red line under them gives the reason they cannot start as written: they ask for ports 4000 and 3000.

The lower block is the WHL stack, built on 2026-10-02 from files in `E:\WHL`, which is outside this repo and not under version control. Inside Docker Desktop, Open WebUI on port 3000 sends chat to LiteLLM on port 4000. LiteLLM forwards to LM Studio on port 1234. LM Studio runs natively on Windows and accepts connections from this machine only. Jellyfin on port 8096 serves the media folder at `E:\WHL\media`, mounted read-only.

The amber arrows from limesalt into the WHL stack mark ports that are open on the network and answer on the desktop's Tailscale address, but that nobody has tried from limesalt yet.

## Elements And Flow
- **Components:**
  - limesalt, the laptop and client
  - Ollama, native Windows, port 11434, six models pulled
  - Relay (LiteLLM) and Langfuse from the repo's `server/` folder, not started
  - Open WebUI (`whl-openwebui`, port 3000), LiteLLM (`whl-litellm`, port 4000) and Jellyfin (`whl-jellyfin`, port 8096) in Docker Desktop
  - LM Studio, native Windows, port 1234, bound to 127.0.0.1, serving `openai/gpt-oss-20b` and `mistralai/devstral-small-2-2512`
  - The media folder `E:\WHL\media`
- **Relationships:**
  - Blue arrow 1 is the only path proven from limesalt away from the home network
  - Amber arrows 2 are open ports not yet tried from limesalt
  - Green arrows 3 to 5 are connections that run entirely on the desktop
  - Dashed gray arrows 6 are written in the repo and not started
  - Dashed outlines group the client, the desktop, and what runs inside Docker Desktop
- **Notable labels or metrics:**
  - "all addresses · 6 models pulled" on Ollama
  - "routes: local-fast, local-coder" on LiteLLM, the two names clients ask for
  - "this machine only (127.0.0.1)" on LM Studio
  - "cannot start as written: ports 4000 and 3000 are already held by the stack below"

## How To Read It
1. Step 1: limesalt asks Ollama for a model over Tailscale. This is the thin version exit test and it passed.
2. Step 2: the same tunnel also reaches ports 3000, 4000 and 8096. They are open, and untested from the laptop.
3. Step 3: Open WebUI passes each chat request to LiteLLM, using the key in `E:\WHL\compose\.env`.
4. Step 4: LiteLLM forwards to LM Studio through `host.docker.internal`, which is why LM Studio can stay bound to this machine.
5. Step 5: Jellyfin reads the media folder. It depends on nothing else in the picture.
6. Step 6: the planned relay would sit in front of Ollama and report every request to Langfuse. Read the red line before starting it.

## Home Library Relevance
The series README was written without sight of `E:\WHL`, so it describes Ollama as the only model runtime and plans a second LiteLLM on port 4000 and Langfuse on port 3000. This picture puts both stacks in one frame so the overlap is visible: two runtimes (Ollama and LM Studio) sharing one 16 GB graphics card, one relay already running and one planned, and two things wanting each of ports 3000 and 4000. The open decision it points at is whether Langfuse joins the existing WHL LiteLLM or the repo's relay replaces it.

Sources, all read on 2026-11-17: `docker ps`, `tailscale status`, `ollama list`, the listening ports on the desktop, `E:\WHL\README.md`, `E:\WHL\compose\`, `E:\WHL\config\litellm\config.yaml`, and `anthologies/home-library-series/server/`.

## Suggested Caption
DIA-106 · Home library: limesalt reaches Ollama on the desktop over Tailscale; the WHL stack runs beside it; Langfuse is not started.
