# Going non-local

Three separate dependencies on the local machine, and how each one is
removed.

## 1. Reading and editing the repo from anywhere

The repo is public at
`gitlab.com/awilliams9293/alonzo-anthologies` (Alonzos Anthologies).
A clean cloud container with no credentials can already clone it, so
read access from a non-local session works today.

Local remotes:

| Remote | URL |
| --- | --- |
| `origin` | `https://gitlab.com/awilliams9293/alonzo-anthologies.git` |
| `github` | `https://github.com/DeveloperZo/alonzo-anthologies.git` (backup) |

For CLI work on GitLab, use `glab` (authenticated via `glab auth login --hostname gitlab.com`).

Write access from Claude Code on the web still depends on whatever host
that session can reach. Prefer pushing to GitLab (`origin`) first so
non-local work sees the canonical remote.

## Rebrand to one name (2026-10-14)

The old site brand was dropped. Everything is now Alonzo's Anthologies,
and the Quartz folder moved from its old name to `site/`. The repo was
updated to the new names in the same change. Three things live outside
the repo and have to be renamed by hand to match:

- Cloudflare Pages project: rename it to `alonzo-anthologies` (the
  `name` in `wrangler.toml`), so it serves `alonzo-anthologies.pages.dev`
  (the `baseUrl`). Also set its build output directory to `site/public`.
- GitHub backup repo: rename it to `DeveloperZo/alonzo-anthologies`, then
  run `git remote set-url github https://github.com/DeveloperZo/alonzo-anthologies.git`.
- Any links already shared that point at the old `*.pages.dev` hostname.

Remove this section once all three are done.

## 2. Reading the published site from anywhere

The repo is already configured for Cloudflare Pages. Nothing is missing
except the Pages project itself.

Already in place:

| File | What it provides |
| --- | --- |
| `wrangler.toml` | `pages_build_output_dir = "site/public"` |
| `build.sh` | Installs `resumeContent/` deps, then `npx quartz build` |
| `site/quartz.config.ts` | `baseUrl` |
| `site/.node-version` | v22.16.0 |

Dashboard setup (gives auto-deploy on push to `main`):

Cloudflare, then Workers and Pages, then Create, then Pages, then Connect
to Git, then select the GitLab project `alonzo-anthologies` (or keep an
existing GitHub-connected project until you re-point it). Settings:

- Build command: `bash ./build.sh`
- Build output directory: `site/public`
- Root directory: `/`
- Environment variable: `NODE_VERSION = 22.16.0`

One-off CLI alternative, no auto-deploy:

```
bash ./build.sh
npx wrangler pages deploy
```

Before the first deploy:

- Decide the `baseUrl` in `site/quartz.config.ts`. It is currently
  `alonzo-anthologies.pages.dev`. Change it first if a custom domain is coming,
  so RSS and Open Graph links are correct from the start.
- Once auto-deploy is on, whatever is on `main` is public. Decide whether
  working documents such as the `RATIONALE-*` files should ship.

## 3. Carrying project context between machines

Desktop project memory does not travel. That is why `_KNOWLEDGE/Context/`
exists. Anything a future session on another machine would need, and
could not work out from the code, belongs in a file here rather than in
desktop memory.
