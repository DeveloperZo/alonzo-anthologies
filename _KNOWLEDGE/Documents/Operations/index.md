---
title: Operations Index
tags:
  - operations
  - meta
draft: false
---
<!--
Purpose: Navigation surface across all OPER runbooks. The first thing oncall/ops should read.
Status: canonical
Owner: zo
Update trigger: when a new OPER runbook is added or an existing one is retired
Last updated: 2026-10-14
-->

# Operations Index

Single entry point to the runbooks for this repo.

## By scenario

| Scenario | Runbook | Status |
|---|---|---|
| Push a change to GitHub and confirm Cloudflare deployed it | [OPER-002 GitHub push](./OPER-002-GitHubPush.md) | draft |
| Deploy, redeploy or roll back the site on Cloudflare Pages | [OPER-001 Cloudflare deploy](./OPER-001-CloudflareDeploy.md) | working |
| Find, scope, rotate or revoke the Cloudflare API token | [OPER-003 Cloudflare credentials](./OPER-003-CloudflareCredentials.md) | working |

## See also

- [`log.md`](./log.md): when runbooks were run and the outcome.
- [`scripts/`](./scripts/): automation pulled out of runbooks for reuse.
