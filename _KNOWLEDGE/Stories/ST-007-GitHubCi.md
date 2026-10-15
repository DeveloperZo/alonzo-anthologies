# ST-007 Broken builds and leaked keys caught before main

<!--
Purpose: Add a minimal GitHub Actions workflow that runs the site build and a secret scan on pull requests and on main, and protect main so it must pass.
Status: planned
Owner: zo
Human id: github-ci
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

Nothing checks a change before it reaches the main branch, and nothing stops a direct or forced push to it. The only build is Cloudflare's, which runs after the push, and when it fails the old site quietly stays up. Nothing scans for committed keys, and the repository is public. After this work every pull request and every push to main runs the same build Cloudflare runs plus a secret scan, and main cannot take a change while either fails.

## User story

**As** Zo as author, **I want** a failing build or a committed key to stop my pull request, **so that** I find out before the change is on main and the live site.

## Status

- Current: `planned`
- Next: write the workflow on a branch and open a pull request to see the first run. Needs `gh auth login` for the API checks below.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** Given a pull request against `main`, when it is opened, then a GitHub Actions run executes a build job (`bash ./build.sh`) and a secret scan job, both visible as checks on the pull request.
- **AC-2** A throwaway pull request that plants a fake token pattern (for example a string shaped like `ghp_` plus 36 characters) fails the secret scan job. The pull request is closed unmerged and its branch deleted.
- **AC-3** A throwaway pull request that breaks the build (for example a syntax error in `site/quartz.config.ts`) fails the build job. Closed unmerged.
- **AC-4** A run on `main` at the HEAD after merge passes. Checked with `gh run list --branch main` or `gh api repos/DeveloperZo/alonzo-anthologies/actions/runs?branch=main`.
- **AC-5** `main` is protected and requires both jobs: `gh api repos/DeveloperZo/alonzo-anthologies/branches/main/protection` lists them under `required_status_checks`, and force pushes and deletion are disallowed. The unauthenticated `curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/branches/main` shows `"protected": true`.
- **AC-6** The workflow does not deploy and holds no Cloudflare token: no `wrangler` call in `.github/workflows/`, and `gh secret list` shows no Cloudflare secret. Production still deploys through the Git integration: the merge produces a `Cloudflare Pages: alonzo-anthologies` check run with `success`, and `https://alonzo-anthologies.pages.dev/` returns 200.
- **AC-7** [TD-003](../Documents/Technical-Debt/TD-003-NoCi.md) is closed with this Story as evidence; [ARCH-002](../Architecture/ARCH-002-SourceControl.md) and [OPER-002](../Documents/Operations/OPER-002-GitHubPush.md) describe the workflow and the protection, and keep the manual secret grep only as a pre-push habit, if at all.

## Scope

- A root `.github/workflows/ci.yml` (the name is a suggestion) with two jobs: `build` (`actions/setup-node` with Node 22.16.0, matching the Pages `NODE_VERSION`, then `bash ./build.sh`) and a secret scan (for example the gitleaks action, or GitHub's own secret scanning if it covers the need; decide in the pull request and record it).
- Triggers: `pull_request` against `main` and `push` to `main`.
- npm cache for `site/` and `resumeContent/` keyed on their lockfiles, if the first run is slow.
- Branch protection (or a ruleset) on `main`: require both checks, block force pushes and deletion.

## Out of scope

- Deploying from CI. Cloudflare's Git integration stays the deploy path.
- Tests, linting or type checks beyond what `build.sh` already runs.
- Making the build fail when `/resume` is missing: [ST-009](./ST-009-ResumeGuard.md). This workflow will run that guard once it exists.
- Requiring pull requests for every change (required reviews). Whether direct pushes to `main` stay allowed for the owner is Zo's call; required checks apply to pull requests either way.

## Additional information

### Dependencies

- `gh` authenticated (`gh auth login`) for AC-4, AC-5 and AC-6. Installed (2.102.0), not yet authenticated on 2026-10-14.
- [ST-009](./ST-009-ResumeGuard.md) and [ST-010](./ST-010-QuartzUpgrade.md) benefit from this workflow; ST-010's test upgrade should run through it.

### Technical details

- Verified 2026-10-14, late evening: no `.github/` at the repo root (`ls`), and the GitHub Actions API lists 0 workflows (`curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/actions/workflows`, public repo, no auth).
- Verified 2026-10-14: `main` is not protected (`curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/branches/main` returns `"protected": false`). The detailed protection endpoint needs auth and was not called.
- Verified 2026-10-14 by `git ls-files`: the vendored Quartz workflows under `site/.github/` are gone (deleted in c6dadfe). GitHub only runs workflows from the root `.github/workflows/`, so nothing runs today.
- The only checks on c6dadfe are the two Cloudflare Pages check runs (public check-runs API).
- GitHub Actions sets `CI=true`. Create React App treats lint warnings as errors when `CI=true`, so the resume build may fail in CI where it passes locally. ARCH-005 records no lint warnings on 2026-10-14; the first run confirms it.

### Risks and open questions

- Actions minutes: free and unlimited for public repositories on GitHub-hosted runners (GitHub's published policy, not checked on this account).
- Which secret scanner to use is open; record the choice under Decisions when made.

## Changelog

- 2026-10-14 (late evening): Renamed from `ST-007-GitLabCi.md` and rewritten for GitHub Actions and branch protection, after GitHub became the only active host. AC-5 now covers protection of `main`, which is unprotected today (public API). GitLab-specific settings dropped.
- 2026-10-14: Created from TD-003.
