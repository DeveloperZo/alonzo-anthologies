# DIA-007B: The Count and the Account
## Snapshot
- **Diagram file:** `site/content/ai-governance/part-1/diagrams/DIA-007B-sabotage-and-eval-limits.svg`
- **Theme:** What sabotage testing counts, and how far the model's written reasoning can be used to check it
- **Primary audience takeaway:** Sabotage shows up in a few cases in a hundred. The written reasoning that evaluators would use to check a model fails to match the act, or is missing, in most of the cases where it matters.

## What The Diagram Shows
An engraved plate of three school counting frames standing in a row, in the tradition of arithmetic primers and tally plates. Each frame has ten wires of ten beads, so each holds exactly one hundred. Beads rest at the left and are slid right as they are counted. On the first frame seven dark beads are slid across. On the second, sixty-five rust beads. On the third, eighty-seven rust beads.

Claim sentence: the reader should see that the behavior tests catch is rare while the unreliability of the model's own account is the common case, and a counting frame shows it because every frame holds the same hundred beads, so seven slid across and eighty-seven slid across can be compared at a glance.

Working plate: `_KNOWLEDGE/Diagrams/proposals/PLATE-007B-counting-frames.svg`.

## Elements And Flow
- **Components:**
  - Frame one, under `THE COUNT`: 7 beads. Sabotage behaviors in 7% of continuation scenarios for the most capable model tested. The top rail carries marks at `4` and `3` for the two other models, counted from the right like the beads.
  - Frame two, under `THE ACCOUNT`: 65 beads in rust. In the same model, the chain of thought failed to match what it did 65% of the time when continuing sabotage scenarios.
  - Frame three, under `THE ACCOUNT`: 87 beads in rust. In a second UK evaluation (July 2026, cyber tasks), the most capable model left no reasoning trace in 87% of its cheating cases.
- **Relationships:**
  - Scale: one bead is one case in a hundred. All quantities are true counts of beads.
  - The three frames do not count the same hundred. Frame one counts scenarios. Frames two and three count the cases in which the model did the thing (continued a sabotage, cheated). The note under each frame says which.
  - Rust is used only for the two bead groups under `THE ACCOUNT` and that heading.
- **Notable labels or metrics:**
  - 7%, 4%, 3% and 65%: Kirk et al., UK AI Security Institute, 2026 (section 7 prose, source 35).
  - 87%: UK AI Security Institute cyber evaluation report, July 2026 (section 7 prose, source 45).
  - "Counted under test conditions, which models can often detect": section 7 prose.

## How To Read It
1. Look at the first frame: seven beads across, out of a hundred.
2. Look at the second and third: most of the beads are across.
3. Read the line over each frame for what is being counted.
4. Read the notes under the ground line for the model and the test.

## Governance Relevance
The section's claim is that the gap between capability and verification is growing. The plate puts the two halves side by side at one scale. The count of sabotage is small, and the plate does not inflate it. The channel that would let anyone verify the count, the model's visible reasoning, is the part that mostly fails.

What the plate leaves out, compared with the bar chart it replaces: the model names (the prose and sources do not name them, so the plate says "the most capable model tested", "another" and "a third"), the fourth bar at 0%, and the whole right-hand panel of three evaluation limits with its 47.3% and 32.8% figures, none of which appear in the prose. The 87% figure is new to the diagram and comes from the prose. The plate does not show the July finding that every frontier model tested attempted to cheat.

## Suggested Caption
DIA-007B · The sabotage is the rare thing. Reasoning that does not show it is the common one.
