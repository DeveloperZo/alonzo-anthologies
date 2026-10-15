---
title: Operations Log
tags:
  - operations
  - timeline
draft: false
---
<!--
Purpose: Timeline of operational runbook executions — cutovers, prove-outs, incidents. Append-only.
Status: canonical
Owner: zo
Update trigger: when an OPER runbook is executed in earnest
Last updated: 2026-05-04
-->

# Operations Log

Append-only timeline of runbook executions. Most recent first.

| Date | Runbook | Trigger | Operator | Outcome | Artifacts |
|---|---|---|---|---|---|
| 2026-10-15 | No runbook. Drop the local `gitlab` remote | Owner: this repo must not keep history that credits an AI agent as a co-author | Cursor agent, at Zo's request | Local `gitlab` remote removed. `git remote` prints `origin` only. Those commits were reachable only from `gitlab/main` (tip c6dadfe), not from `origin/main` or `docs/knowledge-structure`. Archived GitLab project left in place. GitHub still returns the old SHAs (a0cc012, 9ed56c4, b8f82a4) when asked directly | `git remote -v`; GitHub commit API |
| 2026-10-14 | Host move, GitLab back to GitHub (no runbook yet) | Owner decision: no specific reason for GitLab; GitHub suits Claude Code and the job search | Claude Code, at Zo's request | Success. GitHub `DeveloperZo/Zo-Garden-eCafe` renamed by Zo to `alonzo-anthologies`; `main` pushed (c6dadfe); local `origin` now GitHub, GitLab kept as remote `gitlab`. Cloudflare: GitLab-wired project `alonzo-anthologies` deleted 23:45:26 and recreated under the same name from GitHub (repo id 1229275646, same build settings saved beforehand); production `c7455b17` (c6dadfe) live 23:48:07, so about 3 minutes down. `/`, `/resume/`, `/ai-governance/` return 200; `og:site_name` "Alonzo's Anthologies"; sitemap on `alonzo-anthologies.pages.dev`. GitLab project archived afterwards. `zo-garden` not touched | Cloudflare deployment `c7455b17`; saved configs in session scratchpad |
| 2026-10-14 | [OPER-001](./OPER-001-CloudflareDeploy.md), Procedure C (`garden/` to `site/` cutover) | Rebrand commits 445ece0 and c6dadfe ready to ship | Claude Code, at Zo's request | Success. Pages `alonzo-anthologies` output dir changed `garden/public` to `site/public` via API PATCH. Branch preview `c2635c2f` built green, then GitLab `main` fast-forwarded d59196a to c6dadfe. Production `ff476ca6` deployed 23:01 local. `/`, `/resume/`, `/ai-governance/` return 200; `og:site_name` is "Alonzo's Anthologies"; sitemap hosts are only `alonzo-anthologies.pages.dev`. `zo-garden` and GitHub not touched | Cloudflare deployments `c2635c2f`, `ff476ca6` |
