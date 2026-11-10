---
name: resume-tailor
description: >-
  Tailor a resume or cover letter for one job without inventing titles, scope,
  or outcomes. Use when editing resumeContent/src/data/tailoring, quest or
  profile wording, a cover letter under coverLetters/, or when building or
  reviewing an application package with apply:package.
---

# Resume tailor

The base resume is the only source of facts. An overlay may reorder bullets and may reword a sentence. It may not add a title, a duration, a scope, or an outcome the base text does not already state.

## Source of facts

Read these before writing a word:

- `resumeContent/src/data/profile.data.ts`: the base summary and the base competencies.
- `resumeContent/src/data/quests.data.tsx`: `baseQuests`. Job titles are `workTitle` and `roles`. Bullets are `accomplishments`. A tag is a tag on that quest, not a license to add an outcome.
- The printed default is that data with no `REACT_APP_TAILORING`.

A job posting is a target, not a fact. A title, certification, or stack from the posting stays off the page unless the base resume already states it.

## What an overlay may change

Files live in `resumeContent/src/data/tailoring/<id>.ts`. The shape is `types.ts`.

Allowed:

- Reorder bullets with `order`.
- Reword a bullet, overview, summary, or competency only when every claim in the new sentence is already stated for that same item.
- Name a tag in a sentence for that same quest when the tag is already on the quest and the sentence adds no outcome.

Forbidden:

- Do not set `profile.targetRole`. The resume prints it with no label under the person's name, so it reads as their title. Do not print any title they do not hold. Their titles are the `workTitle` values. `role` on the overlay is the job being applied for, and nothing prints it.
- Do not change `workTitle`.
- Do not attach a scope to a span of time the base does not attach. A decade in software architecture is not a decade in healthcare.
- Do not turn one engagement into the whole job, and do not pluralize a singular noun to widen it.
- Do not add a verb, audience, or outcome the base sentence does not state.
- Do not move a learning onto the summary or a competency and present it as the claim.
- Do not delete a fact the person did not tell you to remove. When they tell you to remove a clause, remove that clause and stop. Do not replace it with a new claim.
- Putting a bullet last does not remove it. The resume prints every bullet. If a claim must not print, stop and say so.

## Cover letter

`coverLetters/<id>/` follows the same rule. Immediate Actions is future work in the role, not a past title and not a past result. Do not retitle a past job. Do not write the job they are applying for as a line that reads as a title they hold. A year on a timeline must match the quest dates.

## Before you say it is done

A successful build is not a check. After `npm run apply:package -- <id>`, read the text of `applications/<id>/package/resume.pdf`. Do not treat the TypeScript as the printed page.

Confirm all of these from the PDF, and quote the lines:

- The phrase you removed is absent.
- The replacement sentence is present.
- No title sits under the name.
- A page does not end on a job title or a section heading. The title and the company line under it are on the same page.

If you cannot read the PDF, say the change is unverified.

## Examples

Bad: the posting is Head of Engineering, so `targetRole` is "Head of Engineering".
Good: leave `targetRole` unset. The quest title stays "Manager, Experience Platform".

Bad: "over a decade of experience in software architecture and engineering leadership on healthcare platforms" when healthcare is some of the jobs in that decade.
Good: "over a decade of experience in software architecture and engineering leadership."

Bad: the person says to remove "including several I had not worked in before," and the bullet keeps the clause or swaps in a new claim.
Good: "Owned the architecture on every engagement in whatever stack the client ran."
