# Williams Home Library series

<!--
Purpose: Entry point for the Williams Home Library series: what it is for, its shape, and what is still undecided.
Status: draft
Owner: zo
Human id: home-library-series-readme
Update trigger: when a decision below is settled, or a project in the series starts
Last updated: 2026-11-17
-->

Status: concept. Nothing is built or installed yet. This page was
written on limesalt; the desktop has not been inspected.

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
| Desktop | Server. Runs the model runtime and holds the shared library |
| limesalt (laptop) | Client. Where most interactive work happens |

## Shape

Three layers, each replaceable without touching the others.

| Layer | Job | Default choice | Why |
| --- | --- | --- | --- |
| Network | One stable private address for the desktop, at home and away | Tailscale on both machines | Same name works on the home network (direct) and off it (encrypted tunnel). No router port forwarding, nothing exposed to the internet |
| Model runtime | Serve models over HTTP | Ollama on the desktop, listening on the private network address | Free, runs on Windows, speaks the OpenAI-compatible API most tools accept |
| Library | Files both machines need | Git for anything that is a repo. A private repo or a synced folder for the rest | See `_KNOWLEDGE/Context/` for why repos do not go in a file-sync tool |

The laptop then points any OpenAI-compatible tool at
`http://<desktop-name>:11434/v1`. The address does not change when the
laptop leaves the house.

## Decisions still open

- Desktop hardware: GPU model and memory. This sets which models are
  realistic.
- Desktop operating system and whether it can stay awake, or needs wake
  on LAN.
- Which models to keep loaded, and for what work.
- Whether a chat front end (for example Open WebUI) is wanted, or only
  the API.
- Where the non-repo library lives, and how it is backed up.

## Planned projects in this series

None exist yet. Expected, in order:

1. `server/`: desktop setup as scripts and a runbook (network, runtime,
   keep-awake, health check).
2. `client/`: laptop configuration and a connectivity check that passes
   both at home and away.
3. `swarm/`: agent swarms that use the server as their model endpoint.

## Relation to the gatekeeper series

The gatekeeper workbench (`anthologies/gatekeeper-series/`) treats the
agent tool as configuration. Once the server answers on the private
network, the workbench points at it (slice W3 in its plan), and the
swarm project here is where several briefs run at once (slice W4).
Design seeds for the swarm are listed in
`anthologies/gatekeeper-series/planning/SEEDS.md`.

## Changelog

- 2026-11-17: Series created as a concept page.
