# Diagram

<!--
Purpose: Definition of a Diagram: an SVG plus a markdown spec that explains how to read it.
Status: working
Owner: zo
Human id: definition-diagram
Update trigger: when diagram naming, placement, the spec shape or the caption rule changes
Last updated: 2026-10-14
-->

## What a Diagram is

A picture that shows a mechanism prose would take a page to describe. Each
Diagram is two files with the same basename: the `.svg` artwork and a `.md`
spec that explains how to read it.

Visual style (palette, typography, nodes, arrows, legends, SVG boilerplate)
lives in the diagramming skill at `customizations/skills/diagramming/SKILL.md`,
not here.

## Where it lives

| The Diagram supports... | It lives in |
| --- | --- |
| A Story, Architecture doc or Document | `_KNOWLEDGE/Diagrams/` |
| A published site page | A `diagrams/` folder beside that page under `site/content/`, because Quartz only serves `content/` |

The `DIA` number space is shared across both places. Check both before
picking a number.

## Naming

`DIA-###-<Name>.svg` and `.md` (Name rules in the README).

- A letter suffix marks siblings that answer one question together: `DIA-004A`, `DIA-004B`.
- A series may reserve a hundreds block per part: the AI governance series uses `DIA-0xx` for part 1 and `DIA-2xx` for part 2.

## The SVG

The SVG is the artifact. Quartz and GitLab render it directly, so
there is no PNG step. Every SVG carries:

- a `<title>` that starts with the ID: `DIA-001 · Training pipeline ...`
- a `<desc>` that says in prose what it shows, for screen readers
- the ID and caption as visible text at the bottom of the artwork

The markdown that embeds a Diagram adds no caption line of its own.

## The spec

```markdown
# DIA-###: <Title>

<!--
Purpose: Reading guide for DIA-###.
Status: working
Owner: zo
Human id: <slug>
Update trigger: when the SVG changes
Last updated: <YYYY-MM-DD>
-->

## Snapshot
- **Diagram file:** `<repo-relative path to the .svg>`
- **Embedded in:** <page or doc>
- **Takeaway:** <one sentence>

## What The Diagram Shows
<prose walk-through>

## Elements And Flow
- **Components:** ...
- **Relationships:** ...
- **Notable labels or metrics:** ...

## How To Read It
1. <reading order>

## Caption
<the caption text rendered inside the SVG>

## Changelog
- <YYYY-MM-DD>: Created.
```

## Statuses

`draft`, `working`, `superseded`.

## Changelog

- 2026-10-14: Created. Placement and the spec sibling come from Serennovas (`knowledge/diagrams/`, `images/DIA-0X-name.md`); the spec sections come from the existing AI governance specs. The Serennovas TOML-to-PNG renderer was deliberately not ported.
