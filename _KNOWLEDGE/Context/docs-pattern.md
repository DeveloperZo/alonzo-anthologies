# Doc taxonomy pattern (source reference)

The canonical pattern this repo's doc structure is modeled on lives at
`C:\Repos\Serennovas\MVP UI\docs`. That path is local to Zo's machine and
is a reference only, not a dependency.

## Shape

Prefix-based artifact taxonomy, one folder per type, plus:

- a `_definitions/` folder holding authoring contracts
- a README per folder
- a `completed/` subfolder for archived items
- a single `roadmap/ROADMAP.md` as the planning surface

## Prefixes (full set)

| Prefix | Folder |
| --- | --- |
| ARCH | `architecture/` |
| DOCS | `documents/` |
| M / RM | `milestones/` |
| OPER | `operations/` |
| TD | `technical-debt/` |
| MR | `market-research/` |
| INV | `invoices/` |

## Frontmatter

The source pattern uses an HTML-comment block: Purpose, Status, Owner,
Human id, Update trigger, Last updated. Not YAML.

When porting to Quartz, use the hybrid: YAML on top for Quartz, the
HTML-comment block underneath for human context.

## How to apply

When setting up doc structure, a planning surface, or a Quartz-style docs site
for a new project, start from this pattern and confirm which categories
apply. This repo uses the core set only: ARCH, M / RM, OPER, TD, ROADMAP.

## The newer source: Serennovas `knowledge/`

The pattern has since moved to `C:\Repos\Serennovas\serennovas-monorepo\knowledge`
(the `MVP UI/docs` copy above is now a backup). On 2026-10-14 this repo
consolidated its docs into `_KNOWLEDGE/` and took from that tree:

- `CONVENTIONS.md`, as `_KNOWLEDGE/CONVENTIONS.md`
- `_definitions/document.md` (universal frontmatter)
- the `diagrams/` folder and the DIA spec-sibling idea, as `_KNOWLEDGE/Diagrams/` and `_definitions/diagram.md`

Deliberately not taken: the TOML diagram renderer (it exists to make PNGs
for the Azure DevOps wiki; SVG renders natively here), `AGENTS.md`,
`COMPONENTS.md`, `SKILLS.md`, concern tokens in IDs, `_cross-cutting/`,
code audits, the wiki digest and board sync. Revisit when the repo grows
into them.

Folder mapping here: milestones and the roadmap live in `Stories/`;
operations, technical debt, videos and briefs live under `Documents/`.
