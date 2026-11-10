# Career profile: general version

This is the visual cover letter in Zo's own wording, with no company tailoring. Every company version starts from this one.

Since 2026-11-09 it uses the Factorio look that matches the site's play mode: a grey lab-tile floor, grey bevelled panels, a blood orange accent (`#D2461F`) and warm item colours. The four ideas read as a recipe (01 + 02 + 03 = 04) and the timeline as a production line. On the canvas it is the artboard titled "Default"; the earlier navy and cream version is kept there as "Previous default". The canvas fills the accent colour in when it renders, but this file is printed straight from disk, so the colour is written out here.

| File | Use |
| --- | --- |
| `career-profile.pdf` | Send as is when there is no specific posting |
| `career-profile.png` | Preview |
| `career-profile.html` | Source. Edit it here, or on the Career Profile 2026 design canvas |

## Making a company version

1. Copy this folder to `coverLetters/<id>/`, where `<id>` is the short company id that also names the resume overlay, such as `gtreasury`.
2. Change only these, and keep 01, 02 and the timeline as they are:
   - **03 Immediate Actions:** what the company will expect first, researched from the posting and limited to what the portfolio proves.
   - **04:** the career outcome.
   - **The tag:** the "For <company>" line under the header.
3. Commit it to `main` together with `resumeContent/src/data/tailoring/<id>.ts`.
4. Build both PDFs with `npm run apply:package -- <id>`, run from `resumeContent/`.

The rules for these boards are in `_KNOWLEDGE/Stories/ST-012/foundation.md`:
- conversation starter, not conversation dictator
- say each idea once
- every line earns its place

The full workflow is in `_KNOWLEDGE/Documents/Operations/OPER-004-ApplyToAJob.md`. GTreasury, in `coverLetters/gtreasury/`, is the worked example.
