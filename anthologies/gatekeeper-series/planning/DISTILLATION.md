# Distillation of the original GatekeeperProtocol repository

<!--
Purpose: Record what the original repository contained, why it lost focus, and what is carried forward or dropped.
Status: draft
Owner: zo
Human id: gatekeeper-distillation
Update trigger: when a keep or drop call is reversed, or the source repository changes
Last updated: 2026-11-17
-->

Source: the private `GatekeeperProtocol` repository, branch `main` at
`5315a5d` (2026-04-18), 44 commits. Reviewed on 2026-11-17 by reading
its docs, its commit history and its file layout. The application was
not run.

## What the repository holds

Two unrelated things under one name, joined by a merge of unrelated
histories on 2026-04-18.

| Part | Period | Size | What it is |
| --- | --- | --- | --- |
| A Unity game | 2026-02-10 to 2026-02-20, and the final commit | About 800 tracked files under `Assets/` | A terminal hacking game with nodes, a timer economy and minigames. Milestones M-1 to M-5 |
| An agent tooling lab | 2026-04-03 to 2026-04-08 | About 400 files, 21,500 lines of TypeScript in the app | An npm monorepo (`agent-ecosystem-lab`): operator web UI and local API, contracts package, docs, scripts |

This series is about the second part only.

## What the tooling lab built in six days

- A local web UI with six tabs: HUD, Queue, Forge, Codex, Prototype,
  Verifier.
- An in-memory, event-sourced swarm coordinator: task claims with
  leases, controlled status transitions, per-task history, a reconcile
  endpoint.
- Goal and constraint intake with task recommendations.
- Headless CLI orchestration: one-shot agent turns, detached terminal
  spawns, a research queue, parallel and overnight runners.
- Declarative hook rules with socket fan-out and an optional webhook.
- A docs system: definitions, a glossary, a compiled wiki with an atlas
  and three axes, a decision log, a debt register, a priority surface.

## Why it lost focus

Each point is taken from the repository itself.

1. **The purpose was never written.** `gatekeeper/purpose.md` is at
   status draft with a clarity score of 1 out of 5, and the roadmap
   phases read "(fill)". The tool existed before the reason for it.
2. **It was built as a template for unnamed projects.** `main` was
   declared a hardened template with per-project branches, and on
   2026-04-08 the program was reset to a blank slate (commits "app
   reset" and "getting to default state"). After the reset there was no
   real work left for it to act on.
3. **Breadth outran use.** Six tabs, a swarm, hooks, webhooks, seats and
   a wiki arrived in 24 commits between 2026-04-03 and 2026-04-08. The
   decision log has 63 rows for the same six days. The lessons-learned
   file has none.
4. **Process about process.** Much of the documentation governs how to
   document: definitions of objects, pointers to objects, an audit of
   definitions and objects, rules about wiki material. The archive those
   docs point to (`program-default-archive`) is not in the repository,
   so many links are dead.
5. **The UI led the work.** One client file is over 2,000 lines, while
   the state behind it is in memory and lost on restart (its own debt
   item TD-001), and task recommendations are keyword heuristics
   (TD-004).
6. **The name covers two products.** A game and a tool share a
   repository, a name and a commit history.

## What is worth keeping

These are ideas, not code. Each was sound and survives the cut.

| Idea | Where it was | Why it stays |
| --- | --- | --- |
| Truth lives on disk as plain files; the UI only shows and acts on it | `deployment-product-model.md` | Portable, auditable, works with any agent tool |
| Definitions say how to make a thing; instances are the things | `docs/_meta/definitions/` and `docs/objects/` | Already the working pattern in this monorepo (`_META/Definitions/` and `_KNOWLEDGE/`) |
| The agent supplies evidence; the person validates | `evidence-validation` rule | This is the gate |
| Verifier is a separate, read-only stance from the workbench | `gatekeeper/verifier.md` | Keeps the checker from marking its own work |
| Builder stance: leverage for judgment, not autopilot | `deployment-product-model.md` | Sets what agents may finish alone |
| Decide and deliver: one best default, questions only for what the person alone can answer | `AGENTS.md` | Good brief-writing rule for the workbench |
| Priority surface: a short list of what needs the person, capped at about five | `gatekeeper/priority-surface.md` | Protects attention |
| Agent tool as configuration (`GP_CLI_TOOL`, `GP_CLI_ARGS`), prompt delivered by file | `scripting-runtime.md` | Lets the workbench swap vendors, including a local model |
| Strict task keys and controlled status transitions | swarm contracts | Traceability without a database |
| Compiled wiki that grows by ingest, query and lint | `llm-wiki-pattern.md` | A later option for the knowledge project, once there is enough material |

## What is dropped

| Dropped | Why |
| --- | --- |
| The Unity game | A different product. It stays in its own repository |
| The six-tab UI | Built before any tab had a decision to support. A screen returns only when a real need names it |
| The in-memory swarm coordinator, leases and reconcile endpoint | Solves many-agent contention that a single operator does not have yet. Revisit with the home library swarm work |
| Hooks, webhooks, seats, forge cards, companion "Tamagotchi" framing | Surface area with no user |
| Template `main` plus per-project branches | The tool serves this monorepo first |
| Objects pointers, the definitions and objects audit, the three-axis wiki shell | Process about process |
| Empty scaffold packages (`graph-model`, `identity`, `observability`, `policy-engine`) | One file each, never used |

## The finding that shapes the plan

This monorepo already runs a focused form of the knowledge idea:
`_META/Definitions/` holds the types, `_KNOWLEDGE/` holds the
instances, stories carry acceptance criteria, and the conventions name
four states (planned, built, verified, deployed). What it lacks is the
other two parts: a repeatable way to hand a story to an agent, and a
tool that checks a "verified" claim. The plan starts from that gap
rather than rebuilding what exists.

## Changelog

- 2026-11-17: First version.
