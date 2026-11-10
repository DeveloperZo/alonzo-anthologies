# svg-diagram

Create or update a diagram for the Alonzo's Anthologies Quartz site.

A diagram here is a **plate**: one engraved drawing of one real object, whose
mechanics make the argument. It is not a layout of boxes. The working plates
live in `_KNOWLEDGE/Diagrams/proposals/`, one per published diagram. Good
ones to study: the dials (DIA-001), the stave tub (004B), the governor (005)
and the lever (008B). Open one and copy its `<style>` block before drawing
anything. A plate with a `.gen.mjs` file beside it is generated: change the
generator and rerun it.

## 1. Find the object first

Do not open an SVG until this sentence is written down:

> The reader should see that **[claim]**, and **[object]** shows it because **[how the object physically behaves]**.

Examples that passed:

- Oversight exists but does not bind. A steam governor whose rod to the throttle was never pinned.
- Governance acts where leverage is weakest. An actual lever, with the weights hung beside the fulcrum.
- Oversight money is invisible next to commitments. Bars at true width, and the magnifying glasses needed to see them.

Rules for choosing:

- **Clarity beats cleverness.** The plate has to make the point faster than the old diagram did. If the reader must decode the object before they can read the claim, it has failed. This was the verdict on a distilling apparatus drawn for section 1: a complicated analogy that added no clarity.
- **Recognized in two seconds.** Use things a general reader already knows on sight: a lever, a scale, a ship, a ruler, a ledger, a wall. No specialist apparatus.
- **Three mappings at most.** If the plate needs a six-letter legend to explain what stands for what, it is an allegory, not a diagram. Simplify the object or pick another.
- **Literal first.** When the thing itself can be drawn (a file of numbers, a bar at true width, a dated mark), draw that before reaching for a metaphor.
- **The object has to do the work.** If the claim still reads the same after swapping the object for another, the object is decoration. Pick again.
- **Take words literally.** Governance has a governor. Leverage has a lever. Distillation has a still. The series is full of dead metaphors that can be drawn.
- **Borrow from a real drawing tradition.** Patent drawings, apparatus plates, Playfair's charts, Minard, survey sections, field-guide plates, ledgers. Name the tradition in the companion file.
- **One object per plate.** Two ideas means two plates.
- **Data gets drawn honestly.** Use true scale and show what that costs (the loupes), not a forced minimum width.

## 2. When not to draw

If the content is sentences, it is not a diagram. Prose inside rectangles gets
typeset as a table or as prose in the markdown. Ask: with every box removed,
is anything lost? If not, do not make an SVG.

## 3. Banned vocabulary

These are what made the earlier set read as machine-made. Do not use them:

- rounded-rectangle cards, and any box whose only job is to hold text
- pills, badges, status chips, stat tiles
- left accent bars on cards
- pale tint fills in four or five semantic colors
- a tracked uppercase header with a centered subtitle under it
- a closing aphorism in bold at the bottom
- arrows with label pills
- icons and emoji

## 4. Plate style

**Ink and paper, plus one accent.**

| Role | Light | Dark |
| --- | --- | --- |
| paper | `#F2EEE3` | `#1E2128` |
| ink | `#2A2A35` | `#E8E5DC` |
| soft (captions, sight lines) | `#6B6873` | `#B8B5AD` |
| accent (rust) | `#A85B49` | `#D29183` |

Define them as CSS variables on `:root` inside the SVG `<style>`, with a
`@media (prefers-color-scheme: dark)` override. Style through classes, since
`var()` does not work in presentation attributes.

- **The accent marks the argument and nothing else.** The missing rod, the bare end of the lever, the fines. If more than three things are rust, the plate has no point.
- **Shade with hatching.** A 45 degree line pattern (4.5 unit pitch, 0.6 stroke) replaces every tint fill.
- **Line weights.** 1.4 for outlines, 0.7 for leaders, belts and detail, heavier (2.2 to 3) for rods and levers.
- **Notes beside the thing, keys only if forced.** Write a short italic note next to the part it describes, with a thin leader. Fall back to lettered keys *a, b, c* and a legend line only when notes would collide, and never more than three.
- **The argument is the biggest thing on the plate.** Crop to the detail that matters and let the rest run off the frame. A whole machine drawn small, with the point in a 40 unit corner, reads as a thin schematic.
- **Draw with weight.** Outlines, hatched shadow sides, flanges, rivets, joints. A plate made only of thin single lines looks like a wireframe, not an engraving.
- **No stick figures.** Avoid people where the object works without them. Where a person is needed, draw a filled silhouette with real proportions (about seven heads tall, tapered limbs, hands and feet), at least 60 units high, and check it in a zoomed render. If it still looks amateur after three tries, change the composition so no figure is needed.
- **Type.** Spectral (Georgia fallback) for everything. Fredericka the Great for the plate title only, about 32 units, weight 400, never bold.

**Frame, top to bottom:**

1. Double-rule border.
2. Top left: `PLATE V` (roman numeral of the section). Top right: `PART I · SECTION 5 · SECTION NAME`. Small, tracked, soft. Write "SECTION", never the section symbol.
3. The drawing, standing on a hatched ground line where it has one.
4. Title in Fredericka, centered.
5. Legend line or lines, if the plate has keys.
6. Hairline, then the caption: `DIA-NNN · one plain sentence.`

The caption is inside the SVG. Do not add a caption line in the markdown.
No em dashes anywhere in the text.

## 5. Geometry

Compute positions, do not eyeball them. Put the formula in a comment where a
row of things is spaced by rule (`x = 310 + 50 i`). Anything quantitative is
drawn to the number, and the comment states the scale (`800 units = $1.4T`).

Mechanisms should be mechanically plausible: a lever has a pivot, a belt runs
between two pulleys, a rod ends in a pin. A reader who knows the machine
should not wince.

## 6. Files and embedding

- Part 1 and Part 2 diagrams: `site/content/ai-governance/part-N/diagrams/DIA-NNN-name.svg`
- Repo and system diagrams: `_KNOWLEDGE/Diagrams/DIA-1NN-Name.svg`
- Every SVG has a companion `DIA-NNN-name.md` beside it, in the spec shape set by `_META/Definitions/Diagram.md`. Within that shape, record the claim sentence from step 1, the tradition borrowed from, what each key letter stands for, the source of every number, and what the plate leaves out.

Naming, placement and the spec shape are owned by `_META/Definitions/Diagram.md`.
This file owns how a plate looks. The plate style is for published writing.
The `DIA-1xx` architecture diagrams have not been moved to it.

Embed with `![](/ai-governance/part-1/diagrams/DIA-NNN-name.svg)`.

**Draw in `proposals/`, publish with the script.** An SVG loaded as an image
cannot fetch web fonts, so the working plate (with its `@import`) is not what
gets published. Author and revise `_KNOWLEDGE/Diagrams/proposals/PLATE-NNN-name.svg`,
then run:

```
node _KNOWLEDGE/Diagrams/proposals/embed-title-font.mjs <plate.svg> <published DIA path.svg>
```

It writes the published file with the title's Fredericka glyphs embedded.
Never hand-edit a published plate: change the proposal and run the script
again. Body text is not embedded and renders in Georgia on the site.

**Inlining.** If an SVG is pasted into markdown instead, it must contain no
blank lines between `<svg>` and `</svg>`. CommonMark ends an HTML block at the
first blank line and the rest renders as loose text. Keep plate files free of
blank lines so they can be inlined as they are.

Give every `id` a per-plate prefix (`p5-h`, `p5-boiler`) so two plates on one
page do not collide.

## 7. Check before calling it done

Render it and look at it, in light and in dark, whole and zoomed:

```
powershell -NoProfile -ExecutionPolicy Bypass -File _KNOWLEDGE/Diagrams/proposals/render-plate.ps1 -Svg <plate.svg> -Out <out.png> [-Scheme dark] [-ViewBox "x y w h"]
```

Expect at least three rounds of render, look, fix. Then go through this list:

- Would a reader who has not seen the legend get the point in a few seconds?
- Is it clearer than the diagram it replaces, or only prettier?
- Cover the caption and legend. Does the drawing alone still make the claim?
- Zoom into every figure, joint and label. Does anything look amateur?
- Is the accent on the argument, and on at most three things?
- Any text touching a line, a number or other text?
- Anything from the banned list?
- Does every number match its source in the companion file?
- Both color schemes legible?
- `<title>` and `<desc>` describe what is drawn, for screen readers.
