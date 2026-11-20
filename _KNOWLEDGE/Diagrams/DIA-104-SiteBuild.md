# DIA-104: Site build, from Zo's folders to the one finished folder
## Snapshot
- **Diagram file:** `_KNOWLEDGE/Diagrams/DIA-104-SiteBuild.svg`
- **Theme:** How Zo's written pages and the resume app become the one folder that gets published
- **Primary audience takeaway:** The page maker reads only the writing folder, the resume app is made ready alongside and placed at `/resume/`, and everything lands in one finished folder that the publisher puts online.

## What The Diagram Shows
Two blue boxes on the left are what Zo makes by hand: the writing folder (his written pages and their pictures) and the resume app (kept in its own folder). The top row shows the page maker reading only the writing folder, turning the writing into web pages, and leaving out any page marked draft. The second row shows the resume app going straight across: it is made ready alongside by an extra step added for this site, and placed at the address `/resume/`. Both rows end in the tall green box on the right, the finished folder, which is made fresh every time and holds the web pages and the resume app. An arrow from the finished folder goes down to the publisher, which puts the folder online as the live site. At the bottom left, a dashed grey box holds the project notes: no arrow touches it, because the page maker never reads them. A short note in the middle says when this runs.

## Elements And Flow
- **Components:**
  - The writing folder: `anthologies/website-series/site/content/`
  - The resume app: the resume SPA in `anthologies/resume-series/resumeContent/`
  - The page maker: Quartz, run by `build.sh`
  - The finished folder: `anthologies/website-series/site/public/`, holding the web pages (with their pictures) and the resume app at `/resume/`
  - The publisher: Cloudflare Pages
  - The project notes, never published: `_KNOWLEDGE/`
- **Relationships:**
  - Writing folder to page maker: "reads only this folder"
  - Page maker to finished folder: "writes the web pages"
  - Resume app to finished folder: "made ready alongside, then placed at /resume/", by the `StageResumeSpa` step
  - Finished folder to publisher: "this folder goes online"
  - The project notes have no arrow on purpose
- **Notable labels or metrics:**
  - "leaves out pages marked draft": the `draft: true` flag on a page
  - "one folder, made fresh every time": the finished folder is never saved in the main copy
  - "When this runs": every time Zo sends the changes up, the publisher runs all of this by itself; if a step fails, the live site stays as it was
- **Color:** blue is what Zo makes by hand, green is the automatic part, dashed grey is kept out of the site.
- **Left out on purpose:** the two package installs, the Node version, the count of pages and diagrams, the sitemap, feed and other files the page maker also writes, the fact that the page-writing and the resume step run at the same time, the local preview commands, and the two known gaps (a missing resume app only warns, TD-007; the resume step is a local edit inside Quartz, TD-006). Those are in ARCH-004.

## How To Read It
1. Start at the two blue boxes on the left: these are the only things Zo edits.
2. Follow the top row: the page maker reads only the writing folder and writes the web pages.
3. Follow the second row: the resume app skips the page maker and is placed at `/resume/`.
4. Look at the tall green box: both rows end in the same finished folder.
5. Follow the arrow down to the publisher, which puts that folder online.
6. End at the dashed box: the project notes sit apart, with no arrow.

## Build Relevance
This is the picture behind ARCH-004. It answers the two questions people get wrong most: where a file must live to be published (in the writing folder, never in the project notes), and why the resume is not one of the written pages (it is a separate app placed into the finished folder). It also shows that there is exactly one folder the publisher ever sees.

## Suggested Caption
DIA-104 · Site build: the writing becomes web pages, the resume app goes in at /resume/, and one finished folder is published.
