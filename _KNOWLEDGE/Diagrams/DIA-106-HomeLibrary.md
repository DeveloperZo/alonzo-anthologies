# DIA-106: Home library
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-106-HomeLibrary.svg`
- **Theme:** What runs on the desktop for the home library, and how the laptop reaches it, as of 2026-11-18
- **Primary audience takeaway:** One relay (LiteLLM on port 4000) fronts both model runtimes, LM Studio and Ollama, and records every request in Langfuse. limesalt reaches all of it over Tailscale. From limesalt, the direct Ollama path is proven away from home, and the relay, dashboard, chat page and media server are proven too, on a network the run did not record.

## What The Diagram Shows
The laptop, limesalt, sits on the left. The desktop, `lemonpepper`, fills the right. Both are on the same Tailscale network, which is how every arrow from the laptop travels.

The blue arrow is the thin version: limesalt asks Ollama directly on port 11434. Ollama runs natively on Windows, listens on all addresses, and has six models pulled. This was answered from limesalt on a phone hotspot on 2026-11-17.

The lower block is the WHL stack, built on 2026-10-02 from files in `E:\WHL`, which is outside this repo and not under version control. Inside Docker Desktop, Open WebUI on port 3000 sends chat to LiteLLM on port 4000. LiteLLM is the relay. It offers three routes and refuses any caller without its key. Two routes go to LM Studio on port 1234, which runs natively and accepts connections from this machine only. The third, `ollama-coder`, goes up to Ollama. Jellyfin on port 8096 serves the media folder at `E:\WHL\media`, mounted read-only.

Langfuse, top right, is the activity dashboard on port 3001. It runs in Docker from the files in `anthologies/home-library-series/server/` and joins the WHL Docker network, so LiteLLM can send it a record of every request without leaving Docker.

The amber arrows from limesalt mark ports that answered from limesalt on 2026-11-18: Open WebUI, Langfuse and Jellyfin reported healthy, and the relay refused a request with no key, as it should. A second run with the key set listed the three routes and got a chat answered on `ollama-coder`, and Langfuse holds the record of that chat. They stay amber only because neither report said which network the laptop was on.

## Elements And Flow
- **Components:**
  - limesalt, the laptop and client
  - Ollama, native Windows, port 11434, six models pulled
  - Open WebUI (`whl-openwebui`, port 3000), LiteLLM (`whl-litellm`, port 4000) and Jellyfin (`whl-jellyfin`, port 8096) in Docker Desktop, compose files in `E:\WHL\compose`
  - LM Studio, native Windows, port 1234, bound to 127.0.0.1, serving `openai/gpt-oss-20b` and `mistralai/devstral-small-2-2512`
  - Langfuse 4.82.0 (compose project `whl-langfuse`, port 3001), with its own Postgres, ClickHouse, Redis and object store, none of which are drawn
  - The media folder `E:\WHL\media`
- **Relationships:**
  - Blue arrow 1 is the only path proven from limesalt away from home
  - Amber arrows 2 are proven from limesalt, but not confirmed away from home
  - Green arrows 3 to 7 are connections that run entirely on the desktop
  - Dashed outlines group the client, the desktop, and the WHL stack inside Docker Desktop
- **Notable labels or metrics:**
  - "all addresses · 6 models pulled" on Ollama
  - "the relay · 3 routes · needs a key" on LiteLLM. The routes are `local-fast`, `local-coder` and `ollama-coder`
  - "this machine only (127.0.0.1)" on LM Studio
  - "a record of every request" on the arrow into Langfuse

## How To Read It
1. Step 1: limesalt asks Ollama for a model over Tailscale. This is the thin version exit test and it passed.
2. Step 2: the same tunnel also reaches ports 3000, 3001, 4000 and 8096. All four are proven from the laptop, the relay with its key.
3. Step 3: Open WebUI passes each chat request to LiteLLM, using the key in `E:\WHL\compose\.env`.
4. Step 4: LiteLLM forwards `local-fast` and `local-coder` to LM Studio through `host.docker.internal`, which is why LM Studio can stay bound to this machine.
5. Step 5: Jellyfin reads the media folder. It depends on nothing else in the picture.
6. Step 6: LiteLLM forwards `ollama-coder` to Ollama, the same way.
7. Step 7: LiteLLM reports each request to Langfuse. If Langfuse is down, requests still succeed and only the record is lost.

## Home Library Relevance
The series README was first written without sight of `E:\WHL` and planned a second relay. On 2026-11-17 the decision was to join the two: keep the LiteLLM that already ran, add a route to Ollama, and attach Langfuse to it. This picture is that result. It also shows what is left: one run from limesalt on a hotspot to confirm the amber arrows away from home (the brief is `anthologies/home-library-series/client/VERIFY.md`), a caller who goes straight to Ollama on arrow 1 is not recorded in Langfuse, and Ollama and LM Studio share one 16 GB graphics card.

Verified from the desktop on 2026-11-18 by `anthologies/home-library-series/client/verify.ps1` (9 of 9 checks) and by reading back from Langfuse the record of a chat sent through each runtime. Other sources, read on 2026-11-17: `docker ps`, `tailscale status`, `ollama list`, `E:\WHL\README.md`, `E:\WHL\compose\`, `E:\WHL\config\litellm\config.yaml`.

## Suggested Caption
DIA-106 · Home library: limesalt reaches the desktop over Tailscale; one relay fronts LM Studio and Ollama and records every request in Langfuse.
