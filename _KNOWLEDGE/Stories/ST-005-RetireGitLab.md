# ST-005 GitHub is the only code home

<!--
Purpose: Retire the GitLab project and every local and public link to it, so GitHub is the single code host in practice as well as by decision.
Status: active
Owner: zo
Human id: retire-gitlab
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

On 2026-10-14 the owner made GitHub the only active code host: there was no specific reason for GitLab, and GitHub suits Claude Code and the job search. The same evening the GitLab project was archived and the live site moved to build from GitHub. What is left: some finished local branches, and a decision on whether to delete the archived project. The local `gitlab` remote was removed on 2026-10-15. The footer source link on this branch points at GitHub.

## User story

**As** Zo as operator, **I want** one remote and no leftover branches, **so that** I cannot push to, or branch from, a place nobody maintains.

**As a** recruiter or reader who clicks the site's source link, **I want** to land on the current repository, **so that** I see the live code and not a frozen copy.

## Status

- Current: `active`
- Next: delete the merged local branches (AC-6) and record whether to delete the archived GitLab project (AC-8). The local `gitlab` remote was removed 2026-10-15 (AC-5).
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** The GitLab project `awilliams9293/alonzo-anthologies` is archived (read-only, history kept). Checked by opening `https://gitlab.com/awilliams9293/alonzo-anthologies`: the page shows the archived notice.
- **AC-2** `origin` is GitHub and current: `git remote get-url origin` prints `https://github.com/DeveloperZo/alonzo-anthologies.git`, local `main` tracks `origin/main`, and `git ls-remote origin refs/heads/main` equals `git rev-parse main`.
- **AC-3** No Cloudflare Pages project builds from GitLab: `cfget /pages/projects` (OPER-003, Procedure B) shows `source.type` `github` for every project.
- **AC-4** Given the live site, when a visitor follows the footer source link, then it opens `https://github.com/DeveloperZo/alonzo-anthologies`. Checked with `curl -s https://alonzo-anthologies.pages.dev/ | grep -o 'href="https://git[a-z]*\.com[^"]*"'`, which prints only the GitHub URL.
- **AC-5** `git remote` prints `origin` only.
- **AC-6** No stale local branch remains: `git branch --merged main` prints only `main` (or each other name is listed in Evidence with a reason to keep it).
- **AC-7** Docs match: [OPER-002](../Documents/Operations/OPER-002-GitHubPush.md) pushes to GitHub only; [TD-001](../Documents/Technical-Debt/completed/TD-001-LegacyGitHub.md) is closed; [ARCH-002](../Architecture/ARCH-002-SourceControl.md) records GitHub as the host and GitLab as archived; `_KNOWLEDGE/Context/` gives no GitLab push or URL instructions.
- **AC-8** A dated decision on the archived GitLab project (keep archived, or delete) is recorded under Decisions.
- **AC-9** A push to `main` deploys: the first push after tonight produces a `Cloudflare Pages: alonzo-anthologies` check run with `success` on that commit, and `https://alonzo-anthologies.pages.dev/` returns 200.

## Scope

- Done on 2026-10-14 (by Zo and the orchestrator, logged in `log.md`): GitHub repo renamed to `DeveloperZo/alonzo-anthologies`; `origin` switched to it; Cloudflare `alonzo-anthologies` recreated from it; GitLab project archived.
- Code: change the footer link in `site/quartz.layout.ts` from GitLab to `https://github.com/DeveloperZo/alonzo-anthologies`.
- Local clone, with Zo's agreement: `git remote remove gitlab`; delete merged branches `rebrand-alonzos-anthologies`, `claude/trusting-clarke-f82a22`, `claude/main-latest-commit-47b73f` and `docs/portable-project-context` with `git branch -d` (all are ancestors of `main`).
- Docs: ARCH-002 and the context files named in AC-7.
- Optional: revoke Cloudflare's authorised application on the GitLab account (User settings, Applications), since nothing on Cloudflare uses GitLab now.

## Out of scope

- `zo-garden`: [ST-004](./ST-004-OneHostname.md). It builds from GitHub, not GitLab.
- CI and branch protection on GitHub: [ST-007](./ST-007-GitHubCi.md).
- The prunable worktree under `C:/Repos/Zo Garden eCafe/.claude/worktrees/`: [ST-011](./ST-011-BuildCleanup.md).
- Rewriting history in completed Stories (ST-001 links into the GitLab project; archived projects stay readable, so the links still resolve).
- A mirror or backup of GitHub elsewhere.

## Additional information

### Dependencies

- None. AC-9 waits on the next real push, which AC-4 can provide.

### Technical details

- Verified 2026-10-14, late evening, with `git remote -v`: `origin` is `https://github.com/DeveloperZo/alonzo-anthologies.git`, `gitlab` is `https://gitlab.com/awilliams9293/alonzo-anthologies.git`. `git branch -vv`: `main` tracks `origin/main` at c6dadfe; `git ls-remote origin` shows `main` at c6dadfe.
- Verified with `git merge-base --is-ancestor <branch> main`: `claude/trusting-clarke-f82a22` (91c5e5b), `rebrand-alonzos-anthologies` (c6dadfe), and `claude/main-latest-commit-47b73f` and `docs/portable-project-context` (both 9ed56c4) are all ancestors of `main`, so `git branch -d` deletes them without losing work. The same four branches also exist on the `gitlab` remote (`git ls-remote gitlab`) and are kept there by the archive.
- Verified with the public GitHub API: repo id 1229275646, public, not archived; the old name `DeveloperZo/Zo-Garden-eCafe` redirects (301) to the same repo.
- Verified with `curl` of the GitLab project page: the archived notice is shown.
- Verified with Cloudflare API GETs: both Pages projects have source type `github` (repo id 1229275646). The GitLab-wired project was deleted at 23:45:26 and recreated from GitHub (log.md). The GitLab project's Cloudflare webhook now points at the deleted project; moot while the project is archived (from the orchestrator, not re-checked).
- Verified with `curl` of the live home page: the footer links to `https://gitlab.com/awilliams9293/alonzo-anthologies` (from `site/quartz.layout.ts` line 48).

### Decisions

- 2026-10-14: GitHub is the only active code host; there was no specific reason for the GitLab move (owner decision). Supersedes this Story's earlier scope, "GitLab is the only code home" (archive GitHub).
- 2026-10-14: Archive GitLab now; deleting it is a later decision (AC-8, open).
- 2026-10-15: Remove the local `gitlab` remote. Its history was the only copy in this clone of commits with `Co-Authored-By: Claude`. The archived project stays until AC-8.

### Evidence

- **AC-1**: met 2026-10-14. GitLab project page shows the archived notice (`curl`); archived by Zo, logged in `log.md`.
- **AC-2**: met 2026-10-14. `git remote get-url origin`, `git branch -vv`, `git ls-remote origin` all as stated in Technical details.
- **AC-3**: met 2026-10-14. Cloudflare API: `alonzo-anthologies` and `zo-garden` both `github`.
- **AC-4**: not met. Footer still links to GitLab.
- **AC-5**: met 2026-10-15. `git remote` prints `origin` only.
- **AC-6**: not met. Four merged branches remain.
- **AC-7**: partly met. OPER-002 rewritten for GitHub and TD-001 closed (2026-10-14). ARCH-002 and the context files not checked by this Story.
- **AC-8**: open.
- **AC-9**: not yet. Production `c7455b17` was the project's creation build (`ad_hoc`), not a push build; the GitHub check run on c6dadfe is `success`.

### Risks and open questions

- Deleting the archived GitLab project later removes the pre-rewrite commits that credit Claude as a co-author. GitHub's branches do not contain those commit ids. Rewritten commits with the same subjects are on GitHub, without the co-author lines. GitHub still serves the old SHAs if you request them.

## Changelog

- 2026-10-15: AC-5 met. Local `gitlab` remote removed so this clone no longer reaches commits that credit an AI agent as a co-author. AC-6 and AC-8 stay open.
- 2026-10-14 (late evening): Rewritten in place and renamed from `ST-005-RetireGitHub.md` ("GitLab is the only code home"). The owner made GitHub the only active host; the Story now retires GitLab. AC-1 to AC-3 met tonight, with evidence; status `active`.
- 2026-10-14: Created from TD-001 and the owner default (archive GitHub, remove remote).
