# Project context

Durable context for this monorepo, kept in version control so that any
session (local Claude Code, a Cowork session on another machine, or a
fresh clone with no device link) inherits the same picture.

This replaces desktop-local project memory. Desktop memory does not
travel between machines. These files do.

| File | What it covers |
| --- | --- |
| [monorepo.md](monorepo.md) | Repo layout, GitHub remote, naming and terminology |
| [docs-pattern.md](docs-pattern.md) | The doc taxonomy this repo's structure is modeled on |
| [ai-governance-series.md](ai-governance-series.md) | The two-part explainer: structure, design system, editorial rules |
| [sdlc-articles.md](sdlc-articles.md) | The two SDLC articles: where each draft lives, the direction Zo set, and the kitchen plates (DIA-401 to 408) |
| [working-with-zo.md](working-with-zo.md) | How Zo divides work between Cowork and Claude Code |
| [deployment.md](deployment.md) | Publishing the site and getting write access from non-local sessions |
| [home-library.md](home-library.md) | The home server: what runs on it, where the WHL project really lives, a Docker startup fix, and the rule to hand token-heavy work to the local models |
| [resume-spa.md](resume-spa.md) | Alonzo's Anthologies: quest data model, view filters, and what reaches the PDF |

Hard formatting rules live in the repo root `CLAUDE.md`, not here.

## Standing rule: use the local models for bulk work

Before reading several files, or one long file, only to summarize it,
pull facts out of it or label it, hand that work to the free local
models instead. The how is in the `local-models` skill
(`.claude/skills/local-models/SKILL.md`) and the evidence is in
`../williams-home-library/client/ROUTING.md`. Zo set this on
2026-11-18 to cut frontier token cost.

## Keeping these current

When a decision gets made that a future session would need and could not
work out from the code, add it here in the same turn. Convert relative
dates to absolute. If something in these files turns out to be wrong,
correct it rather than appending a contradiction.
