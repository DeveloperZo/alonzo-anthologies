# Verify the home library from limesalt

<!--
Purpose: Brief for a person or an agent on limesalt to prove the laptop can use the desktop server.
Status: working
Owner: zo
Human id: home-library-client-verify
Update trigger: when a service, port or route on the desktop changes
Last updated: 2026-11-23
-->

This is a brief for an agent working on limesalt. It is read-only: the
checks change nothing on either machine.

## What you are proving

limesalt can reach every service on the desktop (`lemonpepper`) over
Tailscale, both on home wifi and away from it. The picture of what
should be there is `anthologies/home-library-series/diagrams/DIA-100-WhatItIsFor.svg`.

## Before you start

1. Pull this repo so `verify.ps1` beside this file is current.
2. Confirm Tailscale is connected: `tailscale status` lists
   `lemonpepper`.
3. The relay checks need this machine's own front-door key (each caller
   has its own; the master key never leaves the desktop). It is not in
   this repo. If the environment variable `WHL_LITELLM_KEY` is not
   already set, ask Zo for it once. Do not search for it, and do not
   write it into any file. Without it, two checks are skipped and the
   rest still run.

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
| Ollama is closed to the network | Port 11434 refuses the connection. Ollama listens on the desktop only, and callers go through the doors |
| Relay refuses a request with no key | HTTP 401 |
| Relay lists its routes | Includes `local-fast` |
| Relay answers a chat on `local-fast` | A one-word reply. Up to 30 seconds if another model was loaded |
| Private door refuses a request with no key | HTTP 401 |
| Private door has home routes only | Only `local-*` or `home-*` routes. Needs `WHL_PRIVATE_KEY`, otherwise skipped |
| Private chat page is up | HTTP 200 |
| Langfuse dashboard is up | Status OK |
| Open WebUI is up | HTTP 200 |
| Jellyfin is up | HTTP 200 |

The script exits with the number of failed checks, so 0 is a full pass.

After a relay chat passes, the request should also appear in Langfuse at
`http://lemonpepper:3001` within about 30 seconds, named
`litellm_request`. Looking needs Zo's Langfuse login, so leave that
check to Zo.

## If something fails

- **Every check fails:** Tailscale is disconnected on limesalt, or the
  desktop is asleep or off.
- **Tailscale passes, ports 3000, 3001, 4000 and 8096 fail:** Docker
  Desktop is not running on the desktop. See the Docker note in
  `_KNOWLEDGE/Context/home-library.md`.
- **"Ollama is closed to the network" fails:** port 11434 is open
  again. Usually the Ollama app's "Expose Ollama to the network"
  setting was switched back on. Report it to Zo.
- **Passes on home wifi, fails on the hotspot:** a firewall rule on the
  desktop is limited to the home network. Report which ports.
- **The relay lists its routes but the chat fails:** the route name
  changed, or the model is busy. Compare with
  `E:\WHL\config\litellm\config.yaml` on the desktop.

Do not try to fix the desktop from limesalt. Report instead.

## What to report

Paste the result table from each run, say which network each run was on
(home wifi or hotspot, every time),
and add one line per failure with the error text. Then record the date
and outcome in the changelog of `../README.md`.
