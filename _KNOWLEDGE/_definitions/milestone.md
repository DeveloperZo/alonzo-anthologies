---
title: Milestone artifact definition
tags:
  - meta
  - definitions
draft: false
---
<!--
Purpose: Authoring contract for M-### and RM-### milestone artifacts.
Status: superseded
Owner: zo
Update trigger: when required sections change
Last updated: 2026-05-04
-->

> **Superseded 2026-10-14** by [`_META/Definitions/`](../../_META/Definitions/README.md). Kept for history; do not author against this file.

# Milestone

Use this definition for milestone artifacts.

## File naming

- **Active or planned**: `M-###-descriptor.md` in `Stories/`.
- **Retroactive (work already complete before the canonical roadmap existed)**: `RM-###-descriptor.md` in `Stories/` — same structure, never moves.
- **Completed active**: move the `M-###` file from `Stories/` into `Stories/completed/` once exit criteria are met. Update `Stories/ROADMAP.md`.

## Required sections

- **Objective** — one-paragraph statement of what this milestone delivers and why.
- **Exit criteria** — checklist; each item is binary and verifiable. This is the definition of done.
- **Dependencies** — links to other `M-*` / `RM-*` / `TD-*` / `ARCH-*` that must land first.
- **Evidence** — links to PRs, runbook outputs, dashboards, or screenshots that prove each exit criterion.
- **Notes** (optional) — context, decisions, open questions.

## Frontmatter

Use the hybrid YAML + HTML-comment frontmatter described in [`GETTING_STARTED.md`](../GETTING_STARTED.md).
