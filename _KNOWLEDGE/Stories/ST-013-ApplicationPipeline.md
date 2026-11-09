# ST-013 One command builds an application, one click sends it

<!--
Purpose: Automate the preparation of job applications (tailored resume and cover letter as PDFs, a manifest, an answers bank, tracking), while keeping the final submit with Zo.
Status: in progress
Owner: zo
Human id: application-pipeline
Update trigger: when the overlay format, the package command, the manifest format, or the submit rules change
Last updated: 2026-11-09
-->

## Summary

Each application used to mean editing the shared resume data on a company branch. That branch then conflicted with `main` on every rebase, and the only PDF on offer was an image no ATS could read.

After this work:
- A company's tailoring is a small overlay file.
- One command turns the overlay and the company's cover letter into two text PDFs.
- A local manifest tracks the application.
- Claude in Chrome can fill the form, but Zo clicks Submit.

The runbook is [OPER-004](../Documents/Operations/OPER-004-ApplyToAJob.md).

## User story

**As** Zo applying to several roles, **I want** each application's materials built and tracked by one command, **so that** tailoring stays cheap, rebases stay clean, and I only spend attention on the review and the click.

## The proposal, grilled

The proposal (2026-11-09) had five parts: a package command per branch, a YAML manifest per application, a shared answers bank on `main`, assisted submit, and tracking. Plus one structural fix: company tailoring moves into an overlay file, so branches only add files.

Each claim below was checked against the repository. The method was Chain of Verification: list the questions the plan depends on, answer each one independently from the code, then revise the plan wherever an answer contradicted it.

| # | Verification question | Answer, with evidence | Effect on the design |
| --- | --- | --- | --- |
| 1 | Can the manifest and answers bank be committed? | No. The repo is public (`github.com/DeveloperZo/alonzo-anthologies`, see [deployment.md](../Context/deployment.md)), and so is every pushed branch. Salary, work authorization and recruiter contacts would be published. | `applications/` is gitignored except the README and `_templates/`. The trade-off: these files do not travel between machines. |
| 2 | If an overlay activates by being present, what happens when a company branch merges back to `main`? | The overlay lands on `main` and tailors the live site to that company. | Overlays activate only through `REACT_APP_TAILORING`, which only the package command sets. Overlays can therefore live on `main` safely, and company branches become optional. |
| 3 | Is the current PDF readable by an ATS? | No. `utils/pdfGenerator.ts` rasterizes the page with html2canvas into JPEG pages (see [ST-008](./ST-008-TextPdf.md) and TD-005). | The package prints the page through the browser's print path, and the command fails if the PDF has no text layer. |
| 4 | Can an overlay safely point at bullets by their wording? | No. The 2026-11 casual-voice rewrite on `main` changed almost every bullet, and that is what made the GTreasury rebase conflict in 12 places. | Every accomplishment gets a stable `key`, required by the type. Overlays refer only to keys, and a test fails on unknown keys. |
| 5 | Does the overlay reach every view, or only the printed resume? | All views import `quests.data` and `profile.data` (ResumeView, CareerTimeline, Accomplishments, QuestDetail, Factory). | The overlay applies at those modules' exports, so no consumer changes. |
| 6 | Does webpack discover overlay files without a registry, which would be a shared file? | Yes, with `require.context`, but only when it is called literally. A call through a variable silently found nothing and logged "Critical dependency" in the first build. | The call is literal, inside a `try`. Jest has no `require.context`, so tests run untailored. |
| 7 | Does a headless print need anything the site does not already have? | Yes: (a) a page with no navbar or frame, (b) A4 page rules, and (c) removal of the 70 px body offset `Navbar.css` adds globally. Without (c) the resume printed on 3 pages. | Added `#/resume?print=1` and print CSS. The GTreasury and base packages both print as 2 pages. |
| 8 | Does the Chrome or Edge launcher exit only after the PDF is written? | No. It can exit first. The first run shut the local server down before the page loaded. | The script waits until the file exists and stops growing. |
| 9 | Can assisted submit work everywhere? | Direct ATS forms, yes. LinkedIn and Indeed sit behind sign-in, with flows that change often. Workday needs a candidate account. | Assisted fill is for direct ATS forms. LinkedIn and Indeed are manual, using the same package. The agent never clicks Submit. |
| 10 | YAML or JSON for manifests? | YAML needs a parser dependency. Node reads JSON natively. | JSON, keeping the scripts dependency-free. |

## What was built (branch `feat/application-pipeline`)

**Tailoring overlays:**
- `src/data/tailoring/types.ts` holds the overlay shape.
- `src/data/tailoring/index.ts` loads and applies the overlay, and validates it.
- `gtreasury.ts` is the first overlay.
- `tailoring.test.ts` checks every overlay in the folder against the data.

**Stable keys:** all 44 accomplishments have a `key`, and the field is required.

**Data modules:** `quests.data.tsx` and `profile.data.ts` export the tailored values. `targetRole` is undefined unless an overlay sets it.

**Resume view:**
- It shows the target role line when one is set.
- It has a print mode, `#/resume?print=1`.
- Print CSS sets A4 pages, avoids breaks inside bullets, and drops the navbar offset.

**Commands** (`resumeContent/scripts/`):
- `npm run apply:package -- <id>`: build, serve, print `resume.pdf` and `cover-letter.pdf`, and check the text layer.
- `npm run apply:list` and `npm run apply:status`: the tracker, reading and writing `applications/<id>.json`.

**Application files:**
- `applications/` holds the README and templates. Everything else in it is gitignored.
- The GTreasury cover letter moves to `coverLetters/gtreasury/` on `main`.

## Acceptance criteria

- **AC-1** `npm run apply:package -- gtreasury` writes a 2-page `resume.pdf` with a text layer and a 1-page `cover-letter.pdf` into `applications/gtreasury/package/`. **Met 2026-11-09.**
- **AC-2** The GTreasury print shows its tailoring:
  - the target role
  - the SaaS summary
  - the Agile, Azure and API competency text
  - the reordered Progyny, Inspire11, Productive Edge and Lendr bullets
  - the SQL Server and Entity Framework wording
  - Azure services on the consulting entry
  
  **Met 2026-11-09.** Checked on a render of `#/resume?print=1`.
- **AC-3** A build without `REACT_APP_TAILORING` is untailored: no target role, and the base summary. **Met 2026-11-09.** Checked on the base package and by the test `applies no overlay`.
- **AC-4** The overlay test fails on an unknown key or quest, and passes for every overlay in the folder. **Met.**
- **AC-5** `git status` never shows a manifest, `answers.json` or a package PDF. **Met** by `.gitignore`.
- **AC-6** Assisted submit, run once on a real posting, fills the form, uploads both PDFs, and stops before Submit. **Open.** First run on GTreasury.
- **AC-7** The branch is merged to `main`, and `resume/gtreasury-engineering-manager` is reduced to nothing that `main` lacks, or retired. **Open.**

## Known limits

- The live site's "Download PDF" button still makes the image PDF. Switching it to the print path is [ST-008](./ST-008-TextPdf.md), which can now reuse `?print=1` and the print CSS.
- `App.test.tsx` (the Create React App starter test, unchanged since the project began) fails because it looks for "learn react". It is unrelated to this work.

## Status

- Current: `in progress`
- Next: merge `feat/application-pipeline` into `main`, then the first assisted submit (AC-6).
- Last updated: `2026-11-09`
