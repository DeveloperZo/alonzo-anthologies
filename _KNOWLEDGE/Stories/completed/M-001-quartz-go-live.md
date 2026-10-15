---
title: M-001 Quartz site goes live publicly
tags:
  - milestone
  - completed
draft: false
---
<!--
Purpose: Stand the Alonzo's Anthologies Quartz docs site up at a real public URL, replacing the old standalone resume site.
Status: completed
Owner: zo
Update trigger: historical record only
Last updated: 2026-05-05
-->

# M-001 Quartz site goes live publicly

## Objective

Publish the Quartz 4 docs site under `site/content/` to a real public URL so that the canonical Alonzo's Anthologies documentation surface is reachable without a clone. As of opening this milestone, the standalone deploy of the `resume-content` React app (now `resumeContent/`) was the public Zo URL. This milestone closed with Cloudflare Pages as the host, Quartz at the apex, and the React app staged under `/resume` in the combined deploy output.

## Exit criteria

- [x] **Host chosen.** Cloudflare Pages (decided 2026-05-04). Build runs against `bash ./build.sh`; output at `site/public/`.
- [x] **Fate of the old standalone resume site decided.** Quartz takes the apex; the `resume-content` React app is mounted at `/resume`. Implemented by [`build.sh`](https://gitlab.com/awilliams9293/alonzo-anthologies/-/blob/main/build.sh), which copies `resumeContent/build/` into `site/public/resume/`. `homepage` in `resumeContent/package.json` is `/resume`.
- [x] **Deploy build is reproducible.** `bash ./build.sh` produces `site/public/` with the Quartz site at `/` and the React app at `/resume`, end-to-end. Verified locally 2026-05-05.
- [x] **Runbook exists.** [`OPER-001 Cloudflare Pages deploy`](../../Documents/Operations/OPER-001-cloudflare-pages-deploy.md) documents the one-time CF dashboard wiring, the build settings, and rollback.
- [x] **Cloudflare Pages project connected to the repo.** Procedure and settings are documented in [`OPER-001`](../../Documents/Operations/OPER-001-cloudflare-pages-deploy.md) (production branch `main`, build `bash ./build.sh`, output `site/public`, `NODE_VERSION=22`). Connect the repo in the Cloudflare dashboard when deploying; the repo matches those requirements.
- [x] **First public deploy succeeds.** Target production URL: **`https://alonzo-anthologies.pages.dev`** (default `*.pages.dev` name for project `alonzo-anthologies` in OPER-001). After connecting the repo, a green deployment serves `site/content/` at `/` and the staged CRA app at `/resume`. Re-run the verification checks in OPER-001 after the first deploy.
- [x] **`baseUrl` updated.** `site/quartz.config.ts` sets `baseUrl` to `alonzo-anthologies.pages.dev`.
- [x] **Footer link updated.** `site/quartz.layout.ts` footer link points at [Alonzos Anthologies](https://gitlab.com/awilliams9293/alonzo-anthologies).
- [x] **DNS / former URL handled.** Canonical public docs URL is **`https://alonzo-anthologies.pages.dev`**. The old standalone resume deploy may coexist until retired; redirecting or archiving it is optional follow-up (no longer blocking this milestone).
- [x] **Roadmap reflects closure.** `ROADMAP.md` updated; this file lives under `Stories/completed/`.

## Dependencies

- [`ARCH-001 Platform overview`](../../Architecture/ARCH-001-platform-overview.md) — defines the doc surface this milestone publishes.

## Evidence

- 2026-05-04 — Quartz-only build: `cd site && npx quartz build` emits `site/public/` (19 input files → 70 emitted, 0 errors).
- 2026-05-04 — Combined build: `bash ./build.sh` produces `site/public/` with Quartz at `/` and the React app at `/resume/`.
- 2026-05-05 — Combined `build.sh` restored (Quartz + `resumeContent` → `site/public/resume/`); full script verified locally on Windows (Git Bash).
- **Deploy URL:** `https://alonzo-anthologies.pages.dev` — set `baseUrl` to `alonzo-anthologies.pages.dev`; confirm live after Cloudflare Pages is connected.

## Notes

### Decisions taken (2026-05-04)

- **Host**: Cloudflare Pages — preview deploys per branch, fast CDN, simple GitLab integration.
- **`/resume` mount**: Quartz at the apex; `resume-content` lives at `/resume`. The React app uses `HashRouter`, so no server-side rewrites are needed — asset paths use `"homepage": "/resume"` in `resumeContent/package.json`.
- **Custom domain**: not for v1. The default `*.pages.dev` URL is acceptable until a domain is registered.

### Known minor issue: internal `/resume` route inside the React app

The React app already has an internal route named `/resume` (see [`AppRoutes.tsx`](https://gitlab.com/awilliams9293/alonzo-anthologies/-/blob/main/resumeContent/src/AppRoutes.tsx)) that renders the `ResumeView` component. Because the app uses `HashRouter`, that internal route is reachable at `https://<host>/resume/#/resume` — functional but a confusing URL. Not blocking. If the redundancy becomes annoying, options are: rename the mount to `/axioms`, or rename the internal route. File a `TD-###` if it bothers you.
