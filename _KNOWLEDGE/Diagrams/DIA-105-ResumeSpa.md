# DIA-105: Resume app, from Zo's facts to the pages and the PDF
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-105-ResumeSpa.svg`
- **Theme:** How the resume app turns Zo's facts into the pages and the PDF
- **Primary audience takeaway:** Change the facts in the data files; every page reads from them; only the printed resume view becomes the PDF, and the PDF is pictures of that view, not text.

## What The Diagram Shows
The tall blue box on the left is the data files: Zo's facts, kept in one place. It lists what is inside (jobs, projects and dates; the summary and key skills; menu words and colors) and says that to change the resume you change these and nothing else. Two arrows leave it, one to each green box: every page reads the same facts. The top green box is the printed resume view, the resume laid out for printing, showing only the jobs chosen for print. The bottom green box is the other pages: a timeline, the accomplishments, and a page for each job, which show every job. An amber arrow labelled "the Download PDF button" leaves only the printed resume view and ends at the amber PDF box. The other pages end in a short blocked line: no PDF from these pages. Two notes underneath say how the PDF is made and what that means.

## Elements And Flow
- **Components:**
  - The data files: `anthologies/resume-series/resumeContent/src/data/` (`quests.data.tsx`, `profile.data.ts`, `labels.ts`, `styles.data.tsx`)
  - The printed resume view: `ResumeView`, at `/resume/#/resume`
  - The other pages: the timeline, the accomplishments, and a page for each job
  - The PDF: `Alonzo_Williams_Resume.pdf`, made by `src/utils/pdfGenerator.ts`
- **Relationships:**
  - Data files to both page boxes: "every page reads these", "the same facts"
  - Printed resume view to the PDF: "the Download PDF button", "only here"
  - Other pages: a blocked line, "no PDF from these pages"
- **Notable labels or metrics:**
  - "only the jobs chosen for print": the printed view filters jobs by kind; the other pages do not
  - "pictures of that view, not text" and "one picture per page": the gap tracked as TD-005
  - "How the PDF is made": the app takes a picture of the printed resume view, in the visitor's own web browser, and cuts it into page-sized strips
  - "What that means": the words cannot be searched, selected or copied; a program that reads resumes sees no words; a fix is planned (ST-008)
- **Color:** blue is Zo's facts, changed by hand; green is pages a visitor sees; amber is the file a visitor downloads, pictures only.
- **Left out on purpose:** how the app reaches the live site (that is DIA-104), the work and play looks, the page addresses other than the printed view, the exact rules for which job prints where, the contact details typed into the printed view instead of the data files, the picture size and quality numbers, and the fact that a page cut can split a line of text. Also left out: the newer play-mode factory pages and the per-employer tailoring files in the data folder, which ARCH-005 does not describe yet.

## How To Read It
1. Start at the blue box: this is the only place a fact is changed.
2. Follow the two arrows right: both kinds of page read the same facts.
3. Compare the two green boxes: the printed view shows chosen jobs, the other pages show every job.
4. Follow the amber arrow: only the printed resume view has the Download PDF button.
5. Read the two notes: the PDF is pictures, so its words cannot be searched or copied.

## Architecture Relevance
This is the picture behind ARCH-005. It shows why a resume change is a change to the data files and not to the pages, why whatever the printed resume view shows also reaches the PDF while nothing else does, and why the PDF a recruiter receives has no words a machine can read until ST-008 replaces it.

## Suggested Caption
DIA-105 · Resume app: change the facts in the data files. Only the printed resume view becomes the PDF, as pictures, not text.
