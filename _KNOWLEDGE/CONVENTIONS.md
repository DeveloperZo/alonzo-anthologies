# Documentation Conventions

<!--
Purpose: Authoring rules that apply to every doc under _KNOWLEDGE/, and the record of rules that were adopted or retired.
Status: canonical
Owner: zo
Human id: docs-conventions
Update trigger: when a rule is adopted or retired that should apply across stories, architecture, documents and diagrams
Last updated: 2026-10-14
-->

These rules apply to every artifact class: stories (`M-###`, `RM-###`),
architecture (`ARCH-###`), runbooks (`OPER-###`), technical debt (`TD-###`),
briefs (`BRIEF-`), video scripts (`VID-###`) and diagrams (`DIA-###`). Each
class's own contract lives in [_definitions/](./_definitions/README.md).

Hard formatting rules (no section symbol, no em dashes, diagram captions inside
the SVG) live in the repo root `CLAUDE.md` and apply here too.

## Frontmatter

Every canonical doc carries the HTML-comment block directly under the H1. The
fields and their allowed values are in
[_definitions/document.md](./_definitions/document.md).

`_KNOWLEDGE/` is not rendered by Quartz, so a YAML block is not required. Docs
moved here from the old project-docs folder under the site still carry one; leave it until the doc
is next edited for another reason, then drop it.

## Say what is true, at the level it is true

Keep four states distinct and name the one a claim is in:

- **Planned**: written down, not built.
- **Built**: the code or content exists.
- **Verified**: checked, and the doc says how (build output, a page loaded, a test).
- **Deployed**: live at the public URL.

"Built and verified locally; not yet deployed" is the kind of sentence that
earns its place. A doc that blurs these is wrong even when every fact in it is
true.

## Numbering

- Pick the next free number for the prefix by scanning the folder and its
  `completed/` subfolder. Never reuse a retired number.
- IDs are flat (`M-004`, `ARCH-002`) for now. If a second app starts producing
  its own artifacts at volume, adopt Serennovas-style concern tokens
  (`M-GDN-###`, `M-RES-###`) for new IDs only, and record the decision here.

## Superseded docs

Do not delete a superseded doc, and do not retrofit new conventions onto it.
Add a status banner under the frontmatter pointing at the successor, set
`Status: superseded`, and link back from the successor.

## Changelog sections

Every canonical doc ends with a `## Changelog` section, newest first, one line
per meaningful change: `- YYYY-MM-DD: what changed and why`.

## Where things go

| If it is... | It goes in |
| --- | --- |
| Context an agent needs on any machine | `Context/` |
| A unit of build work with exit criteria | `Stories/` |
| A decision about system shape | `Architecture/` |
| A runbook, debt item, brief or script | `Documents/` |
| A diagram that supports a knowledge doc | `Diagrams/` |
| Writing meant for the public | `site/content/`, not here |

## Changelog

- 2026-10-14: Created, adapted from Serennovas `knowledge/CONVENTIONS.md`. Took the universal frontmatter, the planned / built / verified / deployed distinction, the superseded-doc rule and the changelog rule. Did not take the Authority banner or Backend dependency status (Serennovas retired both on 2026-09-07, and this repo has one owner).
