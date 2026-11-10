# AI governance series

A two-part explainer living on the site.

## Canonical locations

| Path | What |
| --- | --- |
| `site/content/ai-governance/index.md` | Quartz hub page for the series |
| `site/content/ai-governance/part-1/` | Part 1: "Can AI Self-Govern?" 8-section systems analysis |
| `site/content/ai-governance/part-2/` | Part 2: "What Can I Do About AI?" full 12 leverage-point action guide |
| `site/content/ai-governance/leverage-points.md` | 12 LP quick reference as Quartz markdown |

Legacy single-file HTML copies exist at the repo root
(`ai-systems-explainer.html`, `what-can-i-do.html`). They are superseded
by the split markdown sections and can be removed.

## Part 1 section structure

1. What's Being Built. Training pipeline, compute scaling
2. Why It's Moving So Fast. Capital ring, circular financing
3. What's Unsolved at That Speed. Alignment gap, RLHF limits
4. Who Was Supposed to Slow It. Oversight resources vs. scale
5. How These Interact as a System. R1 / B / R2 loops, flow pressure
6. Working From Inside. Meadows participation stance, loop speed mismatch
7. What's Actually at Stake. Critique cards, labor displacement, safety risk
8. Where You Have Leverage. Teaser only: 4-tier overview plus Part 2 link

Section 6 is not called "The Dance" and does not present two paths. That
false dichotomy was removed. Section 7 does not use the phrase
"extinction risk".

## Part 2 state (2026-11-10)

Part 2's index embeds two essay sections (`00-why-you-feel-helpless`,
`01-beneath-the-search-result`) and the four tier cards. Only the two
essay sections are in the current voice. The tier cards are an older
layer. The tier walk the index promises (dated examples paired with
look-alikes, and a close on where the reader sits) is not written.

Five files from an earlier structure are still `draft: false` and are
embedded and linked nowhere: `01-how-youre-already-in-it`, `02`, `03`,
`04` and `06`. They contain known errors. Do not cite or reuse them
without the corrections listed in
`part-2/UPDATE-PROPOSALS-2026-11.md`, which also holds every open
decision from the November pass. Its Part 1 companion is
`part-1/UPDATE-PROPOSALS-2026-11.md`.

Part 2 has no source apparatus. The URLs behind its claims are in the
two proposals files and `part-2/RATIONALE-2026-08.md`.

## Part 2 plates (2026-11-10)

Part 2 had one plate. Five were added on 2026-11-10, each drawn by a
subagent from a brief and reviewed in light and dark before publishing:

- DIA-202, section 1: a switch panel, every switch already on, one with no lever.
- DIA-203, tier 1: a radio whose volume knob turns and whose tuning dial is sealed.
- DIA-204, tier 2: a stopping-distance diagram. The train rests past the signal.
- DIA-205, tier 3: Meadows' two identical houses, meter in the basement and in the hall.
- DIA-206, tier 4: a plaque over a time-card rack, nine slots and five cards.

Zo chose the objects for 202, 204 and 205. For tier 3 Zo preferred
Meadows' own example over a market scale that would have covered all
three points of the tier. For tier 4 Zo turned down a signpost and worn
path and asked for "more visceral depiction of actions vs words", which
became the plaque and rack. The radio (203) was not put to Zo.

Zo's verdict on the six Part 2 plates, same day: II (switch panel) and
VI (plaque and rack) stand. V (meter in the hall) and IV (stopping
distance) are weak: "too literal, no bite" and "nothing is happening".
I (load line) is "meh". III (radio) is "barely ok". Across the set:
"too stylistically the same even when we are trying to convey different
ideas/topics", and the same texture on everything (hatching, screws,
bevels).

What follows from that, for every later plate:
- One house style for all plates is itself the fault. Vary the form
  with the subject: a chart from real figures, a marked document, a
  map, a sequence, a scene. Keep only the frame, palette, title face
  and caption line in common.
- A plate must add something the sentence beside it did not say.
  Illustrating the sentence is not enough.
- Draw a moment. Something should be happening or have just happened,
  with the consequence visible.
- Zo approves a concept per plate before anything is drawn.

Redrawn the same day on those rules, each in a different manner. Zo
chose or directed every concept:
- DIA-201 is now "The Bar, Lowered": a high-jump pit in stippled
  perspective, the bar reset near the ground under a ghost of its old
  height.
- DIA-203 is now "A Stone in the Stream": three frames in flowing line.
- DIA-204 is now "The Late Arrival": a night metro platform as a
  poster, the indicator board carrying the argument. Zo's direction:
  "Train / Metro station illustration of delays and its impacts".
- DIA-205 is now "Three Signs Before the Bridge": a road-safety poster.
  Zo's direction: "Dangers of misleading or unclear signage".
DIA-202 and DIA-206 are unchanged. The four replaced working plates
(load line, volume knob, stopping distance, meter in the hall) are
still in `proposals/`, unpublished.

A first drawing of the lowered bar put a foam landing bed behind the
gap, so the drop read as a mattress. Lesson: nothing may stand behind
the space that carries the argument.

Part 2 headers read PLATE I to VI and "PART II · PAGE TITLE", with no
section number, since Part 2 has none.

## Design system

CSS variables `--red` / `--green` / `--blue` / `--amber` / `--gray`, each
with a `-lt` light variant.

Tier colors: gray = low, blue = mid, amber = high, red = transform.

Six figure labels: Fig 1-1 through Fig 5-1, plus Fig 2-2.

Section 7 uses a two-column critique-grid layout. Part 2 is standalone
with its own CSS.

## Typography: a graded script (2026-11-10)

Zo asked for the overall type to take a nod from the Self Deception
script font (fontspace.com, Misti's Fonts), with the degree of
influence set by readability. Great Vibes, an open Google font, stands
in for it. Self Deception itself is "freeware, commercial use requires
donation" and is not in the repo.

- Full script (Great Vibes): the site name in the sidebar, and every
  plate title (38 units).
- Calligraphic italic (Cormorant Garamond italic, 600): all page
  headings h1 to h6 and the hero question.
- Unchanged: body text and plate notes stay in Spectral.

Great Vibes was tried on h1 and h2 and taken off the same day: its
capitals turn "AI" into "AJ" and the section numerals "I:", "II:" into
"J:", "JJ:". Do not put it on any text with acronyms, all-caps or roman
numerals. Fredericka the Great is no longer used on the site or the
plates. The resume app has its own styles and was not changed.

## Diagrams are moving to engraved plates (2026-11-10)

The existing DIA set read as machine-made: cards, pills, stat tiles and
tint fills, the same on every page. Zo approved a different approach on
2026-11-10. Each diagram is a plate: one real object, drawn as an
engraving, whose mechanics make the argument (a governor with no rod to
the throttle, a lever with the weights by the fulcrum). The rules are
in `.claude/commands/svg-diagram.md`.

All series diagrams were published as plates on 2026-11-10, fifteen with DIA-004C
(DIA-001 to 008B and DIA-201). They kept their old file names, so no
embed changed and the old artwork is only in git history. Each has a
rewritten spec beside it. The CSS tokens below describe the page, not
the plates.

Zo rejected three first attempts the same day, and the reasons are now
rules in the skill:
- DIA-001 as a distilling apparatus: "a complicated chemical analogy,
  this did not create more clarity". Clarity beats cleverness. It is
  now a bank of dials, the literal thing.
- DIA-003 with stick figures: "look horrible". No stick figures.
- DIA-005 as a whole engine drawn small with seven lettered keys: "not
  up to quality". The argument must be the biggest thing on the plate.

Three more verdicts from Zo later on 2026-11-10, after reading the
plates in the built page:
- DIA-005 as a governor: "ok but not aligning with the text it's next
  to nor does it invoke more mental clarity". A plate has to draw the
  paragraph it sits beside. It is now a bucket under a leaking pipe,
  for the shifting-the-burden paragraph.
- DIA-007B as three counting frames: "uninteresting". Honest tallies
  were not enough. It is now a gauge with the needle unlinked from its
  works, and the three rates are set as text beside it.
- Zo asked for a momentum example for spending against oversight, and
  chose two wrecking balls of very different sizes. It is DIA-004C, a
  new plate beside DIA-004A, which stays.

Several plates are generated by a script kept beside them in
`proposals/` (`PLATE-NNN-name.gen.mjs`). Regenerate, do not hand-edit
those.

The working copy of each plate is in `_KNOWLEDGE/Diagrams/proposals/`.
The published file is generated from it by `embed-title-font.mjs` in
that folder, which embeds the Great Vibes title glyphs, because an SVG
embedded as an image cannot load web fonts. Edit the working copy and
run the script. Do not hand-edit the published file.

Four plates changed subject, each to match the prose around its embed:
- DIA-201: was a say-versus-do table. Now the drift idea from the spec comment in the Part 2 page (a load line repainted as the ship sits lower).
- DIA-002A: was $600B against about $25B (24 times). Now $856B against $50B (17 times), from the section 2 prose.
- DIA-002B: was the dissent argument with lab valuations. Now a closed ring of gears: no actor can slow down alone.
- DIA-004B: was forces and a money bar. Now a stave tub: a standard holds only to the lowest bar any competitor keeps.

Open points:
- DIA-005 draws only shifting the burden. No loop is drawn anywhere in section 5 now. The prose carries them.
- DIA-004C sets a multi-year projection against a one-year budget, as DIA-004A does. Its spec says so. The $84M figure on both has no entry in `sources.md`.
- `PLATE-005-governor.svg` and `PLATE-007B-counting-frames.svg` are still in `proposals/` but are no longer published. The skill file still cites the governor as a model to study.
- `proposals/preview.html` has not been updated for the three plates of the later pass.
- Body text in the plates renders in Georgia on the site, not Spectral.
- DIA-002B's fourth wheel, "investors", is inferred. The prose names labs, hyperscalers and neoclouds as tiers.
- DIA-007B drops the model names, and no longer draws its quantities to scale: 65, 87 and 7 in 100 are text beside the gauge.
- DIA-007A and 007B headers read PLATE VII A and VII B, but 007B appears first on the page.

### Which plate carries which figure

A prose fact update is not finished until the plates that print the
same figure are regenerated and republished. The plates were brought in
line with the November 2026 revision of Part 1 (commit d53bea9) on
2026-11-10. Use this table the next time the prose moves.

| Plate | Figures printed on it | Where to change them |
| --- | --- | --- |
| DIA-001 | "Hundreds of billions of dials" (also the title), $100M to $1B+ a run | text in the generator |
| DIA-002A | near $856B projected spending, about $50B revenue, 17.1 on the rule, title "Seventeen Times Over" | one block at the top of the generator |
| DIA-002B | none. Wheel names only | |
| DIA-003 | ledge years 2020, 2022, 2023 | plate file |
| DIA-004A | near $856B, UK $84M a year, CAISI $10M a year, largest fine 15 million euros | one block at the top of the generator. The top bar follows DIA-002A. |
| DIA-004B | "Sawn off 24 February 2026. Four revisions since. Not put back." Kaplan quote | text in the generator |
| DIA-004C | $856 billion, $84 million, 10,190 to 1, "a twenty-second as wide", CAISI "half as wide", "a five-thousandth" | one block at the top of the generator. The wording follows from the figures. |
| DIA-005 | none. "liability law, mandatory audits, hard deployment gates" quotes section 5 | plate file |
| DIA-006A | five quotations and attributions, "CAISI has $10M for FY2026" | plate file |
| DIA-006B | 92 million and 170 million (WEF), 20 to 30 years, half a century, 6.1 million, 4.2%, 86% women | plate file. The gorge is 50 years wide at 11.2 units a year. |
| DIA-007A | "8 of 27", 2 August 2026, $2.5B smuggling case, four firms and 10+ GW, "one settled" | generator, for the notes as well as the masonry. A hand edit to the plate is lost on the next run. |
| DIA-007B | 65, 87 and 7 in 100, "No model began one unprompted" | text in the generator |
| DIA-008A | ASRS since 1976 and voluntary, about 10% in a month | plate file |
| DIA-008B | weights per leverage point, and the twelve point names (3 goals, 2 paradigm, 1 coordination, as in `leverage-points.md`) | plate file |
| DIA-201 | September 2023, February 2026, "Four revisions since, to July 2026" | generator |
| DIA-202 | 14 May 2024, 2024, January 2025, 2024, four product names | generator |
| DIA-203 | none | generator |
| DIA-204 | "18 MONTHS LATE", "DELAYED: YEARS", two departed trains (from the tier card's own example) | generator |
| DIA-205 | none | generator |
| DIA-206 | nine slots, five cards, "nine thousand heads to about five thousand" | generator. The count is one constant. |

DIA-201 and Part 2's opening section were brought in line with section 4
of Part 1 on 2026-11-10: the fourth revision (February 2026) dropped the
pause, and four more followed through July 2026.

The new DIA-007A no longer cites the NP-hardness result, so source 30
is now cited by nothing.

## Editorial rules (HARD)

- No false dichotomies. Do not frame AI as having unique properties that
  other complex systems do not share. Meadows' fisheries and
  irreversibility examples apply to all complex systems.
- Ground stakes specifically: mechanism, timeline, distribution. No
  ambient dread. Section 7's safety-risk framing names the mechanism
  (optimization toward miscalibrated objectives), the timeline
  (contested, 2030s to 2040s and later), and the distribution (proximate
  actors are labs and policymakers, not the general public).
- Section 8 stays a teaser. Full leverage-point detail lives only in
  Part 2.
- Curved paths for feedback loops (quadratic bezier). Straight lines for
  direct causal inputs.
