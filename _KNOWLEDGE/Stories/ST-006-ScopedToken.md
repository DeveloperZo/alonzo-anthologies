# ST-006 Least-privilege Cloudflare access

<!--
Purpose: Replace the account-wide Cloudflare API token with Pages-scoped tokens and revoke the broad one.
Status: planned
Owner: zo
Human id: scoped-token
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

The only Cloudflare key on hand can change almost anything on the account, including domain registration and DNS, though the site only ever needs to read or deploy Pages projects. Agent sessions now use it for read-only checks. After this work agents get a key that can only read Pages, Zo keeps a separate deploy key only when needed, and the broad key is revoked. A leak or a mistaken call can then do little harm.

## User story

**As** Zo as operator, **I want** each Cloudflare key to grant only what its holder uses, **so that** a leaked key or a wrong command cannot touch DNS, domains or other services.

## Status

- Current: `planned`
- Next: Zo mints a Pages Read token in the dashboard (OPER-003, Procedure C).
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** The token in `_ENV/cloudflare.md` verifies as active and lists only the [OPER-003](../Documents/Operations/OPER-003-CloudflareCredentials.md) Minimum scope read rows (Pages Read, Account Settings Read) for this one account. Checked with OPER-003 Procedure B: `cfget /tokens/verify` prints `active`, `cfget /tokens/<id>` lists those permission groups and nothing else.
- **AC-2** The agent token cannot write: a harmless write attempt (for example `PATCH /pages/projects/alonzo-anthologies` with an empty body) returns an authentication or permission error. Run once, by Zo, and recorded in Evidence.
- **AC-3** Every new token has an expiry of one year or less (`expires_on` in the token detail).
- **AC-4** The broad token `zo-garden-ecafe` is revoked: with its old value, `/accounts/<id>/tokens/verify` returns `"success":false`.
- **AC-5** The live site is unaffected: `https://alonzo-anthologies.pages.dev/` returns 200 and the next `git push origin main` still produces a green Pages deployment (the Git integration uses no token).
- **AC-6** `git show HEAD:.gitignore` contains `_ENV/`, and `git ls-files _ENV | wc -l` prints `0`.
- **AC-7** OPER-003 records the rotation in its Changelog (date and new token names, never values), and its "Planned, not built" line about two tokens is updated to built. [TD-004](../Documents/Technical-Debt/TD-004-BroadCloudflareToken.md) is closed with this Story as evidence.

## Scope

- Mint a Pages Read token (Pages Read plus Account Settings Read, this account only, expiry one year or less) and store it in `_ENV/cloudflare.md` (OPER-003, Procedures A and C).
- Decide whether to mint the owner Pages Edit token now or only when a break-glass deploy is needed; record the decision.
- Revoke `zo-garden-ecafe` (OPER-003, Procedure D) and review the account audit log once for unexpected writes.
- Update OPER-003, TD-004 and [ARCH-003](../Architecture/ARCH-003-Hosting.md) (Change Map row for the token).

## Out of scope

- CI deploy credentials. Deploys use the Git integration; CI is [ST-007](./ST-007-GitHubCi.md) (GitHub Actions) and does not deploy.
- Redirect and Pages project changes for `zo-garden`: [ST-004](./ST-004-OneHostname.md), done in the dashboard.
- Moving the token out of `_ENV/` into a secret manager.

## Additional information

### Dependencies

- None to start. [ST-004](./ST-004-OneHostname.md) depends on this Story: its API checks should run on the new read token. If anyone plans to do ST-004's redirect by API with the broad token, it must happen before AC-4; the preferred path is the dashboard.

### Technical details

- Verified 2026-10-14 (TD-004, OPER-003): the token is account-owned, named `zo-garden-ecafe`, issued 2026-05-05, expires 2027-05-05, no IP condition, about 100 permission groups including Registrar Domains Admin, Account DNS Settings Write and Workers Scripts Write. Never committed.
- Verified 2026-10-14 by `git show HEAD:.gitignore`: line 26 is `_ENV/`, so the ignore rule is now committed. AC-6 guards it.
- Unverified: whether `wrangler pages deploy` needs more than Pages Edit with `CLOUDFLARE_ACCOUNT_ID` set.

## Changelog

- 2026-10-14 (late evening): ST-007 link updated for its rename to GitHub CI. Token state unchanged (re-verified `active`, expires 2027-05-05, read-only).
- 2026-10-14: Created from TD-004, OPER-003 and the owner default (Pages-scoped tokens, revoke the broad one).
