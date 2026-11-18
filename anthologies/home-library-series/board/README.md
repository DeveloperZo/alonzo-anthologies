# The home library board

<!--
Purpose: What the live board shows, how to run it, what each number means and where it comes from.
Status: working, first version
Owner: zo
Human id: home-library-board
Update trigger: when a service, port, route or data source on the desktop changes
Last updated: 2026-11-18
-->

One page that shows what the home AI server is doing right now. Open it
from any machine on the tailnet or the home network:

    http://lemonpepper:8088/

## What it is made of

| File | What it does |
| --- | --- |
| `collector.py` | Runs on the desktop (plain Python 3.12, standard library only). Polls each source on its own timer and writes `status.json` once a second. |
| `status.json` | The latest reading. Written by the collector. Not in version control. |
| `index.html` | The page. One file, no library, no build step. It refetches `status.json` every 2 seconds. |
| `board.compose.yml` | A small web server container (`whl-board`, busybox httpd) that serves this folder read-only on port 8088. |

The collector runs on the host because it needs `nvidia-smi`, Docker,
Tailscale and the Windows counters. The page is served from a container
because Docker-published ports are already reachable from limesalt, and
a Python process listening on a port is not.

## Start and stop

The container (leave it running, it restarts with Docker Desktop):

    docker compose -f board.compose.yml up -d
    docker compose -f board.compose.yml down

The collector, detached, from PowerShell on the desktop:

    Start-Process -WindowStyle Hidden -FilePath "C:\Python312\pythonw.exe" -ArgumentList '"F:\Programming\alonzo-anthologies\anthologies\home-library-series\board\collector.py"'

Stop it:

    Get-CimInstance Win32_Process -Filter "Name='pythonw.exe'" | Where-Object { $_.CommandLine -match 'collector\.py' } | ForEach-Object { Stop-Process -Id $_.ProcessId }

Only one collector can write a given `status.json`. A second one exits
at once. The collector does not start by itself after a restart of the
desktop. If it is not running, the page greys out and says NO DATA.

To watch it in a console instead: `py -3.12 collector.py`. To take one
reading and exit: `py -3.12 collector.py --once`.

## What the page shows

- **Status line.** A badge (LIVE, DEMO or NO DATA) and one sentence
  saying what the system is doing.
- **The scene.** Laptop, private tunnel, relay, Ollama, and the log. When
  a real request appears in the log, one dot travels the path once. The
  dot carries F for `local-fast` or C for `local-coder`. A smaller dot
  drops from the relay into the log.
- **The tank.** The graphics card as 16 cells of about 1 GB. Solid is
  the loaded model, striped is everything else on the card, empty is
  free. The thin bar and the clock under it count down to the unload.
- **Four numbers.** Requests today, tokens today, the speed of the last
  answer, card memory in use.
- **Service lights.** Relay, Ollama, Langfuse, Open WebUI, Jellyfin and
  the two machines. Up is a solid mark with a tick. Down is a hollow
  mark with a cross, the word DOWN, and one sentence on what that means.
- **24 hour strip.** Real requests per hour.
- **Last ten requests.** Time, caller, route, tokens, seconds.

### Honesty rules the page keeps

- A dot is only ever drawn for a real record, a few seconds after the
  request finishes. Nothing moves while the system is idle except the
  unload clock.
- The DEMO button plays one invented request. The badge says DEMO, the
  dot is hollow and tagged DEMO, the frame is dashed, and no counter,
  table row or log record changes. The page returns to LIVE when the
  demo ends, or at once if a real request arrives.
- If `status.json` stops changing for 15 seconds the page greys out and
  says "NO DATA since" with the time of the last reading.
- No prompt or reply text is fetched, stored or shown. The collector
  never asks Langfuse for those fields.
- No key is in `status.json` or the page. The collector reads the relay
  key from `E:\WHL\compose\.env` and the Langfuse keys from
  `../server/.env`, holds them in memory, and scrubs them from any error
  text.

## What each number means and where it comes from

| On the page | Meaning | Source | Read every |
| --- | --- | --- | --- |
| Card memory in use, percent busy, watts, temperature | The whole card, all programs | `nvidia-smi --query-gpu` | 2 s |
| Solid part of the tank | Card memory held by Ollama | Windows counter `GPU Process Memory`, for the Ollama process. Falls back to Ollama's own figure | 20 s |
| Striped part of the tank | Card memory in use minus the Ollama share | derived | 2 s |
| "Other use is mostly" | The largest other programs on the card. A hint only: the Windows figures overlap | same Windows counter | 20 s |
| Loaded model, context, unload clock | What Ollama holds and when it lets go | Ollama `GET /api/ps` | 3 s |
| Relay light | The relay answers | LiteLLM `GET /health/liveliness` | 5 s |
| Langfuse light | The log answers | Langfuse `GET /api/public/health` | 10 s |
| Open WebUI and Jellyfin lights | Each answers its own health address | `GET /health` on ports 3000 and 8096 | 10 s |
| Machines | Online on the tailnet | `tailscale status --json` | 15 s |
| Containers running, restarts | Docker state | `docker ps -a`, `docker inspect` | 20 s |
| Desktop up | Time since Windows started | Windows tick count | 1 s |
| Last ten requests | Real requests, newest first | Langfuse `GET /api/public/v2/observations` | 4 s |
| Requests today, tokens today | Successful real requests since local midnight, tokens in plus out | a scan of the last 24 hours of the same Langfuse records | 15 s |
| 24 hour strip | Successful real requests per hour. Failed ones are stacked in red | same scan | 15 s |
| Speed of the last request | Tokens out divided by the whole request time, for the newest answer of 20 tokens or more. Waiting and model loading are included, so it reads low after a model switch | derived from the record | 4 s |
| Route medians (in `status.json` only, not drawn yet) | Median seconds and tokens per second per route, 24 hours | Langfuse `GET /api/public/v2/metrics` | 15 s |

The caller is the `user` value a client sends, which `ask-local.ps1`
sets. A request with no `user` shows as "unnamed". The small grey word
after the caller is the task tag.

**"Real" leaves out probes.** These records are counted separately and
kept off the table, the strip and the counters: requests refused before
routing (no key), LiteLLM's own health checks, records for route names
that no longer exist, anything tagged `probe` or `verify`, and an
unnamed, untagged chat that starts within three seconds of a no-key
refusal (the pattern `verify.ps1` leaves; this one is a guess).

Each source fails on its own. `status.json` has a `sources` block with,
per source, whether the last read worked and the time of the last good
read. The page shows that time wherever it shows old data.

## What it cannot show yet

- **Who is asking while a request is running.** Langfuse writes the
  record only after the reply ends. During a request the page can say a
  model is working (the card is above 40 percent busy for two readings
  with a model loaded) but not for whom. Another program using the card
  hard would look the same.
- **Time to first token.** Langfuse has no value for it on any record.
- **Requests that skip the relay.** A direct call to Ollama on port
  11434 leaves no record, so it draws no dot and moves no counter. It
  does reset the unload clock.
- **Model switching.** A switch shows only as the tank emptying and
  refilling. There is no "loading" state.
- **History of outages.** The strip does not mark hours when a service
  was down or the collector was off.
- **Open WebUI and Jellyfin in the scene.** They have lights only.
- Left for later from the research: the token stream, replay of a past
  hour, the "what if I switch this off" layer, the step-through tour,
  and the "what if I load this model" picker.

## Testing a failure without stopping anything

    py -3.12 collector.py --break ollama

This points the collector's Ollama address at a dead port. The real
service is not touched. The page shows Ollama hollow with a cross and the
other sources keep updating. `--break` also accepts `relay`, `langfuse`,
`openwebui` and `jellyfin`. Stop the normal collector first, since only
one can write.
