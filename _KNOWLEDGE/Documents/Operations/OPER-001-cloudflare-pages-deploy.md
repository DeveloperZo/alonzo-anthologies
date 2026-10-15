---
title: OPER-001 Cloudflare Pages deploy
tags:
  - operations
  - deploy
draft: false
---
<!--
Purpose: How to wire and operate the Cloudflare Pages deploy for the Alonzo's Anthologies monorepo.
Status: working
Owner: zo
Update trigger: when the build script changes, when CF Pages settings change, when a custom domain is added
Last updated: 2026-10-14
-->

# OPER-001 Cloudflare Pages deploy

The Alonzo's Anthologies monorepo is deployed via Cloudflare Pages from the GitLab project [`awilliams9293/alonzo-anthologies`](https://gitlab.com/awilliams9293/alonzo-anthologies). Cloudflare watches `main`, runs `build.sh`, and serves the resulting `site/public/` to the Pages URL. The Quartz docs site lives at `/`; the `resumeContent/` CRA app (`resume-content`) is built first and copied to `/resume`. A GitHub backup remote remains in place. If an existing Pages project still watches that backup, re-point it at the GitLab project.

## Modes and prerequisites

- **Cloudflare account** with access to Pages.
- **GitLab access** to `awilliams9293/alonzo-anthologies` (Cloudflare needs permission on the project to receive push events).
- No secrets are required for the deploy itself — the build runs from public source.
- For local repro: Node 22+ and bash. On Windows, run `build.sh` from Git Bash or WSL.

## Procedure

### One-time: connect the repo

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize Cloudflare for GitLab and select the `awilliams9293/alonzo-anthologies` project.
3. Configure the project:
   - **Project name**: `alonzo-anthologies` (or whatever you want the `*.pages.dev` subdomain to be).
   - **Production branch**: `main`.
   - **Framework preset**: `None` (we control the build).
   - **Build command**: `bash ./build.sh`
   - **Build output directory**: `site/public`
   - **Root directory**: leave blank (repo root).
4. Set environment variables under **Settings → Environment variables → Production**:
   - `NODE_VERSION` = `22` (Quartz 4 requires it; CF Pages defaults to an older Node).
5. Save and trigger the first deploy.

The repo root includes [`wrangler.toml`](https://gitlab.com/awilliams9293/alonzo-anthologies/-/blob/main/wrangler.toml) with `pages_build_output_dir = "site/public"`. That matches the dashboard **Build output directory** and fixes **`wrangler pages deploy`** / Workers Builds when Wrangler looks for static assets (it does not default to `site/public`).

### Each deploy (automatic)

A push to `main` triggers a CF Pages build. No action needed in the repo.

### Manual redeploy

In CF dashboard → the Pages project → **Deployments** → choose a commit → **Retry deployment** or **Rollback**.

### Local repro of the deploy build

```bash
# from the repo root
bash ./build.sh
# output lands in site/public/, identical layout to the deploy.
```

## Verification checks

After a deploy completes:

1. **Pages URL is reachable.** `curl -I https://alonzo-anthologies.pages.dev/` returns `200`.
2. **Quartz site renders.** Visiting the apex URL shows the **Alonzo's Anthologies** landing page. Title in tab is `Alonzo's Anthologies`.
3. **`/resume` loads the React app.** Open `https://alonzo-anthologies.pages.dev/resume/` — the `resume-content` app shell loads (HashRouter; assets are built with `"homepage": "/resume"`).
4. **Static assets resolve.** No 404s in the network tab.
5. **Sitemap and RSS exist.** `/sitemap.xml` and `/index.xml` (RSS) return XML.
6. **No analytics ping.** `analytics: null` in `quartz.config.ts` — confirm no requests to `plausible.io`.

## Troubleshooting and fallback

| Symptom | Likely cause | Fix |
|---|---|---|
| Wrangler: `Could not detect a directory containing static files` | Output path not specified — Wrangler looks for `public`/`dist`, not `site/public` | Use dashboard output **`site/public`**, rely on root **`wrangler.toml`** (`pages_build_output_dir`), or run **`npx wrangler pages deploy site/public`** (after `./build.sh`). Run the build first so the directory exists and contains `index.html`. |
| Build fails with `Quartz requires Node >=22` | `NODE_VERSION` env var not set on the Pages project | Add `NODE_VERSION=22` under Settings → Environment variables |
| Build fails in `resumeContent/` on CI | `resumeContent/` was never pushed (e.g. it was listed in `.gitignore`) | Commit and push `resumeContent/`, or allow the build to skip it: `build.sh` runs Quartz-only when that folder is missing (no `/resume` app). |
| Quartz pages render but links 404 | `baseUrl` in `quartz.config.ts` doesn't match the live URL | Update `baseUrl` to the actual deployed origin (e.g. `alonzo-anthologies.pages.dev` or your custom domain) and push |

### Rollback

In CF Pages dashboard → **Deployments** → previous successful deploy → **Rollback to this deployment**. Effective within seconds.

If the issue is in the source rather than the build, `git revert <commit>` and push — CF Pages will redeploy automatically.

## Ownership and references

- **Owner**: zo.
- **Produced by**: [`M-001 Quartz site goes live publicly`](../../Stories/completed/M-001-quartz-go-live.md) (closed 2026-05-05).
- **Architectural context**: [`ARCH-001 Platform overview`](../../Architecture/ARCH-001-platform-overview.md).
- **Build script**: [`build.sh`](https://gitlab.com/awilliams9293/alonzo-anthologies/-/blob/main/build.sh) at the repo root.
- **Wrangler / static output path**: [`wrangler.toml`](https://gitlab.com/awilliams9293/alonzo-anthologies/-/blob/main/wrangler.toml) at the repo root.
