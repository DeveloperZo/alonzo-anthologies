# SmallArticle

<!--
Purpose: Definition of a SmallArticle: one published page that overturns one misconception in a single sitting, with its sources and revision history on the same page.
Status: draft
Owner: zo
Human id: definition-small-article
Update trigger: when the first SmallArticle is published (check this definition against it), or the beats, citation form or editorial rules change
Last updated: 2026-11-10
-->

## What a SmallArticle is

A piece a reader finishes in one sitting, about five to eight minutes. It
starts from something the reader believes and is wrong about, makes them want
the answer before giving it, explains the mechanism through one real story,
and leaves them seeing the world a little more accurately than before. It runs
about 1,200 to 1,800 words of body, on one page, with zero to two diagrams and
about 8 to 20 sources.

This definition is designed, not grounded. No SmallArticle exists yet. The
beats are adapted from a widely circulated breakdown of how Veritasium
structures its explainer videos: misconception first, question before
explanation, core explanation, A-plot and B-plot interleaved, and a payoff.
Citations, voice and the shared editorial rules come from the
[MediumArticle](./MediumArticle.md) (AI governance Part 1). Check this against
the first real instance and correct it where they disagree, as the other
definitions were corrected against theirs.

### SmallArticle or MediumArticle

| Signal | SmallArticle | MediumArticle |
| --- | --- | --- |
| Claim | One misconception, overturned | One question, answered by reading a system |
| Shape | Five beats, on one page (after Veritasium) | Five beats across five to eight section files (after Meadows) |
| Story | One real-world thread through the whole piece | Evidence per section |
| Length | About 1,200 to 1,800 words | About 5,300 words including callouts |
| Diagrams | Zero to two | 10 to 15 |
| Sources | About 8 to 20, on the same page | 50 to 70, on their own page |

If a SmallArticle draft passes about 2,000 words, needs a second
misconception, or needs a second story to carry it, it wants to be a
MediumArticle. If one section of a MediumArticle corrects a common belief on
its own, it can be lifted out as a SmallArticle that links back to the full
piece.

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
| `index.md` | yes | The whole article: dateline, the five beats, sources, revision history |
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

The title names the misconception or the question, never the answer: "Why
the pause went away", not "Competition killed the pause".

## The five beats

In order on the page. Beats 1 and 2 sit above the first heading. Beats 3 and
4 are one stretch of the page: the explanation, told by weaving the two
plots. Beat 5 closes it.

| # | Beat | Words | Heading |
| --- | --- | --- | --- |
| 1 | Misconception | About 150 to 250 | None |
| 2 | Question | About 50, plus the hero question | None |
| 3 and 4 | Explanation, through the A-plot and B-plot | About 900 to 1,200 | Two or three `##` headings |
| 5 | Payoff | About 150 to 250 | One `##` heading |

### 1. Misconception

State a belief the reader most likely holds: intuitive, widely repeated, and
wrong or importantly incomplete. Give it its best case. The reader should
nod, not feel set up.

- Name the belief plainly, and why it feels true (it matches everyday experience, it is what the headlines say, it is what the industry says).
- Show it is common: a poll, a headline, a public statement, with a citation. A straw man nobody holds breaks the piece.
- Plant the first crack: one fact that does not fit. Do not explain it yet.

This replaces the standfirst. The opening does not state the answer.

### 2. Question

Turn the crack into a question the reader wants answered, before any
explanation. It goes in `<div class="hero-question">`, directly after the
crack, with at most one sentence on why it matters.

The question should be answerable by the end of the piece, specific enough
that the reader can start guessing, and impossible to answer correctly from
the misconception.

### 3 and 4. Explanation, through the A-plot and B-plot

The core explanation (beat 3) is the correct mechanism: what actually
happens, and why the intuition got it wrong. It is not told in one block. It
is carried by two threads that alternate (beat 4):

- **A-plot.** One real, specific story: an event, a decision, a case, with named actors, dates and consequences. It runs from the first heading to the payoff. It is sourced like any other claim.
- **B-plot.** The mechanism: the incentive, loop, rule or number that explains why the story went the way it did.

Rules for the weave:

- Open the explanation on the A-plot, not the theory.
- Switch threads every two or three paragraphs. When a B-plot paragraph gets dense, the next paragraph returns to the story.
- Each return to the A-plot should show the B-plot point just made, so the reader sees the mechanism happen and does not just read about it.
- Name the misconception explicitly at the moment the mechanism overturns it, and say why the intuition was reasonable. The reader should leave with the old belief replaced, not just contradicted.
- Stakes belong here, grounded (mechanism, timeline, who bears it), not as a closing alarm.
- Headings follow the A-plot's turns ("The memo in February", "What the competitors did"), so the outline reads as the story.
- The answer to the hero question lands at the end of this stretch, in a short sentence.

B-plot detail that would stall the story goes in a collapsed callout.

### 5. Payoff

Close on a larger truth the reader can now see, one that reaches past this
one story. The payoff is hopeful when the evidence supports hope: the
mechanism that explained the problem also shows where a push moves something,
or that the reader now reads the next headline more accurately.

- It must follow from the explanation. A payoff that needs new evidence is a second article.
- Hopeful, not reassuring. No false comfort, and no unearned call to action.
- End on one short line the reader leaves with.
- Then one onward link, when there is somewhere to go: the MediumArticle it draws from, or the next piece in a series.

## Callouts

At most two, collapsed (`-`), placed in the explanation where the B-plot
would otherwise stall the A-plot. Same types as MediumArticle: `[!note]-`
for a primer or a reader's likely question, `[!key]-` for the structural
point, `[!warning]-` for a timing caveat. If a callout grows past about 150
words, the piece wants to be a MediumArticle.

## Diagrams

Zero to two, on the B-plot, at the point where the mechanism is hardest to
hold in words. Never in the misconception or question beats: a diagram there
gives the answer away. Embed with an absolute path and nothing after it:
`![](/<slug>/diagrams/DIA-###-<name>.svg)`. The caption is inside the SVG.

## Sources

Every factual claim carries a numbered citation, A-plot and B-plot alike, in
the same markup as MediumArticle, with the slug as the anchor prefix:

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

The [MediumArticle voice](./MediumArticle.md#voice) applies, except its two
systems items (systems words, the species): plain first,
correct the common picture, guide the eye, land short, mark the strength of
each claim, ground stakes, structural not moral. In a SmallArticle:

- **Respect the misconception.** The reader held it for good reasons. Never mock it or the people who hold it.
- **One analogy, at most.** The A-plot does most of the work an analogy would.
- **Fewer turns.** One or two "Watch what..." style turns in the whole piece, ideally where the A-plot returns.

### Editorial rules (HARD)

- One misconception, one A-plot. A second of either goes in a second piece.
- The misconception must be real and documented. No straw men.
- The opening does not give the answer.
- No false dichotomies, and no claims that the subject has properties other complex systems lack.
- The payoff is earned by the evidence on the page. No false comfort.
- No emoji in headings or prose.
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
title: "<The misconception or the question>"
tags: [<tags>]
draft: true
version: "1.0"
---

*An analysis · <Month YYYY> · v1.0 · <N> min read*

<Misconception: the belief, why it feels true, evidence that it is widely held.>

<The crack: one fact that does not fit.>

<div class="hero-question">
<The question the article answers.>
</div>

## <First turn of the A-plot>

<A-plot: open on the story.>

<B-plot: the first part of the mechanism, with citations.>

<A-plot: the story showing that point.>

## <Second turn of the A-plot>

<B-plot, then A-plot, alternating. Name the misconception where the mechanism overturns it.>

![](/<slug>/diagrams/DIA-###-<name>.svg)

<The answer to the hero question, in a short sentence.>

## <What this shows>

<Payoff: the larger truth, earned by the evidence. End on one short line.>

<Onward link, if any.>

## Sources

1. <span id="<slug>-ref-1"></span><Author>, "<Title>," *<Publication>*, <date>. <URL>. <What it supports.>

## Revision history

| Version | Date | What changed |
| --- | --- | --- |
| 1.0 | <Month YYYY> | First published. |
```

## Changelog

- 2026-11-10: Restructured around five beats (misconception, question, explanation, A-plot and B-plot interleaved, payoff), adapted from a breakdown of Veritasium's video structure. Replaces the four moves folded from MediumArticle. The opening no longer states the answer; the payoff must be earned by the evidence.
- 2026-11-10: Created as a draft, by cutting the MediumArticle shape (AI governance Part 1) down to one page. Not yet checked against a real instance.
