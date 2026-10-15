# Document

<!--
Purpose: Definition of a Document: reference material that is neither work to build nor rules to enforce. Each kind has its own ID prefix.
Status: working
Owner: zo
Human id: definition-document
Update trigger: when a Document kind is added or removed, or the shared sections or lifecycle change
Last updated: 2026-10-14
-->

## What a Document is

Anything worth keeping that is not a [Story](./Story.md) (work with
acceptance criteria) or an [Architecture](./Architecture.md) doc (rules with
checks).

If a Document starts accumulating acceptance criteria, it wants to be a
Story. If it starts accumulating "always" and "never", it wants to be an
Architecture doc.

## Kinds

Each kind has its own prefix, so a filename tells you what it is without
opening it. A new kind gets a new prefix and a row here; never reuse a prefix
another definition owns (`M`, `RM`, `ARCH`, `DIA`).

| Kind | ID | Folder | Use it for |
| --- | --- | --- | --- |
| Brief | `BRIEF-###` | `Documents/Briefs/` | Work scoped in Cowork for execution in Claude Code |
| Runbook | `OPER-###` | `Documents/Operations/` | Steps to deploy, verify or recover something, with the commands |
| Technical debt | `TD-###` | `Documents/Technical-Debt/` | A known shortcut or risk, and what would remediate it |
| Video script | `VID-###` | `Documents/Videos/` | Short-form and long-form video scripts |

All folders are under `_KNOWLEDGE/`. Numbering is per prefix.

## Sections every kind shares

1. **Scope.** What it covers and what it explicitly does not.
2. The body, shaped by the kind (below).
3. **Related.** Links to the Stories, Architecture docs and Diagrams it supports.
4. **Changelog.**

## Kind-specific body

- **Brief:** Goal, Current state and why it is worth doing, What to do, What not to do, How to know it is done. Records which session wrote it and the date.
- **Runbook:** When to run, Prerequisites, Steps (exact commands), How to know it worked, Rollback. Add a line to `Documents/Operations/log.md` each time it is run in earnest.
- **Technical debt:** What the shortcut is, Why it was taken, What it risks, Remediation (link the Story that will fix it). Moves to `Documents/Technical-Debt/completed/` once that Story ships.
- **Video script:** Format (short or long), Source page, Script, On-screen diagrams (by `DIA` ID).

## Statuses

`draft`, `working`, `canonical`, `superseded`, `archived`. Technical debt
also uses `open` and `remediated`.

## Template

```markdown
# <PREFIX>-### <Descriptor>

<!--
Purpose: <one sentence>
Status: draft
Owner: zo
Human id: <slug>
Update trigger: <the real-world event that should cause an edit>
Last updated: <YYYY-MM-DD>
-->

## Scope

<What this covers, and what it does not.>

## <Body sections for this kind>

## Related

- <Story, Architecture or Diagram links>

## Changelog

- <YYYY-MM-DD>: Created.
```

## Changelog

- 2026-10-14: Each kind keeps its own prefix (BRIEF, OPER, TD, VID) so the kind is visible from the filename. Replaces the single `DOC-###` ID with a `Kind:` line drafted earlier the same day. Briefs are now numbered; the existing unnumbered brief takes `BRIEF-001` when next touched.
