# Going non-local

Three separate dependencies on the local machine, and how each one is
removed.

## 1. Reading and editing the repo from anywhere

The repo is public at
`github.com/DeveloperZo/alonzo-anthologies`. GitHub is the only code host
(owner decision, 2026-10-14: GitHub suits Claude Code and the job
search). A clean cloud container with no credentials can already clone
it, so read access from a non-local session works today.

Local remotes:

| Remote | URL |
| --- | --- |
| `origin` | `https://github.com/DeveloperZo/alonzo-anthologies.git` (`main` tracks `origin/main`) |
| `gitlab` | `https://gitlab.com/awilliams9293/alonzo-anthologies.git` (archived, read-only, reference only) |

The repo was named `Zo-Garden-eCafe` until 2026-10-14; GitHub redirects
the old URL. For CLI work on GitHub, use `gh` (installed; run
`gh auth login` once per machine before relying on it).

Write access from Claude Code on the web still depends on whatever host
that session can reach. Push to GitHub (`origin`). Never push to the
`gitlab` remote; the project is archived and removing the remote is
ST-005.

## Rebrand to one name (2026-10-14)

The old site brand was dropped. Everything is now Alonzo's Anthologies,
and the Quartz folder moved from its old name to `site/`. The repo was
updated to the new names in the same change. Status of the things that
live outside the repo:

- Done: the Pages project `alonzo-anthologies` builds from `site/public`.
  It was recreated from GitHub on the night of 2026-10-14 and serves
  c6dadfe (deployment `c7455b17`).
- Open: retire the old `zo-garden` Pages project (TD-002, ST-004). It is
  connected to the same GitHub repo, builds every push to `main`, and
  serves a duplicate of the current site at `zo-garden.pages.dev`.
- Open: any links already shared that point at the old `*.pages.dev`
  hostname.

Remove this section once the open items are done.

## 2. Reading the published site from anywhere

Done. The site is live at `https://alonzo-anthologies.pages.dev`, built
by the Cloudflare Pages project `alonzo-anthologies` on every push to
GitHub `main`.

In the repo:

| File | What it provides |
| --- | --- |
| `wrangler.toml` | `pages_build_output_dir = "site/public"`. A Git-connected build takes the output folder from here, not from the dashboard (shown by `zo-garden` on 2026-10-14) |
| `build.sh` | Installs `resumeContent/` deps, then `npx quartz build` |
| `site/quartz.config.ts` | `baseUrl` (`alonzo-anthologies.pages.dev`) |
| `site/.node-version` | v22.16.0 |

Dashboard settings, as recreated on 2026-10-14 (Cloudflare, then Workers
and Pages, then Create, then Pages, then Connect to Git, then the GitHub
repo `DeveloperZo/alonzo-anthologies`):

- Production branch: `main`
- Build command: `bash ./build.sh`
- Build output directory: `site/public`
- Root directory: `/`
- Environment variable: `NODE_VERSION = 22.16.0` (Production and Preview)
- Preview deployments: all branches

A Pages project cannot change its Git source in place; moving hosts means
a new project with these settings re-entered, and the old project's
deployment history is lost.

One-off CLI alternative, no auto-deploy (never run against this project):

```
bash ./build.sh
npx wrangler pages deploy
```

Still worth deciding:

- If a custom domain is coming, change `baseUrl` in
  `site/quartz.config.ts` first, so RSS and Open Graph links are correct.
- Whatever is on `main` is public. Pages marked `draft: true` (the
  `RATIONALE-*` files today) are left out of every build.

## 3. Carrying project context between machines

Desktop project memory does not travel. That is why `_KNOWLEDGE/Context/`
exists. Anything a future session on another machine would need, and
could not work out from the code, belongs in a file here rather than in
desktop memory.
