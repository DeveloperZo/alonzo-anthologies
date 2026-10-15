# TD-006 Quartz patches

<!--
Purpose: Record that the vendored Quartz framework carries untracked local patches that a framework refresh would silently overwrite, breaking /resume.
Status: open
Owner: zo
Human id: quartz-patches
Update trigger: when Quartz is upgraded, setup-quartz.ps1 is run, or a patch is added to or removed from site/quartz/
Last updated: 2026-10-14
-->

## Current impact

Three files inside the vendored framework (`site/quartz/`, Quartz 4.5.2)
carry repo-specific changes, and nothing outside ARCH-004 records them:

| File | Local change |
| --- | --- |
| `site/quartz/plugins/emitters/stageResumeSpa.ts` | New file: builds and stages the resume SPA at `/resume` |
| `site/quartz/plugins/emitters/index.ts:13` | Exports `StageResumeSpa` |
| `site/quartz/components/scripts/spa.inline.ts:27-29, 40, 141` | `isInteractiveResumeUrl` makes `/resume` links full page loads instead of SPA swaps |

`site/setup-quartz.ps1` refreshes Quartz by robocopying a fresh upstream
clone over `site/` (everything except `content/` and `.git`). Run today,
it would overwrite `index.ts` and `spa.inline.ts`, and also the
repo-owned `site/quartz.config.ts` (site name, `baseUrl`, the
`StageResumeSpa` emitter entry), `site/quartz.layout.ts`, `package.json`
and `package-lock.json`, and it would bring back the upstream `.github/`
folder deleted in c6dadfe. `stageResumeSpa.ts` itself would survive,
because upstream has no file of that name, but nothing would load it.
The build would then either succeed without `/resume` (upstream config
does not list the emitter) or, if the config were restored by hand, fail
on the missing `Plugin.StageResumeSpa` export. With the export restored
but not the router bypass, Quartz would try to swap the React page into
its own shell and `/resume` would break when reached from a site link.

## Root cause

Quartz has no plugin directory outside its own tree and is meant to be
used as a fork, so the emitter and the router bypass were written in
place. No patch list or upstream diff was kept, and the only refresh tool
is a blind copy.

## Remediation

[ST-010 Quartz upgrade](../../Stories/ST-010-QuartzUpgrade.md): a
documented, tested Quartz upgrade path that names every local patch and
re-applies it. ARCH-004 already lists the patched files in its
components table; the open part is the procedure and a tested upgrade.

## Acceptance criteria

- A written procedure for upgrading Quartz names all three files, plus
  `quartz.config.ts` and `quartz.layout.ts`, and how to re-apply each
  change.
- After a test upgrade, `bash ./build.sh` exits 0, `site/public/resume/index.html`
  exists, and clicking the resume link on the site home page loads the
  app.

## Evidence and status

- Re-verified 2026-10-14 at HEAD c6dadfe by grep:
  `grep -rln -i "resume" site/quartz --include=*.ts` returns only these
  three files plus an unrelated Spanish locale string (`es-ES.ts`).
- `setup-quartz.ps1` behaviour read from source (line 26, robocopy
  `/E /XD ".git" "content"`); not run. That upstream Quartz ships its own
  `quartz.config.ts`, `quartz.layout.ts` and `.github/` is from knowledge
  of the upstream repo, not checked against a fresh clone.
- The patches work in production: deploy `c7455b17` (2026-10-14) serves
  `/resume/` with status 200 (operations log).

## Changelog

- 2026-10-14: Renumbered from TD-008. Remediation now points at ST-010. Widened the impact: the refresh script also overwrites `quartz.config.ts`, `quartz.layout.ts` and the package files and restores `.github/`. Dropped the stale reference to ARCH-001 and to ARCH-004's numbered rules (ARCH-004 is now an area page).
- 2026-10-14: Created while writing ARCH-004.
