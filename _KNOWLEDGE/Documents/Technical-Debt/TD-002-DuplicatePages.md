# TD-002 Duplicate Pages

<!--
Purpose: Record that a second Cloudflare Pages project builds and serves a copy of the site from the same repo, and what retiring it takes.
Status: open
Owner: zo
Human id: duplicate-pages
Update trigger: when zo-garden is redirected, disconnected or deleted
Last updated: 2026-10-14
-->

## Current impact

- The site is public at two hostnames. Since the evening of 2026-10-14 both serve the same current build (c6dadfe, "Alonzo's Anthologies"): `alonzo-anthologies.pages.dev` and `zo-garden.pages.dev`. It is a duplicate, not a stale copy. Links and search results split between them, and older Stories (ST-001, ST-003) still cite the old hostname.
- Every push to `main` on GitHub `DeveloperZo/alonzo-anthologies` builds twice, once per project. Two builds can disagree (different `NODE_VERSION`), and a failure on `zo-garden` would go unnoticed while it keeps serving its previous build.
- Settings drift: `NODE_VERSION` is `22` on `zo-garden` and `22.16.0` on `alonzo-anthologies`; `zo-garden`'s dashboard output directory still says `garden/public`. The build ignores that field (it reads `wrangler.toml`), so it is misleading rather than broken. Moot once `zo-garden` stops building.

## Root cause

When the repo moved to GitLab on 2026-10-14, a new GitLab-connected project
(`alonzo-anthologies`) was created instead of moving the old one, and the old
GitHub-connected `zo-garden` was left with production and preview deploys on.
Later the same evening GitHub became the home again: the GitHub repo
`DeveloperZo/Zo-Garden-eCafe` was renamed to `DeveloperZo/alonzo-anthologies`
and `alonzo-anthologies` was recreated from it. `zo-garden` still points at
that repo (same repo id), so it started building the current code too.

## Remediation

[ST-004 One hostname](../../Stories/ST-004-OneHostname.md). Owner decision (2026-10-14): redirect `zo-garden.pages.dev` to `alonzo-anthologies.pages.dev` with a Cloudflare Bulk Redirect, and turn off `zo-garden`'s automatic deployments.

## Acceptance criteria

- Exactly one Pages project has `deployments_enabled` true (Cloudflare API, `/accounts/<id>/pages/projects`).
- `zo-garden.pages.dev` answers with a 301 to the matching path on `alonzo-anthologies.pages.dev` (`curl -sI https://zo-garden.pages.dev/resume/`).
- A push to `main` produces a new deployment on `alonzo-anthologies` only; `zo-garden`'s latest deployment does not change.

## Evidence and status

Open. Re-verified 2026-10-14, late evening, read-only:

- Cloudflare API: both projects have source `github`, owner `DeveloperZo`, repo id 1229275646. `zo-garden` still records the old repo name `Zo-Garden-eCafe`, `deployments_enabled` true, previews `all`, output `garden/public`, `NODE_VERSION=22`, 24 deployments; the latest is `dc4746b5`, production, `github:push`, c6dadfe, success. `alonzo-anthologies` has output `site/public` and one deployment, `c7455b17` (c6dadfe).
- Public GitHub API: c6dadfe carries two Cloudflare check runs, one for `alonzo-anthologies` (`c7455b17`) and one for `zo-garden` (`dc4746b5`), both `success`.
- `curl`: on both hostnames `/`, `/resume/` and `/ai-governance/` return 200, `og:site_name` is "Alonzo's Anthologies", and each sitemap lists only `alonzo-anthologies.pages.dev` (the `baseUrl`).

## Changelog

- 2026-10-14 (late evening): GitHub became the home again and `zo-garden`, still wired to the same (renamed) repo, built c6dadfe (`dc4746b5`) despite its `garden/public` setting. Impact restated: a duplicate of the current site, built on every push, not a stale copy that would fail. Acceptance criterion about GitHub pushes restated for the same-repo case. Verified with Cloudflare API GETs, the public GitHub API and `curl`.
- 2026-10-14: Updated after the garden/ to site/ cutover. The two hostnames no longer serve the same build: `zo-garden` is now a stale copy with an output directory that would fail its next build. Remediation set to ST-004 with the owner's redirect decision; acceptance criteria tightened to a 301.
- 2026-10-14: Merged two items written independently the same day (TD-002 Legacy Pages from the source-control audit, TD-005 Duplicate Pages project from the hosting audit). The Cloudflare API evidence settled what the first left unverified. The backup-remote naming point moved to [TD-001](./completed/TD-001-LegacyGitHub.md).
