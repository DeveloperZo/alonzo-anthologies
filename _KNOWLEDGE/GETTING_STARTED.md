---
title: Getting Started
tags:
  - meta
  - onboarding
draft: false
---
<!--
Purpose: Onboard contributors to the Alonzo's Anthologies monorepo and the Quartz 4 site that renders the docs.
Status: working
Owner: zo
Human id: getting-started
Update trigger: when build/run commands, doc conventions, or repo structure change
Last updated: 2026-05-04
-->

# Getting Started

## What this repo is

Alonzo's Anthologies is the monorepo. The Quartz site and the interactive resume live under it, with the canonical documentation surface in `site/`. The doc surface is rendered as a static site by [Quartz 4](https://quartz.jzhao.xyz/).

## Prerequisites

- **Node.js 22+** — Quartz 4 requires Node 22 or later. Use `nvm` if you need to manage multiple versions.
- **npm 10+** (ships with Node 22).
- **Git** for version control.

## First-time setup

From the repo root:

```sh
cd site
npm ci
```

## Running the site locally

```sh
cd site
npx quartz build --serve
```

The site serves on `http://localhost:8080`. Edits to anything under `content/` reload live.

## Building for production

```sh
cd site
npx quartz build
```

Output lands in `site/public/`. Deploy that folder however you ship — GitHub Pages, Cloudflare Pages, Netlify, etc.

## Doc conventions

> **2026-10-14:** project docs now live in `_KNOWLEDGE/`, which Quartz does not render. Public writing stays in `site/content/`. The current rules are in [CONVENTIONS.md](./CONVENTIONS.md): the HTML-comment block is required ([`_definitions/document.md`](./_definitions/document.md)), and the YAML block below is only needed on pages under `site/content/`.

Canonical docs use consistent prefixes and a hybrid frontmatter block (YAML for Quartz, HTML comment for human narrative). See [`_definitions/`](./_definitions/) for the contract on each artifact type.

- **`ARCH-###-descriptor.md`** in [`Architecture/`](./Architecture/) — system shape, problem/scope, constraints, components, tradeoffs, verification plan. Definition: [`_definitions/architecture.md`](./_definitions/architecture.md).
- **`M-###-descriptor.md`** in [`Stories/`](./Stories/) — active or planned build work. Must include objective, exit criteria, dependencies, evidence. When complete, move to [`Stories/completed/`](./Stories/completed/) and update [`Stories/ROADMAP.md`](./Stories/ROADMAP.md). Definition: [`_definitions/milestone.md`](./_definitions/milestone.md).
- **`RM-###-descriptor.md`** in [`Stories/`](./Stories/) — retroactive milestones for work completed before the canonical roadmap existed. Same structure as `M-*`; never moved.
- **`OPER-###-descriptor.md`** in [`Documents/Operations/`](./Documents/Operations/) — runbooks for runtime validation, cutover, release verification. Definition: [`_definitions/operations.md`](./_definitions/operations.md). Update [`Documents/Operations/index.md`](./Documents/Operations/index.md) and [`Documents/Operations/log.md`](./Documents/Operations/log.md) when adding one.
- **`TD-###-descriptor.md`** in [`Documents/Technical-Debt/`](./Documents/Technical-Debt/) — debt items. Definition: [`_definitions/technical-debt.md`](./_definitions/technical-debt.md).
- **`VID-###-descriptor.md`** in `content/<topic>/video/` — video scripts for short-form and long-form videos hosted externally. Use `format: short` (60–90 sec, Shorts/Reels/TikTok) or `format: long` (YouTube). Scripts live alongside the source content they draw from. Definition: [`_definitions/video.md`](./_definitions/video.md).

### Frontmatter

Every doc opens with a YAML block followed by an HTML-comment narrative block:

```markdown
---
title: <human-readable title>
tags:
  - <category>
draft: false
---
<!--
Purpose: ...
Status: canonical | working | draft | archived
Owner: ...
Update trigger: ...
Last updated: YYYY-MM-DD
-->
```

The YAML is what Quartz reads. The HTML comment is the narrative contract carried over from the Serennovas pattern — invisible in the rendered site, valuable for the humans editing the file.

## Filing a new artifact

1. **Pick the next free number** for the prefix you need (`M-###`, `ARCH-###`, etc.) by scanning the relevant folder (and its `completed/` subfolder if applicable).
2. **Read the definition** under [`_definitions/`](./_definitions/) for that artifact type — it lists the required sections.
3. **Use the frontmatter** in [`_definitions/document.md`](./_definitions/document.md) (add the YAML block only for pages under `site/content/`).
4. **Link from the roadmap** if it's a milestone, or from a remediating milestone if it's a TD entry.

## Help

The owner of the doc surface is `zo` (per the frontmatter on every canonical doc).
