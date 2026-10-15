# Alonzos Anthologies monorepo

Root: `C:\Repos\alonzo-anthologies`
Primary remote: `github.com/DeveloperZo/alonzo-anthologies` (public), local
remote `origin`. It is the only code host (owner decision, 2026-10-14).

A single repo housing multiple projects under one roof. The product brand
is **Alonzo's Anthologies**. It covers the Quartz site at `site/` and
the interactive resume SPA the site hosts. The site has no separate brand.

The GitHub repo was named `Zo-Garden-eCafe` until 2026-10-14; GitHub
redirects the old URL. Repo names cannot hold an apostrophe, so the slug
is `alonzo-anthologies`. User-facing copy still uses
**Alonzo's Anthologies**.

For a few hours on 2026-10-14 the code lived on GitLab
(`awilliams9293/alonzo-anthologies`). That project is archived.
This clone has no `gitlab` remote. It was removed on 2026-10-15
because it was the only local ref that still reached commits
crediting an AI agent as a co-author. Do not add it back.

## Why

One canonical doc surface across all projects, modeled on the pattern in
[docs-pattern.md](docs-pattern.md).

## Layout

| Path | What it is |
| --- | --- |
| `site/` | Quartz 4 site. Content under `site/content/`. Built output at `site/public/` (gitignored) |
| `resumeContent/` | Alonzo's Anthologies React SPA. Emitted to `/resume` by the Quartz `StageResumeSpa` emitter during the site build |
| `build.sh` | Monorepo build. Installs resume deps, then `npx quartz build` |
| `wrangler.toml` | Cloudflare Pages config. `pages_build_output_dir = "site/public"` |
| `customizations/` | Quartz customizations, plus `customizations/skills/` (the diagramming skill) |
| `_KNOWLEDGE/` | Canonical project docs: stories, architecture, documents, diagrams, definitions |
| `_KNOWLEDGE/Context/` | This folder |
| `CLAUDE.md` | Hard formatting and diagram rules |

## Conventions

Public writing lives under `site/content/` and is rendered by Quartz.
Project docs live under `_KNOWLEDGE/`, which Quartz does not render. The
rules for those docs are in `_KNOWLEDGE/CONVENTIONS.md`.

Taxonomy categories chosen for this repo: ARCH, M / RM, OPER, TD,
ROADMAP, plus BRIEF, VID and DIA. DOCS, MR and INV were deliberately
dropped from the full set. Milestones and the roadmap live in
`_KNOWLEDGE/Stories/`.

## Terminology

| Phrase | Means |
| --- | --- |
| Alonzo's Anthologies | The one brand: the site, the interactive resume SPA (`resumeContent/`), and the monorepo |
| The site | The Quartz site at `site/` |
| The monorepo | This whole repository |
