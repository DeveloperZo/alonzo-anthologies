# MediumArticle

<!--
Purpose: Definition of a MediumArticle: published writing on the site, split into eight section files with numbered sources, diagrams and a revision history.
Status: working
Owner: zo
Human id: definition-medium-article
Update trigger: when the section shape, citation form, versioning or editorial rules change
Last updated: 2026-11-10
-->

## What a MediumArticle is

Writing for readers, published on the site. A MediumArticle makes one
argument across eight sections, backs every factual claim with a numbered
source, and is revised in place as the facts move. It runs about 5,500
words of body, with 10 to 15 diagrams and about 50 sources.

Grounded in `site/content/ai-governance/part-1/` (Part 1: Can AI
Self-Govern?) as it stood at v1.2.

Use a MediumArticle when the argument needs several distinct moves, each
with its own evidence. Use a [SmallArticle](./SmallArticle.md) when one
claim can be made in a single sitting. Use a [Document](./Document.md) for
working material about the repo (a video script drawn from an article is a
Document), and a [Diagram](./Diagram.md) for each picture an article embeds.

## ID and naming

MediumArticles take no ID prefix. Quartz builds URLs from paths, so the folder is
the identity: `site/content/<series>/part-<N>/`, or
`site/content/<slug>/` for a standalone piece. Section files are
`NN-<slug>.md`, two-digit and in reading order, with the slug taken from the
section title (`03-whats-unsolved.md`).

Diagrams use the `DIA` space, with a hundreds block reserved per part when
the article belongs to a series (see [Diagram](./Diagram.md)).

## Where it lives

Under `site/content/`, because Quartz only serves `content/`. This is the
exception to the `_KNOWLEDGE/<Type folder>/` rule in the
[README](./README.md). Series-level context (canonical locations, design
system, series editorial rules) lives in `_KNOWLEDGE/Context/`.

## Files in a MediumArticle

| File | Published | What it holds |
| --- | --- | --- |
| `index.md` | yes | Dateline, hero question, framing paragraph, the sections transcluded in order, onward links |
| `01-<slug>.md` to `08-<slug>.md` | yes, through the index | One section each |
| `sources.md` | yes | Numbered references, grouped by section |
| `changelog.md` | yes | Version table |
| `diagrams/DIA-###-<name>.svg` and `.md` | the SVG | Artwork and its spec, per [Diagram](./Diagram.md) |
| `RATIONALE-YYYY-MM.md`, `UPDATE-PROPOSALS-YYYY-MM.md` | no (`draft: true`) | Working notes for a revision pass |

### Frontmatter

Published files carry Quartz YAML, not the HTML-comment block from the
README, because Quartz renders them. The revision history lives in
`changelog.md`, not in a `## Changelog` at the foot of each file.

```yaml
---
title: "Part 1: Can AI Self-Govern?"   # index: "Part N: <the hero question>"
tags: [ai, governance, systems-thinking]
draft: false
version: "1.2"                          # index only
---
```

Section titles use a Roman numeral: `"III: What's Unsolved at That Speed"`.

## The index

In this order:

1. **Dateline.** One italic line: kind, first-published month, latest revision, version linked to the changelog.
   `*An analysis · May 2026, revised November 2026 · [[changelog|v1.2]]*`
2. **Hero question.** The question the whole article answers, in `<div class="hero-question">`.
3. **Framing paragraph.** Three or four short sentences on the approach and what the reader will get. No findings.
4. **Sections.** One `![[NN-slug]]` transclusion per section, each on its own line.
5. **Onward links.** The next part (`Continue to [[../part-2/index|Part 2: ...]]`), then `[[changelog|Revision history →]]`, then a bold link to sources.

## Sections

### The arc

Part 1 runs from mechanism to diagnosis to stakes to action. A new
MediumArticle keeps the order of the moves, not the topics:

| # | Move | What the section does | Part 1 |
| --- | --- | --- | --- |
| 1 | Ground | Explain what the thing is, in plain terms, before judging it | What's Being Built |
| 2 | Driver | The force that makes it move, and why that force has no natural brake | Why It's Moving So Fast |
| 3 | Gap | What is unsolved at that speed | What's Unsolved at That Speed |
| 4 | Corrector | What was meant to check the driver, and why it does not | Who Was Supposed to Slow It |
| 5 | System | How 2 to 4 interact as one structure. The verdict lands at the end of this section | How These Interact as a System |
| 6 | Stakes now | Effects already measurable, with where the evidence thins | What's Actually at Stake |
| 7 | Stakes uncertain, and limits | The contested risk, then the constraints that bound what can be done | Safety Risk and Binding Constraints |
| 8 | Leverage | A teaser only: where a push moves something, handing off to the next part | Where You Have Leverage |

Section 8 stays short (about 250 words). Full detail belongs to the next
part.

### Inside a section

In this order:

1. **Position line.** `*Section N of 8*`
2. **Standfirst.** One or two italic sentences stating the section's claim. A reader who skims only standfirsts should get the argument.
3. **Opening paragraph.** Names the common picture and corrects it, or sets the scene in concrete terms. It does not open on a statistic.
4. **Body.** Three to six paragraphs, with one or two diagrams placed where the prose first needs them. Optional `###` subheads, only when a section carries two distinct topics (sections 6 and 7 in Part 1).
5. **Callouts.** Zero to three, after the body paragraphs they extend. See below.
6. **Bridge.** One italic line handing off: `*Section N+1 looks at ...*`. The last section has no bridge; it ends on a short landing line ("That's the map.") and the index carries the onward link.

Sections run about 500 to 1,000 words of body, excluding the final teaser.

### Callouts

Quartz callouts, always collapsed (`-`), so the main line reads straight
through. Each one is optional depth, never a step the argument needs.

| Callout | Use it for | Title form |
| --- | --- | --- |
| `> [!note]-` | A concept primer, a reader's likely question, or a case file | "Key concept: stocks and flows", "Don't labs test models before releasing them?", "The liability cases: what settled and what didn't" |
| `> [!key]-` | The structural point a section turns on | "Why this is a systems problem, not just a technical one" |
| `> [!warning]-` | A caveat about timing or applicability | "A note on timing" |

### Diagrams

Embed with an absolute path and nothing after it:
`![](/ai-governance/part-1/diagrams/DIA-003-capability-gap.svg)`. The
caption is inside the SVG. Every diagram has a spec beside it. When a figure
in the prose changes, every plate that prints it changes in the same pass;
the series context keeps a table of which plate carries which figure.

## Sources

Every factual claim carries a numbered citation. In the prose:

```html
<sup><a href="sources#part1-ref-8" id="part1-fnref-8">8</a></sup>
```

- The first citation of a source carries the `id`; repeat citations drop it.
- Two or more in a row join with `<sup>,</sup>`.
- The prefix (`part1-`) is per part, so anchors stay unique across a series.
- A source added in a revision takes a letter suffix after its neighbour (`6a`, `13e`) so existing numbers never shift. Renumbering is the author's call.
- Escape dollar signs in prose (`\$100M`) so Quartz does not read them as math.

In `sources.md`: a one-line note on how numbering works, links back to the
index and changelog, then `## Sources` with one `### Section N: <Title>`
heading per section. Each entry:

```markdown
8. <span id="part1-ref-8"></span>Author, "Title," *Publication*, date. URL. One or two sentences on what the source supports and any caveat.
```

## Voice

What Part 1 does on every page, and a new MediumArticle should do too:

- **Plain first.** Define each technical term in bold, in one plain sentence, the first time it appears (weights, alignment, RLHF). One concrete analogy where it carries the idea (the bathtub, the eighteen-wheeler with sedan brakes).
- **Correct the common picture.** Name what most people assume, then show why it is wrong ("Most people assume you can. ... It isn't.").
- **Guide the eye.** Short imperative turns to walk the reader into evidence: "Watch what...", "Consider what...", "Follow that logic through." Use them sparingly; each one should precede something worth watching.
- **Land short.** End a paragraph on a short sentence that states what the evidence means ("The measurement improves. The ground truth stays out of reach.").
- **Mark the strength of each claim.** Say when a figure is company-reported, when a pattern is predicted rather than measured, and when experts disagree, with the range ("Ord roughly 10%; Hinton 10 to 20%; LeCun effectively zero").
- **Ground stakes.** Every stake names its mechanism, its timeline, and who bears it. No ambient dread.
- **Structural, not moral.** Explain outcomes by the incentives and loops that produce them, not by the character of the people involved.

### Editorial rules (HARD)

- No false dichotomies, and no claims that the subject has properties other complex systems lack.
- The last section is a teaser. Full detail lives in the next part.
- Refer to sections as "Section N" or "section N", never "Part N" (parts are whole articles).
- The repo root `CLAUDE.md` rules apply: no section symbol, no em dashes, diagram captions inside the SVG.
- A series may add rules in its `_KNOWLEDGE/Context/` file; those apply too.

## Versioning and revision

- **Version.** `1.0` on first publication. A currency pass (facts brought up to date) or an editorial pass raises the minor version. Change it in three places together: the index YAML, the dateline, and `changelog.md`.
- **Changelog.** A table, newest first: `| Version | Date | What changed |`. One or two sentences per row, naming what a returning reader would notice.
- **Working notes.** A revision pass gets a `draft: true` file in the article folder: `UPDATE-PROPOSALS-YYYY-MM.md` before edits (each item marked SAFE or DECISION), `RATIONALE-YYYY-MM.md` after them (what changed, what was considered and not applied, conflicts resolved, open items). These are not deleted.
- **Re-open the source.** No figure goes into the prose until its source has been re-opened in that pass.

## Statuses

The `draft` field is the only status Quartz sees: `true` until the
article is published, `false` after. Revision state lives in the working
notes, not in the published files.

## Template

`index.md`:

```markdown
---
title: "Part N: <Hero question>"
tags: [<tags>]
draft: true
version: "1.0"
---

*An analysis · <Month YYYY> · [[changelog|v1.0]]*

<div class="hero-question">
<The question the article answers.>
</div>

<Framing paragraph: the approach, and what the reader will get.>

![[01-<slug>]]

<... one line per section, through 08 ...>

Continue to [[<next part>|<Next part title>]]

[[changelog|Revision history →]]

**[[sources|Sources and references]]** (numbered citations for all sections above)
```

Each section file:

```markdown
---
title: "<Roman numeral>: <Section title>"
tags: [<tags>]
draft: false
---

*Section N of 8*

*<Standfirst: the section's claim in one or two sentences.>*

<Opening paragraph.>

![](/<path>/diagrams/DIA-###-<name>.svg)

<Body paragraphs, with citations.>

> [!note]- <Title>
> <Optional depth.>

*Section N+1 looks at <what comes next>.*
```

`changelog.md`:

```markdown
---
title: "Part N: Changelog"
tags: [<tags>, meta]
draft: false
---

*Revision history for [[index|Part N: <Hero question>]]*

| Version | Date | What changed |
| --- | --- | --- |
| 1.0 | <Month YYYY> | First published. |
```

## Changelog

- 2026-11-10: Renamed from Article to MediumArticle, now that SmallArticle exists. Formats table removed; each size is its own definition.
- 2026-11-10: Created, with the medium format taken from Part 1 of the AI governance series as it stood at v1.2.
