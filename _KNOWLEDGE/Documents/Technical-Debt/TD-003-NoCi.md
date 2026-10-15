# TD-003 No CI

<!--
Purpose: Record that the repo runs no CI, so the Cloudflare Pages production build is the only build check and it runs after code is already on main.
Status: open
Owner: zo
Human id: no-ci
Update trigger: when a workflow is added under .github/workflows/, when branch protection on main changes, or when work starts going through pull requests
Last updated: 2026-10-14
-->

## Current impact

- A broken `build.sh`, Quartz build or `resumeContent/` build is only found after it is on `main`. Cloudflare leaves the previous deployment serving, so the failure is quiet.
- Nothing checks the no-tracked-secrets rules in [ARCH-002](../../Architecture/ARCH-002-SourceControl.md) on push; they rely on the manual scan in [OPER-002](../Operations/OPER-002-GitHubPush.md). The repo is public on GitHub, so a pushed secret is public at once.
- `main` on GitHub has no branch protection, so nothing at the host stops a direct or forced push either.

## Root cause

[ARCH-001](../../Architecture/ARCH-001-PlatformOverview.md) deferred CI and
release tooling "until a second project is under the roof". The Cloudflare
build was treated as the build check. The host moved twice on 2026-10-14
(GitHub to GitLab, then back), and no CI was set up on either.

## Remediation

[ST-007 GitHub CI](../../Stories/ST-007-GitHubCi.md): broken builds and
leaked tokens are caught before they reach `main`. Add a root
`.github/workflows/` workflow that runs `bash ./build.sh` and a secret scan on
pull requests and on pushes to `main`, then protect `main` with that check
required.

## Acceptance criteria

- A pull request run of the workflow builds the site and scans for secrets, and fails on a planted test pattern.
- A run on `main` passes on the current HEAD.
- `main` branch protection requires the workflow's checks to pass before merge.

## Evidence and status

Open. Verified 2026-10-14, late evening:

- No `.github/` at the repo root (`ls .github` fails), and the GitHub Actions API for `DeveloperZo/alonzo-anthologies` lists 0 workflows (`curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/actions/workflows`, unauthenticated, public repo).
- The only checks on `main` (c6dadfe) are the two Cloudflare Pages check runs (public check-runs API).
- `main` is not protected: `curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/branches/main` returns `"protected": false`.
- `site/.github/` (four vendored upstream Quartz workflows plus templates) was deleted in `c6dadfe`: `git show --stat c6dadfe` lists the deletions and `git ls-files | grep '^site/\.github'` prints nothing.
- Earlier the same day, on GitLab (now archived): no `.gitlab-ci.yml`, empty `ci_config_path`, `only_allow_merge_if_pipeline_succeeds` false (`glab api`). Historical.

## Changelog

- 2026-10-14 (late evening): Rewritten for GitHub as the only active host. Remediation is now ST-007 GitHub CI (GitHub Actions and branch protection); acceptance criteria restated for pull requests and required checks. Added the unprotected `main` (public GitHub API). GitLab evidence kept as history.
- 2026-10-14: Corrected the stale `site/.github/workflows/` statements (deleted in c6dadfe, verified with git). Remediation now links ST-007.
- 2026-10-14: Restructured to the Technical debt sections in the Document definition.
- 2026-10-14: Created from `glab api` project settings and pipelines, and a check for `.gitlab-ci.yml`.
