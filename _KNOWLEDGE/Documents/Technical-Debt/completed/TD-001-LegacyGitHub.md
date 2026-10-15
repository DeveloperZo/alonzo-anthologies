# TD-001 Legacy GitHub

<!--
Purpose: Record that a legacy public GitHub repo and a local remote pointing at it existed after GitLab became the only code host, and how the debt closed when GitHub became the home again.
Status: completed
Owner: zo
Human id: legacy-github
Update trigger: none expected; reopen only if a second, unmaintained public copy of the code appears again
Last updated: 2026-10-14
-->

Closed 2026-10-14. Not by retiring GitHub, as planned, but by making GitHub
the canonical code host again. The leftover now runs the other way: the
archived GitLab project, handled by
[ST-005 Retire GitLab](../../../Stories/ST-005-RetireGitLab.md).

## Current impact

None now. While open (earlier on 2026-10-14):

- **A second public copy of the code.** `github.com/DeveloperZo/Zo-Garden-eCafe` was public and held history up to `d59196a`, under the old brand.
- **A live wire to an old site.** The repo was still connected to the legacy Cloudflare Pages project `zo-garden`, so a push to it would start a `zo-garden` build.
- **A trap in the local clone.** `git remote -v` listed `github`, and local branch `claude/trusting-clarke-f82a22` tracked `github/main`.

## Root cause

The GitLab project was created on 2026-10-14 and the GitHub repo was first kept
as a hand-pushed backup. Later the same day the owner decided GitLab is the
only code host (commit `c6dadfe` removed GitHub from the docs and the code),
but the repo, the remote and the Cloudflare connection were not retired with
it.

## Remediation

Planned as ST-005 "GitLab is the only code home" (archive GitHub, remove the
remote). Superseded the same evening by an owner decision: there was no
specific reason for GitLab, and GitHub suits Claude Code and the job search,
so GitHub became the only active host. The GitHub repo was renamed and made
current instead of archived. ST-005 was rewritten as
[ST-005 Retire GitLab](../../../Stories/ST-005-RetireGitLab.md).

## Acceptance criteria

The original criteria assumed retirement and no longer apply. The debt was
"a public copy that looks current but is not, and a remote that can publish to
it". It counts as fixed when:

- The public GitHub repo is the current source: its `main` equals local `main`.
- No local remote points at a stale, writable public copy.
- No Cloudflare Pages project builds from a repo other than the canonical one.

## Evidence and status

Completed 2026-10-14. Verified the same evening:

- GitHub API: `DeveloperZo/alonzo-anthologies`, repo id 1229275646, public, `archived: false`; the old name `DeveloperZo/Zo-Garden-eCafe` answers with a 301 to the same repo id (`curl https://api.github.com/repos/...`). Renamed by Zo.
- `git remote -v`: `origin` is `https://github.com/DeveloperZo/alonzo-anthologies.git`; `gitlab` is the archived project. `git ls-remote origin` shows `main` at c6dadfe, equal to local `main`.
- `git branch -vv`: `claude/trusting-clarke-f82a22` now tracks `origin/main` (behind 31) and is an ancestor of `main`; it is no longer a path to a stale repo. Its deletion is tracked in ST-005.
- Cloudflare API: both Pages projects (`alonzo-anthologies` and `zo-garden`) build from repo id 1229275646, the canonical repo. `zo-garden` is a duplicate hostname, tracked in [TD-002](../TD-002-DuplicatePages.md).
- GitLab project page reports the project as archived (`curl` of the project page; archived by Zo, logged in `log.md`).

## Changelog

- 2026-10-14: Closed and moved to `completed/`. Resolved by GitHub becoming the canonical host (repo renamed to `DeveloperZo/alonzo-anthologies`, `origin` switched, Cloudflare `alonzo-anthologies` recreated from it), not by retirement. Acceptance criteria restated for the outcome; evidence from `git`, the public GitHub API, Cloudflare API GETs and `curl`.
- 2026-10-14: Rescoped and renamed from TD-001 Legacy GitHub (`TD-001-LegacyGitHub.md`). GitLab became the only host in c6dadfe, so the debt is no longer a manual or misnamed backup but a leftover repo and remote. Remediation is now ST-005; the mirror proposal is dropped.
- 2026-10-14: Restructured to the Technical debt sections in the Document definition.
- 2026-10-14: Created from a read-only audit (`git remote -v`, `git ls-remote` against both GitHub URLs, GitHub public API, `glab api`).
