# DIA-102: Source control, one host and push to deploy
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-102-SourceControl.svg`
- **Theme:** Where the code lives, how a push becomes a deploy, and what is left over
- **Primary audience takeaway:** Pushing `main` to GitHub is the only road to production; the archived GitLab project is a read-only leftover, and the old `zo-garden` site builds the same push as a duplicate.

## What The Diagram Shows
The top row is the path in use today. Your local clone pushes `main` to GitHub, the only code host, where `main` is not yet protected. Cloudflare's GitHub App tells the Cloudflare Pages project `alonzo-anthologies` to build, and Cloudflare posts the result back on the commit as a check run. Five red badges mark the steps, and the key at the bottom says each one in plain words. Under the clone, the `_ENV/` folder holds the Cloudflare token: it is drawn dashed red because it stays on this machine and is never committed. The bottom row is gray and dashed: the GitLab project is archived and is not a local remote, and the same GitHub repo still feeds the old Pages project `zo-garden`, which serves a duplicate of the live build.

## Elements And Flow
- **Components:**
  - Your clone (local git at `C:\Repos\alonzo-anthologies`, branch `main`)
  - GitHub `DeveloperZo/alonzo-anthologies` (remote `origin`, public, `main` not protected)
  - Cloudflare Pages project `alonzo-anthologies` (serves `alonzo-anthologies.pages.dev`)
  - `_ENV/` (gitignored folder holding the Cloudflare token)
  - GitLab `awilliams9293/alonzo-anthologies` (archived, read-only)
  - Cloudflare Pages project `zo-garden` (legacy, builds every push to `main`)
- **Relationships:**
  - Solid arrows: push (clone to GitHub), GitHub App (GitHub to Cloudflare), check run (Cloudflare back to GitHub)
  - Dashed gray arrow: the same push reaching `zo-garden`. No arrow runs from the clone to GitLab; that remote was removed on 2026-10-15
  - No arrow leaves `_ENV/`: nothing in it is ever pushed
- **Notable labels or metrics:**
  - "main not protected yet (ST-007)"
  - "same repo, every push"
  - "LEFT OVER · TO RETIRE (ST-005, ST-004)"

## How To Read It
1. Follow the badges 1 to 5 across the top row: scan, push, GitHub App, build and check run, check the live site.
2. Note `_ENV/` under the clone: it has no arrow, which is the point.
3. Drop to the dashed bottom row to see what is left over and what still reaches it.
4. Use the legend to tell live wiring (solid) from leftovers (dashed).

## Architecture Relevance
This is the picture for [ARCH-002 Source control](../Architecture/ARCH-002-SourceControl.md). Its numbered badges match the steps in that page's "How it works" and in [OPER-002](../Documents/Operations/OPER-002-GitHubPush.md). The dashed row is the work left in [ST-005](../Stories/ST-005-RetireGitLab.md) (the archived GitLab project and its remote) and the debt in [TD-002](../Documents/Technical-Debt/TD-002-DuplicatePages.md) (every push builds `zo-garden` too), fixed by [ST-004](../Stories/ST-004-OneHostname.md).

## Suggested Caption
DIA-102 · A push to main on GitHub is the only road to production; GitLab is archived and zo-garden is a duplicate.
