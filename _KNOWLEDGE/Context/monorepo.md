# Alonzos Anthologies monorepo

Root: `C:\Repos\alonzo-anthologies`
Primary remote: `github.com/DeveloperZo/alonzo-anthologies` (public), local
remote `origin`. It is the only code host (owner decision, 2026-10-14).

A single repo housing multiple projects under one roof. The product brand
is **Alonzo's Anthologies**. It covers the Quartz site at `anthologies/website-series/site/` and
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

## Anthology and series pattern (2026-11-17)

Every project lives at `anthologies/<name>-series/<project>/`. The repo
is the anthology collection, a series groups the projects that serve one
purpose, and each project folder keeps its own name and tooling.

| Series | Projects |
| --- | --- |
| `anthologies/website-series/` | `site/` (Quartz) |
| `anthologies/resume-series/` | `resumeContent/` (React SPA), `coverLetters/`, `applications/` |
| `anthologies/gatekeeper-series/` | Planning only (2026-11-17). Knowledge repository, workbench and validation tool, distilled from the private `GatekeeperProtocol` repo. Start at its `README.md` and `planning/` |
| `../williams-home-library/` | Concept only (2026-11-17). The desktop as a home server for local LLMs, reachable from limesalt (the laptop) at home and away |

A series may start as planning docs with no code. The source repo for
the gatekeeper series is not imported: it is private, this repo is
public, and the owner asked for a distilled plan rather than a port
(2026-11-17).

Rules that follow from it:

- A new project goes inside an existing series, or in a new
  `anthologies/<name>-series/` folder. Nothing project-shaped sits at the
  repo root.
- The repo root holds only cross-series files: `build.sh`,
  `wrangler.toml`, `.gitignore`, `CLAUDE.md`, `_KNOWLEDGE/`, `_META/`.
- Projects in one series reach each other as siblings (the resume scripts
  resolve `../applications` and `../coverLetters`). Across series, go up
  to `anthologies/` and down (the Quartz `StageResumeSpa` emitter resolves
  `../../resume-series/resumeContent` from `site/`).
- Root `.gitignore` patterns containing a slash are anchored to the repo
  root, so they must carry the full `anthologies/<series>/<project>/`
  prefix. This matters most for `applications/`, which holds personal
  data in a public repo.
- Moving a project means updating `build.sh`, `wrangler.toml`,
  `.gitignore`, `.claude/launch.json` and the emitter in the same change.

## Layout

| Path | What it is |
| --- | --- |
| `anthologies/website-series/site/` | Quartz 4 site. Content under `anthologies/website-series/site/content/`. Built output at `anthologies/website-series/site/public/` (gitignored) |
| `anthologies/resume-series/resumeContent/` | Alonzo's Anthologies React SPA. Emitted to `/resume` by the Quartz `StageResumeSpa` emitter during the site build |
| `build.sh` | Monorepo build. Installs resume deps, then `npx quartz build` |
| `wrangler.toml` | Cloudflare Pages config. `pages_build_output_dir = "anthologies/website-series/site/public"` |
| `customizations/` | Quartz customizations, plus `customizations/skills/` (the diagramming skill) |
| `_KNOWLEDGE/` | Canonical project docs: stories, architecture, documents, diagrams, definitions |
| `_KNOWLEDGE/Context/` | This folder |
| `CLAUDE.md` | Hard formatting and diagram rules |

## Conventions

Public writing lives under `anthologies/website-series/site/content/` and is rendered by Quartz.
Project docs live under `_KNOWLEDGE/`, which Quartz does not render. The
rules for those docs are in `_KNOWLEDGE/CONVENTIONS.md`.

Taxonomy categories chosen for this repo: ARCH, M / RM, OPER, TD,
ROADMAP, plus BRIEF, VID and DIA. DOCS, MR and INV were deliberately
dropped from the full set. Milestones and the roadmap live in
`_KNOWLEDGE/Stories/`.

## Terminology

| Phrase | Means |
| --- | --- |
| Alonzo's Anthologies | The one brand: the site, the interactive resume SPA (`anthologies/resume-series/resumeContent/`), and the monorepo |
| The site | The Quartz site at `anthologies/website-series/site/` |
| The monorepo | This whole repository |
