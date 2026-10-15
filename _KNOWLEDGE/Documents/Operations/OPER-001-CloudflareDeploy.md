# OPER-001 Cloudflare Pages deploy

<!--
Purpose: How to deploy, verify and roll back the Alonzo's Anthologies site on Cloudflare Pages, including the one-time project setup, the record of the garden/ to site/ cutover and the move of the Git source to GitHub.
Status: working
Owner: zo
Human id: cloudflare-deploy
Update trigger: when build.sh, wrangler.toml, the Pages project settings, its Git source or the hostname change, or a custom domain is added
Last updated: 2026-10-14
-->

## Modes and prerequisites

Covers building with `build.sh`, the Pages project `alonzo-anthologies`, routine deploys, the output-directory cutover (done 2026-10-14), verification and rollback. The rules these steps keep are in [ARCH-003](../../Architecture/ARCH-003-Hosting.md); the API token is covered by [OPER-003](./OPER-003-CloudflareCredentials.md).

Modes:

| Mode | When | Token needed |
| --- | --- | --- |
| A. Create the Pages project | Rebuilding the project from scratch (last done 2026-10-14, when the source moved to GitHub) | No |
| B. Routine deploy | Every change to `main` (automatic) | No |
| C. garden/ to site/ cutover | Done 2026-10-14. Kept as the pattern for any future output-folder move | Only if the setting is changed through the API (Pages Edit) |
| D. Break-glass local deploy | Git integration down | Yes, Pages Edit |

Prerequisites:

- Push access to `origin` (`https://github.com/DeveloperZo/alonzo-anthologies.git`). Push steps are [OPER-002](./OPER-002-GitHubPush.md).
- Cloudflare dashboard login for mode A and for rollback; dashboard or a Pages Edit token for mode C.
- For local builds: Node `22.16.0` (see `site/.node-version`) and bash. On Windows use Git Bash.
- For API checks: the read-only session from OPER-003, Procedure B (`CF_TOKEN`, `CF_ACCOUNT`, `cfget`).

System state (verified 2026-10-14, late evening, after the Git source moved to GitHub):

| Fact | State | How verified |
| --- | --- | --- |
| Pages project `alonzo-anthologies` (recreated 2026-10-14 23:45 local): GitHub `DeveloperZo/alonzo-anthologies` (repo id 1229275646), branch `main`, build `bash ./build.sh`, root `/`, output `site/public`, `NODE_VERSION=22.16.0` (Production and Preview), previews for all branches, deployments enabled, no custom domain | deployed | Cloudflare API, `GET /accounts/<id>/pages/projects` |
| Production is deployment `c7455b17`, commit c6dadfe, success. It is the only deployment on the project: history before 23:45 was deleted with the GitLab-wired project | deployed | API deployments list (total 1). Its trigger is `ad_hoc` (the project's creation build), not `github:push` |
| GitHub shows a `Cloudflare Pages: alonzo-anthologies` check run on c6dadfe, `success`, pointing at `c7455b17` | verified | Public GitHub API, `GET /repos/DeveloperZo/alonzo-anthologies/commits/<sha>/check-runs`, with `curl` |
| A GitHub push triggers a build on `alonzo-anthologies` | not yet observed | No push has happened since the project was recreated. The same repo's push did build `zo-garden` (`dc4746b5`, `github:push`), so the GitHub path fires |
| A Git-connected build takes its output directory from `wrangler.toml` (`pages_build_output_dir = "site/public"`), not the dashboard field | verified | `zo-garden` still has dashboard output `garden/public`, yet built c6dadfe successfully (`dc4746b5`) and serves the current site |
| `/`, `/resume/` and `/ai-governance/` on `alonzo-anthologies.pages.dev` return 200; `og:site_name` is "Alonzo's Anthologies"; the sitemap lists only `alonzo-anthologies.pages.dev` | deployed | `curl` |
| HEAD (c6dadfe) has `wrangler.toml` output `site/public` and `baseUrl: "alonzo-anthologies.pages.dev"` | committed and pushed | `git show HEAD:wrangler.toml`, `git show HEAD:site/quartz.config.ts`; `git ls-remote origin` shows `main` at c6dadfe |
| Older project `zo-garden`: same GitHub repo (the API still shows its old name `Zo-Garden-eCafe`, same repo id), dashboard output `garden/public`, `NODE_VERSION=22`, deployments on. Latest production `dc4746b5` (c6dadfe, `github:push`, success), so it serves an identical copy of the current site | deployed, duplicate | API (24 deployments); `curl` of `zo-garden.pages.dev`: `/`, `/resume/`, `/ai-governance/` 200, `og:site_name` "Alonzo's Anthologies". Tracked as [TD-002](../Technical-Debt/TD-002-DuplicatePages.md) |

## Procedure

### A. Create the Pages project

1. Dashboard: Workers and Pages, Create, Pages, Connect to Git, GitHub, repo `DeveloperZo/alonzo-anthologies`. Before deleting an existing project to recreate it, save its settings (`cfget /pages/projects/<name>`): its deployment history goes with it, and so does every rollback target.
2. Settings: project name `alonzo-anthologies`, production branch `main`, framework preset None, build command `bash ./build.sh`, build output directory `site/public`, root directory blank.
3. Environment variables (Production and Preview): `NODE_VERSION` = the value of `site/.node-version` without the `v` (today `22.16.0`).
4. Save and deploy, then run the Verification checks.

### B. Routine deploy

1. Optional local repro (output lands in `site/public/`):

   ```bash
   bash ./build.sh
   ```

2. Push:

   ```bash
   git push origin main
   ```

3. Cloudflare builds and deploys `main`. Any other pushed branch gets a public preview at `https://<branch>.alonzo-anthologies.pages.dev`. Pages with `draft: true` are removed from every build. Until [ST-004](../../Stories/ST-004-OneHostname.md) lands, the same push also builds `zo-garden`.

### C. Cutover: garden/ to site/ (done 2026-10-14)

Ran once, in this order, on 2026-10-14 (see [log](./log.md)). Kept as the pattern for any future move of the build output folder: change the setting first, prove it on a preview, then ship `main`.

1. Changed the `alonzo-anthologies` Build output directory from `garden/public` to `site/public`. Done through the API (a dashboard edit under Settings, Builds is equivalent).
2. Pushed branch `rebrand-alonzos-anthologies` at c6dadfe (carrying the rename 445ece0 and the GitHub cleanup c6dadfe). Preview `c2635c2f` built green.
3. Fast-forwarded GitLab `main` from d59196a to c6dadfe. Production deploy `ff476ca6` succeeded at 23:01 local.
4. Ran the Verification checks: `/`, `/resume/` and `/ai-governance/` return 200, `og:site_name` is "Alonzo's Anthologies", and the sitemap lists only `alonzo-anthologies.pages.dev`.
5. Left `zo-garden` and the GitHub repo untouched. The expectation then was that `zo-garden`'s `garden/public` setting would make its next build fail. Later the same evening GitHub became the home again and c6dadfe was pushed there: `zo-garden` built it successfully, because the build reads `wrangler.toml` (see System state). Retiring `zo-garden` by redirect is [ST-004](../../Stories/ST-004-OneHostname.md) ([TD-002](../Technical-Debt/TD-002-DuplicatePages.md)).

Later on 2026-10-14 the Git source moved from GitLab to GitHub: the GitLab-wired project was deleted and recreated under the same name from GitHub (Procedure A, with the saved settings). Production `c7455b17` was live about 3 minutes after the delete. See the [log](./log.md).

### D. Break-glass: deploy from a local build

Only when the Git integration is down. Unverified on this project. A later Git push overwrites it.

1. Build: `bash ./build.sh`
2. Deploy with a Pages Edit token (OPER-003):

   ```bash
   CLOUDFLARE_API_TOKEN="$CF_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT" \
     npx wrangler pages deploy site/public --project-name alonzo-anthologies --branch main
   ```

## Verification checks

```bash
curl -sI https://alonzo-anthologies.pages.dev/ | head -1          # HTTP/1.1 200 OK
curl -sI https://alonzo-anthologies.pages.dev/resume/ | head -1   # HTTP/1.1 200 OK
curl -s https://alonzo-anthologies.pages.dev/sitemap.xml | grep -o "<loc>[^/]*//[^/]*" | sort -u
#   only https://alonzo-anthologies.pages.dev
curl -s https://alonzo-anthologies.pages.dev/ | grep -o 'og:site_name" content="[^"]*'
#   Alonzo's Anthologies
curl -s -o /dev/null -w "%{http_code}\n" https://alonzo-anthologies.pages.dev/index.xml   # 200
```

With the OPER-003 session open, confirm the trigger and commit:

```bash
cfget /pages/projects/alonzo-anthologies | node -pe 'const d=JSON.parse(require("fs").readFileSync(0)).result.latest_deployment; [d.deployment_trigger.type, d.deployment_trigger.metadata.commit_hash.slice(0,7), d.latest_stage.status].join(" ")'
```

Expect `github:push`, the pushed commit, and `success`. `ad_hoc` means a manual upload or, as with `c7455b17`, the build Cloudflare runs when a project is created. Confirm the output directory:

```bash
cfget /pages/projects/alonzo-anthologies | node -pe 'JSON.parse(require("fs").readFileSync(0)).result.build_config.destination_dir'
#   site/public
```

Open `/resume/` in a browser and check the app shell renders with no 404s in the network tab.

## Troubleshooting and fallback

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Build ends with no output directory found | `pages_build_output_dir` in `wrangler.toml` does not match where `build.sh` writes (a Git-connected build uses the `wrangler.toml` value over the dashboard field) | Fix `wrangler.toml`, and keep the dashboard field equal to it (Procedure C, step 1) |
| `Quartz requires Node >=22` | `NODE_VERSION` missing on the project | Add it (Procedure A, step 3) |
| Build fails in `resumeContent/` | Dependency or build error in the SPA | Reproduce with `bash ./build.sh`; `build.sh` skips the SPA only when `resumeContent/package.json` is absent |
| Absolute links, RSS or sitemap point at the wrong host | `baseUrl` does not match the hostname | Fix `baseUrl` in `site/quartz.config.ts` (ARCH-003, "Production hostname and `baseUrl`") |
| Push to `main` produces no new deployment | The Cloudflare GitHub App lost access to the repo, or the Git connection broke | Check the project's Git connection in the dashboard and the app's repo access on GitHub (OPER-002, Troubleshooting); use Retry deployment, or Procedure D |

Rollback:

1. Dashboard: `alonzo-anthologies`, Deployments, pick the last good production deploy, Rollback to this deployment. Takes effect in seconds. Today there is no earlier target: `c7455b17` is the project's only deployment (the older ones were deleted with the GitLab-wired project), so until a second production deploy exists, use step 2.
2. If the fault is in source, `git revert <commit>` and `git push origin main`; Cloudflare redeploys.
3. A failed build never replaces production; the previous deploy keeps serving.

## Ownership and references

- Owner: zo.
- [ST-001 Quartz site goes live](../../Stories/completed/ST-001-QuartzGoLive.md), which produced this runbook.
- [ARCH-003 Hosting](../../Architecture/ARCH-003-Hosting.md) and [ARCH-001 Platform overview](../../Architecture/ARCH-001-PlatformOverview.md).
- [OPER-003 Cloudflare credentials](./OPER-003-CloudflareCredentials.md).
- [TD-004 Broad Cloudflare token](../Technical-Debt/TD-004-BroadCloudflareToken.md), [TD-002 Duplicate Pages](../Technical-Debt/TD-002-DuplicatePages.md).
- [ST-004 One hostname](../../Stories/ST-004-OneHostname.md) (retire `zo-garden`) and [ST-006 Scoped token](../../Stories/ST-006-ScopedToken.md).
- [OPER-002 GitHub push](./OPER-002-GitHubPush.md).
- `build.sh` and `wrangler.toml` at the repo root.

## Changelog

- 2026-10-14: Git source moved to GitHub `DeveloperZo/alonzo-anthologies` (owner decision; project deleted 23:45:26 and recreated with the same settings, production `c7455b17` live 23:48:07, per log.md). System state re-verified read-only (Cloudflare API GETs, public GitHub API, `curl`): one deployment only, trigger `ad_hoc`; `zo-garden` now builds the same repo and serves the current site. Settled the open question about the output directory: the build uses `wrangler.toml`. Rollback note rewritten (no earlier target exists). Procedure A now names GitHub.
- 2026-10-14: Procedure C recorded as done (output directory `site/public`, preview `c2635c2f`, `main` d59196a to c6dadfe, production `ff476ca6`). System state re-verified after the cutover with read-only Cloudflare API calls and `curl`; the GitLab push path is now verified. Removed the before-the-cutover warnings, noted the `github:push` trigger label, and added the rollback caveat about `32c179a7`.
- 2026-10-14: Restructured to the Runbook sections in Document.md. Replaced the stale claim that a GitLab-connected project already served `main`: `alonzo-anthologies` was created this day (API `created_on` 2026-10-15T03:13Z, 2026-10-14 local) and has deployed only once. Recorded that `zo-garden` (GitHub) still deploys and that the live build carries the old identity, and added the output-directory cutover. Removed YAML frontmatter. Verified with read-only Cloudflare API calls and `curl`.
- 2026-10-14: Names updated to Alonzo's Anthologies and GitLab during the repo rename (text only; the Pages setup was not changed then).
- 2026-09-01: Last `zo-garden` production deploy (d59196a, `github:push`).
- 2026-05-10: `build.sh` now only installs `resumeContent/` deps; the Quartz `StageResumeSpa` emitter (introduced 2026-05-07, f560687) builds and stages `/resume` (commit 6a53df4).
- 2026-05-05: Pages project `zo-garden` created, connected to GitHub `DeveloperZo/Zo-Garden-eCafe`, output `garden/public`, `NODE_VERSION=22`; `wrangler.toml` added; ST-001 (then ST-001) closed with `https://zo-garden.pages.dev` live.
- 2026-05-04: Created with commit 166dd71 when Cloudflare Pages was chosen as host and `/resume` was mounted.
