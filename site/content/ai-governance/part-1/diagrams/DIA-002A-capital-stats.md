# DIA-002A: Eighteen Times Over
## Snapshot
- **Diagram file:** `site/content/ai-governance/part-1/diagrams/DIA-002A-capital-stats.svg`
- **Theme:** OpenAI's compute target against its revenue
- **Primary audience takeaway:** The spending target is roughly eighteen years of today's revenue, stacked up.

## What The Diagram Shows
An engraved plate of two stacks of coins on one ground line, in the tradition of the true-scale comparison (Playfair's charts, with the money drawn as money). Each coin is $10 billion. On the left, four coins and a thin piece: one year of OpenAI revenue at the July 2026 rate. On the right, a column of seventy-five coins: OpenAI's compute spending target through 2030. A rule stands between them, marked off in heights of the short stack, so the column can be read in years of revenue.

Claim sentence: the reader should see that OpenAI has committed to spend roughly eighteen times what it earns in a year, and two stacks of the same coin show it because a stack's height is its amount, so the short stack can be laid against the tall one like a ruler.

The working plate is `_KNOWLEDGE/Diagrams/proposals/PLATE-002A-coin-stacks.svg`. The published file is generated from it and is not edited by hand.

## Elements And Flow
- **Components:**
  - Short stack: `$42.6 billion`, annualized revenue by July 2026 (section 2 prose, source 6a). Drawn as four full coins and one thin piece for the odd $2.6 billion.
  - Tall stack: `about $750 billion`, the compute spending target through 2030 as lifted by July 2026 (section 2 prose, sources 7a and 6a). Seventy-five coins.
  - The rule: one division is one short stack, numbered 1 to 18. A dashed sight line carries each stack top across to it.
  - Rust: the sight line from the tall stack, the mark where it meets the rule, and the note `17.6 on the rule: roughly eighteen times`.
- **Relationships:**
  - Scale: 0.6 plate units to $1 billion throughout. One coin is 6 units thick. The short stack is 25.56 units, the tall one 450.
  - 750 divided by 42.6 is 17.6. The prose rounds it to "roughly 18×".
- **Notable labels or metrics:**
  - `$42.6 billion`, `about $750 billion`, `each coin, $10 billion`, `17.6`
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
Section 2 argues that the pace is set by a financial structure, not by technology alone. This plate gives the size of the bet in one look: a company does not commit eighteen years of revenue to infrastructure unless it is counting on explosive growth, and everyone who sold it the infrastructure is counting on the same thing.

## Suggested Caption
DIA-002A · One year of OpenAI's revenue beside its compute target, in the same coin and on the same ground.
