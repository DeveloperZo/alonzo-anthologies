# Diagram

<!--
Purpose: Authoring contract for DIA-### diagrams: naming, where they live, the spec sibling, and where the caption goes.
Status: canonical
Owner: zo
Human id: definition-diagram
Update trigger: when diagram naming, placement, the spec shape, or the caption rule changes
Last updated: 2026-10-14
-->

Visual style (palette, typography, nodes, arrows, legends, SVG boilerplate) is
not repeated here. It lives in the diagramming skill at
`customizations/skills/diagramming/SKILL.md`. This file covers how a diagram
is filed.

## File naming

`DIA-###-descriptor.svg`, with a lowercase kebab-case descriptor.

- A letter suffix marks sibling diagrams that answer one question together:
  `DIA-004A-oversight-scale`, `DIA-004B-dissent-paradox`.
- A series may reserve a hundreds block per part: the AI governance series uses
  `DIA-0xx` for part 1 and `DIA-2xx` for part 2.
- Never reuse a retired number.

## Where it lives

| The diagram supports... | It lives in |
| --- | --- |
| A published site page | A `diagrams/` folder beside that page under `site/content/`, so Quartz can serve it |
| A knowledge doc (ARCH, M, OPER, TD) | `_KNOWLEDGE/Diagrams/` |

The DIA number space is shared across both locations. Check both before
picking a number.

## The SVG is the artifact

Diagrams are hand-authored SVG. Quartz and GitLab render SVG directly,
so there is no PNG step. (Serennovas renders PNGs from TOML specs because the
Azure DevOps wiki cannot display SVG. That constraint does not apply here.)

Every SVG carries:

- a `<title>` that starts with the DIA code: `DIA-001 · Training pipeline ...`
- a `<desc>` that says in prose what the diagram shows, for screen readers
- the DIA code and caption rendered as visible text at the bottom of the
  artwork

The markdown that embeds the diagram adds no caption line of its own. See the
diagram conventions in the repo root `CLAUDE.md`.

## The spec sibling

Each diagram has a markdown sibling with the same basename
(`DIA-001-training-pipeline.md`). It is the reading guide, not a render
source. Sections:

```markdown
# DIA-###: <Title>
## Snapshot
- **Diagram file:** `<repo-relative path to the .svg>`
- **Theme:** <topic>
- **Primary audience takeaway:** <one sentence>

## What The Diagram Shows
<prose walk-through>

## Elements And Flow
- **Components:** ...
- **Relationships:** ...
- **Notable labels or metrics:** ...

## How To Read It
1. <numbered reading order>

## Relevance
<why this picture matters to the doc that embeds it>

## Suggested Caption
<the caption text rendered inside the SVG>
```

## Changelog

- 2026-10-14: Created. Placement and the spec-sibling idea come from Serennovas (`knowledge/diagrams/`, `images/DIA-0X-name.md`); the section layout comes from the existing AI governance specs in this repo. The Serennovas TOML renderer was deliberately not ported.
