---
title: Project Status
tags:
  - meta
  - status
draft: false
---
<!--
Purpose: Transient snapshot of recent changes and current focus. Not a planning surface — that's Stories/ROADMAP.md.
Status: working
Owner: zo
Update trigger: weekly, or when a milestone closes or opens
Last updated: 2026-10-14
-->

# Project Status

## Current focus

- Operating and iterating on the published docs surface; choose the next milestone on [`ROADMAP`](./Stories/ROADMAP.md).

## Recent changes

- 2026-05-04 — Repo seeded; Quartz 4 site scaffolded under `site/`; doc taxonomy adopted from the Serennovas pattern (core categories: ARCH, M/RM, OPER, TD, ROADMAP).
- 2026-05-04 — `zowilliams.github.io` (the `resume-content` React app) subsumed into `resumeContent/`; its standalone `.git` was removed.
- 2026-05-04 — Monorepo `git init`'d on `main`; first commit captures the Quartz scaffold and content taxonomy.
- 2026-05-04 — Quartz configured: `pageTitle` set (now "Alonzo's Anthologies"), analytics disabled, footer link pointed at the Zo GitHub.
- 2026-05-05 — M-001 closed: `baseUrl` → `alonzo-anthologies.pages.dev`, footer → monorepo URL, combined `build.sh` restored; see [`completed M-001`](./Stories/completed/M-001-quartz-go-live.md).
- 2026-05-04 — First canonical artifacts seeded: [`ARCH-001`](./Architecture/ARCH-001-platform-overview.md), M-001 (now [`closed`](./Stories/completed/M-001-quartz-go-live.md)), and the first three outcomes on [`ROADMAP`](./Stories/ROADMAP.md).
- 2026-05-04 — Host decided (**Cloudflare Pages**); `resume-content` mounted at `/resume`; combined `build.sh` produces `site/public/` with both apps. Runbook: [`OPER-001`](./Documents/Operations/OPER-001-cloudflare-pages-deploy.md). Workspace tooling deferred per `ARCH-001`.
- 2026-05-04: Pushed `main` to the GitHub backup remote.
- 2026-10-14: Canonical remote is GitLab, [`awilliams9293/alonzo-anthologies`](https://gitlab.com/awilliams9293/alonzo-anthologies). The GitHub repo stays as the `github` backup remote. Site footer points at GitLab.

## Up next

- If Cloudflare Pages still watches the GitHub backup, re-point it at [`awilliams9293/alonzo-anthologies`](https://gitlab.com/awilliams9293/alonzo-anthologies) per [`OPER-001`](./Documents/Operations/OPER-001-cloudflare-pages-deploy.md). Verify **`https://alonzo-anthologies.pages.dev`** after the next deploy from `main`.
- Optionally retire or redirect the legacy `developerzo.github.io/zowilliams.github.io` deploy when convenient.
