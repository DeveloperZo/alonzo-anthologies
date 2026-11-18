# Gatekeeper's Protocol series

<!--
Purpose: Entry point for the Gatekeeper's Protocol series: what it is for, its three projects, and where the planning lives.
Status: draft
Owner: zo
Human id: gatekeeper-series-readme
Update trigger: when the purpose statement is affirmed or changed, or a project in the series starts
Last updated: 2026-11-17
-->

Status: planning only. No code lives here yet. This series is a
distillation of the private `GatekeeperProtocol` repository (last
commit 2026-04-18), rewritten around one job instead of ported.

## Purpose (affirmed 2026-11-17)

Gatekeeper's Protocol is how one person keeps agent work honest: a
knowledge repository that says what is true and what words mean, a
workbench where work is handed to agents against that knowledge, and a
validation tool that checks the result against stated criteria before
anything is called done.

The gate is the point. Nothing passes from "an agent said so" to
"verified" without evidence a person can read.

## The three projects

| Project | One job | Answers |
| --- | --- | --- |
| `knowledge/` | Hold definitions, decisions and current state as plain files | What is true, and where is it written? |
| `workbench/` | Turn a story into a bounded brief, run it, capture the output | What was asked, of whom, and what came back? |
| `validation/` | Check claimed work against its acceptance criteria and record the result | Is it actually done, and how do we know? |

They are built in the order validation, knowledge, workbench. The
reason is in [planning/PLAN.md](planning/PLAN.md).

## Non-goals

- Not a dashboard. No screen exists unless a decision is made on it.
- Not a template for unnamed future projects. It serves this monorepo
  first, and anything general is extracted later from what worked.
- Not an autopilot. Agents execute bounded work. A person passes the
  gate.
- Not the game. The Unity project that shares the name stays in its own
  repository.

## Planning docs

| Doc | What it holds |
| --- | --- |
| [planning/DISTILLATION.md](planning/DISTILLATION.md) | What the original repository was, why it lost focus, what is kept and what is dropped |
| [planning/PLAN.md](planning/PLAN.md) | The focused version: each project's first slice, order, and exit criteria |
| [planning/SEEDS.md](planning/SEEDS.md) | Material from the other repositories worth porting as a planning seed |

## Changelog

- 2026-11-17: Purpose statement affirmed by the owner.
- 2026-11-17: Series created from a review of the GatekeeperProtocol repository and the other local projects.
