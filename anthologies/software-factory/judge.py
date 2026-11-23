#!/usr/bin/env python3
"""Factory judge: a frontier model reads the card and the diff and accepts or rejects.

The runner calls this after an attempt whose gate passed, in the card's worktree,
with FACTORY_CARD, FACTORY_WORKTREE and FACTORY_RUN_DIR set. The runner writes
runs/<id>/diff.patch first. Use as:

  --judge "py -3 F:\\Factory\\bin\\judge.py"

The gate already proved that the code builds, lints no worse and passes the tests.
The judge checks what the gate cannot: that every part of the goal was done, that
names and wording match the card, that nothing outside the goal changed, and
that the change would pass a careful code review.

Settings (environment):
  FACTORY_JUDGE_ROUTE  LiteLLM route of a frontier model. Required.
  FACTORY_LLM_BASE     default http://localhost:4000/v1
  WHL_FACTORY_KEY      the factory's LiteLLM virtual key. Required, never printed.

Output: the last line on stdout is {"verdict":"accept"|"reject","reasons":[...]}.
Token use is appended to runs/<id>/judge-usage.jsonl for value-per-token scoring.
Standard library only.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.request
from pathlib import Path

MAX_DIFF_CHARS = 60_000

SYSTEM = """You are the reviewer in a software factory. A small local model wrote the change \
below to satisfy one card. Automated checks (type check, lint, tests) already passed, so do \
not re-check that it compiles. Check what those checks cannot see:
1. Every requirement in the goal, criterion and interface is actually done. List any that are missing.
2. Exact names, signatures, text and formats the card specifies are matched.
3. Nothing outside the goal changed, and no unrelated code was rewritten.
4. Nothing a careful reviewer would block: dead code, duplicated logic the card asked to \
share, debug output, weakened types, broken behaviour on edge cases the goal mentions.
Do not reject for style preferences the card does not ask for. Each reason must say \
exactly what to change, so the author can fix it without asking.
Answer with JSON only: {"verdict": "accept" or "reject", "reasons": ["..."]}"""


def main() -> int:
    card = json.loads(Path(os.environ["FACTORY_CARD"]).read_text(encoding="utf-8-sig"))
    run_dir = Path(os.environ["FACTORY_RUN_DIR"])
    route = os.environ.get("FACTORY_JUDGE_ROUTE", "")
    key = os.environ.get("WHL_FACTORY_KEY", "")
    base = os.environ.get("FACTORY_LLM_BASE", "http://localhost:4000/v1").rstrip("/")
    if not route or not key:
        print(json.dumps({"verdict": "error",
                          "reasons": ["judge needs FACTORY_JUDGE_ROUTE and WHL_FACTORY_KEY"]}))
        return 2
    diff = (run_dir / "diff.patch").read_text(encoding="utf-8", errors="replace")
    if len(diff) > MAX_DIFF_CHARS:
        diff = diff[:MAX_DIFF_CHARS] + "\n[diff truncated]"

    parts = [f"Card {card['id']}", f"Goal: {card['goal']}"]
    for k in ("criterion", "interface", "notes"):
        if card.get(k):
            parts.append(f"{k.capitalize()}: {card[k]}")
    parts.append("Allowed paths: " + ", ".join(card.get("write", [])))
    parts.append("Diff:\n" + diff)

    body = json.dumps({"model": route, "temperature": 0, "max_tokens": 1500,
                       "messages": [{"role": "system", "content": SYSTEM},
                                    {"role": "user", "content": "\n\n".join(parts)}]}).encode()
    req = urllib.request.Request(f"{base}/chat/completions", data=body, headers={
        "Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    t0 = time.monotonic()
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            resp = json.loads(r.read())
    except Exception as e:  # noqa: BLE001  report, never crash the runner
        print(json.dumps({"verdict": "error", "reasons": [f"judge call failed: {type(e).__name__}"]}))
        return 1

    usage = resp.get("usage", {})
    with (run_dir / "judge-usage.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps({"route": route, "seconds": round(time.monotonic() - t0, 1),
                            "prompt_tokens": usage.get("prompt_tokens"),
                            "completion_tokens": usage.get("completion_tokens")}) + "\n")

    text = resp["choices"][0]["message"].get("content") or ""
    m = re.search(r"\{.*\}", text, re.S)
    try:
        v = json.loads(m.group(0)) if m else {}
    except json.JSONDecodeError:
        v = {}
    if v.get("verdict") not in ("accept", "reject"):
        print(json.dumps({"verdict": "error", "reasons": ["judge reply was not a verdict",
                                                           text[:300]]}))
        return 1
    reasons = [str(r) for r in v.get("reasons", [])][:10]
    print(json.dumps({"verdict": v["verdict"], "reasons": reasons}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
