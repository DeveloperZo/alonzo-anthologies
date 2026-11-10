# Career profile: WellTheory

Visual cover letter for the Head of Engineering role at WellTheory, the first engineering leader there, working as a player-coach. It pairs with the welltheory resume overlay.

| File | Use |
| --- | --- |
| `career-profile.pdf` | The file to send |
| `career-profile.png` | Preview, or to paste into a message |
| `career-profile.html` | Source. Edit it here, or on the Career Profile 2026 design canvas (artboard "WellTheory: Head of Engineering") |

## What is tailored

Copied from `coverLetters/_base/` on 2026-11-09. Only these changed:

- **03 Immediate Actions:** "Build the engineering team and stay hands-on in the code." and "Set habits that move fast and protect member health data." The first leans on the hired team of 5 at Progyny, the second on AI-assisted development with PHI safeguards and HIPAA work across healthcare roles.
- **04:** "The first engineering leader who builds the team and still ships."
- **The tag:** "For WellTheory" in the header.

## How it is built

The resume half of this application is the overlay `resumeContent/src/data/tailoring/welltheory.ts`. Build both PDFs with `npm run apply:package -- welltheory` from `resumeContent/`. The full workflow is in `_KNOWLEDGE/Documents/Operations/OPER-004-ApplyToAJob.md`.
