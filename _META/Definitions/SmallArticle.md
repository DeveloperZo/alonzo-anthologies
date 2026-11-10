# SmallArticle

<!--
Purpose: Definition of a SmallArticle: one published page that makes one claim in a single sitting, with its sources and revision history on the same page.
Status: draft
Owner: zo
Human id: definition-small-article
Update trigger: when the first SmallArticle is published (check this definition against it), or the shape, citation form or editorial rules change
Last updated: 2026-11-10
-->

## What a SmallArticle is

A piece a reader finishes in one sitting, about five to eight minutes. It
makes one claim, walks one line of evidence to it, and ends on what the
reader can now see or do. It runs about 1,200 to 1,800 words of body, on one
page, with zero to two diagrams and about 8 to 20 sources.

This definition is designed, not grounded. No SmallArticle exists yet. It is
the [MediumArticle](./MediumArticle.md) shape (taken from AI governance
Part 1) cut down to one page. Check it against the first real instance and
correct it where they disagree, as the other definitions were corrected
against theirs.

### SmallArticle or MediumArticle

| Signal | SmallArticle | MediumArticle |
| --- | --- | --- |
| Claim | One | One argument built from several claims |
| Moves | Four, on one page | Eight, one file each |
| Body | About 1,200 to 1,800 words | About 5,500 words |
| Diagrams | Zero to two | 10 to 15 |
| Sources | About 8 to 20, on the same page | About 50, on their own page |

If a SmallArticle draft passes about 2,000 words, or a move needs its own
subheads, it wants to be a MediumArticle. If one section of a MediumArticle
holds up without the others, it can be lifted out as a SmallArticle that
links back to the full piece.

Use a [Document](./Document.md) for working material about the repo, and a
[Diagram](./Diagram.md) for each picture a SmallArticle embeds.

## ID and naming

No ID prefix. Quartz builds URLs from paths, so the folder is the identity:
`site/content/<slug>/`, or `site/content/<series>/<slug>/` when it belongs
to a series. The slug comes from the title in kebab case, a few words
(`why-labs-cant-pause/`).

Diagrams use the `DIA` space. A series SmallArticle uses its series' block;
a standalone one takes the next free number after checking every `DIA` in
the repo (see [Diagram](./Diagram.md)).

## Where it lives

Under `site/content/`, because Quartz only serves `content/`. This is the
exception to the `_KNOWLEDGE/<Type folder>/` rule in the
[README](./README.md), the same as MediumArticle.

## Files

| File | Published | What it holds |
| --- | --- | --- |
| `index.md` | yes | The whole article: dateline, hero question, the four moves, sources, revision history |
| `diagrams/DIA-###-<name>.svg` and `.md` | the SVG | Artwork and its spec, per [Diagram](./Diagram.md). Omit the folder when there are no diagrams |
| `RATIONALE-YYYY-MM.md` | no (`draft: true`) | Working notes for a revision pass, only when a pass changes more than a figure or two |

A folder for one page keeps the diagrams and any working notes beside the
text, and gives a clean URL.

### Frontmatter

Quartz YAML, not the HTML-comment block from the README, because Quartz
renders it:

```yaml
---
title: "<Title>"
tags: [<tags>]
draft: false
version: "1.0"
---
```

The title is the claim or the question, in a few words. No Roman numerals;
there are no sections to number.

## The page

In this order:

1. **Dateline.** One italic line: kind, first-published month, latest revision, version, and reading time.
   `*An analysis · November 2026 · v1.0 · 6 min read*`
2. **Hero question.** The question the article answers, in `<div class="hero-question">`.
3. **Standfirst.** One or two italic sentences that state the answer. A reader who stops here has the claim.
4. **The four moves,** each under a `##` heading (below).
5. **Onward link.** One line, when there is somewhere to go: the MediumArticle it draws from, or the next piece in a series.
6. **`## Sources`.**
7. **`## Revision history`.**

### The four moves

The MediumArticle arc, folded from eight moves to four. Keep the order of
the moves, not any particular topics.

| # | Move | What it does | Folds in (MediumArticle) | Length |
| --- | --- | --- | --- | --- |
| 1 | Ground | What the thing is, in plain terms, before judging it. Opens on the common picture and corrects it | Ground | About 250 words |
| 2 | Pressure | The force driving it, and the check that was meant to hold it and does not | Driver, Gap, Corrector | About 500 words |
| 3 | Structure | Why the outcome follows from how the parts fit, not from anyone's character. The verdict lands at the end of this move | System | About 400 words |
| 4 | Stakes and leverage | What is at stake (mechanism, timeline, who bears it), then where a push moves something | Stakes, Constraints, Leverage | About 400 words |

Each heading names what the move shows, not the move: "Why the pause went
away", not "Pressure".

Each move ends on a short landing line. The last move ends on the line the
reader should leave with. There are no bridge lines between moves; the
headings carry the hand-off.

### Callouts

At most two, collapsed (`-`), after the paragraph they extend. Same types as
MediumArticle: `[!note]-` for a primer or a reader's likely question,
`[!key]-` for the structural point, `[!warning]-` for a timing caveat. If a
callout grows past about 150 words, it is a sign the piece wants to be a
MediumArticle.

### Diagrams

Zero to two. A SmallArticle with one diagram puts it in the Structure move,
where the mechanism is. Embed with an absolute path and nothing after it:
`![](/<slug>/diagrams/DIA-###-<name>.svg)`. The caption is inside the SVG.

## Sources

Every factual claim carries a numbered citation, in the same markup as
MediumArticle, with the slug as the anchor prefix:

```html
<sup><a href="#<slug>-ref-3" id="<slug>-fnref-3">3</a></sup>
```

- The `href` is a same-page anchor (`#...`), since sources sit on the page.
- First citation carries the `id`; repeats drop it. Adjacent citations join with `<sup>,</sup>`.
- A source added in a revision takes a letter suffix (`3a`) so numbers never shift.
- Escape dollar signs in prose (`\$100M`).

Under `## Sources`, one flat numbered list (no per-section groups):

```markdown
3. <span id="<slug>-ref-3"></span>Author, "Title," *Publication*, date. URL. One sentence on what it supports.
```

## Voice

The [MediumArticle voice](./MediumArticle.md#voice) applies whole: plain
first, correct the common picture, guide the eye, land short, mark the
strength of each claim, ground stakes, structural not moral. Two
differences from the longer form:

- **One analogy, at most.** There is room for one image to carry the idea, not one per move.
- **Fewer turns.** One or two "Watch what..." style turns in the whole piece. In a short piece they show quickly.

### Editorial rules (HARD)

- One claim. Anything that needs a second thesis goes in a second piece.
- No false dichotomies, and no claims that the subject has properties other complex systems lack.
- The repo root `CLAUDE.md` rules apply: no section symbol, no em dashes, diagram captions inside the SVG.
- A series may add rules in its `_KNOWLEDGE/Context/` file; those apply too.

## Versioning and revision

- **Version.** `1.0` on first publication. A currency or editorial pass raises the minor version. Change it in the YAML, the dateline and the revision history together.
- **Revision history.** The last heading on the page: a table, newest first, `| Version | Date | What changed |`.
- **Working notes.** A pass that changes more than a figure or two gets a `RATIONALE-YYYY-MM.md` (`draft: true`) in the folder. Smaller passes are recorded by the revision history row alone.
- **Re-open the source.** No figure goes into the prose until its source has been re-opened in that pass.

## Statuses

The `draft` field: `true` until published, `false` after.

## Template

```markdown
---
title: "<Title>"
tags: [<tags>]
draft: true
version: "1.0"
---

*An analysis · <Month YYYY> · v1.0 · <N> min read*

<div class="hero-question">
<The question the article answers.>
</div>

*<Standfirst: the answer, in one or two sentences.>*

## <What the thing is>

<Ground: the common picture, then the correction.>

## <What drives it, and what fails to check it>

<Pressure, with citations.>

## <Why it follows from the structure>

![](/<slug>/diagrams/DIA-###-<name>.svg)

<Structure. End on the verdict.>

## <What is at stake, and where to push>

<Stakes and leverage. End on the line the reader leaves with.>

<Onward link, if any.>

## Sources

1. <span id="<slug>-ref-1"></span><Author>, "<Title>," *<Publication>*, <date>. <URL>. <What it supports.>

## Revision history

| Version | Date | What changed |
| --- | --- | --- |
| 1.0 | <Month YYYY> | First published. |
```

## Changelog

- 2026-11-10: Created as a draft, by cutting the MediumArticle shape (AI governance Part 1) down to one page. Not yet checked against a real instance.
