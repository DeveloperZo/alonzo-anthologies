# MediumArticle

<!--
Purpose: Definition of a MediumArticle: a published systems breakdown that answers one question by reading its subject as a system, split into section files with numbered sources, diagrams and a revision history.
Status: working
Owner: zo
Human id: definition-medium-article
Update trigger: when the beats, the section shape, citation form, versioning or editorial rules change
Last updated: 2026-11-10
-->

## What a MediumArticle is

A systems breakdown, published on the site. A MediumArticle takes one
question and answers it by reading its subject the way Donella Meadows reads
a system in *Thinking in Systems*: as a specimen from the systems zoo, with
a bathtub anatomy of stocks and flows, behavior that follows from its
structure, and a particular way of responding when pushed. It backs every
factual claim with a numbered source and is revised in place as the facts
move. It runs about 5,300 words including callouts (about 4,000 without)
across five to eight sections, with 10 to 15 diagrams and 50 to 70 sources.

The page mechanics (files, index, section shape, callouts, citations, voice,
versioning) are grounded in `site/content/ai-governance/part-1/` (Part 1:
Can AI Self-Govern?) as it stood at v1.2. The five beats were set on
2026-11-10, after Part 1 was written. Part 1 matches them in part; the gaps
are listed under [Part 1 against the beats](#part-1-against-the-beats).

Use a MediumArticle when the question is about why a whole system keeps
producing an outcome. Use a [SmallArticle](./SmallArticle.md) when one
mistaken belief can be overturned through one story in a single sitting.
Use a [Document](./Document.md) for working material about the repo (a
video script drawn from an article is a Document), and a
[Diagram](./Diagram.md) for each picture an article embeds.

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
| `01-<slug>.md` to `NN-<slug>.md` | yes, through the index | One section each, five to eight in all (Part 1 has eight) |
| `sources.md` | yes | Numbered references, grouped by section, with later additions in dated groups |
| `changelog.md` | yes | Version table |
| `diagrams/DIA-###-<name>.svg` and `.md` | the SVG | Artwork and its spec, per [Diagram](./Diagram.md) |
| `RATIONALE-YYYY-MM.md`, `UPDATE-PROPOSALS-YYYY-MM.md` | no (`draft: true`) | Working notes for a revision pass |

### Frontmatter

Published files carry Quartz YAML, not the HTML-comment block from the
README, because Quartz renders them. The revision history lives in
`changelog.md`, not in a `## Changelog` at the foot of each file.

```yaml
---
title: "Part 1: Can AI Self-Govern?"   # index: "Part N: <short form of the hero question>"
tags: [ai, governance, systems-thinking]
draft: false
version: "1.2"                          # index only
---
```

Section titles use a Roman numeral: `"III: What's Unsolved at That Speed"`.
A standalone article drops the `Part N:` prefix. Every file is `draft: true`
until the article is published, then all change together.

## The index

In this order:

1. **Dateline.** One italic line: kind, first-published month, latest revision, version linked to the changelog.
   `*An analysis · May 2026, revised November 2026 · [[changelog|v1.2]]*`
2. **Hero question.** The question the whole article answers, in `<div class="hero-question">`.
3. **Framing paragraph.** Three to five short sentences on the approach and what the reader will get, saying that the question stays open until the system is laid out. No findings.
4. **Sections.** One `![[NN-slug]]` transclusion per section, each on its own line.
5. **Onward links.** The next part (`Continue to [[../part-2/index|Part 2: ...]]`; a standalone article omits this line), then `[[changelog|Revision history →]]`, then a bold link to sources.

## The five beats

Every MediumArticle carries these five, in this order, with no beat
returning after the next has begun. A beat is not a section. The article
decides how its five to eight sections divide among the beats, within these
limits:

| Beat | Where it sits | Sections |
| --- | --- | --- |
| The question | The index, above the first section | None |
| The animal | The opening sections | One or two |
| The behavior | The middle of the article, and most of its length | Two to four |
| The verdict | The closing paragraph of the last behavior section, with no heading of its own | None |
| The levers | The closing sections | One or two |

The verdict is the only beat that shares a section with another.

| # | Beat | What the reader gets |
| --- | --- | --- |
| 1 | The question | A question they thought was about people or politics, held open |
| 2 | The animal | What kind of system this is, and its bathtub anatomy |
| 3 | The behavior | What the structure does over time, and where that leads |
| 4 | The verdict | The answer, given as structure and purpose, not blame |
| 5 | The levers | How this animal responds when pushed, and which pushes are realistic |

### 1. The question

One question, in the hero box of the index. The reader arrives with an
answer from instinct or politics: someone is to blame, or someone should
simply decide differently. The question is held open until the system has
been laid out, and the framing paragraph says so. It gives the approach, not
the findings. The title is a short form of the question.

### 2. The animal

Say what kind of system this is before judging it.

- **Draw the boundary.** What is inside the system for this question, and what is left out on purpose.
- **Name the species.** Identify the dominant structure, for this question, with one of the animals in Meadows' systems zoo, or a cross of two. Use her species, not an invented metaphor, so the claim can be checked and readers learn the zoo across articles. Name it in the body of the first section, once, with the structure that makes it that animal. Say that it is a simplification: her zoo animals are teaching cases shown apart from their habitat, and a real system is several of them joined. If none fits well, name the nearest, say where the fit fails, and let the trap named in the behavior beat carry the rest. Do not invent a sixth animal.

  | Species | Structure | Typical behavior |
  | --- | --- | --- |
  | Thermostat | One stock, two balancing loops pulling against each other | Settles near a goal, never quite on it |
  | Population or capital | One stock, a reinforcing loop and a balancing loop | Grows, levels or declines, depending on which loop dominates |
  | Inventory with delays | One stock, balancing loops with delays in perception, response and delivery | Oscillates |
  | Renewable stock on a nonrenewable one (the oil economy) | Two stocks, growth feeding on a resource that does not refill | Grows, peaks and declines as the resource runs down |
  | Renewable stock on a renewable one (the fishing economy) | Two stocks, growth feeding on a resource that can refill | Settles, oscillates or collapses, depending on how efficiently the resource can still be harvested when it is scarce, and whether its power to regenerate is damaged |

- **Draw the bathtub.** The stocks (what accumulates), the inflows and outflows, and what sets each rate. Say plainly which stocks have no drain. State the stocks and flows in the body, in plain words; a collapsed callout may carry the fuller primer (Part 1's "Key concept: stocks and flows").
- **Give it a plate.** The anatomy gets a diagram, in the first section: the one picture a reader could redraw from memory. It shows every stock the prose names, and it counts toward the 10 to 15.

Everything a reader needs in order to understand the subject at all (what it
is, how it is made, what it costs) belongs here, as the description of the
stocks and flows.

### 3. The behavior

What the structure does over time, and where that leads. Behavior and
outcome are one beat. The harm is not a separate thing that happens to the
system; it is the system behaving.

Read the behavior off the structure:

- **Loops.** Which loops amplify and which correct, and which one is dominant now. A shift in dominance is the event worth reporting.
- **Delays.** Where information or response arrives late, and what that produces: oscillation, overshoot, a correction that lands after the harm.
- **Stocks and sinks.** What is filling faster than it drains, what cannot be drained at all, and what buffer is running down.
- **Connections.** Which information reaches which actor, and which link is missing. A missing connection is often the whole finding.

Then name the trap, where one fits, in Meadows' terms: policy resistance,
tragedy of the commons, drift to low performance, escalation, success to
the successful, shifting the burden to the intervenor (addiction), rule
beating, seeking the wrong goal. A trap is a claim. Show the structure that
produces it, and say whether it is observed or predicted. Meadows pairs each
trap with a way out; carry that forward to the levers.

Ground every stake in this beat: the mechanism, the timeline, and who bears
it, graded by how certain it is.

The frame for what goes wrong is this: these systems cannot be controlled.
They can be danced with (Meadows' word) and steered (ours). The damage usually comes from acting as if one actor's
decision, one rule or one fix could set the outcome, when the loops will
answer back. Show the attempts at control and what the system did with them.

### 4. The verdict

Answer the hero question, in systems terms. The verdict lands in one place:
one paragraph, without a heading, closing the last behavior section. It
comes after all of the behavior, stakes included, and it has four parts:

1. **Structure largely produces the behavior.** The outcome is what this arrangement of stocks, loops and delays does. Different people in the same seats would get much the same result, unless they changed the system's rules or goals.
2. **Purpose is read from behavior.** Say what the system is doing, whatever its actors say it is for. This is not a claim of hidden motive: a system's purpose need not be anyone's intention.
3. **Which loop governs.** Name the dominant loop and what would have to change for dominance to shift.
4. **The answer.** One or two sentences, in bold, that a reader could repeat. Part 1: "not reliably, and not because the people are uniquely reckless."

The verdict does not rest on character, and never promises control. It is
not a forecast. It says what pattern the system will tend to keep producing
unless its structure, rules or goals change.

### 5. The levers

How this particular animal responds when pushed. Use Meadows' twelve
leverage points as the map, but do not walk all twelve by rote. She calls
the ranking tentative, not a recipe. Each article picks the three to six
levers that matter for its system and sorts them, in prose or in one table.

- **Realistic and unrealistic.** A lever is realistic when someone can pull it and the system can respond on a timescale that matters. Stocks change slowly: a forest cannot be regrown in a year. Say which levers are out of reach for now, and why (the stock is too slow, the actor does not exist, the window has closed).
- **Low and high.** Numbers and parameters are the easiest to reach and the most easily absorbed, unless the number changes the strength of a loop. In the middle sit the things the behavior beat examined: buffers, the stock-and-flow structure, delays, and the strength of the correcting and amplifying loops. Information flows, rules, goals and paradigms move more and are resisted more. Say where current effort sits.
- **Which direction.** A lever found is often pushed the wrong way. For each one, say which direction helps, and whether current effort is pushing that way.
- **How the animal answered.** For each lever, give the evidence, and label which kind it is:

  | Grade | What it is | Requirement |
  | --- | --- | --- |
  | Observed | The lever was pulled on this system | Cite what happened, including how the system pushed back |
  | Analogue | The lever was pulled on a system of the same species | Cite the case, and say what carries over and what does not |
  | Reasoned | Nobody has pulled it | Argue from the structure, and mark it as predicted |

- **Steer, do not control.** Close on what steering looks like for this animal: where to watch, what to keep feeding back, which windows are narrowing. No promise that one lever fixes it.

A standalone MediumArticle carries this beat in full. In a series, the
beat may be a teaser that hands off to the part that carries the detail
(Part 1's section 8 and Part 2). A teaser names the tiers and where current
effort sits; the evidence grades and the realistic sort are required in the
part that carries the detail.

### Part 1 against the beats

| Beat | Part 1 sections | How well it matches |
| --- | --- | --- |
| The question | Index | Matches, except that the framing paragraph does not say the question is held open |
| The animal | 1 and 2 | Partly. Stocks and flows are introduced (the bathtub callout) and the capital loop is drawn, but no species is named and no single anatomy plate exists |
| The behavior | 3, 4, most of 5, 6 and 7 | Matches in content: loops and shifting the burden (5), delays (3 and 5), a stock with no drain (open weights: stated in 1, a callout in 5, again in 7), a missing price signal (insurance, 4), graded stakes (6 and 7). Out of order: the stakes in 6 and 7 come after the verdict |
| The verdict | Last paragraph of 5 | Matches in part. Structural, not about character, and the governing loop is named. Purpose read from behavior is implied, not stated, and what would shift dominance is not said |
| The levers | 8 | Teaser only, by series rule. Tiers and precedents are given, and low against high is covered. Realistic against unrealistic is touched only in the timing callout, and no lever carries an evidence grade |

Part 1 is left as it is. It is the source of the mechanics below, not a
model of every beat.

## Sections

A beat may span several sections. Each section is one file.

### Inside a section

In this order:

1. **Position line.** `*Section N of M*`, where M is the article's section count
2. **Standfirst.** One to three italic sentences stating the section's claim. A reader who skims only standfirsts should get the argument.
3. **Opening paragraph.** Names the common picture and corrects it, or sets the scene in concrete terms. It does not open on a statistic.
4. **Body.** Three to seven paragraphs, with one to three diagrams placed where the prose first needs them. Optional `###` subheads, only when a section carries two distinct topics (sections 6 and 7 in Part 1).
5. **Callouts.** Zero to three, after the body paragraphs they extend. See below.
6. **Bridge.** One italic line handing off: `*Section N+1 looks at ...*`. The last section has no bridge; it ends on a short landing line ("That's the map.") and the index carries the onward link.

Sections run about 500 to 1,000 words including callouts (about 350 to 900
without). A levers section that is only a teaser (in a series) runs about
250.

### Callouts

Quartz callouts, always collapsed (`-`), so the main line reads straight
through. Each one is optional depth, never a step the argument needs: the
body must stand with every callout closed.

| Callout | Use it for | Title form |
| --- | --- | --- |
| `> [!note]-` | A concept primer, a reader's likely question, or a case file | "Key concept: stocks and flows", "Don't labs test models before releasing them?", "The liability cases: what settled and what didn't" |
| `> [!key]-` | The structural point a section turns on | "Why this is a systems problem, not just a technical one" |
| `> [!warning]-` | A caveat about timing or applicability | "A note on timing" |

### Diagrams

Embed with an absolute path and nothing after it:
`![](/ai-governance/part-1/diagrams/DIA-003-capability-gap.svg)`. The
caption is inside the SVG. Every diagram has a spec beside it. When a figure
in the prose changes, every plate that prints it changes in the same pass.
Keep a table of which plate carries which figure: in the series context
file for a series, in the article's working notes for a standalone piece.
A standalone article takes the next free `DIA` numbers after checking every
`DIA` in the repo.

## Sources

Every factual claim carries a numbered citation. In the prose:

```html
<sup><a href="sources#part1-ref-8" id="part1-fnref-8">8</a></sup>
```

- The first citation of a source carries the `id`; repeat citations drop it.
- Two or more in a row join with `<sup>,</sup>`.
- The prefix (`part1-`) is per part, so anchors stay unique across a series.
- A source added in a revision takes a letter suffix named for its neighbour (`6a`, `13e`) so existing numbers never shift. Renumbering is the author's call.
- Escape dollar signs in prose (`\$100M`) so Quartz does not read them as math.

In `sources.md`: a one-line note on how numbering works, links back to the
index and changelog, then `## Sources` with one `### Section N: <Title>`
heading per section. Sources added in a revision may instead be grouped
under a dated `### <Months YYYY> developments` heading at the end. Each
entry:

```markdown
8. <span id="part1-ref-8"></span>Author, "Title," *Publication*, date. URL. One or two sentences on what the source supports and any caveat.
```

## Voice

What Part 1 does on every page, and a new MediumArticle should do too:

- **Plain first.** Define each technical term in bold, in one plain sentence, the first time it appears (alignment, RLHF). One concrete analogy where it carries the idea (the bathtub, the eighteen-wheeler with sedan brakes).
- **Correct the common picture.** Name what most people assume, then show why it is wrong ("Most people assume you can. ... It isn't.").
- **Guide the eye.** Short imperative turns to walk the reader into evidence: "Watch what...", "Consider what...", "Follow that logic through." Use them sparingly; each one should precede something worth watching.
- **Land short.** End a paragraph on a short sentence that states what the evidence means ("The measurement improves. The ground truth stays out of reach.").
- **Mark the strength of each claim.** Say when a figure is company-reported, when a pattern is predicted rather than measured, and when experts disagree, with the range (Ord roughly 10%, Hinton 10 to 20%, LeCun effectively zero).
- **Ground stakes.** Every stake names its mechanism, its timeline, and who bears it. No ambient dread.
- **Structural, not moral.** Explain outcomes by the incentives and loops that produce them, not by the character of the people involved.
- **Systems words in plain dress.** Say "self-amplifying loop" and "self-correcting loop", as Part 1 does. If Meadows' own terms ("reinforcing", "balancing") are needed, keep them to callouts and diagram specs. Every systems term gets one plain sentence the first time it appears.
- **The species earns its place.** Name the zoo animal once, show the structure that makes it that animal, and move on. It is an identification, not a running joke.

### Editorial rules (HARD)

- No false dichotomies, and no claims that the subject has properties other complex systems lack.
- All five beats, in order. The verdict lands once, after all of the behavior.
- The species is one of Meadows' zoo animals or a cross of two, the structure that justifies it is shown, and it is stated as a simplification.
- No villains and no promise of control. The verdict rests on structure; the levers steer.
- Every lever is labelled observed, analogue or reasoned, and realistic or not on a stated timescale. A series teaser is exempt.
- In a series, the levers beat may be a teaser, with full detail in the next part. A standalone article carries it in full.
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
title: "Part N: <Short form of the hero question>"   # standalone: no "Part N:"
tags: [<tags>]
draft: true
version: "1.0"
---

*An analysis · <Month YYYY> · [[changelog|v1.0]]*

<div class="hero-question">
<The question the article answers.>
</div>

<Framing paragraph: the approach, what the reader will get, and that the question stays open until the system is laid out.>

![[01-<slug>]]

<... one line per section, five to eight in all ...>

Continue to [[<next part>|<Next part title>]]   <series only>

[[changelog|Revision history →]]

**[[sources|Sources and references]]** (numbered citations for all sections above)
```

Each section file. Write the beat it carries in the working notes, not in
the file:

```markdown
---
title: "<Roman numeral>: <Section title>"
tags: [<tags>]
draft: true
---

*Section N of M*

*<Standfirst: the section's claim in one to three sentences.>*

<Opening paragraph.>

![](/<path>/diagrams/DIA-###-<name>.svg)

<Body paragraphs, with citations.>

> [!note]- <Title>
> <Optional depth.>

*Section N+1 looks at <what comes next>.*   <last section: a short landing line>
```

`sources.md`:

```markdown
---
title: "Part N: Sources and references"
tags: [<tags>]
draft: true
---

Superscript numbers in the Part N sections point to entries on this page.

[[index|← Part N overview]] · [[changelog|Revision history]]

## Sources

### Section 1: <Title>

1. <span id="partN-ref-1"></span><Author>, "<Title>," *<Publication>*, <date>. <URL>. <What it supports.>
```

`changelog.md`:

```markdown
---
title: "Part N: Changelog"
tags: [<tags>, meta]
draft: true
---

*Revision history for [[index|Part N: <Hero question>]]*

| Version | Date | What changed |
| --- | --- | --- |
| 1.0 | <Month D, YYYY> | First published. |
```

## Changelog

- 2026-11-10: Corrected after two reviews of the reframing. Against Meadows: zoo rows for the inventory and the fishing economy tightened, the species stated as a simplification, the verdict hedged as she hedges it, the leverage order fixed, with the middle of the list and the direction check added. Against Part 1: word, source, diagram and paragraph counts set to the measured figures, the beats table corrected (section 5 carries behavior as well as the verdict; the stakes follow the verdict), and standalone articles, the anatomy plate, the framing paragraph and a `sources.md` template filled in.
- 2026-11-10: Reframed as a systems breakdown after Donella Meadows. The eight-move arc taken from Part 1 is replaced by five beats (the question, the animal, the behavior, the verdict, the levers); section count loosened to five to eight; Part 1 mapped against the beats with its gaps stated. Part 1 itself is unchanged.
- 2026-11-10: Renamed from Article to MediumArticle, now that SmallArticle exists. Formats table removed; each size is its own definition.
- 2026-11-10: Created, with the medium format taken from Part 1 of the AI governance series as it stood at v1.2.
