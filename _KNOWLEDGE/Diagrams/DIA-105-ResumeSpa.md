# DIA-105: Resume SPA, from data files to the printed resume and the PDF
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-105-ResumeSpa.svg`
- **Theme:** How the resume app turns three data files into every page, and how the PDF is made
- **Primary audience takeaway:** Content changes go in the data files; only the printed resume view reaches the PDF, and the PDF is a set of pictures of that view, not text.

## What The Diagram Shows
Four columns read left to right. The blue column is the data: `quests.data.tsx` (every role, bullet and date, plus the `type` field that decides where a quest prints), `profile.data.ts` (summary and core competencies) and `labels.ts` with `styles.data.tsx` (menu words and theme colours). The amber column is the React views that read those files: ResumeView filters quests by type and adds the contact block, the other views (timeline, accomplishments, quest detail) show every quest, and the navbar and main menu carry the labels in the chosen theme. The green column is what a visitor sees at each `#/` address. The red column is the Download PDF path, which starts only from the printed resume: html2canvas paints the resume container to a canvas, the canvas is cut into A4-height JPEG strips, and jsPDF saves them as an image-only PDF. A dashed frame marks everything that runs in the visitor's browser under `/resume/`. The grey strip at the bottom is the build that puts the app there.

## Elements And Flow
- **Components:**
  - Data files: `quests.data.tsx`, `profile.data.ts`, `labels.ts` and `styles.data.tsx` in `resumeContent/src/data/`
  - Views: `ResumeView`, the other views (`CareerTimeline`, `Accomplishments`, `QuestDetail`), and `Navbar` with `MainMenu`
  - What the visitor sees: the printed resume (`/resume/#/resume`), the interactive pages, the theme frame (work monitor or retro TV)
  - PDF path: `html2canvas`, JPEG strips, `jsPDF` (all in `src/utils/pdfGenerator.ts`)
  - Build: CRA `npm run build` with `homepage: /resume`, the Quartz `StageResumeSpa` emitter, Cloudflare Pages
- **Relationships:**
  - `quests.data.tsx` and `profile.data.ts` both feed ResumeView and the other views (the crossing arrows)
  - Labels and theme colours feed only the navigation chrome
  - Each view renders one kind of page; the red arrow leaves only from the printed resume
  - The PDF steps run in sequence, top to bottom
  - The data files go into the build; the build output is what the browser frame loads
- **Notable labels or metrics:**
  - Circled numbers 1 to 8 match the steps in "How it works, step by step" on ARCH-005
  - "filters by Quest.type": career, independent, hobby and education each print in their own section
  - "paints .resume-container": the one CSS class the PDF depends on
  - "image-only PDF, no text": the gap tracked as TD-005

## How To Read It
1. Start at the blue column: this is where a content change is made (step 1).
2. Drop to the grey strip to see how a change reaches the live site (step 2).
3. Read the dashed frame label: the browser loads one page and the `#/` path picks the view (step 3).
4. Follow the top row across: ResumeView filters, and the printed resume appears (step 4).
5. Compare the middle row: the other views show every quest without the print filter (step 5).
6. Finish down the red column: Download PDF paints, slices and saves the printed resume as pictures (steps 6 to 8).

## Architecture Relevance
This is the picture behind ARCH-005. It shows why a resume edit is usually a data edit and not a code edit, why the print rules live in one view (ResumeView), and why anything that view shows also reaches the PDF while nothing else does. It also makes the main gap visible: the red path ends in images, so the PDF a recruiter receives has no searchable text until ST-008 replaces it.

## Suggested Caption
DIA-105 · Three data files feed every view; only the printed resume reaches the PDF, and it arrives as pictures, not text.
