# DIA-104: Site build from build.sh to site/public
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-104-SiteBuild.svg`
- **Theme:** How the deployable site is built
- **Primary audience takeaway:** One script runs two installs and one Quartz build; Quartz reads only `site/content/`, and a repo-local emitter builds the resume app and copies it to `/resume/`, so everything Cloudflare serves lands in `site/public/`.

## What The Diagram Shows
Seven numbered steps run top to bottom in the centre column, in the order they happen. `build.sh` installs the resume app's packages, then installs Quartz and runs `npx quartz build` inside `site/`. Quartz parses the Markdown, drops pages marked `draft: true`, and runs its emitters: content pages, sitemap and RSS, the `Assets` copy of every SVG, and, at the same time, `StageResumeSpa`, which builds the React resume app and copies it into `site/public/resume/`. Cloudflare Pages then serves `site/public/`. The left column shows what the build reads (and that `_KNOWLEDGE/` is never read); the right column shows what it drops and what it writes. A red box names the two known gaps at step 6.

## Elements And Flow
- **Components:**
  - Inputs: Node 22.16.0 (`site/.node-version`, Cloudflare `NODE_VERSION`), `resumeContent/`, `site/content/`, `_KNOWLEDGE/` (not read)
  - Steps: 1 `build.sh`, 2 `npm ci` in `resumeContent/`, 3 `npm ci` and `npx quartz build` in `site/`, 4 transformers and the `RemoveDrafts` filter, 5 emitters, 6 `StageResumeSpa`, 7 Cloudflare Pages
  - Outputs: the two dropped drafts, the `site/public/` tree
- **Relationships:**
  - Solid arrows are build order; steps 5 and 6 have no arrow between them because Quartz runs all emitters at once; both write into `site/public/`, which step 7 serves
  - Dashed arrows are reads: `resumeContent/` is read twice (installed at step 2, built at step 6); `site/content/` is read at step 3
  - The dashed arrow from step 4 marks a side effect (drafts left out)
- **Notable labels or metrics:**
  - "42 .md, 15 .svg" in `site/content/` (2026-10-14 count)
  - "2 drafts dropped": `RATIONALE-2026-08.md` in each AI governance part
  - "5 and 6 run at the same time": `StageResumeSpa` is listed last in `site/quartz.config.ts`, but Quartz starts every emitter together
  - Known gaps TD-007 (missing resume app is only a warning) and TD-006 (local Quartz patches)

## How To Read It
1. Follow the numbered centre column from 1 to 7; the numbers match "How it works, step by step" in ARCH-004.
2. Glance left at each step to see what it reads. Note that `_KNOWLEDGE/` has no arrow.
3. Glance right at steps 4 to 6 to see what is dropped and what is written.
4. End on the red box: both gaps sit at step 6, the one step that is local code rather than stock Quartz.

## Build Relevance
Every deploy, local or Cloudflare, runs this one path, so the picture answers the two questions people get wrong most: where a file must live to be published (under `site/content/`, never `_KNOWLEDGE/`), and why `/resume/` is not a Quartz page (it is copied in by a repo-local emitter). It also shows where the risk concentrates: step 6 is repo-local code inside the vendored framework, with a silent-skip path.

## Suggested Caption
DIA-104 · Site build. One script, two installs, one Quartz run; a repo-local emitter stages the resume app at /resume/.
