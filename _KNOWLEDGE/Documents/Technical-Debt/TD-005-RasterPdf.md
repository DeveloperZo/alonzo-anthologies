# TD-005 Raster PDF

<!--
Purpose: Record that the resume's Download PDF produces image-only pages with no text layer, and what would fix it.
Status: open
Owner: zo
Human id: raster-pdf
Update trigger: when resumeContent/src/utils/pdfGenerator.ts changes, or ST-008 starts or ships
Last updated: 2026-10-14
-->

## Current impact

The "Download PDF" button on `/resume/#/resume` produces a PDF whose pages
are JPEG images. There is no text layer, so:

- applicant tracking systems and recruiters' search cannot read the name,
  titles, dates or bullets;
- text cannot be selected or copied;
- screen readers get nothing.

The pages are also cut at fixed heights, so a line of text can be split
across two pages, and the file is larger than a text PDF would be (scale
1.45, JPEG quality 0.88). The impact on real applications is unverified:
nobody has run the exported PDF through an ATS parser.

Links are a separate problem that a text PDF alone will not solve: the
LinkedIn address in the header is plain text on screen too, not a link
(`ResumeView.tsx:105`), and no printed quest currently has an
`externalLink`, so there is no Repository link to carry over.

## Root cause

`resumeContent/src/utils/pdfGenerator.ts` paints `.resume-container`
with `html2canvas`, slices the canvas into A4-height strips and adds each
strip with `pdf.addImage(..., 'JPEG', ...)` (lines 76 to 80). This was
chosen for WYSIWYG fidelity: the PDF matches the screen layout and fonts
with no second layout to maintain (file header comment, and ST-003
"preserve this functionality").

## Remediation

[ST-008 Text PDF](../../Stories/ST-008-TextPdf.md). Owner default
(2026-10-14): a text PDF produced from print styling is acceptable, so
pixel-perfect match with the screen is not required. That points at the
first approach below. Candidate approaches, cheapest first:

1. A print stylesheet for `ResumeView` and `window.print()`, so the
   browser writes a real text PDF. Chosen direction per the owner default.
2. Keep the canvas for appearance but overlay invisible text with jsPDF
   `text()` at the same positions (fragile).
3. Generate the PDF from `quests.data.tsx` and `profile.data.ts` directly
   with a text layout (a second layout to maintain).

## Acceptance criteria

- Text extracted from the exported PDF (for example `pdftotext`)
  contains the name, every printed job title and every printed bullet.
- The LinkedIn URL in the PDF is a working link (which needs it rendered
  as a link in `ResumeView` first).
- The PDF still contains only what `ResumeView` shows (see "Print filters
  in ResumeView" in [ARCH-005](../../Architecture/ARCH-005-ResumeSpa.md)).

## Evidence and status

- Built and deployed as image-only: verified by reading `pdfGenerator.ts`
  on 2026-10-14 at c6dadfe (unchanged since d59196a); only `addImage` is
  called, never `text`.
- Exported PDF not opened or text-extracted: unverified at runtime.

## Changelog

- 2026-10-14: Renumbered from TD-007 to TD-005; H1 and Human id match the filename. Remediation now links ST-008 and records the owner default that a print-styled text PDF is acceptable. Corrected the line citation (76 to 80), the ARCH-005 cross-reference (its rules table is gone) and the links claim (LinkedIn is plain text, no printed quest has a repository link). Added the page-cut issue.
- 2026-10-14: Created while writing ARCH-005.
