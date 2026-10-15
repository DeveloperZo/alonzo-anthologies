# Diagrams

<!--
Purpose: Home for DIA-### diagrams that support knowledge docs rather than published site pages.
Status: working
Owner: zo
Human id: diagrams-readme
Update trigger: when a diagram is added here, or the placement rule changes
Last updated: 2026-10-14
-->


Diagrams that explain the system to whoever is building it. Each one is an
`.svg` plus a `.md` spec sibling. Architecture diagrams use the `DIA-1xx`
block.

Diagrams for published writing do not live here. They sit in a `diagrams/`
folder beside their page under `site/content/`, because Quartz only serves
what is under `content/`. The AI governance series is the existing example
(`DIA-0xx` and `DIA-2xx`).

- Definition: [`_META/Definitions/Diagram.md`](../../_META/Definitions/Diagram.md)
- Visual style: `customizations/skills/diagramming/SKILL.md`

## Index

| ID | Diagram | Embedded in |
| --- | --- | --- |
| DIA-101 | [The whole system](./DIA-101-SystemOverview.svg) ([spec](./DIA-101-SystemOverview.md)) | [ARCH-001](../Architecture/ARCH-001-PlatformOverview.md) |
| DIA-102 | [Source control](./DIA-102-SourceControl.svg) ([spec](./DIA-102-SourceControl.md)) | [ARCH-002](../Architecture/ARCH-002-SourceControl.md) |
| DIA-103 | [Hosting](./DIA-103-Hosting.svg) ([spec](./DIA-103-Hosting.md)) | [ARCH-003](../Architecture/ARCH-003-Hosting.md) |
| DIA-104 | [Site build](./DIA-104-SiteBuild.svg) ([spec](./DIA-104-SiteBuild.md)) | [ARCH-004](../Architecture/ARCH-004-SiteBuild.md) |
| DIA-105 | [Resume app](./DIA-105-ResumeSpa.svg) ([spec](./DIA-105-ResumeSpa.md)) | [ARCH-005](../Architecture/ARCH-005-ResumeSpa.md) |

## Changelog

- 2026-10-14: Added DIA-101 to DIA-105 for the Architecture set; definition link moved to `_META/Definitions/`.
- 2026-10-14: Created.
