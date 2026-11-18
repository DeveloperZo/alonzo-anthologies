# DIA-110: Startup and failure
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-110-HomeLibraryStartup.svg`
- **Theme:** What the home library needs after a restart, and what stops when one piece is down
- **Primary audience takeaway:** After a restart someone must log in and then start Docker Desktop by hand; the containers follow it, the relay needs Ollama behind it, and Langfuse being down loses only the record.

## What The Diagram Shows
The picture reads left to right, which is startup order. An arrow from A to B means B needs A.

On the left, Windows starts after a restart or an update. Nothing else happens until someone logs in, because automatic login is off. Three programs run directly on Windows. Tailscale and Ollama come back at login. Docker Desktop does not: it has to be started by hand, which is why it is the one amber node. On the right, a frame holds the four containers. They come back by themselves once Docker Desktop is up. Inside the frame, LiteLLM (the relay) needs Ollama, Open WebUI needs LiteLLM, and Langfuse is used by LiteLLM but not required. Jellyfin needs nothing but Docker Desktop.

Every node also says what stops when that piece is down. A note at the lower left records the known fault that Docker Desktop can fail to start.

## Elements And Flow
- **Components:**
  - **Windows starts** (hardware-style node, gray). What: the operating system coming up after a restart or update. Why it is here: it is the start of the chain, and its amber line "you must log in" is the first manual step. Automatic login is off, and the per-user startup entries run only after a login.
  - **Tailscale** (native program, green). What: the private network that lets the laptop find the desktop by name. Start: comes back at login. The Windows service starts on boot, but unattended mode is off, so the tailnet connects when the user session starts. If down: the laptop cannot find the desktop.
  - **Docker Desktop** (native program, amber). What: the program that runs the containers. Start: you must start it (`autoStart` is false, and its Run key entry is not enabled). If down: the relay, chat, record and media all stop. Ollama keeps running, and the direct path to Ollama on its own port still answers.
  - **Ollama** (native program, green). What: the model runtime, the only one since LM Studio was retired on 2026-11-18. Start: comes back at login, from a Startup folder shortcut. If down: no model answers.
  - **Containers frame** (dashed group frame). What: the four things that run inside Docker Desktop. Why: one label says how all of them start, so the nodes do not have to repeat the reason.
  - **LiteLLM (the relay)** (container, green). Start: follows Docker Desktop (restart policy `unless-stopped`). If down: no tool or chat gets an answer through the relay.
  - **Open WebUI** (container, green). Start: follows Docker Desktop (restart policy `unless-stopped`). If down: no browser chat; tools still work.
  - **Langfuse** (container stack, green, drawn with a second outline because it is seven containers). Start: follows Docker Desktop (all seven have restart policy `always`). If down: answers still come, but there is no record.
  - **Jellyfin** (container, green). Start: follows Docker Desktop (restart policy `unless-stopped`). If down: no media; nothing else is affected.
  - **Known fault note** (amber text with a rule). Docker Desktop can fail to start because of a stale socket. The fix is in `_KNOWLEDGE/Context/home-library.md`.
- **Relationships:**
  - Windows to Tailscale, Docker Desktop and Ollama: one gray bracket with three tips. These programs can only start after Windows is up and a user is logged in.
  - Docker Desktop to the containers frame: one amber arrow that ends at the frame edge. Every container needs Docker Desktop, and this is the weak point of the chain.
  - Ollama to LiteLLM: solid blue. Every relay route points at Ollama, so the relay has nothing to pass work to without it.
  - LiteLLM to Open WebUI: solid blue. Open WebUI talks only to the relay.
  - LiteLLM to Langfuse: thin blue, labelled "not required". The relay sends a record of each request, and carries on if Langfuse is down.
- **Notable labels or metrics:**
  - The bold line in each node is the start line, the status mark: green for "comes back", amber for "you must".
  - The italic lines starting "if down:" give the consequence of that piece being down.
  - There are no numbers on this diagram. Its facts come from the fact sheet checked on lemonpepper on 2026-11-18 (startup chain, Docker Desktop settings, container restart policies, Tailscale preferences, Windows automatic login), and from the retirement of LM Studio on the same day.
  - Counts: 8 nodes, 1 frame, 5 lines (the bracket counts as one), 1 note. 15 marks.

## How To Read It
1. Start at the left: Windows is up, and someone has to log in.
2. Read the middle column top to bottom. The bold line says how each program starts. Only Docker Desktop is amber.
3. Follow the amber arrow into the containers frame: nothing inside it runs until Docker Desktop is up.
4. Inside the frame, follow the blue arrows from Ollama through LiteLLM to Open WebUI. The thin arrow to Langfuse is a use, not a need.
5. For any piece, read its italic "if down" line to see what stops.

## Home Library Relevance
This is the picture for the person standing at the desktop after a reboot, or wondering why the laptop gets no answer. It makes the two manual steps visible: logging in, and starting Docker Desktop. The plan for this set named only Docker Desktop; the fact sheet's startup chain shows that Tailscale and Ollama also wait for a login, so the login is drawn as the first step. The Tailscale settings behind that were verified; that the tailnet connects only at login is the expected consequence of unattended mode being off and was not tested by rebooting.

Two things are left to prose. The commands to start things belong in a runbook and in ARCH-006. No cloud fallback is drawn because none is wanted: the desktop being off simply means no local models. Ports and networks are in DIA-112, model sizes in DIA-108, and what each piece is in DIA-107.

## Suggested Caption
DIA-110 · Startup: after a restart, log in and start Docker Desktop by hand; until then the relay, chat, record and media are down.
