# Verify the home library from limesalt

<!--
Purpose: Brief for a person or an agent on limesalt to prove the laptop can use the desktop server.
Status: working
Owner: zo
Human id: home-library-client-verify
Update trigger: when a service, port or route on the desktop changes
Last updated: 2026-11-18
-->

This is a brief for an agent working on limesalt. It is read-only: the
checks change nothing on either machine.

## What you are proving

limesalt can reach every service on the desktop (`win-mpisa5dbmqf`) over
Tailscale, both on home wifi and away from it. The picture of what
should be there is `_KNOWLEDGE/Diagrams/DIA-106-HomeLibrary.svg`.

## Before you start

1. Pull this repo so `verify.ps1` beside this file is current.
2. Confirm Tailscale is connected: `tailscale status` lists
   `win-mpisa5dbmqf`.
3. The relay checks need the LiteLLM key. It is not in this repo. If
   the environment variable `WHL_LITELLM_KEY` is not already set, ask Zo
   for it once. Do not search for it, and do not write it into any
   file. Without it, two checks are skipped and the rest still run.

## Run it

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/verify.ps1
```

Run it twice: once on home wifi, once with limesalt on a phone hotspot.
Only Zo can switch the network, so ask for that once and wait.

## What passing looks like

| Check | Passes when |
| --- | --- |
| Tailscale reaches the desktop | A pong comes back. "via DERP" means relayed, which is normal on a hotspot. Skipped if the Tailscale command cannot be found |
| Ollama lists models | Six models |
| Ollama answers a chat | A one-word reply, usually within 10 seconds |
| Relay refuses a request with no key | HTTP 401 |
| Relay lists its routes | `local-fast`, `local-coder`, `ollama-coder` |
| Relay answers a chat on `ollama-coder` | A one-word reply |
| Langfuse dashboard is up | Status OK |
| Open WebUI is up | HTTP 200 |
| Jellyfin is up | HTTP 200 |

The script exits with the number of failed checks, so 0 is a full pass.

After a relay chat passes, the request should also appear in Langfuse at
`http://win-mpisa5dbmqf:3001` within about 30 seconds, named
`litellm_request`. Looking needs Zo's Langfuse login, so leave that
check to Zo.

## If something fails

- **Every check fails:** Tailscale is disconnected on limesalt, or the
  desktop is asleep or off.
- **Ollama passes, ports 3000, 3001, 4000 and 8096 fail:** Docker
  Desktop is not running on the desktop. See the Docker note in
  `_KNOWLEDGE/Context/home-library.md`.
- **Passes on home wifi, fails on the hotspot:** a firewall rule on the
  desktop is limited to the home network. Report which ports.
- **The relay chat fails and the Ollama chat passes:** the route name
  changed. Compare with `E:\WHL\config\litellm\config.yaml` on the
  desktop.

Do not try to fix the desktop from limesalt. Report instead.

## What to report

Paste the result table from each run, say which network each run was on
(home wifi or hotspot, every time),
and add one line per failure with the error text. Then record the date
and outcome in the changelog of `../README.md`.
