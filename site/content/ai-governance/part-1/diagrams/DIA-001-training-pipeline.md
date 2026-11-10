# DIA-001: The Still
## Snapshot
- **Diagram file:** `site/content/ai-governance/part-1/diagrams/DIA-001-training-pipeline.svg`
- **Theme:** Training as distillation, with the cost in the fire
- **Primary audience takeaway:** A model is a small amount of liquid collected from an enormous charge of text, and what it costs is the heat.

## What The Diagram Shows
An engraved plate of a distilling apparatus, in the tradition of chemistry-manual apparatus plates. Loose words fall into a funnel on a large retort. The retort sits in a brick furnace whose fire is the only thing drawn in rust. Vapour runs down a beak into a coiled worm inside a tub and drips into a small receiving flask. A thin pipe leaves the receiver, runs over the top of the apparatus and returns to the head of the retort. A tap on the receiver fills a small glass.

Claim sentence: the reader should see that a model is a costly reduction of text into one file, and a still shows it because distilling boils a large charge down to a small receiver and spends its fuel doing so.

## Elements And Flow
- **Components:**
  - `a` The charge in the retort: trillions of words.
  - `b` The fire, in rust: specialized chips, weeks, `$100M to $1B` a run.
  - `c` The worm: billions of tiny adjustments.
  - `d` The receiver: one file, about 100 billion numbers.
  - `e` The return pipe: each model helps make the next.
  - `f` The tap and glass: your prompt.
- **Relationships:**
  - Flow runs left to right: charge, vapour, worm, receiver, glass.
  - The return pipe runs right to left over the top, closing the loop from one generation to the next.
- **Notable labels or metrics:**
  - `trillions of words`, `$100M to $1B a run`, `billions of tiny adjustments`, `about 100 billion numbers`. All four come from the prose of section 1 and its first source note.

## How To Read It
1. Start at the scraps of text falling into the funnel.
2. Notice the fire. It is the only colored element.
3. Follow the beak down through the worm to the drip.
4. Compare the size of the receiver with the retort.
5. Trace the return pipe back to the start.

## Governance Relevance
Section 1 argues that capability scales with compute and that compute is expensive. The plate puts the expense where the reader cannot miss it and shows the product as small, portable and persistent, which sets up the later point that released weights cannot be recalled.

What it leaves out: the filtering and labeling step from the earlier pipeline diagram, and inference cost.

## Suggested Caption
DIA-001 · The model is what collects in the flask. What it costs is the fire.
