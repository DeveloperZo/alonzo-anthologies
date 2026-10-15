# ST-009 Production never ships without the resume

<!--
Purpose: Make a production or CI build fail when /resume was not staged, while keeping the warning-only behaviour for local Quartz previews.
Status: planned
Owner: zo
Human id: resume-guard
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

The site build can finish successfully without the interactive resume. When the resume folder or its build output is missing, the build prints a yellow warning and carries on, and Cloudflare would then publish a site whose resume links lead nowhere. After this work, a build on Cloudflare or in CI stops with a clear error instead, while a local preview without the resume still works.

## User story

**As a** recruiter following the resume link, **I want** the resume to be there, **so that** I am not sent to a missing page.

**As** Zo as operator, **I want** a production build without `/resume` to fail loudly, **so that** the previous good deployment keeps serving instead of a broken one.

## Status

- Current: `planned`
- Next: confirm which environment variable Cloudflare Pages sets in this project's build.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** With `resumeContent/` absent (moved aside in a scratch clone) and `CF_PAGES=1`, `bash ./build.sh` exits non-zero and its last error line names `/resume`.
- **AC-2** With `resumeContent/build/index.html` missing after the resume build step and `CI=true`, the Quartz build exits non-zero with a message naming `/resume`.
- **AC-3** With `resumeContent/` absent and neither `CF_PAGES` nor `CI` set, `bash ./build.sh` still exits 0 and prints the existing warning.
- **AC-4** `QUARTZ_SKIP_RESUME_BUILD=1` in a production or CI build is refused (non-zero exit), so a stale `build/` cannot be shipped.
- **AC-5** Cloudflare sets the variable the guard reads: a production deployment log for `alonzo-anthologies` shows the guard's "production build" line, and the deployment is green with `https://alonzo-anthologies.pages.dev/resume/` returning 200.
- **AC-6** [TD-007](../Documents/Technical-Debt/TD-007-SilentResumeSkip.md) is closed with this Story as evidence; [ARCH-004](../Architecture/ARCH-004-SiteBuild.md) and [TD-006](../Documents/Technical-Debt/TD-006-QuartzPatches.md)'s patch list include the guard.

## Scope

- In `site/quartz/plugins/emitters/stageResumeSpa.ts`: when `CF_PAGES` or `CI` is set, throw instead of warning at the two skip points (missing `package.json`, missing `build/index.html`), and reject `QUARTZ_SKIP_RESUME_BUILD=1`.
- In `build.sh`: exit non-zero instead of skipping the resume install when `CF_PAGES` or `CI` is set.
- Print one line naming the mode ("production build: /resume required") so AC-5 can be read from the log.

## Out of scope

- The `--serve` partial rebuild path, which copies whatever `build/` holds; it is local only.
- Checking that the staged resume is the right version beyond existing.
- Adding CI itself: [ST-007](./ST-007-GitHubCi.md).

## Additional information

### Dependencies

- None to start. Once [ST-007](./ST-007-GitHubCi.md) lands, its GitHub Actions workflow (which sets `CI=true`) runs this guard on every pull request.
- This adds a fourth repo-local edit inside the vendored framework; [ST-010](./ST-010-QuartzUpgrade.md) must list it.

### Technical details

- Verified 2026-10-14 by reading `stageResumeSpa.ts`: the missing-`package.json` and missing-`build/index.html` branches log in yellow and `return`; a failed `npm run build` throws.
- Verified 2026-10-14 by reading `build.sh`: it skips `npm ci` in `resumeContent/` with an "incomplete clone" message when `package.json` is missing.
- Unverified: that Cloudflare Pages sets `CF_PAGES=1` in this project's build. Cloudflare documents it; AC-5 confirms it on this project.

## Changelog

- 2026-10-14 (late evening): ST-007 is now GitHub Actions; links and wording updated (pull request, not merge request).
- 2026-10-14: Created from TD-007.
