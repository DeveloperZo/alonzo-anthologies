# ST-011 Build files say only what is true

<!--
Purpose: Remove dead build scripts, a stale resume README, an unused index.html script and an orphan worktree, so the build has one documented path.
Status: planned
Owner: zo
Human id: build-cleanup
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

A few leftovers describe a build that no longer exists: a second build command nobody runs, a diagram copy step the framework already does, a resume README that explains the build wrongly, an unused script in the resume's page shell, and a stale working copy from before the repository was renamed. None breaks the live site, but each misleads whoever reads it next. After this work the repository holds one build path and the docs that describe it are right.

## User story

**As** Zo as author, **I want** the build files and READMEs to describe only the build that runs, **so that** I, or an agent, do not follow a dead path.

## Status

- Current: `planned`
- Next: confirm a local `bash ./build.sh` still copies the diagram SVGs without `sync-diagrams.mjs`.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** `site/sync-diagrams.mjs` is deleted, and `site/package.json` has no `build` or `sync-diagrams` script (`grep -n "sync-diagrams\|\"build\"" site/package.json` prints nothing).
- **AC-2** After a clean local `bash ./build.sh` (exit 0), every SVG under `site/content/` exists at the same relative path under `site/public/`. Check: `cd site && find content -name '*.svg' | sed 's/^content/public/' | xargs ls > /dev/null` exits 0.
- **AC-3** `resumeContent/README.md` names the npm package `alonzos-anthologies` (as in `resumeContent/package.json`), and says `build.sh` runs `npm ci` in `resumeContent/` while Quartz's `StageResumeSpa` emitter runs `npm run build` and copies `build/` into `site/public/resume/`. The "Quartz-only local preview" paragraph matches `stageResumeSpa.ts` (a full build runs the resume build itself; only `QUARTZ_SKIP_RESUME_BUILD=1` and `--serve` partial rebuilds reuse an existing `build/`).
- **AC-4** The `window.publicUrl` script is gone from `resumeContent/public/index.html` (`grep -rn publicUrl resumeContent/public resumeContent/src` prints nothing), or, if something is found to need it, a comment beside it names that consumer.
- **AC-5** The orphan worktree is gone: `git worktree list` shows only the main working tree, `.git/worktrees/main-latest-commit-47b73f` does not exist, and `.claude/worktrees/main-latest-commit-47b73f` is deleted. Before deletion, its HEAD (9ed56c4) is confirmed an ancestor of `main` and it has no uncommitted changes (both true on 2026-10-14).
- **AC-6** Deployed: after the change is pushed, the Pages deployment is green, and on `https://alonzo-anthologies.pages.dev` the AI governance diagrams (for example `/ai-governance/part-1/diagrams/DIA-001-training-pipeline.svg`) and `/resume/` return 200.
- **AC-7** [ARCH-004](../Architecture/ARCH-004-SiteBuild.md) and [ARCH-005](../Architecture/ARCH-005-ResumeSpa.md) drop the Change Map rows this Story resolves.

## Scope

- Delete `site/sync-diagrams.mjs`; remove the `build` and `sync-diagrams` scripts from `site/package.json`.
- Correct the stale lines in `resumeContent/README.md` (line 3 package name; line 8 build description; the Quartz-only preview paragraph).
- Remove the `window.publicUrl` script block (lines 31 to 34) from `resumeContent/public/index.html`.
- Prune the orphan worktree: `git worktree prune` (git already reports it prunable), then delete the `.claude/worktrees/main-latest-commit-47b73f` directory. Decide whether to delete the `claude/main-latest-commit-47b73f` and `docs/portable-project-context` branches, both at 9ed56c4 and already in `main`.

## Out of scope

- Loose files at the repository root (for example `ai-systems-explainer.html`). Owner decision 2026-10-14: leave them alone for now.
- `resumeContent/.gitignore` Jekyll and GitHub Pages leftovers (an ARCH-005 Change Map row). Not in this Story; a candidate for a later cleanup.
- The `.claude/worktrees/` line in `.git/info/exclude`. It is local, untracked and harmless.
- Quartz framework patches and the upgrade procedure: [ST-010](./ST-010-QuartzUpgrade.md).

## Additional information

### Dependencies

- None. Doing this before [ST-010](./ST-010-QuartzUpgrade.md) keeps dead scripts out of its patch list.

### Technical details

- Verified 2026-10-14 by reading `site/package.json`: `"sync-diagrams": "node sync-diagrams.mjs"` and `"build": "npx quartz build && node sync-diagrams.mjs"`. `build.sh` runs `npx quartz build` directly and never calls either. ARCH-004 records that Quartz's `Assets` emitter already copies the SVGs.
- Verified 2026-10-14 by reading `site/sync-diagrams.mjs`: it copies every `.svg` under `content/` into `public/`.
- Verified 2026-10-14 by reading `resumeContent/README.md` against `build.sh`, `stageResumeSpa.ts` and `resumeContent/package.json` (`"name": "alonzos-anthologies"`).
- Verified 2026-10-14: `resumeContent/public/index.html` lines 31 to 34 set `window.publicUrl = "%PUBLIC_URL%"`; grep finds no reader in `resumeContent/src`.
- Verified 2026-10-14: `git worktree list` shows the entry as `C:/Repos/Zo Garden eCafe/.claude/worktrees/main-latest-commit-47b73f 9ed56c4 (detached HEAD) prunable`. That path no longer exists; the directory now sits at `.claude/worktrees/main-latest-commit-47b73f` inside this repo, its `.git` file points at the old path, and it is hidden by `.git/info/exclude`. `git status` against its index shows no changes, and `git merge-base --is-ancestor 9ed56c4 main` succeeds.

## Changelog

- 2026-10-14: Created from the ARCH-004 and ARCH-005 Change Maps and a read of each named file.
