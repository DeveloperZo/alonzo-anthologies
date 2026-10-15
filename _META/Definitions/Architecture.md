# Architecture

<!--
Purpose: Definition of an Architecture page: a plain-language digest of one area of the system, with every component rated on one shared scale, plus the landing page that maps them all.
Status: working
Owner: zo
Human id: definition-architecture
Update trigger: when the page skeleton, the rating scale, or the landing page's job changes
Last updated: 2026-10-14
-->

## What an Architecture page is

A digest of one area of the system (source control, hosting, the site build,
the resume app) written so the owner, a collaborator or a new agent can see
what the parts are, which ones are risky to change, and what is broken today.
The code is authoritative; the page says so and cites it.

Use an Architecture page for how an area works and how to change it safely.
Use a [Story](./Story.md) for work to do, and a [Document](./Document.md)
(runbook) for the exact commands.

## The set

| Page | ID | Job |
| --- | --- | --- |
| Landing page | `ARCH-001-PlatformOverview` | The system in one paragraph, the whole-system diagram, the index of area pages, the flows that cross pages, the deployable components, and the Change Map (every Structural or Coordinated component across the set) |
| Area pages | `ARCH-002` onward | One area each, in the skeleton below |

The rating scale is defined once, here. The landing page carries the
cross-system list and must be updated whenever an area page's table gains,
loses or re-rates a Structural or Coordinated component.

## Where it lives

`_KNOWLEDGE/Architecture/ARCH-###-<Name>.md`. Its diagram lives in
`_KNOWLEDGE/Diagrams/` (see [Diagram](./Diagram.md)); architecture diagrams
use the `DIA-1xx` block.

## Frontmatter

The architecture comment block replaces Purpose and Status with the fields a
digest needs:

```markdown
<!--
Audience: owner, collaborators, new agents
Sources:
  - <every file, doc or system the page was checked against>
Human id: <name in kebab case>
Last synthesized: <YYYY-MM-DD, the last time every claim was re-checked against Sources>
-->
```

Under the comment, one quote line: `> Part of the [Architecture](./ARCH-001-PlatformOverview.md) set. Plain-language digest; the code is authoritative. Ratings use the scale in _META/Definitions/Architecture.md.`

## Area page skeleton

Every area page has these headings, in this order:

1. **In one paragraph.** What the area does, in plain words, and its current state (built, verified, deployed). Under about 150 words.
2. **Diagram.** The embedded `DIA-1xx` SVG, then one short paragraph on how to read it (direction, what the numbers or dashed lines mean).
3. **Components that matter here.** One table, columns in this order: Component, Kind, Why it matters, Change class, A change also touches, Evidence. Rate with the scale below. "Why it matters" starts with the bold rating, then one clause. Evidence is a file path, a command, or an API check.
4. **How it works, step by step.** Numbered steps, grouped under bold lead-ins where the area has more than one flow. Each step says who acts, on what, and what can go wrong.
5. **Changing this area.** Three subsections, `### Routine changes`, `### Coordinated changes`, `### Structural changes`, each a list of the changes someone is likely to make and what they must touch, in what order. Write "None today." rather than dropping a subsection.
6. **Known gaps.** Where reality differs from intent today, one bullet each, with the TD or Story that tracks it. Delete a bullet when it is fixed, and say so in the Changelog.
7. **Related pages.** The landing page, sibling area pages, and the runbooks and TD items this page leans on.
8. **Changelog.** Newest first. Say what was re-verified, not only what was edited.

## The rating scale

| Rating | Values | In plain words |
| --- | --- | --- |
| **Kind** | Entry point, Rule point, Data of record, Shared contract, Worker, Plumbing | A way in; a place a decision is made; the only copy of something; a shape two parts must agree on; a background process; build and deploy machinery |
| **Why it matters** | Critical, Important, Supporting | A mistake takes the site down, leaks a credential or loses the only copy of something (Critical); breaks a feature or blocks the owner (Important); is annoying but contained (Supporting) |
| **Change class** | Routine, Coordinated, Structural | One place, one push, and the build catches mistakes (Routine); two or more parts, or a repo change plus an outside setting, must land together in order (Coordinated); changes what every visitor sees or a shared contract, has no test net, or is hard to undo (Structural) |

A Structural change is not forbidden. It means: plan it as a Story, prove it
on a preview deploy, and expect it to take more than one sitting.

## Landing page skeleton

`ARCH-001-PlatformOverview` uses: The system in one paragraph; The whole
system on one page (DIA-101); The pages (table: Page, What it covers, Read it
when you want to know); Flows that cross pages; Deployable components (table:
Component, Runs where, Ships how); Change Map (the cross-system table:
Component, Kind, Why it matters, Change class, Where to read more; most
demanding first); Standing decisions (the few system-wide decisions that
every area page assumes, each with its date or source); Gaps that cut across
pages; Changelog.

## Template (area page)

```markdown
# ARCH-### <Area name>

<!--
Audience: owner, collaborators, new agents
Sources:
  - <path>
Human id: <name in kebab case>
Last synthesized: <YYYY-MM-DD>
-->

> Part of the [Architecture](./ARCH-001-PlatformOverview.md) set. Plain-language digest; the code is authoritative. Ratings use the scale in `_META/Definitions/Architecture.md`.

## In one paragraph

## Diagram

![DIA-1## <title>](../Diagrams/DIA-1##-<Name>.svg)

<How to read it.>

## Components that matter here

| Component | Kind | Why it matters | Change class | A change also touches | Evidence |
| --- | --- | --- | --- | --- | --- |

## How it works, step by step

## Changing this area

### Routine changes

### Coordinated changes

### Structural changes

## Known gaps

## Related pages

## Changelog

- <YYYY-MM-DD>: Created; facts verified against Sources.
```

## Changelog

- 2026-10-14: Replaced the rules-first shape (from the Serennovas `_definitions/architecture.md`) with the shape Serennovas actually uses for its architecture pages (`knowledge/wiki/Architecture/`, for example Identity-and-Billing): page skeleton, three-part rating scale, landing page with a Change Map. Adapted for this repo: SVG diagrams in `_KNOWLEDGE/Diagrams/` (DIA-1xx), ARCH IDs with names, and the Change Map folded into the landing page rather than a separate page, because the set has four areas.
- 2026-10-14: Created (rules-first shape).
