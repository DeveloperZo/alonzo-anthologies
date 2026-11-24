# Home library diagrams

<!--
Purpose: Index of the home library diagram set and its numbering.
Status: working
Owner: zo
Human id: home-library-diagrams
Update trigger: when a diagram is added, renumbered or retired
Last updated: 2026-11-23
-->

Eight pictures, most general first. Read them in number order.

## Numbering

Numbers belong to this series, not to the whole repo.

- `DIA-100` is the most general picture.
- `DIA-101` to `DIA-199` are closer looks at parts of it, still in plain language.
- `DIA-200` starts a block about one part in more depth. A higher hundred may be more complex.
- Nothing goes deeper than the 200 block for now. Technical specs are not drawn.

## Rules for this set

- A box leads with a plain name that says what the piece does. The program name is small grey print.
- The 100 block must be readable by someone in the household who is not technical.
- No shape code that needs a legend. Color carries at most three meanings per picture.
- All seven come from `gen_diagrams.py`. Edit it and run `python gen_diagrams.py .` here. Do not edit an SVG by hand.

## The set

| ID | Question it answers |
| --- | --- |
| [DIA-100](./DIA-100-WhatItIsFor.svg) ([spec](./DIA-100-WhatItIsFor.md)) | What is this for? |
| [DIA-101](./DIA-101-ThePieces.svg) ([spec](./DIA-101-ThePieces.md)) | What is each piece, why do we have it, and how do you use it? |
| [DIA-102](./DIA-102-WhereItLives.svg) ([spec](./DIA-102-WhereItLives.md)) | Which computer holds what? |
| [DIA-103](./DIA-103-OneRequest.svg) ([spec](./DIA-103-OneRequest.md)) | What happens when someone asks the home AI something? |
| [DIA-104](./DIA-104-AfterARestart.svg) ([spec](./DIA-104-AfterARestart.md)) | How do you bring it back, and what stops when a piece is off? |
| [DIA-105](./DIA-105-WhoCanGetIn.svg) ([spec](./DIA-105-WhoCanGetIn.md)) | Which doors are open, to whom, and how is each locked? |
| [DIA-106](./DIA-106-HomeInFront.svg) ([spec](./DIA-106-HomeInFront.md)) | How does private material stay in the house, and how is paid AI reached? |
| [DIA-200](./DIA-200-HandingOverWork.svg) ([spec](./DIA-200-HandingOverWork.md)) | Which jobs go to the home AI, and how is the result kept honest? |

## Plain names

| On the pictures | Program | Technical term |
| --- | --- | --- |
| The Arbiter | Claude Code today. It may later be Zo's own model | frontier model, harness |
| The front door | LiteLLM | the relay |
| The home AI | Ollama, running the model `gpt-oss:20b` | model runtime, local model |
| The logbook | Langfuse | the request record |
| The chat page | Open WebUI | |
| The live board | `board/` in this series | |
| Movies and shows | Jellyfin | media server |
| The private connection | Tailscale | the tailnet |
| The service runner | Docker Desktop | containers |
| The key | one LiteLLM key per caller (the master keys stay on the desktop) | virtual key |
| The computer at home | the desktop `lemonpepper` | |
| The laptop | `limesalt` | |

## Changelog

- 2026-11-23: Updated for the hardened server. DIA-105: every door has a lock, the home AI is closed to other devices, the chat pages and movies have owners. DIA-100, DIA-101 and DIA-103: "the password" became each caller's own key. DIA-100 and DIA-101: n8n Cloud has no way in while it is not used (Funnel is off). The `.md` specs beside them were not rewritten and still describe the 2026-11-18 state.

- 2026-11-18: DIA-100 and DIA-101 redrawn for the home-in-front arrangement, with the private side, the paid switch and n8n Cloud. DIA-106 added for the rules. DIA-102, DIA-103 and DIA-200 still show the earlier arrangement.
- 2026-11-18: Set redone in plain language and renumbered from DIA-106 to DIA-112 in `_KNOWLEDGE/Diagrams/` to its own series numbers here. The old "files, secrets and state" picture was a technical spec and was retired; it is in git history.
