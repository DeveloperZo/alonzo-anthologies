---
title: Roadmap artifact definition
tags:
  - meta
  - definitions
draft: false
---
<!--
Purpose: Authoring contract for the single canonical roadmap.
Status: superseded
Owner: zo
Update trigger: when the roadmap shape changes
Last updated: 2026-05-04
-->

> **Superseded 2026-10-14** by [`_META/Definitions/`](../../_META/Definitions/README.md). Kept for history; do not author against this file.

# Roadmap

Use this definition for the single canonical roadmap at `Stories/ROADMAP.md`. There is only ever one roadmap; do not fork it.

## Required sections

- **Outcomes** — the durable goals the milestones serve.
- **Active milestones** — `M-*` currently in flight. Each entry links to the artifact and shows status.
- **Retroactive milestones** — `RM-*` representing pre-existing completed work.
- **Sequencing and dependencies** — Now / Next / Later windows; arrows between milestones where order matters.
- **Risks** — known threats to delivery; link to TDs.
- **Review cadence** — when this doc gets refreshed, by whom.

## Frontmatter

Use the hybrid YAML + HTML-comment frontmatter described in [`GETTING_STARTED.md`](../GETTING_STARTED.md).
