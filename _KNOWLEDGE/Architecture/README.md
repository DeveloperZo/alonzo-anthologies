---
title: Architecture
tags:
  - architecture
draft: false
---
<!--
Purpose: Index of ARCH-### system-shape and decision artifacts.
Status: canonical
Owner: zo
Update trigger: when an ARCH artifact is added, retired, or renumbered
Last updated: 2026-10-14
-->

# Architecture

One page per area of the system, plus a landing page that maps them all.
Definition and rating scale: [`_META/Definitions/Architecture.md`](../../_META/Definitions/Architecture.md).

## Index

| Page | Covers | Diagram |
| --- | --- | --- |
| [ARCH-001 Platform overview](./ARCH-001-PlatformOverview.md) | Landing page: the whole system, cross-page flows, the Change Map | [DIA-101](../Diagrams/DIA-101-SystemOverview.svg) |
| [ARCH-002 Source control](./ARCH-002-SourceControl.md) | GitHub, `main`, secrets, the archived GitLab project | [DIA-102](../Diagrams/DIA-102-SourceControl.svg) |
| [ARCH-003 Hosting](./ARCH-003-Hosting.md) | Cloudflare Pages, hostnames, previews, the token, rollback | [DIA-103](../Diagrams/DIA-103-Hosting.svg) |
| [ARCH-004 Site build](./ARCH-004-SiteBuild.md) | `build.sh`, Quartz, drafts, staging `/resume/` | [DIA-104](../Diagrams/DIA-104-SiteBuild.svg) |
| [ARCH-005 Resume app](./ARCH-005-ResumeSpa.md) | The React app at `/resume/`, its data and the PDF | [DIA-105](../Diagrams/DIA-105-ResumeSpa.svg) |
