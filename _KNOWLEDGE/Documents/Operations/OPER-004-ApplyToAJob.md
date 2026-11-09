# OPER-004 Apply to a job

<!--
Purpose: The end-to-end steps for one application: tailor, package, assisted submit, track.
Status: draft
Owner: zo
Human id: apply-to-a-job
Update trigger: when the package command, the overlay format, the manifest format, or the assisted-submit rules change
Last updated: 2026-11-09
-->

One application, start to finish. The design is in [ST-013](../../Stories/ST-013-ApplicationPipeline.md).

**The rule that matters:** automation prepares and fills. Zo reviews and clicks Submit. No agent submits an application, sends a message to an employer, or accepts terms on Zo's behalf.

## 1. Tailor (in git, on `main`)

1. Pick a short lowercase id for the company, such as `gtreasury`.
2. **Resume:** create `resumeContent/src/data/tailoring/<id>.ts`, using [gtreasury.ts](../../../resumeContent/src/data/tailoring/gtreasury.ts) as the worked example.
   - An overlay can set the target role, the summary and competency text, each job's overview line and tags, the bullet order (by key), and a bullet's wording (by key).
   - It cannot add bullets or invent facts. New facts go into `quests.data.tsx` first.
   - Accomplishment keys are the `key:` fields in `quests.data.tsx`.
   - Run `npm test`. The overlay test fails on any key or quest that does not exist.
3. **Cover letter:** copy `coverLetters/_base/` to `coverLetters/<id>/`, then edit `career-profile.html`.
   - Change only 03 (Immediate Actions), 04, and the "For <company>" tag.
   - The rules are in [ST-012 foundation](../../Stories/ST-012/foundation.md).
4. Commit both to `main`. Overlays do nothing on the live site: they apply only when a build sets `REACT_APP_TAILORING`, which only the package command does.

A company branch (`resume/<id>-<role>`) is optional. Use one for drafts you do not want on `main` yet. It only adds files, so rebasing it onto `main` stays clean.

## 2. Package (local)

```
cd resumeContent
npm run apply:package -- <id>
```

The command writes `applications/<id>/package/resume.pdf` and `cover-letter.pdf`:
- It builds the resume with the overlay applied.
- It prints `#/resume?print=1` to a text PDF through headless Edge or Chrome.
- It fails if the resume PDF has no text layer.

It takes about two minutes, mostly the build. Open both PDFs and read them before going further.

## 3. Manifest (local, gitignored)

1. Copy `applications/_templates/manifest.example.json` to `applications/<id>.json`.
2. Fill in the posting URL, the ATS, the role, and any company-specific answers.
3. Fill in `applications/answers.json` once, from its template. Every form reuses it.

## 4. Assisted submit (Claude in Chrome)

Ask Claude in a session that has Claude in Chrome connected: "Apply to `<id>` using `applications/<id>.json`, and stop before submitting." Claude then:

1. Opens the posting URL from the manifest in a new tab.
2. Fills the form from the manifest and `answers.json`.
   - It never guesses: a field it has no answer for is left empty and reported to Zo.
   - Voluntary disclosure (EEO) questions use only the values in `answers.json`.
3. Uploads `resume.pdf` and `cover-letter.pdf` from the package folder.
4. **Stops before Submit** and lists what it filled, what it skipped, and anything it could not upload.
5. Zo reviews every field on the page and clicks Submit.

Direct ATS forms (Greenhouse, Lever, Ashby, Workday) work this way. Workday usually needs an account first, so Zo creates and signs in to it.

For LinkedIn Easy Apply and Indeed, Zo applies by hand with the same two PDFs and the answers bank open. Their flows change often and sit behind sign-in. Claude does not log in to them for Zo.

## 5. Track

```
npm run apply:status -- <id> applied "Greenhouse, referral from X"
npm run apply:list
```

Update the status as the process moves: interviewing, offer, rejected, withdrawn. Each change is dated in the manifest's `history`.
