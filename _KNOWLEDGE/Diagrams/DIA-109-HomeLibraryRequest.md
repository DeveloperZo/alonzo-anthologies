# DIA-109: One request
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-109-HomeLibraryRequest.svg`
- **Theme:** What happens to one request sent to the home library, step by step
- **Primary audience takeaway:** A request goes to the relay, which checks the key, picks the model by route name, lets Ollama answer and writes a record to Langfuse; a request sent straight to Ollama has no key and leaves no record.

## What The Diagram Shows
The picture reads left to right and follows one request. The caller on the left is a tool or a browser, on limesalt or on lemonpepper. Step 1 has two forms, both numbered 1 because a request takes one or the other: a browser opens the chat page (Open WebUI, port 3000), or a tool calls the relay (LiteLLM, port 4000) and sends the key. In step 2 the chat page passes the request on to the relay, with the key it holds. The relay checks the key and picks the model by the route name in the request. In step 3 it calls Ollama (port 11434) for that route's model. Ollama loads the model if it is not already loaded and writes the answer. Step 4 has no arrow of its own: the answer returns the same way it came. In step 5 the relay sends a record of the request to Langfuse, which stores it.

The amber line along the bottom is the one weak point this diagram is about. A caller can skip the relay and call Ollama directly on port 11434. That call works, but nothing checks a key and nothing is recorded.

The dotted vertical line is the tailnet. Calls from limesalt cross it. A caller on the desktop itself (lemonpepper) reaches the same ports with no tailnet needed; that case is not drawn separately.

## Elements And Flow
- **Components:**
  - A tool or a browser (caller pill, blue). What: whatever sends the request, on limesalt or lemonpepper. Why: every request starts here. Who the caller is and why it sends the work is in DIA-106.
  - Tailnet (dotted blue line). What: the private network between the two machines (Tailscale). Why: it is how limesalt reaches the desktop by the name `lemonpepper`.
  - Open WebUI (container, green, chip `:3000`). What: the chat page in the browser. Why: the way in for a person with no tool set up. It talks only to the relay, never to Ollama directly.
  - LiteLLM, the relay (container, green, larger, chip `:4000`). What: checks the key and picks the model by route name. Why: one address and one key for every caller, and the one place that reports each request.
  - Ollama (native Windows program, green, chip `:11434`). What: the model runtime. It loads the model if needed and writes the answer. Why: it is the only thing that runs the local models.
  - Langfuse (container stack, green, chip `:3001`). What: stores the record of each request. Why: the relay has no database of its own, so this is the only usage history. The stack stands for seven containers.
  - Routes note (text, above Ollama). What: the relay's two routes and the model each one points at. Why: it shows what "picks the model by route name" means in practice.
- **Relationships:**
  - Blue arrow, badge 1, caller to Open WebUI: `chat in the browser`.
  - Blue arrow, badge 1, caller to LiteLLM: `a tool, with the key`. A call with no key is refused.
  - Blue arrow, badge 2, Open WebUI to LiteLLM: `with the key`. Open WebUI holds the relay key and sends it. This hop runs inside Docker.
  - Blue arrow, badge 3, LiteLLM to Ollama: `the route's model`.
  - Badge 4, text only, under LiteLLM: `the answer returns the same way`.
  - Blue arrow, badge 5, LiteLLM to Langfuse: `a record of the request`. If Langfuse is down the request still succeeds and only the record is lost. This hop runs inside Docker; the chip `:3001` is the port where a person opens the Langfuse dashboard.
  - Amber arrow, no badge, caller to Ollama: `straight to Ollama: no key, no record`.
  - The three lines that leave the caller cross the tailnet line, because a call from limesalt travels over the tailnet.
- **Notable labels or metrics:**
  - `ROUTES`: `local-fast` goes to `gpt-oss:20b`, `local-coder` goes to `qwen2.5-coder:14b`. Source: the list of changes made on 2026-11-18 when LM Studio was retired (the relay now has exactly these two routes, both to Ollama). The older `ollama-coder` route no longer exists.
  - Port chips `:3000`, `:4000`, `:11434`, `:3001`. Source: the verified component fact sheet of 2026-11-18 (`Get-NetTCPConnection`, `docker inspect`).
  - "checks the key": the fact sheet records that `/v1/models` with no key returned 401.
  - "no key, no record": the fact sheet records that Ollama on port 11434 asks for no key and that requests sent to it directly are not recorded in Langfuse.
  - "loads the model if needed": Ollama holds one of the two models at a time. Asking for the other swaps them, which takes about 6 to 30 seconds, and a loaded model stays for 30 minutes after its last use. These numbers are not on the picture; they come from the same list of changes.
  - Counts: 5 nodes, 7 lines (1 network line, 5 blue arrows, 1 amber arrow), 0 frames, 2 notes, 14 marks in total, 2 line meanings.
  - Grid: caller column x 24 to 184; tailnet at x 214; Open WebUI x 250 to 430; LiteLLM and Langfuse share one column, x 445 to 655; Ollama x 790 to 976. LiteLLM and Ollama share the center line y 245.

## How To Read It
1. Start at the caller on the left and pick one of the two arrows marked 1: the browser path through the chat page, or the tool path straight to the relay.
2. Follow the badges 2 and 3 to the right, reading the two lines inside the relay on the way: it checks the key, then picks the model by route name. The routes note says which model each name means.
3. Read step 4 as the return trip: the answer goes back along the path it arrived on.
4. Follow step 5 down from the relay to Langfuse. This is the record.
5. Finish on the amber line along the bottom. It reaches Ollama without passing the relay, so it gets no key check and leaves no record.

## Home Library Relevance
This is the mechanism picture of the set. DIA-106 says why work is sent to the desktop; this diagram says what the desktop does with one request. The five badges match the steps under "One request" in the area page, so the picture and the prose can be read side by side. It also shows why tools should be pointed at the relay on port 4000 and not at Ollama on port 11434: only the relay path is guarded by the key and shows up in Langfuse. The diagram leaves out Jellyfin (not part of a model request), the graphics card and which model fits (DIA-108), which networks can reach each port (DIA-112), and what happens when a piece is down (DIA-110).

## Suggested Caption
DIA-109 · One request: the relay checks the key, picks the model, Ollama answers, and a record goes to Langfuse.
