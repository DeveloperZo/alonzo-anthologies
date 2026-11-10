# DIA-002A: Seventeen Times Over
## Snapshot
- **Diagram file:** `site/content/ai-governance/part-1/diagrams/DIA-002A-capital-stats.svg`
- **Theme:** OpenAI's compute target against its revenue
- **Primary audience takeaway:** The spending target is roughly seventeen years of today's revenue, stacked up.

## What The Diagram Shows
An engraved plate of two stacks of coins on one ground line, in the tradition of the true-scale comparison (Playfair's charts, with the money drawn as money). Each coin is $10 billion. On the left, five coins: one year of OpenAI revenue at the September 2026 rate. On the right, a column of eighty-five coins and a thin piece: OpenAI's compute spending through 2030 in an internal projection reported in September 2026. A rule stands between them, marked off in heights of the short stack, so the column can be read in years of revenue.

Claim sentence: the reader should see that OpenAI has is projected to spend roughly seventeen times what it earns in a year, and two stacks of the same coin show it because a stack's height is its amount, so the short stack can be laid against the tall one like a ruler.

The working plate is `_KNOWLEDGE/Diagrams/proposals/PLATE-002A-coin-stacks.svg`. The published file is generated from it and is not edited by hand.

## Elements And Flow
- **Components:**
  - Short stack: `about $50 billion`, annualized revenue at the end of September 2026 as the company told investors (section 2 prose, source 6b). Five full coins.
  - Tall stack: `near $856 billion`, compute spending through 2030 in an internal projection reported in September 2026 (section 2 prose). Eighty-five coins and a thin piece for the odd $6 billion.
  - The rule: one division is one short stack, numbered 1 to 18. A dashed sight line carries each stack top across to it.
  - Rust: the sight line from the tall stack, the mark where it meets the rule, and the note `17.1 on the rule: roughly seventeen times`.
- **Relationships:**
  - Scale: 0.53 plate units to $1 billion throughout. One coin is 5.3 units thick. The short stack is 26.5 units, the tall one 453.7.
  - 856 divided by 50 is 17.1. The prose rounds it to "roughly 17×".
- **Notable labels or metrics:**
  - `about $50 billion`, `near $856 billion`, `each coin, $10 billion`, `17.1`
- **What the plate leaves out:**
  - The January 2025 pairing in the prose: Stargate's roughly $500 billion against about $6 billion of revenue exiting 2024, which is 80 times.
  - The earlier targets: $1.4 trillion in late 2025 and $600 billion in February 2026.
  - Everything on the old stat tiles that the prose no longer carries: the `$448B` combined hyperscaler capex, the `~$25B` revenue figure and the `~24×` ratio. The old ratio was $600 billion over $25 billion. The prose has since been updated, and the plate follows the prose.

## How To Read It
1. Find the short stack and its figure.
2. Follow its sight line to `1` on the rule.
3. Run your eye up the rule to the rust mark.
4. Read the tall stack's figure.

## Governance Relevance
Section 2 argues that the pace is set by a financial structure, not by technology alone. This plate gives the size of the bet in one look: a company does not commit seventeen years of revenue to infrastructure unless it is counting on explosive growth, and everyone who sold it the infrastructure is counting on the same thing.

History: first drawn on 2026-11-10 with the July figures ($750 billion against $42.6 billion, 17.6, titled "Eighteen Times Over"). Regenerated the same day when section 2 moved to the September figures. The $856 billion is a reported internal projection, not a company statement, and the plate says so. All figures sit in one block at the top of `PLATE-002A-coin-stacks.gen.mjs`.

## Suggested Caption
DIA-002A · One year of OpenAI's revenue beside its compute target, in the same coin and on the same ground.
