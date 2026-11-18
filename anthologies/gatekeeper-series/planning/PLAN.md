# Plan for the focused version

<!--
Purpose: Define the three projects of the Gatekeeper's Protocol series, their first slices, build order and exit criteria.
Status: draft
Owner: zo
Human id: gatekeeper-plan
Update trigger: when a slice is started, finished or re-scoped, or an open decision is settled
Last updated: 2026-11-17
-->

Everything here is planned. Nothing is built.

## Rules for the whole series

1. **One real workspace.** The series acts on this monorepo. A feature
   that this monorepo does not need today is not built.
2. **Files first.** Every project works from the command line on plain
   files. A UI is a later slice, and only for a decision a person makes
   often.
3. **One slice at a time.** A slice has a written exit criterion and is
   used on real work before the next one starts.
4. **The checker never does the work.** Validation only reads and
   reports. The workbench only runs. Neither edits the knowledge it is
   judged against.

## Build order: validation, knowledge, workbench

Validation comes first because it is the gate, it is the smallest, and
it is useful on day one against work already in this repository. It
also defines what a brief must contain, which the workbench needs.
Knowledge is second because most of it exists and needs tightening, not
building. The workbench is last because handing work to agents is only
safe once a result can be checked.

## Project 1: `validation/`

**Job:** given a story, report for each acceptance criterion whether it
is met, with the evidence, and write that result down.

| Slice | What it does | Exit criterion |
| --- | --- | --- |
| V1 | Read one story file, list its acceptance criteria, and run any criterion that carries a command. Print pass, fail or "needs a person" per criterion, with the command output | Run against an existing story in `_KNOWLEDGE/Stories/` that has a command check, and the result matches a hand check |
| V2 | Write the result to an append-only verification log beside the story: date, commit, criterion, result, evidence | Two runs on different commits produce two entries, and neither run changes the story |
| V3 | Refuse a status of verified when the log has no passing entry for the current commit | A story marked verified with no log entry is reported as a failure |

Carried from the original: the Verifier stance and the evidence rule.
Seeded from elsewhere: the milestone verification workflow (see
[SEEDS.md](SEEDS.md)).

## Project 2: `knowledge/`

**Job:** keep definitions, decisions and current state findable and
consistent, for people and agents.

Most of this is `_META/Definitions/` and `_KNOWLEDGE/` as they stand.
The project is the set of checks and habits around them, not a second
copy.

| Slice | What it does | Exit criterion |
| --- | --- | --- |
| K1 | A lint over `_KNOWLEDGE/`: every doc has its header block, relative links resolve, ids are unique, hard formatting rules hold | Run clean, or every finding is a real defect that gets fixed |
| K2 | One decision log for the monorepo, with a cap: a decision is logged only when it would surprise a future reader | The log exists and the next three real decisions land in it |
| K3 | A context bundle: for a given story, list the files an agent must read (definitions, architecture, context pages) | The bundle for one story is enough for a fresh agent session to start without questions about where things are |

Carried from the original: definitions versus instances, the decision
log, and the document header block. Deferred: the compiled wiki, until
K1 to K3 are in use and there is material worth synthesising.

## Project 3: `workbench/`

**Job:** turn a story into a bounded brief, run it with a chosen agent
tool, and capture what came back, so validation can check it.

| Slice | What it does | Exit criterion |
| --- | --- | --- |
| W1 | Build a brief from a story plus its K3 bundle: task, files in scope, standing rules, the acceptance criteria. Dry run prints it | A person reads the brief for one story and would hand it over unchanged |
| W2 | Run the brief with one agent tool on a side branch, never on `main`, and save the output and the vendor used | One real story is completed this way and passes V1 |
| W3 | Agent tool as configuration, so the same brief runs on a paid vendor or on a local model served by the home library | The same story brief runs on two different tools without editing the workbench |
| W4 | Several briefs in parallel, each on its own branch | Deferred until W1 to W3 are in regular use. This is where swarms start |

Carried from the original: tool as configuration, prompt by file, the
decide-and-deliver rule, the cap on what reaches the person. Seeded
from elsewhere: the vendor-neutral agent runner (see
[SEEDS.md](SEEDS.md)).

## How the series connects to the home library

The workbench needs a model endpoint. Today that is a paid vendor
command line tool. Once the home library server exists
(`anthologies/home-library-series/`), slice W3 points the workbench at
it, and slice W4 is the agent swarm that runs on it. Neither series
blocks the other before W3.

## Open decisions (only the owner can settle these)

1. Settled 2026-11-17: the purpose statement in the series README is affirmed.
2. Language for the tools. Default if not decided: Node scripts with no
   build step, matching the rest of this monorepo.
3. Whether the series keeps the Gatekeeper UI as a later goal, or stays
   command line for good.
4. Whether this public repository is the right home for the tooling, or
   only for its plans.

## Changelog

- 2026-11-17: Purpose statement affirmed; open decision 1 settled.
- 2026-11-17: First version.
