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
  FACTORY_MAX_OUTPUT output cap incl. reasoning, default 6144 (also the input reserve)
  WHL_FACTORY_KEY    the factory's LiteLLM virtual key (front door, local-*, paid).
                     Required. Never printed, never read from a file.
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
    """The factory's own LiteLLM virtual key. Never read from E:\\WHL\\compose\\.env:
    the master keys there are rotated and must not be used by tools."""
    return os.environ.get("WHL_FACTORY_KEY", "")


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
        print("worker_aider: no relay key (set WHL_FACTORY_KEY)", file=sys.stderr)
        return 2

    files = tracked(wt)
    # An explicit "edit": [] means no existing file is edited (only new_files).
    edit = card["edit"] if "edit" in card else \
        [f for f in files if any(fnmatch.fnmatch(f, p) for p in card["write"])]
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
    paths = edit + [nf for nf in new_files if nf not in edit]
    if paths:
        lines.append("Files to change, by exact path from the repository root (write to these paths, "
                     "never to a path relative to another file):\n" + "\n".join(paths))
    lines.append("Only change the files you have been given. Keep the change minimal and match the "
                 "surrounding code style. Do not add dependencies. Do not edit tests unless a file you "
                 "were given is a test.")
    if feedback_path and Path(feedback_path).exists():
        fb = Path(feedback_path).read_text(encoding="utf-8", errors="replace")[-3500:]
        lines.append("Your previous attempt failed these checks. Fix the cause:\n" + fb)
    # Budget check: Aider sends whole files, so a card whose files do not fit the
    # context makes the model hang or reason over a truncated prompt. Fail fast.
    chars = len("\n\n".join(lines))
    for f in edit + read:
        try:
            chars += (wt / f).stat().st_size
        except OSError:
            pass
    est = int(chars / 3.5) + 2000  # files + message + Aider's own prompt
    # gpt-oss spends output tokens on reasoning before the edit; at 4096, 8 of 9
    # token-limit hits in the M-UI-035 run were the output cap. Input and output
    # share the context, so a bigger cap leaves less room for files.
    max_out = int(os.environ.get("FACTORY_MAX_OUTPUT", "6144"))
    budget = ctx - int(os.environ.get("FACTORY_OUTPUT_RESERVE", str(max_out)))
    (run_dir / f"budget-{attempt}.json").write_text(json.dumps(
        {"estimated_input_tokens": est, "budget": budget, "ctx": ctx}), encoding="utf-8")
    if est > budget:
        print(f"worker_aider: card too big for the context: ~{est} input tokens, budget {budget}. "
              "Split the card or narrow edit/read.", file=sys.stderr)
        return 3
    msg_file = run_dir / f"aider-message-{attempt}.txt"
    msg_file.write_text("\n\n".join(lines), encoding="utf-8")

    meta = run_dir / "aider-model-metadata.json"
    meta.write_text(json.dumps({f"openai/{route}": {
        "max_input_tokens": ctx, "max_tokens": max_out, "max_output_tokens": max_out,
        "input_cost_per_token": 0, "output_cost_per_token": 0,
        "litellm_provider": "openai", "mode": "chat"}}), encoding="utf-8")

    cmd = [os.environ.get("FACTORY_AIDER", "aider"),
           "--model", f"openai/{route}",
           "--model-metadata-file", str(meta),
           "--edit-format", "diff",
           # Git root (the worktree) anchors paths. With --no-git, Aider took the folder of
           # the chat files as its root and wrote new files to a nested duplicate path.
           "--no-auto-commits", "--no-dirty-commits", "--no-gitignore", "--yes-always", "--no-pretty", "--no-stream",
           "--map-tokens", "0", "--no-detect-urls", "--no-show-model-warnings", "--no-check-update",
           "--analytics-disable", "--no-auto-lint", "--no-auto-test",
           "--timeout", os.environ.get("FACTORY_LLM_TIMEOUT", "600"),
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
                           stdin=subprocess.DEVNULL, timeout=2400)
    tail = log.read_text(encoding="utf-8", errors="replace")[-1500:]
    print(tail)
    return p.returncode


if __name__ == "__main__":
    sys.exit(main())
