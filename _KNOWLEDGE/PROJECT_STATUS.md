---
title: Project Status
tags:
  - meta
  - status
draft: false
---
<!--
Purpose: Transient snapshot of recent changes and current focus. Not a planning surface: that's Stories/ROADMAP.md.
Status: working
Owner: zo
Update trigger: weekly, or when a milestone closes or opens
Last updated: 2026-10-14
-->

# Project Status

## Current focus

- Operating and iterating on the published docs surface; choose the next milestone on [`ROADMAP`](./Stories/ROADMAP.md).

## Recent changes

- 2026-05-04: Repo seeded; Quartz 4 site scaffolded under `site/`; doc taxonomy adopted from the Serennovas pattern (core categories: ARCH, M/RM, OPER, TD, ROADMAP).
- 2026-05-04: The standalone `resume-content` React app subsumed into `resumeContent/`; its standalone `.git` was removed.
- 2026-05-04: Monorepo `git init`'d on `main`; first commit captures the Quartz scaffold and content taxonomy.
- 2026-05-04: Quartz configured: `pageTitle` set (now "Alonzo's Anthologies"), analytics disabled, footer link set.
- 2026-05-05: ST-001 closed: `baseUrl` → `alonzo-anthologies.pages.dev`, footer → monorepo URL, combined `build.sh` restored; see [`completed ST-001`](./Stories/completed/ST-001-QuartzGoLive.md).
- 2026-05-04: First canonical artifacts seeded: [`ARCH-001`](./Architecture/ARCH-001-PlatformOverview.md), ST-001 (now [`closed`](./Stories/completed/ST-001-QuartzGoLive.md)), and the first three outcomes on [`ROADMAP`](./Stories/ROADMAP.md).
- 2026-05-04: Host decided (**Cloudflare Pages**); `resume-content` mounted at `/resume`; combined `build.sh` produces `site/public/` with both apps. Runbook: [`OPER-001`](./Documents/Operations/OPER-001-CloudflareDeploy.md). Workspace tooling deferred per `ARCH-001`.
- 2026-10-14 (evening): Rebrand to Alonzo's Anthologies and `garden/` to `site/` rename shipped (commits 445ece0, c6dadfe) from GitLab, which was briefly the only code host. Superseded later the same night, see the next entry.
- 2026-10-14 (late evening): **GitHub is the only code host.** Owner decision: there was no specific reason for the GitLab move, and GitHub suits Claude Code and the job search. The GitHub repo was renamed `Zo-Garden-eCafe` to [`DeveloperZo/alonzo-anthologies`](https://github.com/DeveloperZo/alonzo-anthologies) (public, same repo id, old URL redirects); local `origin` is GitHub, `gitlab` is kept as a read-only remote. The GitLab project is archived. The Cloudflare Pages project `alonzo-anthologies` was deleted and recreated from GitHub with the same settings; production `c7455b17` (c6dadfe) went live at 23:48 local after about 3 minutes down. Re-verified the same night: `/`, `/resume/`, `/ai-governance/` return 200, site name "Alonzo's Anthologies", sitemap on `alonzo-anthologies.pages.dev`. The legacy `zo-garden` project, connected to the same repo, also built c6dadfe and now serves a duplicate of the site. Logged in [`Operations/log.md`](./Documents/Operations/log.md); architecture in [`ARCH-002`](./Architecture/ARCH-002-SourceControl.md) and [`ARCH-003`](./Architecture/ARCH-003-Hosting.md).

## Up next

- Commit and push the `_KNOWLEDGE/` docs and the staged resume data edits to GitHub `main` ([`OPER-002`](./Documents/Operations/OPER-002-GitHubPush.md)). That push is also the first push-triggered build of the recreated Pages project: confirm the "Cloudflare Pages: alonzo-anthologies" check passes and the live site still returns 200 ([`OPER-001`](./Documents/Operations/OPER-001-CloudflareDeploy.md)).
- Retire the duplicate `zo-garden.pages.dev` ([`ST-004`](./Stories/ST-004-OneHostname.md)).
- Add GitHub Actions CI and protect `main` ([`ST-007`](./Stories/ST-007-GitHubCi.md)).
- Remove the `gitlab` remote and stray local branches ([`ST-005`](./Stories/ST-005-RetireGitLab.md)); narrow the Cloudflare token ([`ST-006`](./Stories/ST-006-ScopedToken.md)).
- The site footer link in `site/quartz.layout.ts` still points at GitLab; it needs a code change to point at GitHub.
- Optionally retire or redirect the old standalone resume deploy when convenient.
