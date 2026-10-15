# TD-004 Broad Cloudflare token

<!--
Purpose: Record that the only Cloudflare API token on hand grants far more than Pages access, and what replaces it.
Status: open
Owner: zo
Human id: broad-cloudflare-token
Update trigger: when the token is re-scoped, rotated or revoked
Last updated: 2026-10-14
-->

## Current impact

Whoever reads `_ENV/cloudflare.md` can do far more than redeploy a static site. On the whole account they can change DNS, alter or transfer registered domains, deploy Workers, write R2 storage and edit firewall rules. Agent sessions are now asked to use this token for read-only checks, which widens who touches it. Nothing is broken today; the risk is the blast radius of a leak or a mistaken write.

The ignore rule that keeps the file out of git (`_ENV/` in `.gitignore`) is committed as of c6dadfe, so a fresh clone is protected too.

## Root cause

The token, named `zo-garden-ecafe`, was minted on 2026-05-05, the day the `zo-garden` Pages project was created. It was granted account-wide with 97 permission groups and no IP condition, instead of only the Pages permissions the setup needed. The motive is not recorded; avoiding permission errors during setup is the likely one (unverified).

## Remediation

[ST-006 Scoped token](../../Stories/ST-006-ScopedToken.md). Owner decision (2026-10-14): replace it with Pages-scoped token(s) and revoke the broad one. Steps are in [OPER-003](../Operations/OPER-003-CloudflareCredentials.md), Procedures C and D.

## Acceptance criteria

- The token in `_ENV/cloudflare.md` lists only the OPER-003 Minimum scope permission groups for this account (`cfget /tokens/<id>`).
- `zo-garden-ecafe` is revoked: its verify call fails.
- The replacement has an expiry of one year or less.
- `git show HEAD:.gitignore` contains `_ENV/` (met in c6dadfe).

## Evidence and status

Open. Re-verified 2026-10-14 after the cutover with read-only calls to `/accounts/<id>/tokens/verify` (active, expires 2027-05-05) and `/accounts/<id>/tokens/<id>` (`zo-garden-ecafe`, 97 permission groups, no IP condition; it is the only token on the account). Policies include Registrar Domains Admin, Account DNS Settings Write, Workers Scripts Write, Workers R2 Storage Write, Account Rulesets Write, Billing Read and Pages Write, all scoped to the one account. `git log --all -S` on the value returns nothing, so it has never been committed. `git show HEAD:.gitignore` now has the `_ENV/` line (c6dadfe), and `git ls-files _ENV` prints nothing. The token value was never printed.

## Changelog

- 2026-10-14: Re-verified after the cutover. The `_ENV/` ignore is now committed, so that acceptance criterion is met; scope count corrected to 97. Remediation set to ST-006.
- 2026-10-14: Restructured to the Technical debt sections in Document.md.
- 2026-10-14: Created from a read-only API inspection of the token's policies.
