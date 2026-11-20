# ST-014 Each series has diagrams that fit its own context

<!--
Purpose: Refine the diagram sets so each series has its own, drawn for its own context, with deeper levels where they are missing.
Status: planned
Owner: zo
Human id: series-diagrams
Update trigger: when a series gains or loses a diagram set, or the numbering rule changes
Last updated: 2026-11-18
-->

## Summary

On 2026-11-18 the home library diagrams were redone in plain language
(DIA-100 to DIA-105 and DIA-200 in `anthologies/home-library-series/diagrams/`),
and the anthologies site set in `_KNOWLEDGE/Diagrams/` was redone the same way
(DIA-100 to DIA-105). Zo's verdict on the site set: fine for 100-level
pictures, but the home library style was copied without applying the site's
own context, there is no 200 level, and the series, which are the core pieces
of the anthologies, have no detail sets of their own.

This story is the to-do. Nothing here is started.

## User story

**As** Zo, **I want** each series to carry a set of diagrams that fits what
that series is, **so that** a reader goes from the most general picture of
the anthologies down into any one series without meeting a borrowed style or
a missing level.

## What to do

1. Rework the site set (`_KNOWLEDGE/Diagrams/` DIA-100 to DIA-105) so its
   manner and wording come from the site's own subject, not from the home
   library set.
2. Add a 200 level to the site set where a part deserves a closer look.
3. Give each series its own set in its own `diagrams/` folder, numbered from
   DIA-100 inside the series: website, resume, gatekeeper. The home library
   already has one.
4. Decide what the top-level DIA-100 shows once every series has a set. It
   should point down into the series, not repeat them.

## Rules already decided

- X00 is the most general picture, X01 to X99 are closer looks, a higher
  hundred may be more complex. No technical specs until asked.
- 100-level pictures must be readable by someone in the household who is not
  technical: plain names first, program names as small print.
- See `_META/Definitions/Diagram.md` and
  `anthologies/home-library-series/diagrams/README.md`.

## Changelog

- 2026-11-18: Created from Zo's review of the redone site set.
