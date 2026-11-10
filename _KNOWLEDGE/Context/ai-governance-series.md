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

## Design system

CSS variables `--red` / `--green` / `--blue` / `--amber` / `--gray`, each
with a `-lt` light variant.

Tier colors: gray = low, blue = mid, amber = high, red = transform.

Six figure labels: Fig 1-1 through Fig 5-1, plus Fig 2-2.

Section 7 uses a two-column critique-grid layout. Part 2 is standalone
with its own CSS.

## Diagrams are moving to engraved plates (2026-11-10)

The existing DIA set read as machine-made: cards, pills, stat tiles and
tint fills, the same on every page. Zo approved a different approach on
2026-11-10. Each diagram is a plate: one real object, drawn as an
engraving, whose mechanics make the argument (a governor with no rod to
the throttle, a lever with the weights by the fulcrum). The rules are
in `.claude/commands/svg-diagram.md`.

Six plates were published on 2026-11-10: DIA-001, 003, 004A, 005, 008B
and 201. They kept their old file names, so no embed changed and the
old artwork is only in git history. Each has a rewritten spec beside
it. The other DIAs are still in the old style. The CSS tokens below
describe the page, not the plates.

The working copy of each plate is in `_KNOWLEDGE/Diagrams/proposals/`.
The published file is generated from it by `embed-title-font.mjs` in
that folder, which embeds the Fredericka title glyphs, because an SVG
embedded as an image cannot load web fonts. Edit the working copy and
run the script. Do not hand-edit the published file.

DIA-201 changed subject. The old SVG was a say-versus-do table. The
plate draws the drift idea from the spec comment in the Part 2 page (a
load line repainted as the ship sits lower).

Open points:
- The 1876 Merchant Shipping Act line on DIA-201 was written from memory. Check it.
- DIA-005 no longer draws the forming loop or the capability-gap loop. The prose carries them.
- Body text in the plates renders in Georgia on the site, not Spectral.
- DIA-006A, 007A and 008A are prose in boxes and should probably become tables or text.

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
