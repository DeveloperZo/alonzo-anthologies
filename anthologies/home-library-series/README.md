# Williams Home Library series

<!--
Purpose: Entry point for the Williams Home Library series: what it is for, its shape, and what is still undecided.
Status: draft
Owner: zo
Human id: home-library-series-readme
Update trigger: when a decision below is settled, or a project in the series starts
Last updated: 2026-11-17
-->

Status: working on the desktop as of 2026-11-17. One relay fronts both
model runtimes and every request through it is recorded in Langfuse.
The thin version exit test passed from limesalt, and on 2026-11-18
`client/verify.ps1` run on limesalt reached every service. Still to do:
rerun it on limesalt with `WHL_LITELLM_KEY` set, so a chat through the
relay is proven from the laptop, and set a Langfuse login.

## Thin version exit test

From limesalt, off the home network, a chat request to
`http://<desktop-name>:11434/v1` is answered by an open source model
running on the desktop. This proves the work can be done without paid
tokens. The thin version runs on Windows; the move to Linux comes
after.

Met on 2026-11-17: from limesalt on a phone hotspot,
`http://win-mpisa5dbmqf:11434/v1/models` returned the desktop's model
list. A chat request by the same name was answered from the desktop
itself.

## What runs today

![](../../_KNOWLEDGE/Diagrams/DIA-106-HomeLibrary.svg)

| Piece | Address | Job |
| --- | --- | --- |
| LiteLLM (the relay) | `http://win-mpisa5dbmqf:4000/v1` | The one address tools should use. Needs a key. Forwards to LM Studio or Ollama and records each request |
| Langfuse (the dashboard) | `http://win-mpisa5dbmqf:3001` | Shows every request through the relay: model, prompt, reply, time taken |
| Open WebUI | `http://win-mpisa5dbmqf:3000` | Chat in the browser |
| Ollama | `http://win-mpisa5dbmqf:11434/v1` | Direct access to Ollama models. No key, and not recorded in Langfuse |
| Jellyfin | `http://win-mpisa5dbmqf:8096` | Media server |
| LM Studio | Port 1234, desktop only | Reached through the relay |

The relay offers three routes. A client asks for a route name, not a
model name.

| Route | Answered by |
| --- | --- |
| `local-fast` | `openai/gpt-oss-20b` in LM Studio |
| `local-coder` | `mistralai/devstral-small-2-2512` in LM Studio |
| `ollama-coder` | `qwen2.5-coder:14b` in Ollama |

The files are in two places. The relay, Open WebUI and Jellyfin belong
to the WHL project in `E:\WHL` on the desktop, which is outside this
repo and not under version control. It has its own README and
architecture page. Langfuse is in `server/` here.

## Purpose

Turn the desktop into an always-available home server that hosts local
LLMs and shared working material, and let limesalt (the laptop) use it
the same way whether both machines are on the home network or not.

This is the "free LLM stack": models run on hardware already owned, so
use costs electricity and nothing per token. Agent swarms come after
this works, because a swarm needs a model endpoint that every agent can
reach.

## Machines

| Machine | Role |
| --- | --- |
| Desktop | Server. Runs the model runtime and holds the shared library. Windows, Intel i9-13900K, 64 GB memory, NVIDIA RTX 5080 with 16 GB of graphics memory |
| limesalt (laptop) | Client. Where most interactive work happens |

## Shape

Three layers, each replaceable without touching the others.

| Layer | Job | Default choice | Why |
| --- | --- | --- | --- |
| Network | One stable private address for the desktop, at home and away | Tailscale on both machines | Same name works on the home network (direct) and off it (encrypted tunnel). No router port forwarding, nothing exposed to the internet |
| Model runtime | Serve models over HTTP | Ollama and LM Studio on the desktop, behind one relay (LiteLLM) | Free, run on Windows. The relay gives tools one OpenAI-compatible address and a record of use |
| Library | Files both machines need | Git for anything that is a repo. A private repo or a synced folder for the rest | See `_KNOWLEDGE/Context/` for why repos do not go in a file-sync tool |

The laptop then points any OpenAI-compatible tool at the relay,
`http://<desktop-name>:4000/v1`. The address does not change when the
laptop leaves the house.

## Server: the activity dashboard

`server/` holds Langfuse only. The relay it reports for is the WHL
LiteLLM, so there is no second relay here.

| File | What it is |
| --- | --- |
| `langfuse.compose.yml` | Unchanged copy of the upstream Langfuse file. Do not edit |
| `langfuse.override.yml` | The local changes: port 3001 instead of 3000, and membership of the WHL Docker network |
| `env.example` | Template for `.env`, which git ignores |

To start or restart, from `server/`:

```
docker compose -f langfuse.compose.yml -f langfuse.override.yml up -d
```

To set the login, fill in `LANGFUSE_INIT_USER_EMAIL` and
`LANGFUSE_INIT_USER_PASSWORD` in `.env` and run the same command. The
login is created on the next start. It does not have to be there for
the first one.

The relay finds Langfuse through four settings on the `litellm` service
in `E:\WHL\compose\docker-compose.yml`, and two keys in
`E:\WHL\compose\.env` that must match `LANGFUSE_INIT_PROJECT_PUBLIC_KEY`
and `LANGFUSE_INIT_PROJECT_SECRET_KEY` here. To offer another model, add
an entry to `E:\WHL\config\litellm\config.yaml` and restart the relay.

## Decisions still open

- Settled 2026-11-17: desktop hardware is in the Machines table. A
  model must fit in 16 GB of graphics memory to run at full speed.
- Settled 2026-11-17: the desktop runs Windows with sleep set to never.
  A move to Linux is planned, dual boot first.
- Settled 2026-11-17: the two stacks are joined. Langfuse reports for
  the WHL LiteLLM on port 4000, which gained a route to Ollama. The
  second relay was removed from `server/`.
- Whether direct access to Ollama on port 11434 stays open. It has no
  key and is not recorded in Langfuse.
- Whether `E:\WHL` moves into this repo. Today it has no history and no
  backup.
- Which models to keep loaded, and for what work. Ollama and LM Studio
  share one 16 GB graphics card.
- Settled 2026-11-17: an activity dashboard is wanted (Langfuse behind
  a relay). Open WebUI is the chat front end already running.
- Where the non-repo library lives, and how it is backed up.

## Planned projects in this series

In order:

1. `server/`: started. Holds Langfuse. Still wanted: the rest of the
   desktop setup as scripts and a runbook (network, runtime,
   keep-awake).
2. `client/`: started. Holds the connectivity check (`verify.ps1`) and
   the brief for running it on limesalt (`VERIFY.md`). Laptop tool
   configuration is still to come.
3. `swarm/`: agent swarms that use the server as their model endpoint.

## Relation to the gatekeeper series

The gatekeeper workbench (`anthologies/gatekeeper-series/`) treats the
agent tool as configuration. Once the server answers on the private
network, the workbench points at it (slice W3 in its plan), and the
swarm project here is where several briefs run at once (slice W4).
Design seeds for the swarm are listed in
`anthologies/gatekeeper-series/planning/SEEDS.md`.

## Changelog

- 2026-11-18: `client/verify.ps1` run on limesalt: Ollama chat, Open
  WebUI, Langfuse and Jellyfin passed, and the relay refused a request
  with no key. The two keyed relay checks were skipped (no key set).
  The report did not say whether limesalt was on home wifi or a
  hotspot. The one failure was the script not finding the Tailscale
  command, which is fixed: it now looks in the install folder and
  skips the check if the command is missing.
- 2026-11-17: Stacks joined. Langfuse started on port 3001 and attached
  to the WHL LiteLLM, which gained the `ollama-coder` route. Second
  relay removed. `client/verify.ps1` passes 9 of 9 from the desktop.
- 2026-11-17: Found the WHL stack in `E:\WHL` already running on ports
  3000, 4000 and 8096. Added DIA-106 and the port conflict with
  `server/`.
- 2026-11-17: Thin version exit test passed from limesalt on a phone
  hotspot.
- 2026-11-17: Desktop side of the thin version verified from the
  desktop itself.
- 2026-11-17: Server files added: relay and dashboard, not yet started.
- 2026-11-17: Desktop hardware and operating system recorded.
- 2026-11-17: Thin version scoped: Windows, Ollama, exit test added.
- 2026-11-17: Series created as a concept page.
