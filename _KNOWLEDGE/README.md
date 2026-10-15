# Knowledge

<!--
Purpose: Top-level index of _KNOWLEDGE/: what lives where, and which surface to open for each question.
Status: canonical
Owner: zo
Human id: knowledge-readme
Update trigger: when _KNOWLEDGE/ gains, loses, or renames a folder or an artifact class
Last updated: 2026-10-14
-->

`_KNOWLEDGE/` is the canonical documentation surface for the monorepo:
planning, architecture, operations, briefs, diagrams, and the durable
context an agent needs on any machine. Quartz does not render it. Public
writing lives in `site/content/`.

The shape is adapted from the Serennovas `knowledge/` tree. See
[Context/docs-pattern.md](./Context/docs-pattern.md) for what was taken and
what was left behind.

## Structure

| Folder | What lives there |
| --- | --- |
| [Context/](./Context/README.md) | Durable project context for agents and collaborators. Read first |
| [Stories/](./Stories/README.md) | `M-###` and `RM-###` milestones, `completed/`, and the single [ROADMAP](./Stories/ROADMAP.md) |
| [Architecture/](./Architecture/README.md) | `ARCH-###` system shape and decisions |
| [Documents/](./Documents/README.md) | Briefs (`BRIEF-`), runbooks (`OPER-###`), technical debt (`TD-###`), video scripts (`VID-###`) |
| [Diagrams/](./Diagrams/README.md) | `DIA-` diagrams that support knowledge docs |
| [_definitions/](./_definitions/README.md) | Authoring contract for every artifact class |

Root files:

- [CONVENTIONS.md](./CONVENTIONS.md): rules that apply to every doc in this tree.
- [GETTING_STARTED.md](./GETTING_STARTED.md): onboarding and contribution flow.
- [PROJECT_STATUS.md](./PROJECT_STATUS.md): transient recent-changes snapshot. Not a planning surface.

## Prefixes

| Prefix | Folder | Purpose |
| --- | --- | --- |
| `ARCH-###` | `Architecture/` | System shape, decisions, tradeoffs |
| `M-###` | `Stories/`, then `Stories/completed/` | Active build work |
| `RM-###` | `Stories/` (never moves) | Retroactive milestones |
| `OPER-###` | `Documents/Operations/` | Runbooks |
| `TD-###` | `Documents/Technical-Debt/`, then `completed/` | Debt items |
| `BRIEF-` | `Documents/Briefs/` | Work authored in Cowork for execution in Claude Code |
| `VID-###` | `Documents/Videos/` | Video scripts |
| `DIA-###` | `Diagrams/`, or beside the page that embeds it | Diagrams |

## Quick start

- Delivery status: [ROADMAP](./Stories/ROADMAP.md).
- Current work: [Stories](./Stories/README.md).
- Runtime validation: [Operations index](./Documents/Operations/index.md).
- Writing a new doc: [CONVENTIONS](./CONVENTIONS.md), then the matching file in [_definitions/](./_definitions/README.md).

## Changelog

- 2026-10-14: Consolidated the old project-docs folder under the site, `docs/context/` and `docs/briefs/` into `_KNOWLEDGE/`. Milestones and the roadmap moved to `Stories/`; operations, technical debt, videos and briefs moved under `Documents/`. Added `CONVENTIONS.md`, `Diagrams/`, `_definitions/document.md` and `_definitions/diagram.md`, adapted from Serennovas.
