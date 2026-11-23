#!/usr/bin/env python3
"""Software factory runner, v0.

Moves one card at a time through queue/inbox -> process -> output | finding.
The directories are the state. Standard library only, so it runs the same on
lemonpepper (Windows) and in a Linux test VM.

  python runner.py --root F:\\Factory --repo F:\\Programming\\Serennovas init
  python runner.py --root F:\\Factory --repo F:\\Programming\\Serennovas run-next
  python runner.py --root F:\\Factory --repo F:\\Programming\\Serennovas run-next --worker "patch:F:\\Factory\\stubs\\M-UI-050.patch"

Card format: see README.md beside this file.

Stages per card:
  1. worktree   git worktree on branch factory/<id> at card.base
  2. setup      card.setup commands (for example npm ci); a failure stops the card
  3. baseline   card.accept run once before any change; red commands must
                still pass, unless listed in tolerate_red_at_base, or listed in
                ratchet and the count they print does not go up
  4. attempt    worker -> scope check -> gate, up to 1 + card.retries times;
                the gate log of a failed attempt is handed to the next one
  5. hidden     card.hidden_tests copied in from their commit, card.hidden_accept run;
                scoring only, the worker never sees them
  6. judge      external command if --judge is given, run after each attempt whose
                 gate passes; a reject is fed back to the next attempt. Otherwise "unjudged"
  7. file       commit on the branch (never main, never pushed), result.json,
                card moved to output/ or finding/, one line appended to log.md
"""
from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import time
from pathlib import Path

QUEUE_DIRS = ("inbox", "process", "output", "finding")
TAIL = 6000  # characters of command output kept in logs and feedback


# ---------------------------------------------------------------- helpers

def now() -> str:
    return dt.datetime.now().astimezone().isoformat(timespec="seconds")


def run(cmd, cwd: Path, timeout: int = 1800, env: dict | None = None) -> dict:
    """Run a command. A string runs through the shell (so npm/npx resolve on Windows)."""
    t0 = time.monotonic()
    try:
        p = subprocess.run(
            cmd, cwd=str(cwd), shell=isinstance(cmd, str), capture_output=True,
            text=True, encoding="utf-8", errors="replace", timeout=timeout,
            env={**os.environ, **(env or {})},
        )
        code, out = p.returncode, (p.stdout or "") + (p.stderr or "")
    except subprocess.TimeoutExpired as e:
        code, out = 124, f"TIMEOUT after {timeout}s\n{(e.stdout or '')}{(e.stderr or '')}"
    return {"cmd": cmd if isinstance(cmd, str) else " ".join(cmd), "code": code,
            "seconds": round(time.monotonic() - t0, 1), "tail": out[-TAIL:]}


def git(repo: Path, *args, check: bool = True) -> str:
    p = subprocess.run(["git", "-C", str(repo), *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if check and p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {p.stderr.strip()}")
    return p.stdout


def append_jsonl(path: Path, obj: dict) -> None:
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(obj) + "\n")


def load_card(path: Path) -> dict:
    card = json.loads(path.read_text(encoding="utf-8-sig"))  # tolerate a BOM from PowerShell
    for key in ("id", "base", "goal", "write", "accept"):
        if key not in card:
            raise ValueError(f"card {path.name} is missing '{key}'")
    card.setdefault("workdir", ".")
    card.setdefault("setup", [])
    card.setdefault("read", [])
    card.setdefault("retries", 2)
    card.setdefault("hidden_tests", [])
    card.setdefault("hidden_accept", [])
    return card


# ---------------------------------------------------------------- stages

def make_worktree(repo: Path, root: Path, card: dict) -> Path:
    wt = root / "worktrees" / card["id"]
    branch = f"factory/{card['id']}"
    if wt.exists():
        git(repo, "worktree", "remove", "--force", str(wt), check=False)
        shutil.rmtree(wt, ignore_errors=True)
    git(repo, "worktree", "prune")
    git(repo, "worktree", "add", "-f", "-B", branch, str(wt), card["base"])
    return wt


def gate(wt: Path, card: dict, cmds: list[str]) -> list[dict]:
    cwd = wt / card["workdir"]
    return [run(c, cwd) for c in cmds]


# Build and test output that is never the worker's change, even if the repo
# does not ignore it. Cards can add more under "ignore".
DEFAULT_IGNORE = ["*__pycache__*", "*node_modules/*", "*/bin/*", "*/obj/*", "*/dist/*",
                  "*/coverage/*", "*.pyc", "*/.vite/*", "*test-results/*", "*playwright-report/*",
                  "*.aider*"]


def changed_files(wt: Path, base: str, noise: set[str], ignore: list[str]) -> list[str]:
    """Stage the worker's changes only. Noise (files dirtied by setup or the
    baseline run) and ignored patterns are left unstaged, so they are neither
    scope-checked nor committed."""
    git(wt, "add", "-A")
    out = git(wt, "diff", "--cached", "--name-only", base)
    files = [ln for ln in out.splitlines() if ln.strip()]
    drop = [f for f in files if f in noise or any(fnmatch.fnmatch(f, p) for p in ignore)]
    if drop:
        subprocess.run(["git", "-C", str(wt), "reset", "-q", "--pathspec-from-file=-"],
                       input="\n".join(drop), text=True, capture_output=True)
    return [f for f in files if f not in set(drop)]


def out_of_scope(files: list[str], allowed: list[str]) -> list[str]:
    return [f for f in files if not any(fnmatch.fnmatch(f, pat) for pat in allowed)]


def run_worker(worker: str, wt: Path, card_path: Path, feedback: Path | None,
               run_dir: Path, attempt: int) -> dict:
    """worker is 'patch:<file>' (stub: apply a known diff) or a command line.

    A command worker gets FACTORY_CARD, FACTORY_WORKTREE, FACTORY_FEEDBACK
    (empty on the first attempt), FACTORY_RUN_DIR and FACTORY_ATTEMPT, and
    edits files in the worktree. Its exit code is recorded, not trusted:
    the gate decides.
    """
    if worker.startswith("patch:"):
        patch = Path(worker[len("patch:"):]).resolve()
        if attempt > 1:
            return {"cmd": f"stub patch {patch.name}", "code": 0, "seconds": 0,
                    "tail": "stub worker: patch already applied, nothing to retry"}
        r = run(["git", "apply", "--whitespace=nowarn", str(patch)], wt)
        if r["code"] != 0:  # line endings differ on Windows checkouts; fall back to blobs
            r = run(["git", "apply", "--3way", "--whitespace=nowarn", str(patch)], wt)
        return r
    env = {
        "FACTORY_CARD": str(card_path), "FACTORY_WORKTREE": str(wt),
        "FACTORY_FEEDBACK": str(feedback) if feedback else "",
        "FACTORY_RUN_DIR": str(run_dir), "FACTORY_ATTEMPT": str(attempt),
    }
    return run(worker, wt, timeout=3600, env=env)


def hidden(wt: Path, repo: Path, card: dict) -> list[dict]:
    """Copy the hidden tests in, run hidden_accept, then put the worker's files back."""
    if not card["hidden_tests"]:
        return []
    saved = {}
    for t in card["hidden_tests"]:
        f = wt / t["path"]
        saved[t["path"]] = f.read_bytes() if f.exists() else None
    try:
        return _hidden_run(wt, repo, card)
    finally:
        for rel, data in saved.items():
            f = wt / rel
            if data is None:
                f.unlink(missing_ok=True)
            else:
                f.write_bytes(data)


def _hidden_run(wt: Path, repo: Path, card: dict) -> list[dict]:
    for t in card["hidden_tests"]:
        blob = git(repo, "show", f"{t['commit']}:{t['path']}")
        dest = wt / t["path"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(blob, encoding="utf-8", newline="")
    return gate(wt, card, card["hidden_accept"])


def judge(judge_cmd: str | None, wt: Path, card_path: Path, run_dir: Path) -> dict:
    if not judge_cmd:
        return {"verdict": "unjudged", "reasons": ["no judge configured"]}
    r = run(judge_cmd, wt, timeout=900, env={
        "FACTORY_CARD": str(card_path), "FACTORY_WORKTREE": str(wt),
        "FACTORY_RUN_DIR": str(run_dir)})
    try:
        return json.loads(r["tail"].strip().splitlines()[-1])
    except Exception:
        return {"verdict": "error", "reasons": [f"judge exit {r['code']}", r["tail"][-500:]]}


# ---------------------------------------------------------------- main flow

def count(pattern: str, text: str) -> int | None:
    """Last match of pattern's first group as an int, or None."""
    hits = re.findall(pattern, text)
    if not hits:
        return None
    h = hits[-1]
    return int(h[0] if isinstance(h, tuple) else h)


def summarize(results: list[dict], excused: set[str], ratchet: dict[str, str],
              base_counts: dict[str, int]) -> tuple[bool, list[str]]:
    """A red command fails the gate unless it is excused, or it is a ratchet
    command whose count (say, ESLint errors) did not go up from the base."""
    failed = []
    for r in results:
        cmd = r["cmd"]
        if r["code"] == 0 or cmd in excused:
            continue
        if cmd in ratchet and cmd in base_counts:
            now_n = count(ratchet[cmd], r["tail"])
            r["ratchet"] = {"base": base_counts[cmd], "now": now_n}
            if now_n is not None and now_n <= base_counts[cmd]:
                continue
        failed.append(cmd)
    return (not failed), failed


def process(root: Path, repo: Path, card_path: Path, worker: str, judge_cmd: str | None) -> dict:
    card = load_card(card_path)
    cid = card["id"]
    run_dir = root / "runs" / cid
    run_dir.mkdir(parents=True, exist_ok=True)
    attempts_log = run_dir / "attempts.jsonl"
    result: dict = {"id": cid, "started": now(), "worker": worker, "stages": {}}
    t0 = time.monotonic()

    def stage(name: str, data) -> None:
        result["stages"][name] = data
        append_jsonl(attempts_log, {"at": now(), "stage": name, "data": data})

    wt = make_worktree(repo, root, card)
    base_sha = git(wt, "rev-parse", "HEAD").strip()
    stage("worktree", {"path": str(wt), "branch": f"factory/{cid}", "base": base_sha})

    setup = gate(wt, card, card["setup"])
    stage("setup", setup)
    if any(r["code"] != 0 for r in setup):
        return finish(root, card_path, result, t0, ok=False, reason="setup failed")

    baseline = gate(wt, card, card["accept"])
    # A command red at base must still pass, because new tests are red at base
    # by design. Only commands the card lists in tolerate_red_at_base (say, a
    # lint already failing for unrelated reasons) are excused, and only if red.
    red_at_base = {r["cmd"] for r in baseline if r["code"] != 0}
    excused = red_at_base & set(card.get("tolerate_red_at_base", []))
    # ratchet: {"npm run lint": "(\\d+) errors?"}. A command red at base may stay
    # red as long as the count it prints does not go up.
    ratchet = card.get("ratchet", {})
    base_counts = {r["cmd"]: n for r in baseline if r["code"] != 0 and r["cmd"] in ratchet
                   for n in [count(ratchet[r["cmd"]], r["tail"])] if n is not None}
    ignore = DEFAULT_IGNORE + card.get("ignore", [])
    noise = set(changed_files(wt, base_sha, set(), []))
    git(wt, "reset", "-q")
    stage("baseline", {"red_at_base": sorted(red_at_base), "excused": sorted(excused), "ratchet_base": base_counts, "noise_files": len(noise),
                       "results": [{k: r[k] for k in ("cmd", "code", "seconds")} for r in baseline]})

    feedback: Path | None = None
    passed = False
    fail_reason = "gate did not pass"
    for attempt in range(1, card["retries"] + 2):
        w = run_worker(worker, wt, card_path, feedback, run_dir, attempt)
        files = changed_files(wt, base_sha, noise, ignore)
        bad = out_of_scope(files, card["write"])
        g = [] if bad else gate(wt, card, card["accept"])
        ok, failed = summarize(g, excused, ratchet, base_counts)
        # The worker's exit code counts: a worker that gave up (or never ran the
        # model) must not pass on the strength of a gate that an empty change
        # can satisfy.
        ok = ok and not bad and bool(files) and w["code"] == 0
        stage(f"attempt-{attempt}", {"worker": w, "files": files, "out_of_scope": bad,
                                     "gate": g, "passed": ok})
        if ok and judge_cmd:
            # Judge inside the loop: a rejection is detail the gate cannot see
            # (wording, a property left out), so it goes back to the worker as
            # feedback, like a red gate.
            (run_dir / "diff.patch").write_text(git(wt, "diff", "--cached", base_sha),
                                                encoding="utf-8")
            verdict = judge(judge_cmd, wt, card_path, run_dir)
            stage(f"judge-{attempt}", verdict)
            if verdict.get("verdict") == "error":  # a broken judge is not feedback
                fail_reason = "judge error: " + "; ".join(verdict.get("reasons", []))
                break
            if verdict.get("verdict") != "accept":
                fail_reason = "judge: " + ("; ".join(verdict.get("reasons", [])) or "rejected")
                feedback = run_dir / f"feedback-{attempt}.txt"
                feedback.write_text("The checks passed, but a reviewer rejected the change:\n- "
                                    + "\n- ".join(verdict.get("reasons", [])), encoding="utf-8")
                continue
        if ok:
            passed = True
            break
        if w["code"] == 3:  # worker refused the card as too big; retrying cannot help
            fail_reason = "card over the worker's context budget"
            break
        feedback = run_dir / f"feedback-{attempt}.txt"
        lines = []
        if w["code"] != 0:
            lines.append(f"The worker exited {w['code']}:\n{w['tail'][-1500:]}")
        if not files:
            lines.append("No files were changed.")
        if bad:
            lines.append("Edits outside the allowed paths, revert them: " + ", ".join(bad))
        for r in g:
            if r["cmd"] in failed:
                lines.append(f"$ {r['cmd']}  (exit {r['code']})\n{r['tail']}")
        feedback.write_text("\n\n".join(lines), encoding="utf-8")
    result["attempts"] = attempt

    diff = git(wt, "diff", "--cached", base_sha)
    (run_dir / "diff.patch").write_text(diff, encoding="utf-8")
    result["diff_lines"] = sum(1 for ln in diff.splitlines()
                               if ln[:1] in "+-" and not ln.startswith(("+++", "---")))

    if card["hidden_tests"]:
        h = hidden(wt, repo, card)
        stage("hidden", h)
        result["hidden_passed"] = all(r["code"] == 0 for r in h) if h else None
        changed_files(wt, base_sha, noise, ignore)
        if passed and result["hidden_passed"] is False:
            passed, fail_reason = False, "hidden tests failed"

    if not passed:
        verdict = {"verdict": "reject", "reasons": [fail_reason]}
    elif judge_cmd:
        verdict = result["stages"][f"judge-{attempt}"]
    else:
        verdict = {"verdict": "unjudged", "reasons": ["no judge configured"]}
    stage("judge", verdict)

    if passed:
        git(wt, "-c", "user.name=factory", "-c", "user.email=factory@localhost",
            "commit", "-q", "-m", f"factory: {cid}\n\n{card['goal']}", check=False)
        result["commit"] = git(wt, "rev-parse", "HEAD").strip()

    ok = passed and verdict.get("verdict") in ("accept", "unjudged")
    return finish(root, card_path, result, t0, ok=ok,
                  reason="" if ok else ("; ".join(verdict.get("reasons", [])) or "rejected"))


def finish(root: Path, card_path: Path, result: dict, t0: float, ok: bool, reason: str) -> dict:
    result["seconds"] = round(time.monotonic() - t0, 1)
    result["finished"] = now()
    result["outcome"] = "output" if ok else "finding"
    result["reason"] = reason
    dest = root / "queue" / result["outcome"]
    (root / "runs" / result["id"]).mkdir(parents=True, exist_ok=True)
    shutil.move(str(card_path), str(dest / card_path.name))
    (dest / f"{result['id']}.result.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    (root / "runs" / result["id"] / "result.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    hp = result.get("hidden_passed")
    line = (f"- {result['finished'][:16]} `{result['id']}` {result['outcome']}"
            f" attempts={result.get('attempts', 0)} diff={result.get('diff_lines', 0)}"
            f" hidden={'n/a' if hp is None else ('pass' if hp else 'FAIL')}"
            f" {result['seconds']}s worker=`{result['worker'][:40]}`"
            + (f" reason: {reason}" if reason else "") + "\n")
    log = root / "log.md"
    if not log.exists():
        log.write_text("# Factory log\n\nOne line per run. Details in runs/<card-id>/.\n\n", encoding="utf-8")
    with log.open("a", encoding="utf-8") as f:
        f.write(line)
    return result


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", required=True, type=Path, help="factory root, for example F:\\Factory")
    ap.add_argument("--repo", required=True, type=Path, help="git repository the cards work on")
    ap.add_argument("command", choices=["init", "run-next", "status"])
    ap.add_argument("--worker", default=os.environ.get("FACTORY_WORKER", ""),
                    help="'patch:<file>' or a command line; default $FACTORY_WORKER")
    ap.add_argument("--judge", default=os.environ.get("FACTORY_JUDGE"),
                    help="command that prints a JSON verdict as its last line")
    a = ap.parse_args()
    for stream in (sys.stdout, sys.stderr):  # ESLint prints characters cp1252 cannot encode
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    root, repo = a.root.resolve(), a.repo.resolve()

    if a.command == "init":
        for d in QUEUE_DIRS:
            (root / "queue" / d).mkdir(parents=True, exist_ok=True)
        (root / "runs").mkdir(exist_ok=True)
        (root / "worktrees").mkdir(exist_ok=True)
        print(f"initialised {root}")
        return 0

    if a.command == "status":
        for d in QUEUE_DIRS:
            names = sorted(p.name for p in (root / "queue" / d).glob("*.json")
                           if not p.name.endswith(".result.json"))
            print(f"{d:8} {len(names):3}  {', '.join(names)}")
        return 0

    if not a.worker:
        print("no worker: pass --worker or set FACTORY_WORKER", file=sys.stderr)
        return 2
    if any((root / "queue" / "process").glob("*.json")):
        print("a card is already in process/; finish or move it first", file=sys.stderr)
        return 3
    inbox = sorted((root / "queue" / "inbox").glob("*.json"), key=lambda p: p.stat().st_mtime)
    if not inbox:
        print("inbox empty")
        return 0
    card_path = root / "queue" / "process" / inbox[0].name
    shutil.move(str(inbox[0]), str(card_path))
    try:
        res = process(root, repo, card_path, a.worker, a.judge)
    except Exception as e:  # leave a trace, move the card out of process/
        res = finish(root, card_path, {"id": card_path.stem, "worker": a.worker, "stages": {}},
                     time.monotonic(), ok=False, reason=f"runner error: {e}")
    print(json.dumps({k: res.get(k) for k in
                      ("id", "outcome", "attempts", "diff_lines", "hidden_passed", "seconds", "reason")}))
    return 0 if res["outcome"] == "output" else 1


if __name__ == "__main__":
    sys.exit(main())
