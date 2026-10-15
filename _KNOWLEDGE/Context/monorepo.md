# Alonzos Anthologies monorepo

Root: `C:\Repos\alonzo-anthologies`
Primary remote: `gitlab.com/awilliams9293/alonzo-anthologies` (public)
Backup remote: `github.com/DeveloperZo/alonzo-anthologies` (as `github`)

A single repo housing multiple projects under one roof. The product brand
is **Alonzo's Anthologies**. It covers the Quartz site at `site/` and
the interactive resume SPA the site hosts. The site has no separate brand.

GitLab project display name is `Alonzos Anthologies` (no apostrophe;
GitLab rejects `'` in project names). User-facing copy still uses
**Alonzo's Anthologies**.

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
