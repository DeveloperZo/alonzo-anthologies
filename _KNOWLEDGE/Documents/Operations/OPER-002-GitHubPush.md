# OPER-002 GitHub push

<!--
Purpose: How to push main to GitHub (which deploys), after a secret check, and confirm Cloudflare Pages built it.
Status: draft
Owner: zo
Human id: github-push
Update trigger: when the GitHub repo URL, branch protection or the Cloudflare Git connection changes, when CI is added (ST-007), or when gh auth changes
Last updated: 2026-10-14
-->

GitHub (`origin`, `DeveloperZo/alonzo-anthologies`) is the only active code
host as of 2026-10-14. A push to `main` is a production deploy. The steps
below are numbered to match
[DIA-102](../../Diagrams/DIA-102-SourceControl.svg) and
[ARCH-002](../../Architecture/ARCH-002-SourceControl.md).

The GitLab project is archived and the local `gitlab` remote is kept only as
a read-only reference: never push to it (see
[ST-005](../../Stories/ST-005-RetireGitLab.md)).

A push to `main` currently deploys twice: to `alonzo-anthologies` and to the
legacy `zo-garden` project, which builds from the same repo. That is expected
until [ST-004](../../Stories/ST-004-OneHostname.md) turns `zo-garden` off; it
is not an error.

## Modes and prerequisites

- **Mode:** your local `main` has commits that `origin/main` does not (`git log origin/main..main --oneline` prints something). The same steps work for a work branch (it deploys to a preview URL instead of production); replace `main` with the branch name.
- Git Bash (Windows) or any POSIX shell, at the repo root, with `curl`.
- Push rights to `DeveloperZo/alonzo-anthologies` through git's stored HTTPS credentials. The push tonight (2026-10-14, logged in `log.md`) worked with them.
- Optional: `gh` (installed, 2.102.0) logged in with `gh auth login`. Not yet authenticated on 2026-10-14. Step 4 works without it because the repo is public.
- The `origin` remote is GitHub:

  ```bash
  git remote get-url origin
  # https://github.com/DeveloperZo/alonzo-anthologies.git
  ```

  Verified 2026-10-14 with `git remote -v`, which also lists `gitlab` (the archived project). `main` tracks `origin/main`.
- Branch protection: none. The public GitHub API reports `"protected": false` for `main` (verified 2026-10-14 with `curl https://api.github.com/repos/DeveloperZo/alonzo-anthologies/branches/main`). Force pushes are therefore not blocked by the host; never force-push `main`. Protection is planned in [ST-007](../../Stories/ST-007-GitHubCi.md).

## Procedure

1. **Scan for secrets.** The first command must print `ok`; the others must print nothing.

   ```bash
   git check-ignore -q _ENV/x && git check-ignore -q .env && echo ok
   git ls-files | grep -E '^_ENV/|(^|/)\.env'
   git log -p origin/main..main | grep -nE 'cfat_|glpat-|ghp_|github_pat_'
   ```

   If anything prints, stop. Do not push. See Troubleshooting.

2. **Push to GitHub.** First make sure you are not behind:

   ```bash
   git fetch origin
   git status -sb                        # must not say "behind"
   git log origin/main..main --oneline   # the commits you are about to publish
   git push origin main
   ```

   If behind: `git pull --rebase origin main`, then repeat step 1.

3. **GitHub tells Cloudflare.** Nothing to run: the Cloudflare Pages GitHub App receives the push. Step 4 is how you know it built.

4. **Confirm GitHub has the commit and Cloudflare built it.** The check run can take a few minutes to appear and a few more to finish.

   ```bash
   git ls-remote origin refs/heads/main     # SHA must equal: git rev-parse main
   curl -s "https://api.github.com/repos/DeveloperZo/alonzo-anthologies/commits/$(git rev-parse main)/check-runs" \
     | grep -E '"(name|status|conclusion|details_url)"'
   ```

   Look for `"name": "Cloudflare Pages: alonzo-anthologies"` with `"conclusion": "success"`; its `details_url` names the deployment. A second run named `Cloudflare Pages` (its `details_url` names `zo-garden`) comes from the legacy project. Once `gh` is authenticated, `gh api repos/DeveloperZo/alonzo-anthologies/commits/<sha>/check-runs` returns the same. The Cloudflare deployments API (OPER-001, Verification checks) is the alternative.

5. **Check the live site.** Run the verification checks in [OPER-001](./OPER-001-CloudflareDeploy.md).

## Verification checks

- `git rev-parse main origin/main` prints the same SHA twice.
- The GitHub check runs for that SHA include `Cloudflare Pages: alonzo-anthologies` with `success`. On 2026-10-14 the check run for c6dadfe was `completed`, `success`, pointing at deployment `c7455b17` (verified with the `curl` in step 4, unauthenticated).
- `curl -s -o /dev/null -w '%{http_code}\n' https://alonzo-anthologies.pages.dev/` prints `200` (it did on 2026-10-14, verified).

Status: draft. The push to GitHub was run in earnest on 2026-10-14 during the host move (logged in `log.md`): `origin/main` is c6dadfe (`git ls-remote origin`). Production deployment `c7455b17` came from the project's creation build (trigger `ad_hoc`), not from a push, so a push-triggered build on the recreated `alonzo-anthologies` project is not yet observed. The legacy `zo-garden` did build the push (`dc4746b5`, `github:push`), which shows the GitHub push path fires. The first real push after tonight should be logged.

## Troubleshooting and fallback

- **Step 1 prints a tracked secret or a token prefix.** Do not push. Unstage or amend the local commit so the value is gone (`git reset` the commit, edit, recommit), then rerun step 1. If the value was already pushed anywhere, treat it as exposed: revoke it at its issuer first (Cloudflare dashboard for a `cfat_` token, see [OPER-003](./OPER-003-CloudflareCredentials.md)), then record what was done in `log.md`. GitHub is public: a pushed secret is public at once.
- **`_ENV/` is not ignored.** Stop. Restore the `_ENV/` line in `.gitignore` and commit it before anything else.
- **Push rejected as non-fast-forward.** You skipped the fetch in step 2. Rebase onto `origin/main` and push again. Never force; nothing on GitHub prevents it today, so this rule is yours to keep.
- **No `Cloudflare Pages: alonzo-anthologies` check run after ten minutes.** Check in the Cloudflare dashboard that the project's Git connection still names `DeveloperZo/alonzo-anthologies`, and on GitHub (Settings, Applications) that the Cloudflare Workers and Pages app still has access to the repo. Use Retry deployment in Cloudflare, or OPER-001 Procedure D.
- **The check run names a different branch.** Cloudflare reports per commit. When a commit was already built on another branch (for example a preview before a fast-forward of `main`), the run can carry that branch's name. Confirm the production deployment in Cloudflare (OPER-001) rather than trusting the ref name.
- **Conclusion `failure`.** The previous deployment keeps serving, so the site is not down. Fix forward with a new commit, or `git revert <sha>` and repeat from step 1.
- **Bad commit is live.** `git revert <sha>`, then repeat from step 1. For an instant rollback while the revert builds, use the Cloudflare dashboard rollback in OPER-001 (once there is an earlier deployment to roll back to).
- **You pushed to `gitlab` by mistake.** The project is archived and archived GitLab projects are read-only, so the push should be refused (GitLab's documented behaviour; not tested here). If it somehow lands, nothing deploys from GitLab any more; note it in `log.md`.

## Ownership and references

- Owner: zo.
- [ARCH-002 Source control](../../Architecture/ARCH-002-SourceControl.md) and [DIA-102](../../Diagrams/DIA-102-SourceControl.svg)
- [OPER-001 Cloudflare deploy](./OPER-001-CloudflareDeploy.md)
- [OPER-003 Cloudflare credentials](./OPER-003-CloudflareCredentials.md)
- [ST-005 Retire GitLab](../../Stories/ST-005-RetireGitLab.md) (removes the `gitlab` remote)
- [TD-002 Duplicate Pages](../Technical-Debt/TD-002-DuplicatePages.md) (why each push builds twice)
- [TD-003 No CI](../Technical-Debt/TD-003-NoCi.md): when [ST-007](../../Stories/ST-007-GitHubCi.md) adds a GitHub Actions workflow, step 1 becomes a check the workflow also runs, and step 4 gains a workflow run to watch.
- Closed: [TD-001 Legacy GitHub](../Technical-Debt/completed/TD-001-LegacyGitHub.md).

## Changelog

- 2026-10-14: Renamed from `OPER-002-GitLabPush.md` and rewritten for GitHub as the only active host (owner decision this evening: GitHub suits Claude Code and the job search; there was no specific reason for GitLab). Push target is `origin` on GitHub; step 4 uses the public GitHub check-runs API (verified with `curl` on c6dadfe) instead of GitLab commit statuses. Recorded that `main` is unprotected (public API) and that each push also builds `zo-garden`.
- 2026-10-14: Reworked for GitLab as the only host (c6dadfe). Removed the GitHub backup push, the backup match check and the stale-backup-remote repair section. Sections renamed to the runbook sections in the Document definition. Steps numbered to match DIA-102. Added the per-commit status note from the c6dadfe cutover.
- 2026-10-14: Created. Push steps unverified (no push run); remote URLs, glab auth, protection and the Cloudflare commit status verified read-only.
