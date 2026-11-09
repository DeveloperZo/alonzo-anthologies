# Applications

The application log and the files each application needs. **Everything in this folder except this README and `_templates/` is gitignored.** This repo is public, and these files hold personal data: contacts, salary, and work authorization.

| Path | What it is | In git |
| --- | --- | --- |
| `_templates/manifest.example.json` | Template for one application | Yes |
| `_templates/answers.example.json` | Template for the answers bank | Yes |
| `answers.json` | The answers bank: questions every form asks. Fill it in once | No |
| `<id>.json` | One manifest per application: posting, ATS, status, contacts, company-specific answers, history | No |
| `<id>/package/resume.pdf`, `cover-letter.pdf` | The package for that application, made by `npm run apply:package` | No |

`<id>` is a short lowercase company id, such as `gtreasury`. The same id names the resume overlay (`resumeContent/src/data/tailoring/<id>.ts`) and the cover letter folder (`coverLetters/<id>/`).

## Commands

Run these from `resumeContent/`:

```
npm run apply:package -- <id>                      build resume.pdf and cover-letter.pdf
npm run apply:list                                 table of every application
npm run apply:status -- <id> applied "Greenhouse"  set a status and log it in the history
```

Statuses are draft, ready, applied, interviewing, offer, rejected, and withdrawn.

## These files do not travel

Because they are gitignored, manifests and the answers bank live only on this machine. Back them up yourself, or move this folder into a private repository if you need them elsewhere.

The full workflow, including assisted submit, is in `_KNOWLEDGE/Documents/Operations/OPER-004-ApplyToAJob.md`.
