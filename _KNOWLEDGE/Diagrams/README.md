# Diagrams

<!--
Purpose: Home for DIA-### diagrams that support knowledge docs rather than published site pages.
Status: working
Owner: zo
Human id: diagrams-readme
Update trigger: when a diagram is added here, or the placement rule changes
Last updated: 2026-11-17
-->

Diagrams that explain the system to whoever is building it. Each one is an
`.svg` plus a `.md` spec sibling. Architecture diagrams use the `DIA-1xx`
block.

Diagrams for published writing do not live here. They sit in a `diagrams/`
folder beside their page under `anthologies/website-series/site/content/`, because Quartz only serves
what is under `content/`. The AI governance series is the existing example
(`DIA-0xx` and `DIA-2xx`).

- Definition: [`_META/Definitions/Diagram.md`](../../_META/Definitions/Diagram.md)
- Visual style: `customizations/skills/diagramming/SKILL.md`
- Plate style for published writing: `.claude/commands/svg-diagram.md`.
  Reference plates are in [`proposals/`](./proposals/). They are not
  adopted diagrams and are not in the index below.

## Index

| ID | Diagram | Embedded in |
| --- | --- | --- |
| DIA-101 | [The whole system](./DIA-101-SystemOverview.svg) ([spec](./DIA-101-SystemOverview.md)) | [ARCH-001](../Architecture/ARCH-001-PlatformOverview.md) |
| DIA-102 | [Source control](./DIA-102-SourceControl.svg) ([spec](./DIA-102-SourceControl.md)) | [ARCH-002](../Architecture/ARCH-002-SourceControl.md) |
| DIA-103 | [Hosting](./DIA-103-Hosting.svg) ([spec](./DIA-103-Hosting.md)) | [ARCH-003](../Architecture/ARCH-003-Hosting.md) |
| DIA-104 | [Site build](./DIA-104-SiteBuild.svg) ([spec](./DIA-104-SiteBuild.md)) | [ARCH-004](../Architecture/ARCH-004-SiteBuild.md) |
| DIA-105 | [Resume app](./DIA-105-ResumeSpa.svg) ([spec](./DIA-105-ResumeSpa.md)) | [ARCH-005](../Architecture/ARCH-005-ResumeSpa.md) |
| DIA-106 | [Home library: who does what work](./DIA-106-HomeLibrary.svg) ([spec](./DIA-106-HomeLibrary.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-107 | [Components: what each piece is and why it is here](./DIA-107-HomeLibraryComponents.svg) ([spec](./DIA-107-HomeLibraryComponents.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-108 | [What runs where, and which models fit on the card](./DIA-108-HomeLibraryRunsWhere.svg) ([spec](./DIA-108-HomeLibraryRunsWhere.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-109 | [One request, step by step](./DIA-109-HomeLibraryRequest.svg) ([spec](./DIA-109-HomeLibraryRequest.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-110 | [Startup and failure](./DIA-110-HomeLibraryStartup.svg) ([spec](./DIA-110-HomeLibraryStartup.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-111 | [Files, secrets and state](./DIA-111-HomeLibraryFiles.svg) ([spec](./DIA-111-HomeLibraryFiles.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |
| DIA-112 | [Who can reach what](./DIA-112-HomeLibraryReach.svg) ([spec](./DIA-112-HomeLibraryReach.md)) | [Home library series README](../../anthologies/home-library-series/README.md) |

## Changelog

- 2026-11-18: DIA-106 redrawn as the overview of a set of seven; added DIA-107 to DIA-112, each from one perspective.
- 2026-11-17: Added DIA-106 for the home library series.
- 2026-11-10: Added `proposals/` with three reference plates and a pointer to the plate style.
- 2026-10-14: Added DIA-101 to DIA-105 for the Architecture set; definition link moved to `_META/Definitions/`.
- 2026-10-14: Created.
