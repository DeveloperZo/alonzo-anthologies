# DIA-103: Hosting and deploy
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-103-Hosting.svg`
- **Theme:** How a push becomes a live site on Cloudflare Pages
- **Primary audience takeaway:** One push to GitHub is the whole deploy: Cloudflare builds it and publishes `main` to production and every other branch to a public preview, while the old `zo-garden` project builds the same push and serves a duplicate on a second hostname.

## What The Diagram Shows
The live path runs left to right across the top. The owner pushes a branch from the local clone to GitHub, the only code host. Cloudflare's GitHub App tells the Cloudflare Pages project `alonzo-anthologies` to build. The project runs `bash ./build.sh` with `NODE_VERSION` 22.16.0 and publishes the `site/public` folder, which `wrangler.toml` names. A push to `main` lands on production at `alonzo-anthologies.pages.dev` (today deployment `c7455b17` of commit c6dadfe); a push to any other branch lands on its own preview URL, which is public. The Cloudflare API token sits in the gitignored `_ENV/` folder on the owner's machine and is used only to read project settings and deployments. Across the bottom, drawn dashed, are the leftovers: the archived GitLab project, connected to nothing live, and the Pages project `zo-garden`, which the same GitHub push also builds, so `zo-garden.pages.dev` serves a duplicate of production.

## Elements And Flow
- **Components:**
  - Local clone (owner's machine), pushing to the `origin` remote
  - GitHub `DeveloperZo/alonzo-anthologies` (only code host, public)
  - Pages project `alonzo-anthologies` (build command, Node version, output directory)
  - Production URL `alonzo-anthologies.pages.dev`
  - Preview URLs `<branch>.alonzo-anthologies.pages.dev`
  - `_ENV/cloudflare.md`, the local API token
  - Left over: GitLab `awilliams9293/alonzo-anthologies` (archived), Pages project `zo-garden`, `zo-garden.pages.dev`
- **Relationships:**
  - Solid arrows 1 to 5 are the live deploy path; the branch name decides production (4) or preview (5)
  - The dotted red line (6) is the token used for read-only API checks against the Cloudflare account
  - The dashed gray arrow labeled "same push" runs from GitHub to `zo-garden`, then on to its hostname; the archived GitLab box has no arrows
  - Two dashed outlines group what lives on the owner's machine and what lives in the Cloudflare account
- **Notable labels or metrics:**
  - "output dir: site/public (wrangler.toml)"
  - "c7455b17 · c6dadfe · 2026-10-14" on production
  - "dashboard says garden/public (ignored)" on `zo-garden`
  - "duplicate of production (dc4746b5)" and "redirect planned (ST-004)" on `zo-garden.pages.dev`
  - "account-wide today (TD-004)" on the token

## How To Read It
1. Follow the numbered badges 1 to 3 from the local clone to the Pages project.
2. Read the Pages project box as the build contract: the command, the Node version and the output folder must all match the repo.
3. Take step 4 for `main` and step 5 for any other branch.
4. Note that step 6 never deploys anything; it only reads.
5. Finish on the dashed row: the same push also reaches `zo-garden`, a second public copy of the site, and the GitLab project is archived.

## Hosting Relevance
The numbered steps match "How it works, step by step" in [ARCH-003 Hosting](../Architecture/ARCH-003-Hosting.md), so the picture and the page can be read side by side. The settings printed inside the Pages project box are the ones a repo change most often has to agree with: changing the build output folder or the Node version means changing the Cloudflare setting too. The `zo-garden` box records the evidence that a Git-connected build takes its output folder from `wrangler.toml`, not from the dashboard. The dashed row shows what [ST-004](../Stories/ST-004-OneHostname.md) and [ST-005](../Stories/ST-005-RetireGitLab.md) retire, and the red token box shows what [ST-006](../Stories/ST-006-ScopedToken.md) narrows.

## Suggested Caption
DIA-103 · Hosting: a GitHub push builds and deploys alonzo-anthologies; zo-garden builds the same push as a duplicate.
