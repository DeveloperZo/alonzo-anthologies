#!/usr/bin/env bash
# Monorepo build for Cloudflare Pages.
# Layout: anthologies/<name>-series/<project>/.
# Output: anthologies/website-series/site/public/
#   (Quartz site at /, interactive résumé at /resume via StageResumeSpa emitter).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="$REPO_ROOT/anthologies/website-series/site"
RESUME_DIR="$REPO_ROOT/anthologies/resume-series/resumeContent"

if [ -f "$RESUME_DIR/package.json" ]; then
  echo "==> Installing resume SPA deps (resume-series/resumeContent/) — Quartz StageResumeSpa runs npm run build during site emit"
  (cd "$RESUME_DIR" && npm ci)
else
  echo "==> Skipping resume-series/resumeContent/ (not in workspace — e.g. incomplete clone). Quartz-only deploy."
fi

echo "==> Building Quartz docs site (website-series/site/)"
(cd "$SITE_DIR" && npm ci && npx quartz build)
# /resume: StageResumeSpa runs the resumeContent npm run build then copies build/ into public/resume/.

echo "==> Done. Deploy anthologies/website-series/site/public/"
