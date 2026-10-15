---
title: ARCH-001 Platform overview
tags:
  - architecture
  - platform
draft: false
---
<!--
Purpose: Anchor doc describing the Alonzo's Anthologies monorepo shape — what lives under it, how the pieces relate, and where canonical documentation lives.
Status: canonical
Owner: zo
Update trigger: when a top-level project is added, removed, or its role changes; when the doc-rendering pipeline changes
Last updated: 2026-05-05
-->

# ARCH-001 Platform overview

## Problem and scope

Alonzo's Anthologies is a monorepo intended to host every Zo-owned project under a single root, with one canonical documentation surface in front of all of them. Before this doc, projects lived in separate repos with no shared planning surface and no shared taxonomy for architecture decisions, milestones, or operational runbooks.

In scope: top-level monorepo shape, the docs pipeline (Quartz 4), the relationship between the docs surface and the projects it documents, and the rules for adding new projects.

Out of scope: the internal architecture of any individual project (those get their own `ARCH-###` artifacts), host-specific runbooks (see [`OPER-001`](../Documents/Operations/OPER-001-cloudflare-pages-deploy.md); milestone [`M-001`](../Stories/completed/M-001-quartz-go-live.md) closed 2026-05-05), and CI/release tooling (deferred until a second project is under the roof).

## Constraints

- **Single planning surface.** All milestones and roadmap state live under [`site/content/`](../). No competing planning docs in app subfolders.
- **Node 22+.** Quartz 4 requires it. This is the floor for any tooling at the monorepo root.
- **No tracked secrets.** Apps that need credentials read from local env files or a host-side secret store; nothing under `.env*` is tracked.
- **Doc taxonomy is fixed.** `ARCH-###`, `M-###` / `RM-###`, `OPER-###`, `TD-###`, plus the single `ROADMAP.md`. Definitions live in [`_definitions/`](../_definitions/) and are the authoring contract.

## System context

```
┌─────────────────────────── Alonzo's Anthologies (monorepo) ───────────────────────────┐
│                                                                                       │
│   site/         ← Quartz 4 site. Builds site/content/ to a static doc surface.    │
│   ├── content/    ← canonical docs (ARCH/M/RM/OPER/TD/ROADMAP)                        │
│   ├── quartz/     ← Quartz framework (vendored)                                       │
│   └── public/     ← build output (gitignored)                                         │
│                                                                                       │
│   resumeContent/     ← CRA interactive resume (npm `resume-content`; migrated from a standalone repo). │
│                     Subsumed into the monorepo (its standalone .git was removed).     │
│                                                                                       │
│   <future>/       ← additional Zo-owned projects, added under their own folders.      │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

External-facing surfaces:

- **The docs site** (Quartz output of `site/content/`) — the public-facing canonical reference for every project under this roof.
- **The `resumeContent/` app** — also staged at **`/resume`** on the Cloudflare Pages deploy of this monorepo (see closed [`M-001`](../Stories/completed/M-001-quartz-go-live.md)). An older standalone deploy may still exist until retired.

## Components and interfaces

| Component | Lives in | Role | Owns |
|---|---|---|---|
| Public content | `site/content/` | Authoring source for the static site | Published writing and its diagrams |
| Project docs | `_KNOWLEDGE/` | Not rendered | All canonical project docs and the taxonomy (moved here 2026-10-14) |
| Quartz | `site/quartz/`, `site/quartz.config.ts`, `site/quartz.layout.ts` | Static-site generator | Build pipeline, theme, plugin set |
| `resume-content` | `resumeContent/` | Interactive resume SPA (CRA) | Its own UI, routes, build via `resumeContent/` |

The doc surface and the apps are decoupled: the apps don't import from `site/`, and `site/` doesn't read from app sources. The link between them is editorial — milestone artifacts under `_KNOWLEDGE/Stories/` reference work that happens in app folders, and the roadmap orders that work.

There is no shared workspace tooling yet (no npm workspaces, no pnpm, no Turborepo). Each top-level folder has its own `package.json` and `node_modules/`. Adding workspace tooling is a deferred decision (see Tradeoffs).

## Data and control flow

**Authoring → published docs:**

1. An author edits a markdown file under `site/content/` (or adds a new `ARCH-###` / `M-###` / etc. per its definition).
2. `npx quartz build` (run locally or by the deploy host) reads `content/`, applies the configured plugins, and emits a static site to `site/public/`.
3. The host serves `site/public/`. Production: **Cloudflare Pages** at `https://alonzo-anthologies.pages.dev` (see [`OPER-001`](../Documents/Operations/OPER-001-cloudflare-pages-deploy.md)).

**Local dev loop:**

```
cd site
npx quartz build --serve     # serves on http://localhost:8080 with live reload
```

**Project work (e.g. `resumeContent/`):** orthogonal to the docs pipeline. Each app has its own scripts; nothing in `site/` blocks or is blocked by app builds.

## Tradeoffs and risks

- **Vendored Quartz vs. dependency.** Quartz is layered into `site/` rather than installed as an npm dependency, because that's its supported usage model (per its own docs). Tradeoff: upgrades require re-running the setup script and reconciling our local `quartz.config.ts` / `quartz.layout.ts` edits. Mitigation: keep our edits to those two files surgical, and review Quartz changelog before re-running setup.
- **No workspace tooling yet.** With only `site/` and `resumeContent/`, the cost of npm workspaces / Turborepo isn't justified. Risk: as more projects land, dependency duplication and CI churn grow. Revisit when the third project is under the roof or when CI lands.
- **Legacy resume URL.** The old standalone resume site may still serve an older deploy until redirected or retired. Canonical public Zo documentation URL: **`https://alonzo-anthologies.pages.dev`**. Mitigation: prefer linking the monorepo docs site; retire or redirect the legacy deploy when convenient.
- **Doc rot.** The taxonomy is only useful if artifacts are kept current. Mitigation: every doc carries a `Last updated` and `Update trigger` in its frontmatter; the roadmap's review cadence is documented in [`ROADMAP.md`](../Stories/ROADMAP.md).

## Verification plan

- **Local build passes.** `cd site && npx quartz build` exits 0 and emits `site/public/`. Verified at the time of writing this doc (17 input files, 63 emitted).
- **Doc surface renders.** `npx quartz build --serve` serves the site at `http://localhost:8080` with the updated `pageTitle` ("Alonzo's Anthologies") and the configured footer.
- **Taxonomy holds.** Every artifact under `_KNOWLEDGE/Architecture/`, `_KNOWLEDGE/Stories/`, and `_KNOWLEDGE/Documents/` matches the contract in its respective `_KNOWLEDGE/_definitions/*.md` file.
- **Roadmap is the only planning surface.** A periodic check confirms no competing roadmap-like docs exist outside `_KNOWLEDGE/Stories/ROADMAP.md`.
