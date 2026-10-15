# OPER-003 Cloudflare credentials

<!--
Purpose: Where the Cloudflare API token lives, the minimum scope it needs, how to rotate or revoke it, and how a non-local session gets deploy access without the token being committed.
Status: working
Owner: zo
Human id: cloudflare-credentials
Update trigger: when the token is minted, rotated, revoked or re-scoped, when it nears expiry, or when a new host needs API access
Last updated: 2026-10-14
-->

## Modes and prerequisites

Covers the Cloudflare API token used to read, and in a break-glass case write, the Pages projects for this repo. The deploy itself is [OPER-001](./OPER-001-CloudflareDeploy.md); the rules are [ARCH-003](../../Architecture/ARCH-003-Hosting.md). This doc never contains a token value.

Modes:

| Mode | When |
| --- | --- |
| A. Store the token | A new token is minted |
| B. Open a read-only API session | A session needs Pages settings or deployments |
| C. Rotate | Before 2027-05-05, on suspected exposure, or to replace the broad token |
| D. Revoke | The token is no longer needed, or was exposed |
| E. Non-local access | Another machine or Claude Code on the web needs to deploy or inspect |

Prerequisites:

- Owner login to the Cloudflare dashboard for the account that holds the `alonzo-anthologies` Pages project (modes C and D).
- Git Bash (Windows) or any POSIX shell, with `curl` and `node` on `PATH`.

Minimum scope:

| Use | Permission | Resource |
| --- | --- | --- |
| Read settings and deployments (agents, ARCH-003 checks) | Account, Cloudflare Pages, Read | This account only |
| Break-glass `wrangler pages deploy` (owner only) | Account, Cloudflare Pages, Edit | This account only |
| Look up the account ID (`GET /accounts`) | Account, Account Settings, Read | This account only |

Planned, not built: two tokens. A Pages Read token lives in `_ENV/cloudflare.md` for agents; a Pages Edit token is kept by the owner and minted only when needed. Both expire in a year or less. Whether `wrangler pages deploy` needs more than Pages Edit with `CLOUDFLARE_ACCOUNT_ID` set is unverified.

System state (verified 2026-10-14):

| Fact | State | How verified |
| --- | --- | --- |
| The token lives in `_ENV/cloudflare.md`, one line, token only | built | File shape inspected (one 53-character string); value not printed |
| `_ENV/` is gitignored | committed | `git check-ignore -v _ENV/cloudflare.md` matches `.gitignore:26`; `git show HEAD:.gitignore` (c6dadfe) has the `_ENV/` line; `git ls-files _ENV` prints nothing |
| The token has never been committed | verified | `git log --all -S"$CF_TOKEN"` and `git log --all -- _ENV` return nothing |
| Account-owned token `zo-garden-ecafe`, issued 2026-05-05, expires 2027-05-05, no IP condition | verified | `/user/tokens/verify` rejects it; `/accounts/<id>/tokens/verify` returns `active`; `/accounts/<id>/tokens/<id>` returns the detail |
| Scope is 97 account-wide permission groups (Pages, Workers, DNS, Registrar Domains Admin, Billing Read and more) | verified, too broad | Same token-detail call; tracked as [TD-004](../Technical-Debt/TD-004-BroadCloudflareToken.md) |
| The Git-connected deploy uses no token | verified | Builds are triggered by the Git integration, not a token: on 2026-10-14 GitLab pushes deployed the earlier `alonzo-anthologies` project, and after the move to GitHub the push of c6dadfe built `zo-garden` (`dc4746b5`, `github:push`). The recreated `alonzo-anthologies` was built at creation (`c7455b17`). The repo has no CI file (no `.github/workflows/`; GitHub Actions API lists 0 workflows) |

## Procedure

### A. Store the token

1. Put the token, and nothing else, on one line in `_ENV/cloudflare.md`.
2. Confirm it is ignored and untracked:

   ```bash
   git check-ignore -q _ENV/cloudflare.md && echo ignored
   git ls-files _ENV | wc -l   # must print 0
   ```

3. Never paste the token into a tracked file, `wrangler.toml`, a Pages env var, a commit message, a doc or a chat.

### B. Open a read-only API session

1. Load the token and account ID into shell variables, and define a GET helper:

   ```bash
   CF_TOKEN=$(grep -oE '[A-Za-z0-9_-]{20,}' _ENV/cloudflare.md | head -1)
   CF_ACCOUNT=$(curl -s -H "Authorization: Bearer $CF_TOKEN" \
     https://api.cloudflare.com/client/v4/accounts \
     | node -pe 'JSON.parse(require("fs").readFileSync(0)).result[0].id')
   cfget() { curl -s -H "Authorization: Bearer $CF_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT$1"; }
   ```

2. Verify:

   ```bash
   cfget /tokens/verify | node -pe 'JSON.parse(require("fs").readFileSync(0)).result.status'
   ```

3. Use only GET. Never `echo` `CF_TOKEN`.

### C. Rotate

1. Dashboard: Manage Account, Account API Tokens, Create Token. Grant only the Minimum scope rows, limited to this account, with an expiry.
2. Replace the line in `_ENV/cloudflare.md` with the new value.
3. Run Procedure B.
4. Revoke the old token (Procedure D).
5. Record the rotation in this doc's Changelog: date and new token name, never the value.

### D. Revoke

1. Dashboard: Manage Account, Account API Tokens, find the token by name, Delete.
2. With the old value still in `CF_TOKEN`, run `cfget /tokens/verify`.
3. If exposure is suspected, review the account audit log in the dashboard for unexpected writes.

### E. Give a non-local session access

1. Deploying needs no token: `git push origin main` and the Git integration builds it (OPER-001, Procedure B).
2. Reading the API: give the session a Pages Read token through that host's own secret store (an environment variable such as `CLOUDFLARE_API_TOKEN`), never through the repo. Whether Claude Code on the web offers such a store is unverified; if it does not, do API reads from the local machine.
3. If GitHub Actions is ever made to deploy, store the token as an encrypted Actions secret (repository or environment), never in a workflow file. [ST-007](../../Stories/ST-007-GitHubCi.md) adds CI that does not deploy and holds no Cloudflare token.

## Verification checks

- Procedure A: `git ls-files _ENV | wc -l` prints `0`.
- Procedure B: step 2 prints `active`.
- Procedure C: the new token prints `active`, and `cfget /tokens/<id>` lists only the Minimum scope permission groups.
- Procedure D: the old token's verify call returns `"success":false` with an invalid-token error.

## Troubleshooting and fallback

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `/user/tokens/verify` says `Invalid API Token` | The token is account-owned, not user-owned | Use `/accounts/<id>/tokens/verify` (Procedure B) |
| `GET /accounts` returns an empty list | Token lacks Account Settings Read | Add it, or set `CF_ACCOUNT` by hand from the dashboard URL |
| `git ls-files _ENV` prints a path | The file was committed | Remove it from the index (`git rm --cached`), commit, then rotate the token at once (Procedure C); history still holds the old value |
| New token fails Procedure B | Wrong scope or account | Restore the previous value in `_ENV/cloudflare.md` (only possible before Procedure D) and re-check permissions in the dashboard. A revoked token cannot be restored; mint another |

## Ownership and references

- Owner: zo.
- [ARCH-003 Hosting](../../Architecture/ARCH-003-Hosting.md), the "Cloudflare API token" component.
- [ST-006 Scoped token](../../Stories/ST-006-ScopedToken.md), which runs Procedures C and D to replace the broad token.
- [OPER-001 Cloudflare Pages deploy](./OPER-001-CloudflareDeploy.md).
- [TD-004 Broad Cloudflare token](../Technical-Debt/TD-004-BroadCloudflareToken.md).

## Changelog

- 2026-10-14 (late evening): Updated for GitHub as the only active code host. Procedure E's CI note now names GitHub Actions secrets; the token-free deploy row cites the GitHub-triggered `zo-garden` build. Token unchanged: re-verified `active`, expires 2027-05-05 (read-only `cfget /tokens/verify`).
- 2026-10-14: Re-verified after the cutover. The `_ENV/` ignore is now committed (c6dadfe); the token-free Git deploy is now proven on `alonzo-anthologies` (GitLab pushes); scope count corrected to 97 permission groups (token detail, read-only). Linked ST-006. Token still active, expires 2027-05-05; value not printed.
- 2026-10-14: Restructured to the Runbook sections in Document.md.
- 2026-10-14: Created. Token state read with read-only API calls; value never printed or recorded.
