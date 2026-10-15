# ST-008 Resume PDF that machines can read

<!--
Purpose: Make the resume's PDF export a text PDF, using print styling, so recruiters' tools can read and search it.
Status: planned
Owner: zo
Human id: text-pdf
Update trigger: when scope, status or acceptance criteria change
Last updated: 2026-10-14
-->

## Summary

The resume's download button produces a PDF made of pictures of the page. It looks right, but no search, applicant tracking system or screen reader can read a word of it, and its links do not work. After this work the resume prints to a real text PDF through the browser's print path, with a print layout that matches the printed resume on screen. That matters because the PDF is the copy that gets attached to applications.

## User story

**As a** recruiter, **I want** a resume PDF whose text I can search, copy and parse, **so that** the candidate shows up in my tools with the right name, titles and dates.

**As a** visitor using a screen reader, **I want** the PDF to contain real text, **so that** I can read it.

## Status

- Current: `planned`
- Next: write a print stylesheet for the resume view and test `window.print()` locally.
- Last updated: `2026-10-14`

## Acceptance criteria

- **AC-1** Given the live resume at `https://alonzo-anthologies.pages.dev/resume/#/resume`, when a visitor uses the PDF control, then they get a PDF (through the browser's print dialog, "Save as PDF") without the site's controls, menus or the download button on the page.
- **AC-2** `pdftotext` on a PDF saved from the live page contains the name, every printed job title and every printed bullet, in reading order. Checked by comparing against `ResumeView` output for the same build.
- **AC-3** The LinkedIn URL and the email in the PDF are working links (clickable in a PDF viewer; checked by a viewer's link inspection). They are rendered as anchors on the page too, not plain text.
- **AC-4** The PDF contains only what `ResumeView` shows, and nothing else reaches it ([ARCH-005](../Architecture/ARCH-005-ResumeSpa.md) rule 5, updated to say "print view" if the mechanism changes).
- **AC-5** Pages break between sections or entries, not through the middle of a line, on A4 and US Letter, in current Chrome and Firefox.
- **AC-6** Built locally (`bash ./build.sh` exits 0), then live: the deployed `/resume/` serves the new behaviour after a green Pages deployment.
- **AC-7** [TD-005](../Documents/Technical-Debt/TD-005-RasterPdf.md) is closed with this Story as evidence, and ARCH-005's Change Map row for `pdfGenerator.ts` is removed.

## Scope

- A print stylesheet (`@media print`) for `ResumeView`: hide app chrome and the download button, set page size and margins, control page breaks, force the light palette.
- Change the PDF control to call `window.print()`, and label it so a visitor expects the print dialog.
- Render the email (`mailto:`) and LinkedIn URL in the resume header as anchors so the browser writes them as PDF links.
- Remove `resumeContent/src/utils/pdfGenerator.ts` and the `jspdf` and `html2canvas` dependencies if nothing else uses them.

## Out of scope

- Generating the PDF from the data files with a separate layout (TD-005 option 3), or a text overlay on the image (option 2).
- Running the PDF through a real ATS parser. Useful, but not a pass or fail criterion here.
- Changes to resume content or wording.

## Additional information

### Dependencies

- None.

### Technical details

- Verified 2026-10-14 by reading `resumeContent/src/utils/pdfGenerator.ts`: it captures `.resume-container` with `html2canvas` and adds JPEG strips with `pdf.addImage`; it never calls `text`. The only caller is `components/ResumeView/ResumeView.tsx`, and `jspdf` and `html2canvas` are imported nowhere else in `src/` (grep).
- Verified 2026-10-14 by reading `ResumeView.tsx`: the email and LinkedIn URL are plain text in `.contact-info`, not links. Moving them into `profile.data.ts` is ARCH-005's separate Change Map row and is not required here.

### Decisions

- 2026-10-14: A text PDF using print styling is acceptable (owner default). This trades a one-click download for the print dialog.

### Risks and open questions

- The visitor chooses the paper size and may leave browser headers and footers on; the print CSS can suppress margins for them but not every browser honours it. AC-5 limits the promise to Chrome and Firefox.

## Changelog

- 2026-10-14: Created from TD-005 and the owner default (print-styled text PDF).
