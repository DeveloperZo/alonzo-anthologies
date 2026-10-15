# Definitions

<!--
Purpose: Index of artifact definitions, plus the rules every instance follows whatever its type.
Status: working
Owner: zo
Human id: definitions-readme
Update trigger: when a definition is added, removed, or renamed, or a rule here changes
Last updated: 2026-10-14
-->

A definition describes a type of thing we create instances of. Each one says
what the type is for, when to use it instead of a neighbouring type, how an
instance is named, where it lives, which sections it carries, and how it moves
through its life. Each ends with a template to copy.

Instances live in `_KNOWLEDGE/<Type folder>/`. Definitions live here, in
`_META/Definitions/`, and nowhere else.

## Definitions

| Definition | Instances live in | ID |
| --- | --- | --- |
| [Story](./Story.md) | `_KNOWLEDGE/Stories/` | `M-###`, `RM-###` |
| [Architecture](./Architecture.md) | `_KNOWLEDGE/Architecture/` | `ARCH-###` |
| [Document](./Document.md) | `_KNOWLEDGE/Documents/<Kind>/` | One prefix per kind: `BRIEF-###`, `OPER-###`, `TD-###`, `VID-###` |
| [Diagram](./Diagram.md) | `_KNOWLEDGE/Diagrams/`, or beside a site page | `DIA-###` |

## Rules for every instance

### Frontmatter

An HTML-comment block sits directly under the H1:

```markdown
# <ID> <Title>

<!--
Purpose: <one sentence on what this instance is for>
Status: <type-specific status, see the definition>
Owner: zo
Human id: <slug, matching the filename minus the ID>
Update trigger: <the real-world event that should cause an edit>
Last updated: <YYYY-MM-DD>
-->
```

No YAML block. `_KNOWLEDGE/` is not rendered by Quartz.

### Numbering and filenames

Pick the next free number by scanning the type folder and its `completed/`
subfolder. Never reuse a retired number.

The filename is `<ID>-<Name>.md`, where Name is a short PascalCase label
of one to three words that tells you what the doc is about without opening
it: `OPER-001-CloudflareDeploy.md`, `ARCH-002-SourceControl.md`,
`TD-001-StaleMirror.md`. Prefer the subject over the verb, and drop words the
prefix already says ("Runbook", "Debt", "Architecture"). The Human id in the
frontmatter is the same Name in kebab case (`cloudflare-deploy`).

### Truthfulness

Keep planned, built, verified and deployed distinct, and say which one a
claim is in. "Built and verified locally; not yet deployed" is a good
sentence. A doc that blurs these is wrong even when each fact is true.

### Superseding

Never delete a superseded instance. Set its status to `superseded`, add a
one-line banner under the frontmatter pointing at the successor, and link
back from the successor.

### Changelog

Every instance ends with `## Changelog`, newest first:
`- YYYY-MM-DD: what changed and why`.

### Formatting

The repo root `CLAUDE.md` rules apply: no section symbol, no em dashes, and
diagram captions inside the SVG.

## Adding a definition

Add a file here named for the type in the singular (`Story.md`), add a row to
the table above, and create its instance folder under `_KNOWLEDGE/`.

## Changelog

- 2026-10-14: Created with Story, Architecture, Document and Diagram, adapted from the Serennovas `knowledge/_definitions/` and the earlier contracts in `_KNOWLEDGE/_definitions/`.
