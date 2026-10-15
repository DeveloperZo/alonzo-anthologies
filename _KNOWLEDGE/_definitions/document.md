# Document (universal frontmatter)

<!--
Purpose: The frontmatter contract every canonical doc under _KNOWLEDGE/ follows, whatever its artifact class.
Status: superseded
Owner: zo
Human id: definition-document
Update trigger: when a frontmatter field is added, removed, or changes meaning
Last updated: 2026-10-14
-->

> **Superseded 2026-10-14** by [`_META/Definitions/`](../../_META/Definitions/README.md). Kept for history; do not author against this file.

## The block

Every canonical doc has an HTML-comment block immediately after the H1:

```markdown
# <PREFIX-### Title>

<!--
Purpose: <one sentence on what this doc is for>
Status: <canonical | working | draft | superseded | archived>
Owner: zo
Human id: <slug, matching the filename minus the prefix>
Update trigger: <what change in the world should cause this doc to be edited>
Last updated: <YYYY-MM-DD>
-->
```

## Fields

- **Purpose**: one sentence. If it takes two, the doc is probably two docs.
- **Status**:
  - `canonical`: the source of truth for its topic.
  - `working`: in active use and expected to change.
  - `draft`: not yet relied on.
  - `superseded`: replaced. Carries a banner pointing at the successor (see [CONVENTIONS](../CONVENTIONS.md)).
  - `archived`: kept for history, no longer maintained.
- **Owner**: `zo` unless a doc has a different steward.
- **Human id**: a slug used to refer to the doc in conversation.
- **Update trigger**: a real-world event, not "as needed".
- **Last updated**: the date of the last meaningful edit.

## Changelog

- 2026-10-14: Created, adapted from Serennovas `_definitions/document.md`. The `DOCS-###` artifact class was not carried over.
