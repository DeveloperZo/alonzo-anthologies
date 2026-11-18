# DIA-106: Home library: who does what work
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-106-HomeLibrary.svg`
- **Theme:** What the home library is for: which work stays with a frontier model and which work goes to the local models on the desktop
- **Primary audience takeaway:** A frontier tool such as Claude Code stays in charge and keeps the thinking. It hands the token-heavy work to free local models on the desktop, through one relay that records everything. The desktop also has a chat page and a media server.

## What The Diagram Shows
This is the overview of a seven-diagram set (DIA-106 to DIA-112). It answers one question: what is this system for?

The left column holds the two parties that are not the server. Claude Code is the harness. It runs on either machine (the laptop `limesalt` or the desktop `lemonpepper`), and it plans the work, decides what to do next and checks every result. Above it is the frontier model in the cloud, which is paid per token. The gray arrow between them says the thinking stays there.

The blue arrow to the right is the point of the system. The harness hands token-heavy work to the desktop, where the models are local and cost nothing per token. The hand-off is a small command the harness runs: it sends a prompt to the relay and gets text back. The result returns to the harness, which judges it.

Inside the desktop frame, the work arrives at LiteLLM, the relay: one address and one key for every tool. LiteLLM passes the work to Ollama, the model runtime, which runs the local models and costs electricity and time only. LiteLLM also sends a record of each request up to Langfuse, so the owner can see how much work went local.

The dashed group at the bottom holds what else the desktop offers. Open WebUI is a chat page in a browser that uses the same models through the same relay. Jellyfin is a media server and connects to nothing else in the picture.

## Elements And Flow
- **Components:**
  - **Frontier model** (gray pill, outside party). What: a model in the cloud. Why it is drawn: it is the cost the system exists to reduce, because it is paid per token.
  - **Claude Code, the harness** (blue pill, the asking side). What: a frontier tool that plans, decides and checks the result. Why: it is who sends the work. It can run on `limesalt` or on `lemonpepper`. Claude Code is the example; any frontier tool that can run a command can take this role.
  - **Desktop frame** (solid frame). What: the machine `lemonpepper`. Why: everything inside it is local, so there is no cost per token.
  - **LiteLLM, the relay** (green, round corners, a Docker container). What: one address and one key. Why: it passes the work to a model, and it is the one place where every request can be recorded.
  - **Ollama** (green, square corners, a native Windows program). What: the model runtime that runs the local models. Why: the work costs electricity and time only. It is the only model runtime since LM Studio was retired on 2026-11-18.
  - **Langfuse** (green, drawn as a stack because it is several containers). What: keeps a record of every request sent through the relay. Why: it shows how much work went local.
  - **Also on the desktop** (dashed group frame). Why: these two are not part of the hand-off, but a newcomer should know they exist.
  - **Open WebUI** (green container). What: a chat page for the same models. Why: a person can use the local models in a browser, with no tool set up.
  - **Jellyfin** (green container). What: a media server for movies, shows and music. Why: the second, unrelated use of the desktop.
- **Relationships:**
  - Harness up to frontier model (gray, solid): "keeps the thinking". Not a call into the system. Planning and judgment stay with the frontier model.
  - Harness to LiteLLM (blue, solid): "hands over token-heavy work". The note under it, "the result comes back to the harness", stands in for a return arrow.
  - LiteLLM to Ollama (blue, solid, no label): the relay passes the work to a local model.
  - LiteLLM up to Langfuse (blue, solid): "a record".
  - Open WebUI up to LiteLLM (blue, solid, no label): the chat page uses the same relay. It does not talk to Ollama directly.
  - Jellyfin has no arrows. Nothing depends on it and it depends on nothing drawn here.
- **Notable labels or metrics:**
  - The picture carries no numbers. Ports, model names, sizes and speeds are in DIA-107, DIA-108, DIA-109 and DIA-112.
  - "token-heavy work" is not broken down on the picture. The owner's examples are: summarizing long files, first drafts, pulling fields out of text, sorting items into categories, and bulk rewrites.
  - "no cost per token" and "costs electricity and time only" are the cost claim: local models are free to call, but they use power and they are slower than a frontier model.
  - Counts: 7 nodes, 2 frames, 5 arrows, 1 note. 15 marks in total. Two line meanings. No amber and no red.
  - Sources: the component fact sheet checked on `lemonpepper` on 2026-11-18 (what each component is, that Open WebUI is set to talk only to the relay, that LiteLLM reports to Langfuse, that Jellyfin is independent), and the owner's decisions of 2026-11-18 (Ollama is the only model runtime, both relay routes point at it, no cloud route, the intended use, the machine names).

## How To Read It
1. Start at the blue pill on the left. Claude Code is the harness: it stays in charge.
2. Follow the gray arrow up. The thinking stays with the frontier model, which is paid per token.
3. Follow the blue arrow right, into the desktop. The token-heavy work goes to LiteLLM, the relay.
4. Continue right to Ollama, which runs the local models and does the work. The answer goes back the same way to the harness.
5. Go up from LiteLLM to Langfuse, where a record of the request is kept.
6. Finish on the dashed group. The chat page uses the same relay and models. The media server stands alone.

## Home Library Relevance
This picture replaces the earlier DIA-106, which was a status report of what had been proven from the laptop and on which day. That history is not structure and belongs in prose. The redraw gives the first picture of the set the one job a first picture has: say what the system is for.

The purpose is cost. A frontier tool is the harness on either machine. It keeps planning and judging, and sends the token-heavy work to the local models through the relay to cut frontier token cost. Because every such request passes through LiteLLM, Langfuse holds the only record of how much work actually went local.

What this picture leaves out on purpose, and where to find it: ports and who can reach them (DIA-112), the tailnet between the two machines (DIA-108, DIA-112), the graphics card and model sizes (DIA-108), the key check, the route names and the direct path to Ollama that skips the relay and the record (DIA-109), and every weak point (DIA-110, DIA-111, DIA-112). Two facts from the fact sheet are relevant to the lower group and are not drawn because weak points are not this diagram's subject: Jellyfin runs but has never been set up and its media folder is empty, and Open WebUI had no account when checked.

## Suggested Caption
DIA-106 · Home library: a frontier tool keeps the thinking and hands token-heavy work to local models on the desktop.
