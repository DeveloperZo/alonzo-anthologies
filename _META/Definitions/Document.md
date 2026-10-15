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
another definition owns (`ST`, `ARCH`, `DIA`).

| Kind | ID | Folder | Use it for |
| --- | --- | --- | --- |
| Brief | `BRIEF-###` | `Documents/Briefs/` | Work scoped in Cowork for execution in Claude Code |
| Runbook | `OPER-###` | `Documents/Operations/` | Steps to deploy, verify or recover something, with the commands |
| Technical debt | `TD-###` | `Documents/Technical-Debt/` | A known shortcut or risk, and what would remediate it |
| Video script | `VID-###` | `Documents/Videos/` | Short-form and long-form video scripts |

All folders are under `_KNOWLEDGE/`. Numbering is per prefix.

## Sections

Every kind carries the frontmatter block and ends with `## Changelog`. The
body is set by the kind. Each kind's sections below are the contract this
repo already used for it (from `_KNOWLEDGE/_definitions/`, or from the one
existing instance where there was no contract), not new ones.

### Brief

Grounded in the one existing brief. Opens with a line saying where it was
authored and when ("Authored in Cowork, for execution in Claude Code.
Written YYYY-MM-DD."). Then:

- **Goal.** What the work should achieve, and what it explicitly is not.
- **Current state, and why this is worth doing.**
- The body: whatever the work needs settled (gaps, evidence, candidates, sequence).
- **Open questions for Zo.**

### Runbook (`OPER`)

From the earlier operations contract:

- **Modes and prerequisites.** The state the system must be in; the credentials, tools or flags required.
- **Procedure.** Numbered, copy-pastable steps with exact commands.
- **Verification checks.** How to know each step worked: expected output, URLs, log lines.
- **Troubleshooting and fallback.** What to do when a step fails, including rollback.
- **Ownership and references.** The Stories, Architecture docs and TD items it relates to.

Add an entry to `Documents/Operations/index.md` when a runbook is created,
and a line to `Documents/Operations/log.md` each time it is run in earnest.
Reusable scripts go in `Documents/Operations/scripts/`.

### Technical debt (`TD`)

From the earlier technical-debt contract:

- **Current impact.** What concretely breaks, slows down or is put at risk today.
- **Root cause.** The structural reason the debt exists.
- **Remediation.** The Story that will fix it, or "unplanned".
- **Acceptance criteria.** What specifically counts as fixed.
- **Evidence and status.** Current verification.

Status is `open` until the remediating Story ships, then `completed`, and
the file moves to `Documents/Technical-Debt/completed/`. These mirror the
Story statuses and the `completed/` folder.

### Video script (`VID`)

From the earlier video contract. The script is the authored intent before
recording, not a transcript.

The comment block adds four fields after `Purpose`: `Format: short | long`,
`Platform: youtube-shorts | tiktok | reels | youtube | multi`,
`Source: <the site page it draws from>`, `Duration target: <e.g. 90 sec>`.
The format goes in this field, never in the filename.

All videos:

- **Concept.** One paragraph: what it is about and the one idea it lands on.
- **Platform and format.** Host, format, aspect ratio, caption or platform constraints.
- **Source material.** Links to the site pages it draws from. No claims outside them.
- **Script.** Spoken words with time codes, in this block shape:

  ```
  [MM:SS-MM:SS | SECTION LABEL]
  [B-ROLL: what the viewer sees]
  [ON SCREEN: text, stat, or graphic]
  SPEAKER: The words spoken aloud.
  ```

Short-form adds **Hook** (first 5 to 10 seconds: one question, contradiction
or number that stops a scroll) and **CTA** (a specific URL, page or video;
"follow for more" is not a CTA).

Long-form adds **Chapters** (timestamp, chapter title, source doc) and
**Production notes** (thumbnail concept, YouTube description, tags,
recording notes).

Script conventions:

- Write to be spoken. Contractions and short sentences are correct.
- One idea per short. Each long-form chapter resolves to one takeaway.
- Ground every technical term with one plain sentence the first time it appears.
- Ground every claim in the source material, or annotate it.
- Commit to a claim or cut it; no hedging stacks.
- Anything easier to show than say gets an `[ON SCREEN: ...]` cue, citing the `DIA` ID where a diagram exists.

## Statuses

`draft`, `working`, `canonical`, `superseded`, `archived`. Technical debt
uses `open` and `completed` instead.

## Template

```markdown
# <PREFIX>-### <Title>

<!--
Purpose: <one sentence>
Status: draft
Owner: zo
Human id: <name in kebab case>
Update trigger: <the real-world event that should cause an edit>
Last updated: <YYYY-MM-DD>
-->

<Sections for this kind, from above.>

## Changelog

- <YYYY-MM-DD>: Created.
```


## Changelog

- 2026-10-14: Replaced the invented per-kind sections (and the shared Scope and Related sections) with the contracts this repo already had: runbook, technical debt and video from `_KNOWLEDGE/_definitions/`, brief from the existing brief. TD statuses set to `open` and `completed`.
- 2026-10-14: Each kind keeps its own prefix (BRIEF, OPER, TD, VID) so the kind is visible from the filename. Replaces the single `DOC-###` ID with a `Kind:` line drafted earlier the same day. Briefs are now numbered; the existing unnumbered brief takes `BRIEF-001` when next touched.
