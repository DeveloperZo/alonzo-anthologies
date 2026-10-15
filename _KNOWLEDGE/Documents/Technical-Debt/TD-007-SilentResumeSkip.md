# TD-007 Silent resume skip

<!--
Purpose: Record that the site build can succeed and deploy without /resume, and what would make that a failure.
Status: open
Owner: zo
Human id: silent-resume-skip
Update trigger: when stageResumeSpa.ts or build.sh changes how a missing or stale resume build is handled
Last updated: 2026-10-14
-->

## Current impact

`StageResumeSpa` (`site/quartz/plugins/emitters/stageResumeSpa.ts`) logs
a yellow warning and returns, leaving the Quartz build at exit 0, when:

- `resumeContent/package.json` is missing (lines 45 to 52), or
- `resumeContent/build/index.html` is missing after the build step
  (lines 58 to 68).

`build.sh` also skips the resume install with a message when
`resumeContent/package.json` is missing (lines 8 to 13). In either case
Cloudflare would deploy a site with no `/resume`, while the home page
and `interactive-resume.md` still link to it, so the links 404.

Separately, `QUARTZ_SKIP_RESUME_BUILD=1` and `--serve` partial rebuilds
copy whatever `resumeContent/build/` holds, which can be older than
`src/`.

A failed `npm run build` does throw (lines 27 to 31), and Quartz prints
the error and exits 1 (`site/quartz/util/trace.ts`), so that path is
fine.

## Root cause

The skips were written for incomplete clones and Quartz-only previews
(log text: "incomplete clone"). The same code path runs in production,
where `/resume` is required.

## Remediation

[ST-009 Resume guard](../../Stories/ST-009-ResumeGuard.md). Smallest fix: fail the build when `CI` or `CF_PAGES` is set
and `/resume` was not staged; keep the warning for local runs.

## Acceptance criteria

- With `resumeContent/` absent and `CF_PAGES=1`, `bash ./build.sh` exits
  non-zero with a message naming `/resume`.
- With `resumeContent/` absent locally and no CI variables, the build
  still succeeds with the warning.

## Evidence and status

- Behaviour read from source on 2026-10-14 and re-checked at HEAD c6dadfe
  (line numbers unchanged); not reproduced by removing `resumeContent/`.
- The normal path works: Cloudflare deploy `c7455b17` (2026-10-14) serves
  `/resume/` with status 200, so the skip did not fire there.
- Whether Cloudflare sets `CF_PAGES` in this project's build is unverified.

## Changelog

- 2026-10-14: Renumbered from TD-009. Remediation now points at ST-009. Evidence re-checked at c6dadfe; added that a failed resume build exits 1 via `trace.ts`, and that production staged `/resume/` normally.
- 2026-10-14: Created while writing ARCH-004.
