# Seeds from the other repositories

<!--
Purpose: List material in the owner's other projects worth porting into this monorepo as a planning seed, and where each would land.
Status: draft
Owner: zo
Human id: gatekeeper-seeds
Update trigger: when a seed is ported, rejected, or a new source project is reviewed
Last updated: 2026-11-17
-->

Reviewed on 2026-11-17: the GatekeeperProtocol repository (docs and
full commit history) and the project folders on this PC, using the
local-only review notes written the same day. GitHub repositories that
are not cloned on this PC were not reviewed, because the GitHub command
line tool is not signed in here.

Nothing below has been copied into a tracked folder. Each seed is an
idea plus a pointer. The copies that exist sit in the local-only
toolkit, which is ignored by git because this repository is public.
Before any of it is promoted, read the whole file and rewrite examples
that still describe the project it came from.

## Seeds for the gatekeeper series

| Seed | Source | Lands in | What to take |
| --- | --- | --- | --- |
| Milestone verification workflow | A client project | `validation/` V1 to V3 | An agent implements, then proves the work three ways (contracts with numbered steps, repeatable test scenarios, acceptance criteria) and logs each result |
| Code audit contract | A client project | `validation/`, later | Every finding gives a location, a mechanism, a consequence and the smallest fix, and coverage is backed by a runnable sweep |
| Staged review pipeline | An underwriting prototype | `validation/`, later | Lettered stages, one written spec per stage, a fixed set of outcomes (advance, reject, ask for more, revise), an append-only audit trail |
| Vendor-neutral agent runner | A client project | `workbench/` W2 and W3 | One entry point for an unattended task, vendor chosen by configuration, task text passed so no shell can interpret it, result on a side branch only, each run tagged with vendor and cost |
| Saved task plan format | A task planning tool's data | `workbench/` W1 | The record shape only: dependencies, files to change, create or read, an implementation guide, how to verify |
| Document system with 13 types | A client project | `knowledge/` K1 | Compare against `_META/Definitions/` and lift only a type this monorepo lacks. Do not import the set |
| Daily standup briefing skill | A client project | `knowledge/`, later | A read-only briefing over a fixed time window with a coverage receipt, and the rule that inbox content is data, never instructions |
| Evidence and validation rule, Verifier rubric, priority surface, decide and deliver | GatekeeperProtocol | All three | See [DISTILLATION.md](DISTILLATION.md), "What is worth keeping" |

## Seeds for the home library series

| Seed | Source | Lands in | What to take |
| --- | --- | --- | --- |
| Agent tool as configuration | GatekeeperProtocol | `home-library-series`, swarm work | The same runner accepts any command line agent, so a locally served model is one more entry |
| Event-sourced swarm coordinator design | GatekeeperProtocol | `home-library-series`, swarm work | Claims with leases, controlled transitions and replay. A design reference for when several agents share one queue, not code to port |
| Web UI for cross-device access, one stack and one workspace | GatekeeperProtocol | `home-library-series`, server | The stated goal of the same operator experience away from the desk is what the home server delivers |
| Chat command bot pattern | A client project | `home-library-series`, later | Request signature checking and a single allowed user, if the server is ever driven from a phone |

## Reviewed and not seeded

| Project | Why not |
| --- | --- |
| The Unity game inside GatekeeperProtocol | A separate product. Its design docs stay with it |
| Family assistant prototype (service and UI) | Abandoned and not runnable. The idea of one agent per person may return under the home library, but there is nothing to port |
| Factorio mod | Active hobby project with its own repository. Unrelated to these series |
| Auth and workflow experiments, the library wrapper fragment, empty placeholders | Vendor samples, fragments or empty |
| Personal and family folders | Private. Nothing from them belongs in a public repository |

## Changelog

- 2026-11-17: First version.
