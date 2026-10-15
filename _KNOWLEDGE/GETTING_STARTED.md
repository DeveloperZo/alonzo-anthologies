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

- **Node.js 22+**: Quartz 4 requires Node 22 or later. Use `nvm` if you need to manage multiple versions.
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

Output lands in `site/public/`. Production deploys that folder to Cloudflare Pages.

## Doc conventions

Project docs live in `_KNOWLEDGE/`, which Quartz does not render. Public
writing lives in `site/content/`.

Every type of doc we create instances of has a definition in
[`_META/Definitions/`](../_META/Definitions/README.md): Story (`ST-###`),
Architecture (`ARCH-###`), Document (`BRIEF`, `OPER`, `TD`, `VID`, one
prefix per kind) and Diagram (`DIA-###`). The README there holds the rules
every instance follows: the HTML-comment frontmatter block, filenames as
`<ID>-<ShortName>.md`, and keeping planned, built, verified and deployed
distinct.

Pages under `site/content/` still need the YAML block Quartz reads, with the
HTML-comment block under it.

## Filing a new doc

1. **Read the definition** for the type in `_META/Definitions/`. It lists the sections and ends with a template to copy.
2. **Pick the next free number** for the prefix by scanning the folder and its `completed/` subfolder.
3. **Name the file** `<ID>-<ShortName>.md`.
4. **Link it in**: a Story gets a ROADMAP row; a TD item names the Story that will fix it; a runbook gets a row in `Documents/Operations/index.md`.

## Help

The owner of the doc surface is `zo` (per the frontmatter on every canonical doc).
