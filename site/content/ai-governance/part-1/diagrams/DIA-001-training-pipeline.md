# DIA-001: One Hundred Billion Dials
## Snapshot
- **Diagram file:** `site/content/ai-governance/part-1/diagrams/DIA-001-training-pipeline.svg`
- **Theme:** What a model is, and how training produces it
- **Primary audience takeaway:** A model is nothing but a very large set of numbers, and training is the act of nudging each one a hair after every wrong guess at a next word.

## What The Diagram Shows
An engraved plate in the tradition of instrument and control-panel plates. A strip of paper across the top carries the essay's own sentence, `A modern AI model is a very large file of numbers.` The last word is printed in full inside a dashed outline that marks where a slip covered it. The slip is lifted aside, and the wrong guess, `words`, is written on it and struck through in rust. Below it a panel of identical dials runs back to a horizon and off both sides of the plate. The five dials in the front row have their settings written under them as numbers. The front centre dial is the only thing drawn in rust: a dashed line shows where its pointer stood a moment ago, and the number under it reads `0.4173`.

Claim sentence: the reader should see that a model is only a very large set of numbers, each set by tiny corrections after wrong guesses at the next word, and a bank of dials shows it because a dial holds one number in its position and can be turned by a hair.

The three mappings:
- The strip is the sentence shown to the model, and the lifted slip is its wrong guess at the last word.
- Each dial is one number (one weight).
- The rust pointer and its dashed former position are one adjustment.

## Elements And Flow
- **Components:**
  - The paper strip, the dashed outline around its last word, and the lifted slip carrying the struck guess.
  - The bank of dials, drawn in true one-point perspective (ground `y = 205 + 280 / z`, rows 0.45 apart in `z`, odd rows staggered half a pitch), reduced to rows of dashes near the horizon.
  - The front row, with a scale of ticks around each dial and its setting written beneath.
  - The rust dial at front centre, turned from `0.4172` to `0.4173`.
- **Relationships:**
  - Reading runs top to bottom: sentence, guess, how wrong, adjustment.
  - Every dial is the same. The rust one is singled out only to show a single turn. The note says the rest are turned too.
- **Notable labels or metrics:**
  - `About 100 billion dials`: section 1, "A large model might have 100 billion of them."
  - `Billions of times, trillions of words`: section 1, "Do that billions of times across trillions of words."
  - `One run: $100M to $1B+`: section 1 and its first source note.
  - The strip's sentence, ending in `numbers`, is the first sentence of section 1.
  - The guess `words` and the dial settings (`0.4172`, `0.4173`, and the four others in the front row) are illustrative. They are not data.

## How To Read It
1. Read the strip to its last word, then the struck guess on the slip beside it.
2. Read the two notes under it.
3. Look down the bank of dials to the horizon.
4. Find the rust dial and the dashed line beside its pointer.
5. Read the rust note under the panel.

## Governance Relevance
Section 1 has to leave the reader with a concrete picture of what a model is before the series argues about who controls it. The plate shows that the product is a set of numbers and nothing else, which sets up the later points that the file can be copied, and that once its weights are released there is no recall. It also shows why training is expensive: the same small turn, repeated across a bank this size, billions of times.

What it leaves out: the data collection and filtering steps from the earlier pipeline diagram; the chips that do the turning; the predecessor model helping to train the next generation; and inference (the user's prompt). The turn of the rust pointer is drawn about nine degrees wide so that it can be seen. A true hair would not show.

History: the first version hid the last word under the slip. Zo asked what the reader was meant to guess. Nothing is hidden from the reader now.

## Suggested Caption
DIA-001 · The model is the settings: a file of numbers, each nudged a hair after every wrong guess at the next word.
