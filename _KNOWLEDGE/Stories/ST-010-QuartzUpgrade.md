# ST-010 Quartz can be upgraded without breaking the resume

<!--
Purpose: Write and prove a Quartz upgrade procedure that names and re-applies every repo-local change to the vendored framework.
Status: planned
Owner: zo
Human id: quartz-upgrade
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

The site runs on a copy of the Quartz framework that carries a few local changes, and nothing lists them. The only refresh script copies a fresh Quartz over the whole site folder, which would wipe those changes and break the resume link or the build. After this work there is a written upgrade procedure that names every local change and how to put it back, and it has been tried once on a branch with a green preview.

## User story

**As** Zo as operator, **I want** an upgrade procedure that I can follow without remembering the local patches, **so that** taking a Quartz update does not break `/resume` or the build.

## Status

- Current: `planned`
- Next: list every file in `site/` that differs from upstream Quartz 4.5.2.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** A written procedure exists (an OPER runbook, linked from [ARCH-004](../Architecture/ARCH-004-SiteBuild.md)) that names every repo-local change in `site/` outside `content/`, including at least `quartz/plugins/emitters/stageResumeSpa.ts`, `quartz/plugins/emitters/index.ts`, `quartz/components/scripts/spa.inline.ts`, `quartz.config.ts`, `quartz.layout.ts` and `package.json`, and says how to re-apply each.
- **AC-2** The list is complete: a diff of `site/` (excluding `content/`, `public/`, `node_modules/` and `.quartz-cache/`) against upstream Quartz at the vendored version shows no file the procedure does not name.
- **AC-3** A test upgrade on a branch, following only the procedure, gives `bash ./build.sh` exit 0 and `site/public/resume/index.html` present.
- **AC-4** The branch's Cloudflare Pages preview deployment is green, and on the preview URL clicking the resume link on the home page loads the resume app (a full page load, not a blank page).
- **AC-5** `site/setup-quartz.ps1` is either removed or changed so it cannot silently overwrite the patched files (for example it refuses to run, or excludes them and prints the procedure's link).
- **AC-6** Whether the test upgrade is merged is a separate decision; if it is, production at `https://alonzo-anthologies.pages.dev/` and `/resume/` return 200 after a green deployment. [TD-006](../Documents/Technical-Debt/TD-006-QuartzPatches.md) is closed when AC-1 to AC-5 pass.

## Scope

- Produce the upstream diff and the patch list.
- Write the upgrade runbook (new OPER document) and link it from ARCH-004 and TD-006.
- Run one test upgrade on a branch to the latest Quartz 4 release and check the preview.
- Fix or retire `setup-quartz.ps1`.

## Out of scope

- Moving Quartz to an upstream git remote with rebased patch commits (TD-006's larger fix). The procedure may recommend it for later.
- Merging the test upgrade to production if it brings unrelated layout changes; that is Zo's call.
- Changing the patches themselves, beyond what [ST-009](./ST-009-ResumeGuard.md) adds.

## Additional information

### Dependencies

- [ST-009](./ST-009-ResumeGuard.md) first or alongside, because it adds another edit inside `stageResumeSpa.ts` that the list must include.
- [ST-007](./ST-007-GitHubCi.md) helps: the test upgrade's pull request then runs the build in CI as well as in the Pages preview.
- [ST-011](./ST-011-BuildCleanup.md) removes the `build` and `sync-diagrams` scripts from `site/package.json`; do it first so the patch list does not carry dead lines.

### Technical details

- Verified 2026-10-14 by reading `site/setup-quartz.ps1`: it clones upstream Quartz and runs `robocopy $staging $siteRoot /E /XD ".git" "content"`, so it overwrites every framework file, including `quartz.config.ts`, `quartz.layout.ts` and `package.json`, not only the three TD-006 lists.
- Verified 2026-10-14 from `site/package.json`: the vendored version is `4.5.2`.
- From TD-006 (grep, 2026-10-14): the resume-related patches are the three files it names.

## Changelog

- 2026-10-14 (late evening): ST-007 is now GitHub Actions; link and wording updated (pull request, not merge request).
- 2026-10-14: Created from TD-006.
