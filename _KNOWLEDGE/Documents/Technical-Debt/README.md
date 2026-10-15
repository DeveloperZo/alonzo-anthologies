---
title: Technical Debt
tags:
  - technical-debt
draft: false
---
<!--
Purpose: Index of TD-### debt items. Items move to completed/ once the remediating milestone ships and acceptance criteria are met.
Status: canonical
Owner: zo
Update trigger: when a TD is filed, closed, or renumbered
Last updated: 2026-10-14
-->

# Technical Debt

Risk and remediation register (`TD-###`). Definition: the Technical debt kind
in [`_META/Definitions/Document.md`](../../../_META/Definitions/Document.md).
Each item names the Story that will fix it; it moves to `completed/` when that
Story ships.

## Open

| ID | Debt | Fixed by |
| --- | --- | --- |
| [TD-002](./TD-002-DuplicatePages.md) | Old `zo-garden` Pages project builds every push and serves a duplicate of the site | [ST-004](../../Stories/ST-004-OneHostname.md) |
| [TD-003](./TD-003-NoCi.md) | No CI and no branch protection: builds and secret scans happen only after a push to `main` | [ST-007](../../Stories/ST-007-GitHubCi.md) |
| [TD-004](./TD-004-BroadCloudflareToken.md) | The Cloudflare token is account-wide | [ST-006](../../Stories/ST-006-ScopedToken.md) |
| [TD-005](./TD-005-RasterPdf.md) | The resume PDF is images with no text layer | [ST-008](../../Stories/ST-008-TextPdf.md) |
| [TD-006](./TD-006-QuartzPatches.md) | Local edits inside vendored Quartz that an upgrade would wipe | [ST-010](../../Stories/ST-010-QuartzUpgrade.md) |
| [TD-007](./TD-007-SilentResumeSkip.md) | A build can ship without `/resume/` and only warn | [ST-009](../../Stories/ST-009-ResumeGuard.md) |

## Completed

| ID | Debt | Closed | How |
| --- | --- | --- | --- |
| [TD-001](./completed/TD-001-LegacyGitHub.md) | Legacy public GitHub repo and remote | 2026-10-14 | GitHub became the canonical host again; leftover GitLab handled by [ST-005](../../Stories/ST-005-RetireGitLab.md) |

Folder: [`completed/`](./completed/).
