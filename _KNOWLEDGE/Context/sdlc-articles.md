# SDLC articles

Two articles about software delivery with AI. Both stay. Zo, 2026-11-23:
"Its not a matter of replace. Hence the name is anthologies of my
workspace."

## Where The Work Goes (SmallArticle)

"If the Machine Does the Work, Where Does the Work Go?" at
`anthologies/website-series/site/content/where-the-work-goes/index.md`.
Complete at about 1,770 words with 13 sources. Zo set it back to
`draft: true` on 2026-11-23. The homepage still links to it.

Open points found on 2026-11-23: source 4 (the Guardian) was never
opened and says so on the page, source 11 (iRobot's pet promise) has not
been re-checked, the code review paragraph and the "fair bet" prediction
are uncited, and the curling passage is a second analogy.

## Same Menu, Different Kitchen (MediumArticle, not yet in the repo)

The prose lives in a Claude Doc:
https://claude.ai/artifact/MVsknJKPNEzw9NS5a5dYPs (first titled "Your
SDLC Isn't Broken. It's Doing Exactly What It Was Built To Do."). Eight
sections, about 4,400 words, 22 sources. It was written in a claude.ai
chat on 2026-11-21 and has no folder under `content/` yet.

Direction Zo set in that chat:

- The read-in is general ("given how capable AI is, does it make you
  better"), then it narrows to developers, then the hiker with ten
  gallons of water introduces the systems lens. The hiker appears once.
  "Not every analogy needs to be heavy handed or long running."
- One story carries every section: two kitchens with the same menu. The
  best kitchens win, not the best cooks. The lake and algae story was
  dropped.
- No neutered or neutral language. Rank the primary cause first and say
  it plainly.
- Do not use the pull-request flood or the shadow IT examples.
- Validation was by chain of verification on every figure and proof by
  cases on every loop.

Scored against Part 1 on 2026-11-23 (my judgment, out of 50): Part 1
40, this article 31, with most of the gap in visuals and publication
state. Zo asked for the plates and the stakes. Still open from that
review: a verdict paragraph at the end of section 7 that names the
traps, and trimming stacked qualifiers.

Stakes paragraphs were added to sections 5, 6 and 7 on 2026-11-23,
using only sources already in the piece.

## The kitchen plates (DIA-401 to DIA-408)

Two rounds on 2026-11-23, both in `_KNOWLEDGE/Diagrams/proposals/kitchen/`.

**Round 1, rejected.** Eight object plates in the Part 1 engraved
manner (`PLATE-40N-*.gen.mjs`: a cut menu, a kitchen timer, bootprints,
two passes, a ticket rail, a pot and recipe card, two receipts, the
repaired pass). Zo's verdict: "its better to go informatics than your
dias...they feel plastic and soulless". Do not go back to drawn objects
for this article.

**Round 2, the direction Zo picked.** Shown two data graphics, Zo
answered "plate 5", read as: follow the Plate V sample. That manner is
grouped horizontal bars on one scale: a small-cap group head over a
hairline, one row per figure, every bar drawn to its number from a zero
line, large numerals at the bar ends, hatch for ordinary rows, rust for
the one row the plate turns on, and the sample and study design in a
line at the foot. `chart.mjs` draws it. The frame, palette, title face
and caption line still come from `frame.mjs`.

**Round 3, same day.** With all six drawn as bars, Zo said: "i want
more variation in my plates, i asked for infomatics and got a basic
high school bar chart". So "informatics" means infographics: a form
chosen for each plate's data, with large numerals and the finding
readable at a glance. One form repeated across a set is the fault, as
it was for the Part 2 plates. Only Plate V keeps the bars.

| Plate | Form |
| --- | --- |
| DIA-401 | A map: a field of task dots cut by a jagged frontier, figures on the side they belong to |
| DIA-402 | A number line with three marks, and the 39 points between the clock and the belief bracketed |
| DIA-404 | A slope chart from each group's own score without AI |
| DIA-405 | Grouped bars on one scale (`chart.mjs`) |
| DIA-406 | Unit grids of 100 squares filled to each quiz score |
| DIA-407 | Two squares with area to scale for spend, two 100% strips for the work mix, 100 marks with 18 filled |

**Round 4, same day, the set now in the doc.** Zo on round 3: "there's
so much richness that can be found with engaging images please inspire
wonder or emulate it". Shown a Minard-style flow map for Plate V and an
old sea chart for Plate I, Zo answered "plate 5" again. The flow map is
the manner that landed. The sea chart did not.

What the flow manner is: width (or length, or depth) is the number,
drawn as ribbons of fine hand-wobbled streamlines between heavier
banks, ink for ordinary flows and rust for the one the plate turns on,
dashed baselines cut clear of the water, large numerals beside the
flow. `flow.mjs` holds it. Each plate has its own composition:

| Plate | File | Composition |
| --- | --- | --- |
| DIA-401 | `WONDER-401-fork` | A stream forks at a jagged ridge. Three tributaries (12.2, 25.1, 40) join the upper channel and a rust strand of 19 leaves the lower one |
| DIA-402 | `WONDER-402-lanes` | Length is time. Three straight cuts (76, 80, 100) and a rust river whose length along its bends is 119, laid straight beneath |
| DIA-404 | `WONDER-404-confluence` | Three equal streams swell by 43, 26.08 and 17, run together and meet the pass |
| DIA-405 | `WONDER-405-flow` | A river 66.2% wider pools at the pass, leaves 11.7% narrower, and returns in rust 57.9% wider to rejoin its source |
| DIA-406 | `WONDER-406-vessels` | Five vessels of water filled to 67, 50, 86, 39 and 24 on one staff |
| DIA-407 | `WONDER-407-spend` | A rust river widening from 37 to 115 over two streams that keep their width, and 100 marks with 18 filled |

The `INFO-*` files (rounds 2 and 3) and `WONDER-401-chart` are
superseded and kept only as history.

- Generators: `INFO-40N-name.gen.mjs` and `WONDER-40N-name.gen.mjs`, run as
  `node INFO-40N-name.gen.mjs INFO-40N-name.svg`. Renders in `renders/`.
- Drawn: 401, 402, 404, 405, 406, 407. Their PNG renders are embedded
  in the Claude Doc under each placeholder line.
- Plate III: Zo called the round 1 bootprints drawing "ass". It was
  removed from the doc. The hiker has one number (83 lb) and no plate.
- Plate VIII: the round 1 drawing stays in the doc. Zo said that is
  fine.
- The `DIA-4xx` block is this article's. `DIA-1xx` is the home library
  and `DIA-3xx` was Where The Work Goes.
- Not published: no content folder, no `embed-title-font.mjs` run, no
  spec files.

| Plate | Figures printed on it |
| --- | --- |
| DIA-401 | +12.2% tasks, +25.1% speed, over +40% quality, 19 points fewer right answers, 758 consultants |
| DIA-402 | forecast 24% faster, measured 19% slower, believed 20% faster, 16 developers, 246 issues |
| DIA-404 | +43% and +17% (consultants), +26.08% (4,867 developers), DORA stability stated with no bar because the article gives no size |
| DIA-405 | +66.2% epics, 11.7% fewer deployments, +57.9% incidents a month, +54% bugs per developer, +242.7% incidents per change, review five times as long |
| DIA-406 | 67% without AI, 50% with, then 86, 39 and 24 by habit, 52 engineers |
| DIA-407 | $37 and $115, new features 57 and 56, maintenance 25 and 24, 18% measure, 883 surveyed |
