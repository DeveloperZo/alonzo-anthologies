# Story

<!--
Purpose: Definition of a Story: one unit of build work with a beneficiary and testable acceptance criteria.
Status: working
Owner: zo
Human id: definition-story
Update trigger: when the Story sections, statuses, kinds or lifecycle change
Last updated: 2026-10-14
-->

## What a Story is

A unit of work that changes something a person can notice, written so that
"done" is checkable. Every Story names who benefits and how we will know it
landed.

Use a Story when there is work to build. Use an [Architecture](./Architecture.md)
doc for rules that outlast any one piece of work, and a
[Document](./Document.md) for reference material.

## ID

`ST-###`, so the ID always matches the definition it belongs to.

## Where it lives

- Planned and active: `_KNOWLEDGE/Stories/`.
- Completed: `_KNOWLEDGE/Stories/completed/`.
- Sequencing: `_KNOWLEDGE/Stories/ROADMAP.md` is the single planning surface. Every Story has a row there.

## Sections, in order

1. **Summary.** Two to four plain sentences, under about 80 words: what is true today, what will be different, and why it matters now. No IDs, paths or jargon. Rewrite in the past tense when done.
2. **User story.** `**As a** <role>, **I want** <capability>, **so that** <benefit>.` Use a real role (reader, recruiter, visitor, Zo as author, Zo as operator), never "a user" or "the system". One or two stories; a third role usually means two Stories.
3. **Status.** Current status, the one next step or blocker, and the date.
4. **Acceptance criteria.** Numbered `AC-1`, `AC-2`. Each is pass or fail and checkable by someone else. Observable behaviour first, technical checks after. State deployment explicitly: "builds locally" and "live at the public URL" are different criteria. Never renumber; strike through a dropped one and say why.
5. **Scope.** What is being built or changed. Technical language is fine.
6. **Out of scope.** What a reasonable reader might assume is included but is not.
7. **Additional information.** Only the subsections that have content, in this order: Dependencies, Technical details, Decisions (dated), Delivery plan, Evidence (per criterion), Risks and open questions.
8. **Changelog.**

## Title

`# <ID> <Outcome in a few words>`. Name the outcome, not the mechanism:
"Resume shows real side projects", not "Replace quests 8 and 9 data".

## Statuses

`planned`, `active`, `completed`. These are the states the roadmap tracks
(Next and Later, Now, Completed) and the ones existing Stories use. Record a
blocker in the Status section's next-step line, not as a status. Keep the
Status section and the frontmatter `Status:` line in step.

## Definition of done

A Story moves to `completed/` when:

1. Every acceptance criterion is met and Evidence points at proof for each.
2. The Summary is rewritten in the past tense.
3. Status reads `completed` in both places, with the date.
4. The ROADMAP row points at the `completed/` path.

## Template

```markdown
# ST-### <Outcome in a few words>

<!--
Purpose: <one sentence>
Status: planned
Owner: zo
Human id: <slug>
Update trigger: when scope, status or acceptance criteria change
Last updated: <YYYY-MM-DD>
-->

## Summary

<Two to four plain sentences.>

## User story

**As a** <role>, **I want** <capability>, **so that** <benefit>.

## Status

- Current: `planned`
- Next: <one line>
- Last updated: `<YYYY-MM-DD>`

## Acceptance criteria

- **AC-1** Given <situation>, when <action>, then <observable result>.
- **AC-2** <technical check, and how it is verified>.

## Scope

- <what is built or changed>

## Out of scope

- <what is not, and where it lives instead>

## Additional information

### Dependencies

- <what must land first>

### Evidence

- **AC-1**: <commit, build output, URL, screenshot>

## Changelog

- <YYYY-MM-DD>: Created.
```

## Changelog

- 2026-10-14: Removed the retroactive kind and the Serennovas-only statuses (`in_progress`, `blocked`, `deferred`, `superseded`); neither had any instance or use in this repo. Statuses are now the three the roadmap and existing Stories use.
- 2026-10-14: IDs changed from `M-###` to `ST-###`, so a Story's ID matches its definition.
- 2026-10-14: Created from the earlier `milestone.md` contract (IDs, `completed/`, roadmap) and the Serennovas milestone definition (section order, user story, numbered acceptance criteria, definition of done). Serennovas board linkage and founder action items were not carried over.
