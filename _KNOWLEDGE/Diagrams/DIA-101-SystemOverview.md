# DIA-101: The whole system
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-101-SystemOverview.svg`
- **Theme:** How one push becomes the live site and the resume app
- **Primary audience takeaway:** Everything ships through one path, a push to GitHub `main` that Cloudflare builds and publishes; the old `zo-garden` project builds the same push as a duplicate until it is retired, and the GitLab project is archived.

## What The Diagram Shows
Four columns run left to right. The owner's machine holds the public writing, the resume app, the project docs that are never published, and a gitignored Cloudflare token. A push goes to GitHub, the only code host, whose `main` branch is production. Cloudflare's GitHub App starts the Cloudflare Pages project `alonzo-anthologies`, which runs `build.sh`: Quartz builds the pages while `StageResumeSpa` builds the resume app, and both land in `site/public/`. That folder is published to the live address for `main` and to a preview address for other branches, where visitors read the site and open the resume. A dashed row underneath shows what is left over: the archived GitLab project, connected to nothing, and the `zo-garden` Pages project, which the same push still builds and publishes at `zo-garden.pages.dev` as a duplicate of the current site.

## Elements And Flow
- **Components:**
  - Owner's machine: `site/content/`, `resumeContent/`, `_KNOWLEDGE/`, `_ENV/`
  - GitHub repo `alonzo-anthologies` (`main` = production)
  - Cloudflare Pages `alonzo-anthologies`: `build.sh`, Quartz, `StageResumeSpa`, `site/public/`
  - `alonzo-anthologies.pages.dev`, branch previews, visitors
  - Left over: GitLab (archived), Pages `zo-garden`, `zo-garden.pages.dev`
- **Relationships:**
  - Blue arrows: push to deploy (steps 1, 2)
  - Amber arrows inside Cloudflare: the build (step 3)
  - Green arrows: publish and visit (steps 4, 5)
  - Red dotted line: the token used only for read-only API checks
  - Gray dashed: the same push feeding `zo-garden`, and on to its hostname; the archived GitLab box has no arrows
- **Notable labels or metrics:**
  - "main = production"
  - "the only code host"
  - "Node 22.16.0"
  - "project docs, never published"
  - "same push"
  - "to be retired: ST-004, ST-005"

## How To Read It
1. Follow the numbered badges from the owner's machine to the visitors.
2. Read the italic line under each column to find the page that explains it.
3. Note that `_KNOWLEDGE/` and `_ENV/` never travel along the push path to the site.
4. Finish on the dashed row: the GitLab box is archived and fed by nothing, while `zo-garden` receives every push to GitHub and serves a copy of the live site until it is retired.

## Architecture Relevance
This is the map for the Architecture set. Each column is one area page, and every Structural or Coordinated component in the Change Map sits on one of these boxes or arrows. The numbered badges match "Flows that cross pages" in [ARCH-001](../Architecture/ARCH-001-PlatformOverview.md).

## Suggested Caption
DIA-101 · One push to GitHub main builds the site and the resume app on Cloudflare and publishes both; zo-garden still builds a copy.
