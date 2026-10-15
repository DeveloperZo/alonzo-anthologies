# Architecture

<!--
Purpose: Definition of an Architecture doc: the checkable rules for one slice of the system, plus where the code breaks them today.
Status: working
Owner: zo
Human id: definition-architecture
Update trigger: when the Architecture shape, budget or rule format changes
Last updated: 2026-10-14
-->

## What an Architecture doc is

A short list of rules someone must follow when changing one slice of the
system (the site build, the resume SPA, deployment), plus the places the
code breaks them today. An agent doing a ten-minute task should get what it
needs from the rules table alone, so the table comes first.

It is not a description of the system, a design history or a tutorial. If a
fact does not change what someone writes, cut it. Explanation belongs in a
[Document](./Document.md), and work belongs in a [Story](./Story.md).

**Budget: about 60 to 90 lines.** Over 100 means reference material crept in.

## Where it lives

`_KNOWLEDGE/Architecture/ARCH-###-<Name>.md`. One doc per slice.

## Writing rules

- One line per rule, imperative, 6 to 10 rules per doc. Merge overlapping rules.
- Each rule carries a **Check**: a grep, a build command or a file-layout invariant someone can run. If you cannot write the check, the rule is too vague.
- State the rule, not the reasoning. Put a reason in Notes only when someone would otherwise undo the rule.
- Exceptions go in the rule line or the check, not in their own field.

## Known deviations

Where the code breaks a rule today, one row each: where, which rule, the
smallest fix. Fix the code and delete the row; never turn a row into history.
A deviation is a recorded exception, never a precedent.

## Statuses

`working`, `superseded`, `archived`.

## Template

```markdown
# ARCH-### <Descriptor>

<!--
Purpose: <one sentence>
Status: working
Owner: zo
Human id: <slug>
Update trigger: <what change invalidates this>
Last updated: <YYYY-MM-DD>
Verified against code: <YYYY-MM-DD> (<commit>)
-->

<One or two lines: which paths this covers, and links to sibling docs that cover the rest.>

## Rules

| # | Rule | Check |
| --- | --- | --- |
| 1 | <imperative, one line> | <grep, command, or invariant> |

## <Optional: one reference block>

<Only if the rules need a lookup to apply: a route table, a token list. Compact.>

## Notes

- <Only facts that stop someone undoing a rule, or that record a decision.>

## Known deviations

| Where | Breaks | Fix |
| --- | --- | --- |
| `<file:line>` | <rule #> | <smallest fix> |

## Changelog

- <YYYY-MM-DD>: Created.
```

## Changelog

- 2026-10-14: Created from the Serennovas rules-first architecture definition (adopted there 2026-09-07 after the long-form shape produced 200-line docs). Replaces the earlier seven-section shape in `_KNOWLEDGE/_definitions/architecture.md`. ARCH-001 predates this and has not been reshaped.
