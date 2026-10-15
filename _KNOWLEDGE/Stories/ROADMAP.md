---
title: Roadmap
tags:
  - roadmap
draft: false
---
<!--
Purpose: Single canonical planning surface for the Alonzo's Anthologies monorepo. Roadmap progress = Story progress.
Status: canonical
Owner: zo
Update trigger: when a Story is opened, closed, or re-sequenced; when an outcome is added or retired
Last updated: 2026-10-14
-->

# Roadmap

The single planning surface for the Alonzo's Anthologies monorepo. Every Story has a row here. Definition: [`Story`](../../_META/Definitions/Story.md). Index: [`README`](./README.md).

## Outcomes

The durable goals the Stories serve. Edit when a goal is reached, retired, or added.

- **One canonical public surface for Zo's work.** Zo's public writing and the interactive resume are served from one site, at one hostname (`alonzo-anthologies.pages.dev`), and it is the first thing someone sees when they look up Zo's work. Project docs stay in `_KNOWLEDGE/`, out of the published site.
- **One roof for Zo's projects.** The monorepo, hosted on GitHub only (`DeveloperZo/alonzo-anthologies`, since 2026-10-14), is the single home for current and future Zo-owned projects, with the doc taxonomy giving them a shared shape (`ARCH-###`, `ST-###`, `OPER-###`, `TD-###`, `DIA-###`).
- **A planning surface that holds.** This roadmap, and the Stories it orders, stay current: review cadence is kept, and stale Stories are closed or re-scoped rather than left to drift.

## Now (active)

| ID | Title | Owner | State |
|---|---|---|---|
| [ST-005](./ST-005-RetireGitLab.md) | GitHub is the only code home | zo | Active since 2026-10-14. GitLab archived, `origin` is GitHub, Cloudflare builds only from GitHub (all met tonight). Next: footer source link to GitHub, remove the `gitlab` remote and merged local branches (with Zo's agreement), record whether to delete the archived GitLab project. |
| [ST-002](./ST-002-ContentSeeds.md) | First content seeds live | zo | Active since 2026-05-04 and stale. Met in substance but never closed: project docs are out of `site/content/`, and `/resume/` and `/ai-governance/` are live (200 on 2026-10-14). The Thinking in Systems seed it names was deleted on 2026-05-05 (91c5e5b) and the AI governance series took its place. Next: closure review (strike or replace that criterion, add evidence, move to `completed/`). |

## Next

Ordered by risk, highest first.

| ID | Title | Fixes | Depends on |
|---|---|---|---|
| [ST-006](./ST-006-ScopedToken.md) | Least-privilege Cloudflare access | [TD-004](../Documents/Technical-Debt/TD-004-BroadCloudflareToken.md) | None |
| [ST-004](./ST-004-OneHostname.md) | One public hostname | [TD-002](../Documents/Technical-Debt/TD-002-DuplicatePages.md) | ST-006 (read token for checks) |
| [ST-009](./ST-009-ResumeGuard.md) | Production never ships without the resume | [TD-007](../Documents/Technical-Debt/TD-007-SilentResumeSkip.md) | None |
| [ST-007](./ST-007-GitHubCi.md) | Broken builds and leaked keys caught before main | [TD-003](../Documents/Technical-Debt/TD-003-NoCi.md) | `gh auth login` for the API checks |
| [ST-008](./ST-008-TextPdf.md) | Resume PDF that machines can read | [TD-005](../Documents/Technical-Debt/TD-005-RasterPdf.md) | None |

## Later

| ID | Title | Fixes | Notes |
|---|---|---|---|
| [ST-011](./ST-011-BuildCleanup.md) | Build files say only what is true | ARCH-004 and ARCH-005 Change Map rows | Do before ST-010 so dead scripts stay out of its patch list. Root loose files out of scope. |
| [ST-010](./ST-010-QuartzUpgrade.md) | Quartz can be upgraded without breaking the resume | [TD-006](../Documents/Technical-Debt/TD-006-QuartzPatches.md) | After ST-009 and ST-011; easier once ST-007 runs the build in CI. |

## Completed

| ID | Title | Closed |
|---|---|---|
| [ST-001](./completed/ST-001-QuartzGoLive.md) | Quartz site goes live publicly | 2026-05-05 |
| [ST-003](./completed/ST-003-ResumeLive.md) | Interactive resume live at /resume | 2026-05-04 |

## Risks

| Risk | Linked TD | Mitigation |
|---|---|---|
| The broad Cloudflare token leaks or is misused; it can change DNS and registered domains | [TD-004](../Documents/Technical-Debt/TD-004-BroadCloudflareToken.md) | ST-006 |
| `zo-garden.pages.dev` builds every push from the same GitHub repo and serves a duplicate of the site, splitting links and search results | [TD-002](../Documents/Technical-Debt/TD-002-DuplicatePages.md) | ST-004 |
| Production has no rollback target: `c7455b17` is the only deployment on the recreated `alonzo-anthologies` project | None | Fix forward with `git revert` (OPER-001); resolves itself at the next production deploy |
| A production build deploys without `/resume`, and the resume links 404 | [TD-007](../Documents/Technical-Debt/TD-007-SilentResumeSkip.md) | ST-009 |
| A broken build or a committed key is only found after it is on public `main`, which has no branch protection | [TD-003](../Documents/Technical-Debt/TD-003-NoCi.md) | ST-007 |
| Recruiters' tools cannot read the resume PDF | [TD-005](../Documents/Technical-Debt/TD-005-RasterPdf.md) | ST-008 |
| A Quartz refresh overwrites the local patches and breaks `/resume` or the build | [TD-006](../Documents/Technical-Debt/TD-006-QuartzPatches.md) | ST-010; until then, do not run `site/setup-quartz.ps1` |

## Review cadence

This doc is reviewed when a Story opens or closes, and at minimum every two weeks.
