# Site setup

The Quartz 4 framework files are not yet present in this folder — only the `content/` scaffold (the doc taxonomy adopted from the Serennovas pattern).

To layer Quartz 4 in:

```powershell
cd site
.\setup-quartz.ps1
```

The script:

1. Clones the official Quartz 4 repo into a temp directory.
2. Copies its framework files (`quartz/`, `quartz.config.ts`, `quartz.layout.ts`, `package.json`, `tsconfig.json`, etc.) into this folder.
3. Skips its example `content/` folder so your existing scaffold under `content/` is preserved.
4. Cleans up the temp directory.

After it finishes:

```powershell
npm ci
npx quartz build --serve
```

The site serves on `http://localhost:8080`.

## Customizing

The two files you'll edit most:

- **`quartz.config.ts`** — site title, description, base URL, plugins.
- **`quartz.layout.ts`** — page chrome (header/footer, nav, what shows on each page type).

Quartz's own docs are at <https://quartz.jzhao.xyz/>.

## Where the project docs live

Project docs (definitions, architecture, milestones, runbooks, technical debt, roadmap) live in `_KNOWLEDGE/` at the repo root, not under `site/content/`. Start at [`_KNOWLEDGE/README.md`](../_KNOWLEDGE/README.md). Pages under `content/` are public writing only.

You can delete this `SETUP.md` and `setup-quartz.ps1` after the framework is in place.
