# `resumeContent` — Alonzo's Anthologies (CRA)

This package is the Alonzo's Anthologies monorepo’s **Alonzo's Anthologies** SPA (npm **`resume-content`**). It originated as the `zowilliams.github.io` GitHub Pages app and is now built for **Cloudflare Pages** as part of the combined site.

## Monorepo wiring

- **`homepage`** in `package.json` is **`/resume`** — production assets load under `/resume/`.
- From the repo root, **`bash ./build.sh`** runs `npm ci && npm run build` here, then copies **`build/`** into **`site/public/resume/`** after the Quartz build.

## Local development

```bash
cd resumeContent
npm ci
npm start
```

For a path-accurate preview of the mounted app, use `npm run build` plus a static server rooted at `site/public` after a full `build.sh`, or serve `build/` with a base path of `/resume`.

**Quartz-only local preview:** After `npm run build` in this folder at least once, `npx quartz build` or `npx quartz build --serve` from `site/` copies `resumeContent/build/` into `site/public/resume/` automatically (via the `StageResumeSpa` emitter). You do not need to run `build.sh` for `/resume` to exist locally.

## CRA defaults

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See CRA docs for `npm test`, `npm run build`, and `npm run eject`.
