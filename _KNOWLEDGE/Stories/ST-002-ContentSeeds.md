---
title: ST-002 First content seeds live
tags:
  - milestone
  - active
draft: false
---
<!--
Purpose: Clear project meta from site/content/, establish the site's first two real content pieces, and get them live on alonzo-anthologies.pages.dev.
Status: active
Owner: zo
Update trigger: when an exit criterion flips, when content is published
Last updated: 2026-05-04
-->

# ST-002 First content seeds live

## Objective

The site launched (ST-001) with project management artifacts as its only content — milestones, runbooks, architecture docs. That was a structural mistake. This milestone corrects it: move all project docs out of `site/content/` into a project-docs folder where they drive development without being published, and plant the site's first two real content seeds so that a visitor to `alonzo-anthologies.pages.dev` finds something worth reading.

## Exit criteria

- [ ] **Project meta cleared from `site/content/`.** All milestone, operations, architecture, roadmap, and definition files removed from `site/content/`. Only real content remains.
- [ ] **Resume seed live.** The interactive resume at `alonzo-anthologies.pages.dev/resume/` (built from `resumeContent/`, staged by `build.sh`) — primary surface for Zo’s developer identity alongside the Quartz site.
- [ ] **Thinking in Systems seed live.** `site/content/thinking-in-systems-ai.md` published — structural analysis of the AI market through Donella Meadows' framework.
- [ ] **Both seeds have substance.** Neither is a placeholder. Each has enough real content to be worth a visitor's time.
- [ ] **Roadmap reflects closure.** `ROADMAP.md` updated; this file moves to `Stories/completed/`.

## Dependencies

- ST-001 completed — `alonzo-anthologies.pages.dev` must be live before exit criteria can be verified.
- The old project-docs folder under the site must exist as the destination for displaced project docs (done).

## Evidence

- 2026-05-04 — Project-docs folder created under the site; project docs moved out of `site/content/`.
- 2026-05-04 — `site/content/thinking-in-systems-ai.md` created as an initial seed; resume experience lives in monorepo `resumeContent/` (see [`ST-003`](./completed/ST-003-ResumeLive.md)).
- _Live verification: TBD once content has substance and deploys green._

## Notes

### Decisions taken

- **Two seeds only.** Resume and Thinking in Systems: AI. No folder structure beyond what these two need. The site grows as content grows, not ahead of it.
- **Project docs location.** A project-docs folder under the site, accessible to agents and collaborators for context, not served by Quartz as public content. (Moved to `_KNOWLEDGE/` on 2026-10-14; the decision to keep project docs out of `site/content/` still stands.)
- **Resume approach.** Canonical experience is the CRA SPA in `resumeContent/` (npm `resume-content`), staged at **`/resume`** via `build.sh` ([`ST-003`](./completed/ST-003-ResumeLive.md)). Quartz does not emit a conflicting `/resume` page.
