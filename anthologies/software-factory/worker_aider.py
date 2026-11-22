#!/usr/bin/env python3
"""Factory worker: Aider driving a local model through LiteLLM.

The runner calls this in the card's worktree with FACTORY_CARD, FACTORY_WORKTREE,
FACTORY_FEEDBACK, FACTORY_RUN_DIR and FACTORY_ATTEMPT set. Use as:

  --worker "py -3 F:\\Factory\\bin\\worker_aider.py"

Settings (environment):
  FACTORY_ROUTE      LiteLLM route, default local-fast (local-think for retries if
                     FACTORY_RETRY_ROUTE is set)
  FACTORY_LLM_BASE   default http://localhost:4000/v1
  FACTORY_CTX        model context window, default 16384
  WHL_LITELLM_KEY    relay key. If unset, read from E:\\WHL\\compose\\.env by this
                     process, like ask-local.ps1 does. Never printed.
  FACTORY_AIDER      aider executable, default "aider"

Card fields used: goal, criterion, workdir, write, read, and optionally
  edit        explicit list of files to open for editing (repo-relative). Default:
              files matching the write globs that exist at base.
  new_files   files the worker is expected to create (repo-relative).
  interface   text describing names and signatures other code or tests rely on.
  notes       anything else the planner wants the worker to know.
"""
from __future__ import annotations

import fnmatch
import json
import os
import subprocess
import sys
from pathlib import Path


def relay_key() -> str:
    key = os.environ.get("WHL_LITELLM_KEY", "")
    env = Path(r"E:\WHL\compose\.env")
    if not key and env.exists():
        for line in env.read_text(encoding="utf-8", errors="replace").splitlines():
            if line.startswith("LITELLM_MASTER_KEY="):
                key = line.split("=", 1)[1].strip()
                break
    return key


def tracked(wt: Path) -> list[str]:
    out = subprocess.run(["git", "-C", str(wt), "ls-files"], capture_output=True, text=True,
                         encoding="utf-8", errors="replace").stdout
    return [f for f in out.splitlines() if f]


def main() -> int:
    card = json.loads(Path(os.environ["FACTORY_CARD"]).read_text(encoding="utf-8-sig"))
    wt = Path(os.environ["FACTORY_WORKTREE"])
    run_dir = Path(os.environ["FACTORY_RUN_DIR"])
    attempt = int(os.environ.get("FACTORY_ATTEMPT", "1"))
    feedback_path = os.environ.get("FACTORY_FEEDBACK", "")

    route = os.environ.get("FACTORY_ROUTE", "local-fast")
    if attempt > 1 and os.environ.get("FACTORY_RETRY_ROUTE"):
        route = os.environ["FACTORY_RETRY_ROUTE"]
    base = os.environ.get("FACTORY_LLM_BASE", "http://localhost:4000/v1")
    ctx = int(os.environ.get("FACTORY_CTX", "16384"))
    key = relay_key()
    if not key:
        print("worker_aider: no relay key (set WHL_LITELLM_KEY)", file=sys.stderr)
        return 2

    files = tracked(wt)
    edit = card.get("edit") or [f for f in files if any(fnmatch.fnmatch(f, p) for p in card["write"])]
    new_files = card.get("new_files", [])
    for nf in new_files:  # aider adds a missing file it is given as empty, then fills it
        p = wt / nf
        p.parent.mkdir(parents=True, exist_ok=True)
        if not p.exists():
            p.write_text("", encoding="utf-8")
    read = card.get("read", [])

    lines = [
        "You are making one small, focused change in an existing codebase.",
        f"Goal: {card['goal']}",
    ]
    if card.get("criterion"):
        lines.append(f"Acceptance criterion: {card['criterion']}")
    if card.get("interface"):
        lines.append(f"Required interface (other code and tests depend on these exact names):\n{card['interface']}")
    if card.get("notes"):
        lines.append(f"Notes: {card['notes']}")
    lines.append("Only change the files you have been given. Keep the change minimal and match the "
                 "surrounding code style. Do not add dependencies. Do not edit tests unless a file you "
                 "were given is a test.")
    if feedback_path and Path(feedback_path).exists():
        fb = Path(feedback_path).read_text(encoding="utf-8", errors="replace")[-3500:]
        lines.append("Your previous attempt failed these checks. Fix the cause:\n" + fb)
    msg_file = run_dir / f"aider-message-{attempt}.txt"
    msg_file.write_text("\n\n".join(lines), encoding="utf-8")

    meta = run_dir / "aider-model-metadata.json"
    meta.write_text(json.dumps({f"openai/{route}": {
        "max_input_tokens": ctx, "max_tokens": 4096, "max_output_tokens": 4096,
        "input_cost_per_token": 0, "output_cost_per_token": 0,
        "litellm_provider": "openai", "mode": "chat"}}), encoding="utf-8")

    cmd = [os.environ.get("FACTORY_AIDER", "aider"),
           "--model", f"openai/{route}",
           "--model-metadata-file", str(meta),
           "--edit-format", "diff",
           "--no-git", "--yes-always", "--no-pretty", "--no-stream",
           "--map-tokens", "0", "--no-show-model-warnings", "--no-check-update",
           "--analytics-disable", "--no-auto-lint", "--no-auto-test",
           "--chat-history-file", str(run_dir / f"aider-chat-{attempt}.md"),
           "--input-history-file", str(run_dir / "aider-input.history"),
           "--message-file", str(msg_file)]
    for r in read:
        cmd += ["--read", r]
    cmd += edit + [nf for nf in new_files if nf not in edit]

    env = {**os.environ, "OPENAI_API_KEY": key, "OPENAI_API_BASE": base,
           "PYTHONIOENCODING": "utf-8"}
    log = run_dir / f"aider-attempt-{attempt}.log"
    with log.open("w", encoding="utf-8") as f:
        p = subprocess.run(cmd, cwd=str(wt), stdout=f, stderr=subprocess.STDOUT, env=env,
                           stdin=subprocess.DEVNULL, timeout=1800)
    tail = log.read_text(encoding="utf-8", errors="replace")[-1500:]
    print(tail)
    return p.returncode


if __name__ == "__main__":
    sys.exit(main())
