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
| [Architecture/](./Architecture/README.md) | `ARCH-###`: the landing page (ARCH-001) and one page per area of the system |
| [Stories/](./Stories/README.md) | `ST-###` units of work, `completed/`, and the single [ROADMAP](./Stories/ROADMAP.md) |
| [Documents/](./Documents/README.md) | Briefs (`BRIEF-###`), runbooks (`OPER-###`), technical debt (`TD-###`), video scripts (`VID-###`) |
| [Diagrams/](./Diagrams/README.md) | `DIA-1xx` diagrams for architecture pages |

Definitions for every type live outside this folder, in
[`_META/Definitions/`](../_META/Definitions/README.md).

Root files:

- [GETTING_STARTED.md](./GETTING_STARTED.md): onboarding and contribution flow.
- [PROJECT_STATUS.md](./PROJECT_STATUS.md): transient recent-changes snapshot. Not a planning surface.

Superseded and kept for history: `_definitions/` and `CONVENTIONS.md`.

## Prefixes

| Prefix | Folder | Definition |
| --- | --- | --- |
| `ST-###` | `Stories/`, then `Stories/completed/` | [Story](../_META/Definitions/Story.md) |
| `ARCH-###` | `Architecture/` | [Architecture](../_META/Definitions/Architecture.md) |
| `BRIEF-###` | `Documents/Briefs/` | [Document](../_META/Definitions/Document.md) |
| `OPER-###` | `Documents/Operations/` | [Document](../_META/Definitions/Document.md) |
| `TD-###` | `Documents/Technical-Debt/`, then `completed/` | [Document](../_META/Definitions/Document.md) |
| `VID-###` | `Documents/Videos/` | [Document](../_META/Definitions/Document.md) |
| `DIA-###` | `Diagrams/` (`DIA-1xx`), or beside a site page | [Diagram](../_META/Definitions/Diagram.md) |

## Quick start

- How the system fits together: [ARCH-001 Platform overview](./Architecture/ARCH-001-PlatformOverview.md).
- Delivery status: [ROADMAP](./Stories/ROADMAP.md).
- Runtime validation: [Operations index](./Documents/Operations/index.md).
- Writing a new doc: the matching definition in [`_META/Definitions/`](../_META/Definitions/README.md).

## Changelog

- 2026-10-14: Definitions moved to `_META/Definitions/`; `_definitions/` and `CONVENTIONS.md` superseded. Stories use `ST-###`, Architecture follows the Serennovas page set with ARCH-001 as the landing page, and filenames carry a short name.
- 2026-10-14: Consolidated the old project-docs folder under the site, `docs/context/` and `docs/briefs/` into `_KNOWLEDGE/`. Milestones and the roadmap moved to `Stories/`; operations, technical debt, videos and briefs moved under `Documents/`. Added `CONVENTIONS.md`, `Diagrams/`, `_definitions/document.md` and `_definitions/diagram.md`, adapted from Serennovas.
