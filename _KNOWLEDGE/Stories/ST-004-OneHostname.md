# ST-004 One public hostname

<!--
Purpose: Retire zo-garden.pages.dev by redirecting it to alonzo-anthologies.pages.dev and stopping its deployments, so the site has one public address.
Status: planned
Owner: zo
Human id: one-hostname
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

The site is public at two addresses today, and both show the same current site, because the old project now builds from the same repository as the real one. Every change is built and published twice. After this work the old address sends every visitor to the current site, and nothing builds or publishes there any more. This matters now because older links and search results still point at the old address, and two copies split them.

## User story

**As a** visitor following an old link, **I want** to land on the current site at its real address, **so that** I bookmark and share the right one.

**As** Zo as operator, **I want** exactly one Pages project that deploys, **so that** a push can only publish to the address I check.

## Status

- Current: `planned`
- Next: Zo turns off automatic deployments on `zo-garden` in the Cloudflare dashboard; ST-006 should land first so verification uses the Pages Read token.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** Given a browser with no cache, when a visitor opens `https://zo-garden.pages.dev/`, `https://zo-garden.pages.dev/resume/` and `https://zo-garden.pages.dev/ai-governance/`, then each ends on the same path at `https://alonzo-anthologies.pages.dev`. Checked live with `curl -sI <url>`: status `301` and a `location:` header on `alonzo-anthologies.pages.dev` with the path preserved.
- **AC-2** The redirect keeps query strings and subpaths: `curl -sI "https://zo-garden.pages.dev/ai-governance/part-1/?x=1"` returns `301` to `https://alonzo-anthologies.pages.dev/ai-governance/part-1/?x=1`.
- **AC-3** The canonical site is unaffected: `curl -s -o /dev/null -w "%{http_code}" https://alonzo-anthologies.pages.dev/` (and `/resume/`, `/ai-governance/`) prints `200`.
- **AC-4** `zo-garden` no longer deploys. Cloudflare API (OPER-003, Procedure B): `cfget /pages/projects/zo-garden` shows `source.config.deployments_enabled` false (or production and preview branch deployments both disabled), and `cfget /pages/projects` shows exactly one project, `alonzo-anthologies`, with deployments enabled.
- **AC-5** The next push to `main` on GitHub after the change produces a new deployment on `alonzo-anthologies` and none on `zo-garden`: `cfget /pages/projects/zo-garden/deployments` shows the same latest deployment (today `dc4746b5`) before and after, and the commit's GitHub check runs list only `Cloudflare Pages: alonzo-anthologies`.
- **AC-6** Docs match the live state: [ARCH-003](../Architecture/ARCH-003-Hosting.md) records `zo-garden` as redirect-only with deployments off, and [TD-002](../Documents/Technical-Debt/TD-002-DuplicatePages.md) is closed with this Story's evidence.

## Scope

- Cloudflare dashboard, Pages project `zo-garden`, Settings, Builds: turn off automatic production and preview deployments.
- An account-level Bulk Redirect list and rule: source `zo-garden.pages.dev`, target `https://alonzo-anthologies.pages.dev`, status 301, with preserve query string, include subdomains, subpath matching and preserve path suffix on.
- Update ARCH-003 (project table and Change Map rows for `zo-garden`), TD-002 (close), [OPER-002](../Documents/Operations/OPER-002-GitHubPush.md) (drop the "each push builds twice" note), and the operations log entry for the change.

## Out of scope

- Deleting the `zo-garden` project. The owner default is redirect plus deployments off; deleting it would remove the hostname the redirect serves.
- Disconnecting the GitHub repo from Cloudflare. `alonzo-anthologies` builds from it; only `zo-garden`'s deployments go off.
- The archived GitLab project: [ST-005](./ST-005-RetireGitLab.md). The local `gitlab` remote was removed on 2026-10-15.
- A custom domain. Both hostnames stay on `pages.dev`.
- Rewriting historical Stories (ST-001, ST-003) that cite the old hostname; they are records.

## Additional information

### Dependencies

- [ST-006](./ST-006-ScopedToken.md) first, so the AC-4 and AC-5 API checks run on the new Pages Read token and not the broad one. The write steps here are done by Zo in the dashboard; the Pages Read token cannot create redirects. If they are ever done by API instead, the token needs Bulk Redirect permissions (account filter lists and rulesets), which is wider than OPER-003's minimum and should be a short-lived token.
- No ordering with [ST-005](./ST-005-RetireGitLab.md): `zo-garden` is fed by the GitHub repo, which stays, not by GitLab.

### Technical details

- Verified 2026-10-14, late evening (Cloudflare API GETs): `zo-garden` and `alonzo-anthologies` both build from GitHub repo id 1229275646, now `DeveloperZo/alonzo-anthologies` (`zo-garden` still shows the pre-rename name `Zo-Garden-eCafe`). `zo-garden` auto-deploys on push with previews `all`. Its latest deployment `dc4746b5` built c6dadfe successfully even though its dashboard output directory says `garden/public`: a Git-connected build uses `pages_build_output_dir` from `wrangler.toml`.
- Verified 2026-10-14 with `curl`: `zo-garden.pages.dev` returns 200 on `/`, `/resume/` and `/ai-governance/` with `og:site_name` "Alonzo's Anthologies", an identical copy of the current site.
- Bulk Redirects are account-level, so they can match a `pages.dev` hostname without a zone. This is Cloudflare's documented way to redirect a `pages.dev` subdomain (from Cloudflare documentation, not tested on this account).

### Risks and open questions

- Search engines may hold `zo-garden.pages.dev` URLs for a while; a 301 is the signal that moves them. Not measured.
- Whether turning off deployments is a single toggle or two (production and preview) in the current dashboard is unverified; AC-4 checks the API result either way.

## Changelog

- 2026-10-14 (late evening): GitHub became the only active host and `zo-garden` now builds the current site from the same repo. Summary, AC-5, dependencies and technical details updated: the old address is a duplicate built on every push, not a stale copy; no ordering with ST-005 remains. Verified with Cloudflare API GETs and `curl`.
- 2026-10-14: Created from TD-002 and the owner default (redirect, deployments off).
