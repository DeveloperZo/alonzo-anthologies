"""Runs the local-model evaluation behind ../ROUTING.md and prints a pass table.

  python run_eval.py                     every task, both routes, two runs each
  python run_eval.py --runs 1            one run each
  python run_eval.py --only t05 t06      some tasks only
  python run_eval.py --perf              speed, cold start and size-limit probes only
  python run_eval.py --out D:\\some\\dir   where replies and results.json go

Each task is sent through ../ask-local.ps1 with -Caller eval and -Task eval-<id>,
so the runs can be filtered out of the request log. Replies, stats and
results.json land in the output folder (a temp folder by default), never here.

Most scores are machine checks. Task t01 (summary) is only screened here:
read the summaries against inputs/arch003.md to count wrong claims.
"""
import argparse
import difflib
import itertools
import json
import os
import re
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(os.path.dirname(HERE), "ask-local.ps1")
INPUTS = os.path.join(HERE, "inputs")
TESTS = os.path.join(HERE, "tests")
ROUTES = ["local-fast", "local-coder"]
EMDASH = "\u2014"
# gpt-oss likes non-breaking hyphens, narrow spaces and curly quotes. They break exact matching.
ODD_CHARS = {"\u2011": "-", "\u2010": "-", "\u202f": " ", "\u00a0": " ", "\u2009": " ",
             "\u2019": "'", "\u2018": "'", "\u201c": '"', "\u201d": '"'}


def read(name):
    with open(os.path.join(INPUTS, name), encoding="utf-8") as handle:
        return handle.read()


def write(path, text):
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(text)


def ask(prompt, files, route, task, out_path, max_tokens):
    """One call to ask-local.ps1. Returns (reply or None, stats dict, error text)."""
    cmd = ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", TOOL,
           "-Route", route, "-Task", "eval-" + task, "-Caller", "eval",
           "-MaxTokens", str(max_tokens), "-Stats", "-Out", out_path]
    for path in files:
        cmd += ["-File", path]
    if os.path.exists(out_path):
        os.remove(out_path)
    started = time.time()
    done = subprocess.run(cmd, input=prompt.encode("utf-8"), capture_output=True, timeout=1200)
    wall = round(time.time() - started, 1)
    err = done.stderr.decode("utf-8", "replace").strip()
    stats = {}
    for line in err.splitlines():
        if line.startswith("{"):
            try:
                stats = json.loads(line)
            except ValueError:
                pass
    stats.setdefault("seconds", wall)
    stats["exit"] = done.returncode
    reply = None
    if done.returncode == 0 and os.path.exists(out_path):
        with open(out_path, encoding="utf-8") as handle:
            reply = handle.read()
    return reply, stats, err


# ---------- helpers for scoring ----------

def strip_fence(text):
    """Return (inner text, had_fence). Takes the longest fenced block if any."""
    blocks = re.findall(r"```[a-zA-Z0-9]*[ \t]*\r?\n(.*?)```", text, flags=re.S)
    if blocks:
        return max(blocks, key=len), True
    return text, False


def loose_json(text):
    """Parse JSON the way a forgiving harness would. Returns (value, how)."""
    raw = text.strip()
    try:
        return json.loads(raw), "strict"
    except ValueError:
        pass
    inner, fenced = strip_fence(raw)
    try:
        return json.loads(inner.strip()), "fenced"
    except ValueError:
        pass
    for opener, closer in (("{", "}"), ("[", "]")):
        first, last = raw.find(opener), raw.rfind(closer)
        if first != -1 and last > first:
            try:
                return json.loads(raw[first:last + 1]), "dug out"
            except ValueError:
                pass
    return None, "no JSON"


def norm(value):
    return re.sub(r"\s+", " ", str(value)).strip().lower().strip(".'\"` ")


def grade(good, total, pass_at, partial_at):
    if good >= pass_at:
        return "PASS"
    return "PARTIAL" if good >= partial_at else "FAIL"


def run_python_tests(reply, test_file, work):
    code, _ = strip_fence(reply)
    candidate = os.path.join(work, "candidate.py")
    write(candidate, code)
    try:
        done = subprocess.run([sys.executable, "-I", os.path.join(TESTS, test_file), candidate],
                              capture_output=True, timeout=30, cwd=work)
    except subprocess.TimeoutExpired:
        return "FAIL", "tests timed out", ""
    lines = done.stdout.decode("utf-8", "replace").strip().splitlines()
    try:
        passed, total = (int(part) for part in lines[-1].split())
    except (ValueError, IndexError):
        return "FAIL", "test run broke", " | ".join(lines[-2:])
    detail = "; ".join(line for line in lines[:-1])[:300]
    return grade(passed, total, total, int(total * 0.8)), f"{passed}/{total} tests", detail


# ---------- the tasks ----------

def t01_prompt(work):
    return ("Summarize the attached document for an engineer who has not read it. "
            "Write 8 to 10 bullets. Each bullet is one sentence and starts with '- '. "
            "Use only facts stated in the document. Keep names, dates and identifiers exactly as written. "
            "Do not add advice or opinion. Output only the bullets."), [os.path.join(INPUTS, "arch003.md")]


def t01_score(reply, work):
    source = read("arch003.md")
    bullets = [line for line in reply.splitlines() if line.strip().startswith(("- ", "* "))]
    tokens = set(re.findall(r"[A-Za-z0-9_.:/\-]*\d[A-Za-z0-9_.:/\-]*", reply))
    loose = sorted(t.strip(".,:;/-") for t in tokens if t.strip(".,:;/-") and t.strip(".,:;/-") not in source)
    words = len(reply.split())
    ok = 8 <= len(bullets) <= 10 and not loose
    measure = f"{len(bullets)} bullets, {words} words, {len(loose)} numbers or ids not in source (screen only)"
    return ("PASS" if ok else "PARTIAL"), measure, ", ".join(loose)[:200]


T02_EXPECT = {
    "git_host": "github", "production_branch": "main", "build_script": "build.sh",
    "live_hostname": "alonzo-anthologies.pages.dev", "has_custom_domain": False,
    "verified_date": "2026-10-14", "production_deploy_id": "c7455b17",
    "production_commit": "c6dadfe", "legacy_project": "zo-garden",
    "legacy_hostname": "zo-garden.pages.dev",
}


def t02_prompt(work):
    return ("Read the attached paragraph and fill in this JSON object. Reply with only the JSON object.\n"
            "{\n"
            '  "git_host": string, the service the code is pushed to,\n'
            '  "production_branch": string,\n'
            '  "build_script": string, file name only,\n'
            '  "live_hostname": string, host only, no https,\n'
            '  "has_custom_domain": boolean,\n'
            '  "verified_date": string, YYYY-MM-DD,\n'
            '  "production_deploy_id": string,\n'
            '  "production_commit": string,\n'
            '  "legacy_project": string, the older Pages project name,\n'
            '  "legacy_hostname": string, host only\n'
            "}"), [os.path.join(INPUTS, "hosting_paragraph.txt")]


def t02_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, dict):
        return "FAIL", "did not parse as a JSON object", how
    wrong = []
    for key, want in T02_EXPECT.items():
        got = data.get(key)
        same = (got is want) if isinstance(want, bool) else (norm(got) == want)
        if not same:
            wrong.append(f"{key}={got!r}")
    extra = sorted(set(data) - set(T02_EXPECT))
    good = len(T02_EXPECT) - len(wrong)
    status = grade(good, 10, 10, 8) if not extra else "PARTIAL"
    return status, f"{good}/10 fields, JSON {how}", "; ".join(wrong + [f"extra key {k}" for k in extra])


T03_LABELS = ["home-library", "resume", "governance", "repo", "home-library", "resume", "governance", "repo",
              "home-library", "governance", "resume", "repo", "resume", "governance", "repo", "resume",
              "home-library", "repo", "governance", "resume"]


def t03_prompt(work):
    return ("Sort each of the 20 commit subjects in the attached file into exactly one category.\n"
            "Categories:\n"
            "- resume: the resume web app and its content, including play mode, quests, the career factory, "
            "job applications, printing and PDF.\n"
            "- governance: the AI governance article series (Part 1, Part 2), its prose, links, diagrams and plates.\n"
            "- home-library: the home server, its relay, Langfuse, Tailscale machine names and verify runs.\n"
            "- repo: repository housekeeping: folder structure, git remotes, ignore rules, commit attribution, "
            "project knowledge and definitions.\n"
            'Reply with only a JSON object that maps each number to its category, like {"1": "repo", "2": "resume"}.'
            ), [os.path.join(INPUTS, "commits.txt")]


def t03_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, dict):
        return "FAIL", "did not parse as a JSON object", how
    wrong = [f"{i + 1}:{data.get(str(i + 1))}" for i, want in enumerate(T03_LABELS)
             if norm(data.get(str(i + 1))) != want]
    good = 20 - len(wrong)
    return grade(good, 20, 18, 15), f"{good}/20 labels, JSON {how}", " ".join(wrong)


T04_BANNED = ["leverag", "utiliz", "seamless", "robust", "best-in-class", "best in class", "holistic",
              "going forward", "best practice"]
T04_FACTS = ["4000", "11434", "16 GB", "16384", "2026-11-17", "3001", "6 to 30", "lemonpepper", "limesalt",
             "LiteLLM", "Ollama", "Langfuse", "summaries", "extraction", "code"]


def t04_prompt(work):
    path = os.path.join(work, "rewrite_source.txt")
    write(path, read("rewrite_source.txt").replace("{{EMDASH}}", EMDASH))
    return ("Rewrite the attached paragraph to follow these rules.\n"
            "1. No em dashes. Use commas, periods, colons or parentheses instead. Do not swap in a hyphen, "
            "an en dash or two hyphens.\n"
            "2. Do not use these words or phrases in any form: leverage, utilize, seamless, robust, "
            "best-in-class, holistically, going forward, best practice.\n"
            "3. Keep every fact, number and name. Do not add facts.\n"
            "4. Keep it one paragraph of about the same length.\n"
            "Output only the rewritten paragraph."), [path]


def t04_score(reply, work):
    source = read("rewrite_source.txt").replace("{{EMDASH}}", EMDASH)
    text = reply.strip()
    problems = []
    # Count typographic characters as one rule break, then check the facts on a plain copy.
    plain = text
    for odd, simple in ODD_CHARS.items():
        plain = plain.replace(odd, simple)
    if plain != text:
        problems.append("typographic characters in place of plain hyphens or spaces")
    text = plain
    low = text.lower()
    if EMDASH in text:
        problems.append("em dash left in")
    if "\u2013" in text or "--" in text or " - " in text:
        problems.append("dash swapped for another dash")
    problems += [f"banned: {word}" for word in T04_BANNED if word in low]
    problems += [f"lost fact: {fact}" for fact in T04_FACTS if fact.lower() not in low]
    ratio = len(text) / len(source)
    if not 0.7 <= ratio <= 1.2:
        problems.append(f"length ratio {ratio:.2f}")
    if "\n\n" in text or low.startswith(("here", "sure", "rewritten")):
        problems.append("extra text or more than one paragraph")
    status = "PASS" if not problems else ("PARTIAL" if len(problems) == 1 else "FAIL")
    return status, f"{len(problems)} rule breaks, length ratio {ratio:.2f}", "; ".join(problems)


def t05_prompt(work):
    return ("Write a Python 3 function. Reply with only the code, no explanation.\n\n"
            "def slugify(title: str, max_len: int = 60) -> str\n\n"
            "Rules:\n"
            "1. Lowercase the title.\n"
            "2. Keep only ASCII letters a to z and digits 0 to 9. Every run of any other characters "
            "(spaces, punctuation, underscores, accented or other non-ASCII characters) becomes a single hyphen.\n"
            "3. Remove leading and trailing hyphens.\n"
            "4. If the result is longer than max_len, cut it to max_len characters, then remove any trailing hyphen.\n"
            "5. If the result is empty, return \"untitled\".\n"
            "Use only the standard library."), []


def t05_score(reply, work):
    return run_python_tests(reply, "test_slugify.py", work)


def t06_prompt(work):
    return ("Write a Python 3 function. Reply with only the code, no explanation.\n\n"
            "def parse_doc_header(md: str) -> dict\n\n"
            "It parses the first HTML comment block (from '<!--' to the next '-->') in a markdown string.\n"
            "Rules:\n"
            "1. If there is no '<!--' or no '-->' after it, return {}.\n"
            "2. Take the text between the markers and process it line by line. Lines may end in \\r\\n. "
            "Skip blank lines.\n"
            "3. A line is 'indented' if it starts with a space or a tab. Text on the same line as '<!--' "
            "counts as not indented.\n"
            "4. A line that is not indented and contains a colon is a key line. The key is the text before "
            "the FIRST colon: strip it, lowercase it, and replace each run of spaces with one underscore "
            "('Last  Updated ' becomes 'last_updated'). The value is the rest of the line, stripped. "
            "Later colons stay in the value. If a key appears twice, the later one wins.\n"
            "5. A line that is not indented and has no colon is ignored.\n"
            "6. An indented line belongs to the most recent key. If there is no key yet, ignore it.\n"
            "   a. If it starts with '- ' (after stripping) and the key's value is the empty string or already "
            "a list, it is a list item: the value becomes a list of strings and the item is the text after "
            "'- ', stripped. Colons inside items are plain text.\n"
            "   b. Otherwise it is a continuation. If the value is a list, append a space and the stripped line "
            "to the LAST item. If the value is the empty string, the value becomes the stripped line. "
            "Otherwise append a space and the stripped line to the value.\n"
            "7. A key line with an empty value and no list items keeps the value ''.\n"
            "Only the first comment block is parsed. Use only the standard library.\n\n"
            "Example input:\n"
            "<!--\nOwner: zo\nSources:\n  - a: b\n    more\n  - c\n-->\n"
            "Example output:\n"
            "{'owner': 'zo', 'sources': ['a: b more', 'c']}"), []


def t06_score(reply, work):
    return run_python_tests(reply, "test_header.py", work)


def t07_prompt(work):
    return ("Make one small change to the attached PowerShell script and return the complete edited file.\n"
            "The change: add a parameter [int]$TimeoutSec = 20 as the last entry of the param block, and use "
            "$TimeoutSec in place of every literal '-TimeoutSec 20' in the script. Leave '-TimeoutSec 180' as it is.\n"
            "Change nothing else: keep every other line, comment and blank line exactly as it is.\n"
            "Reply with only the file content. No code fence, no explanation."
            ), [os.path.join(INPUTS, "verify_orig.ps1")]


def t07_score(reply, work):
    original = [line.rstrip() for line in read("verify_orig.ps1").strip().splitlines()]
    body, fenced = strip_fence(reply)
    body = re.sub(r"^=====.*=====\s*$", "", body, flags=re.M)
    lines = [line.rstrip() for line in body.strip().splitlines()]
    uses = sum(line.count("-TimeoutSec $TimeoutSec") for line in lines)
    left = sum(line.count("-TimeoutSec 20") for line in lines)
    has_param = any(re.search(r"\[int\]\s*\$TimeoutSec\s*=\s*20", line) for line in lines)
    kept_180 = any("-TimeoutSec 180" in line for line in lines)
    # Undo the requested change. What is left must be the original file.
    undone = []
    for line in lines:
        if re.fullmatch(r"\s*\[int\]\s*\$TimeoutSec\s*=\s*20,?", line):
            # The entry before the new one gained a comma. Take it back off.
            if undone and undone[-1].endswith(",") and undone[-1][:-1] in original:
                undone[-1] = undone[-1][:-1]
            continue
        undone.append(line.replace("-TimeoutSec $TimeoutSec", "-TimeoutSec 20"))
    matcher = difflib.SequenceMatcher(None, original, undone, autojunk=False)
    changed = sum(max(i2 - i1, j2 - j1) for op, i1, i2, j1, j2 in matcher.get_opcodes() if op != "equal")
    parse_ok = powershell_parses(body, work)
    did_it = uses == 4 and left == 0 and has_param and kept_180 and parse_ok
    note = (" (fenced)" if fenced else "")
    measure = (f"{uses}/4 uses, param {'yes' if has_param else 'no'}, parses {'yes' if parse_ok else 'no'}, "
               f"{changed} other lines differ of {len(original)}{note}")
    if did_it and changed == 0:
        return "PASS", measure, ""
    if did_it:
        return "PARTIAL", measure, "the change is right but other lines were altered or dropped"
    return "FAIL", measure, ""


def powershell_parses(text, work):
    path = os.path.join(work, "edited.ps1")
    write(path, text)
    script = ("$e=$null;$t=$null;[void][System.Management.Automation.Language.Parser]::ParseFile("
              f"'{path}',[ref]$t,[ref]$e);if($e.Count){{exit 1}}else{{exit 0}}")
    done = subprocess.run(["powershell", "-NoProfile", "-Command", script], capture_output=True, timeout=60)
    return done.returncode == 0


def bug_line():
    for number, line in enumerate(read("buggy.py").splitlines(), 1):
        if "max_chars - 1]" in line:
            return number
    raise RuntimeError("planted bug not found in inputs/buggy.py")


def t08_prompt(work):
    numbered = "\n".join(f"{n:3d}  {line}" for n, line in enumerate(read("buggy.py").splitlines(), 1))
    path = os.path.join(work, "buggy_numbered.txt")
    write(path, numbered + "\n")
    return ("The attached Python module has exactly one bug: one line makes a function break the promise in "
            "its own docstring. The line numbers on the left are not part of the code. Find the line.\n"
            'Reply with only JSON: {"line": <number>, "why": "<one sentence>", "fixed_line": "<the corrected code line>"}'
            ), [path]


def t08_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, dict):
        return "FAIL", "did not parse as a JSON object", how
    want = bug_line()
    got = data.get("line")
    fixed = str(data.get("fixed_line", ""))
    fix_ok = "start + max_chars]" in fixed.replace("start+max_chars", "start + max_chars")
    if str(got) == str(want) and fix_ok:
        return "PASS", f"line {got} (bug is on {want}), fix correct", ""
    if str(got) == str(want):
        return "PARTIAL", f"line {got} right, fix wrong", fixed[:120]
    return "FAIL", f"said line {got}, bug is on {want}", str(data.get("why", ""))[:160]


T09_QUESTIONS = [
    ("What was the GitHub repo named before it was renamed?", lambda a: "zo-garden-ecafe" in a),
    ("On what date was the local git remote named gitlab removed?", lambda a: "2026-10-15" in a),
    ("What is the id of the current production deployment of the live site?",
     lambda a: "c7455b17" in a and "ff476ca6" not in a and "dc4746b5" not in a),
    ("How many permission groups does the Cloudflare API token have?", lambda a: "97" in a),
    ("What exact value is NODE_VERSION set to in the alonzo-anthologies Pages project?", lambda a: "22.16.0" in a),
    ("Which Docker Desktop version has the stale socket crash?", lambda a: "4.33.1" in a),
    ("How many tokens per second did gpt-oss 20b run at in Ollama at context 16384?",
     lambda a: "155" in a and "165" not in a),
    ("What port does the Langfuse Postgres database listen on?", lambda a: a == "not stated"),
]


def t09_prompt(work):
    path = os.path.join(work, "bigdoc.md")
    write(path, "\n\n".join(read(name) for name in ("arch002.md", "arch003.md", "home-library.md")))
    questions = "\n".join(f"{i}. {q}" for i, (q, _) in enumerate(T09_QUESTIONS, 1))
    return ("Answer these questions from the attached file only. It holds three documents one after another.\n"
            f"{questions}\n"
            "Give short answers: the value only, no sentence. If the documents do not state the answer, "
            "use the exact string NOT STATED.\n"
            'Reply with only a JSON object with the keys "1" to "8" and string values.'), [path]


def t09_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, dict):
        return "FAIL", "did not parse as a JSON object", how
    wrong = []
    for i, (_, check) in enumerate(T09_QUESTIONS, 1):
        answer = norm(data.get(str(i), ""))
        if not check(answer):
            wrong.append(f"{i}={answer!r}")
    good = 8 - len(wrong)
    return grade(good, 8, 8, 6), f"{good}/8 answers, JSON {how}", "; ".join(wrong)


T10_JOBS = {"A": ("F", ""), "B": ("C", "A"), "C": ("F", "B"), "D": ("C", ""),
            "E": ("F", ""), "F": ("C", "C"), "G": ("F", "D"), "H": ("C", "E")}


def t10_switches(order):
    """Number of model switches for an order, or None if the order is not valid."""
    if sorted(order) != sorted(T10_JOBS):
        return None
    seen, switches, loaded = set(), 0, None
    for job in order:
        route, needs = T10_JOBS[job]
        if needs and needs not in seen:
            return None
        if loaded is not None and route != loaded:
            switches += 1
        loaded = route
        seen.add(job)
    return switches


def t10_best():
    counts = (t10_switches(list(p)) for p in itertools.permutations(T10_JOBS))
    return min(c for c in counts if c is not None)


def t10_prompt(work):
    return ("A relay runs two local models, FAST and CODER, but only one can be loaded at a time. "
            "Loading the first model is free. Every later change of model counts as one switch.\n"
            "Eight jobs must each run exactly once:\n"
            "A: FAST\nB: CODER, must run after A\nC: FAST, must run after B\nD: CODER\nE: FAST\n"
            "F: CODER, must run after C\nG: FAST, must run after D\nH: CODER, must run after E\n"
            "Find an order of all eight jobs that needs the fewest switches possible.\n"
            'Reply with only JSON: {"order": ["A", "..."], "switches": <number>}'), []


def t10_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, dict) or not isinstance(data.get("order"), list):
        return "FAIL", "did not parse as the JSON asked for", how
    order = [str(job).strip().upper() for job in data["order"]]
    real = t10_switches(order)
    best = t10_best()
    claimed = data.get("switches")
    if real is None:
        return "FAIL", f"order breaks a rule (claimed {claimed} switches, best is {best})", " ".join(order)
    if real == best and claimed == real:
        return "PASS", f"valid order, {real} switches, best is {best}", ""
    return "PARTIAL", f"valid order with {real} switches, claimed {claimed}, best is {best}", " ".join(order)


T11_STATEMENTS = [
    "Open WebUI listens on port 3000.",
    "Langfuse runs on port 3000 as compose project whl-langfuse.",
    "The WHL home lab at E:\\WHL is not a git repository.",
    "The two stacks were joined on 2026-11-18.",
    "The laptop is called limesalt.",
    "The Windows computer name of the desktop was changed to lemonpepper.",
    "gpt-oss 20b ran faster in LM Studio than in Ollama.",
    "Updating Docker Desktop is the lasting fix for the stale socket crash, and it has not been done.",
    "To read records back from Langfuse 4, call /api/public/traces.",
    "Three of the files edited in E:\\WHL have .bak-2026-11-17 copies.",
    "Calling GET /health on the relay is the safe way to check that it is alive.",
    "Both routes use a context of 16384.",
]
T11_WRONG = {2, 4, 6, 9, 11}


def t11_prompt(work):
    statements = "\n".join(f"{i}. {s}" for i, s in enumerate(T11_STATEMENTS, 1))
    return ("Check each numbered statement against the attached document. Some statements contradict the "
            "document; the others agree with it.\n"
            f"{statements}\n"
            "Reply with only a JSON array of the numbers of the statements that contradict the document, "
            "in ascending order, like [1, 5]."), [os.path.join(INPUTS, "home-library.md")]


def t11_score(reply, work):
    data, how = loose_json(reply)
    if not isinstance(data, list):
        return "FAIL", "did not parse as a JSON array", how
    try:
        got = {int(item) for item in data}
    except (TypeError, ValueError):
        return "FAIL", "array holds things that are not numbers", str(data)[:100]
    missed, false_alarms = sorted(T11_WRONG - got), sorted(got - T11_WRONG)
    errors = len(missed) + len(false_alarms)
    status = "PASS" if errors == 0 else ("PARTIAL" if errors == 1 else "FAIL")
    return status, f"{len(T11_WRONG) - len(missed)}/5 found, {len(false_alarms)} false alarms, JSON {how}", \
        f"missed {missed}, false alarms {false_alarms}" if errors else ""


T12_EXPECT = ["LM Studio", "Open WebUI", "Langfuse", "LiteLLM", "Jellyfin"]


def t12_prompt(work):
    return ("From the attached document, take the five services that are given a port number below 9000. "
            "Reply with only a JSON array of exactly five strings: the service names in ascending order of port. "
            "No code fence, no keys, no other text before or after the array."
            ), [os.path.join(INPUTS, "home-library.md")]


def t12_score(reply, work):
    try:
        data = json.loads(reply.strip())
    except ValueError:
        _, how = loose_json(reply)
        return "FAIL", f"reply is not bare JSON ({how})", reply.strip()[:120].replace("\n", " ")
    if not (isinstance(data, list) and len(data) == 5 and all(isinstance(item, str) for item in data)):
        return "FAIL", "not an array of exactly five strings", str(data)[:120]
    if [norm(item) for item in data] == [norm(item) for item in T12_EXPECT]:
        return "PASS", "format exact, content exact", ""
    return "PARTIAL", "format exact, content wrong", str(data)[:160]


TASKS = [
    ("t01", "Summarize a 4k token doc", 3000, t01_prompt, t01_score),
    ("t02", "Extract 10 fields to JSON", 3000, t02_prompt, t02_score),
    ("t03", "Sort 20 items into 4 categories", 3000, t03_prompt, t03_score),
    ("t04", "Rewrite to a style rule", 3000, t04_prompt, t04_score),
    ("t05", "Write a function, easy (slugify)", 3000, t05_prompt, t05_score),
    ("t06", "Write a function, harder (header parser)", 4000, t06_prompt, t06_score),
    ("t07", "Edit a real script, change nothing else", 5000, t07_prompt, t07_score),
    ("t08", "Find a planted bug in 89 lines", 3000, t08_prompt, t08_score),
    ("t09", "Answer 8 questions near the context limit", 3000, t09_prompt, t09_score),
    ("t10", "Multi-step reasoning (job ordering)", 4000, t10_prompt, t10_score),
    ("t11", "Check 12 statements against a doc", 3000, t11_prompt, t11_score),
    ("t12", "Strict output format", 3000, t12_prompt, t12_score),
]


def run_tasks(routes, runs, only, out):
    results = []
    for route in routes:  # one route at a time, so the model is swapped once
        for task_id, title, max_tokens, make_prompt, score in TASKS:
            if only and task_id not in only:
                continue
            for run in range(1, runs + 1):
                work = os.path.join(out, f"{task_id}-{route}-{run}")
                os.makedirs(work, exist_ok=True)
                prompt, files = make_prompt(work)
                write(os.path.join(work, "prompt.txt"), prompt)
                reply, stats, err = ask(prompt, files, route, task_id, os.path.join(work, "reply.txt"), max_tokens)
                if reply is None:
                    status, measure, detail = "FAIL", "no reply", err[-200:]
                else:
                    try:
                        status, measure, detail = score(reply, work)
                    except Exception as exc:  # a scorer must never stop the run
                        status, measure, detail = "FAIL", "scorer error", repr(exc)
                row = {"task": task_id, "title": title, "route": route, "run": run, "status": status,
                       "measure": measure, "detail": detail, "tokens_in": stats.get("tokens_in"),
                       "tokens_out": stats.get("tokens_out"), "seconds": stats.get("seconds"),
                       "finish": stats.get("finish")}
                results.append(row)
                print(f"{task_id} {route:11s} run {run}: {status:7s} {measure}"
                      f" [{row['tokens_in']} in, {row['tokens_out']} out, {row['seconds']} s]", flush=True)
                write(os.path.join(out, "results.json"), json.dumps(results, indent=1))
    return results


def print_table(results):
    print("\n| Task | Route | Run | Result | Measure | In | Out | Seconds |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for r in results:
        print(f"| {r['task']} {r['title']} | {r['route']} | {r['run']} | {r['status']} | {r['measure']} | "
              f"{r['tokens_in']} | {r['tokens_out']} | {r['seconds']} |")
    print()
    for route in sorted({r["route"] for r in results}):
        rows = [r for r in results if r["route"] == route]
        counts = {s: sum(1 for r in rows if r["status"] == s) for s in ("PASS", "PARTIAL", "FAIL")}
        tokens_in = sum(r["tokens_in"] or 0 for r in rows)
        tokens_out = sum(r["tokens_out"] or 0 for r in rows)
        seconds = sum(r["seconds"] or 0 for r in rows)
        print(f"{route}: {counts['PASS']} pass, {counts['PARTIAL']} partial, {counts['FAIL']} fail of {len(rows)} runs. "
              f"{tokens_in} tokens in, {tokens_out} out, {seconds:.0f} s.")


def run_perf(out):
    """Speed on a long reply, cold versus warm start, and the two size limits."""
    work = os.path.join(out, "perf")
    os.makedirs(work, exist_ok=True)
    tiny = "Reply with one word: ready"
    long_prompt = ("Write about 700 words explaining, for a new engineer, how DNS resolution works from the "
                   "browser to the authoritative server. Plain prose, no headings.")
    rows = []

    def step(label, route, prompt, max_tokens=3000, files=()):
        reply, stats, err = ask(prompt, list(files), route, "perf-" + label, os.path.join(work, label + ".txt"),
                                max_tokens)
        rate = ""
        if stats.get("tokens_out") and stats.get("seconds"):
            rate = f"{stats['tokens_out'] / stats['seconds']:.0f} tokens/s overall"
        rows.append({"label": label, "route": route, "stats": stats, "rate": rate,
                     "reply_head": (reply or err)[:160]})
        print(f"{label:22s} {route:11s} {stats.get('seconds')} s, {stats.get('tokens_in')} in, "
              f"{stats.get('tokens_out')} out, exit {stats.get('exit')} {rate}", flush=True)
        return reply, err

    # Whatever is loaded now, the first call to each route after the other one is a cold start.
    step("prime-coder", "local-coder", tiny)
    step("cold-fast", "local-fast", tiny)
    step("warm-fast", "local-fast", tiny)
    step("long-fast", "local-fast", long_prompt)
    step("cold-coder", "local-coder", tiny)
    step("warm-coder", "local-coder", tiny)
    step("long-coder", "local-coder", long_prompt)

    # Too large by the tool's own count: it must refuse without calling the relay.
    big = os.path.join(work, "too_large.txt")
    write(big, "The quick brown fox jumps over the lazy dog. " * 1600)
    _, err = step("too-large", "local-coder", "Summarize this.", 2000, [big])
    print("  tool said:", err)

    # Passes the tool's four-characters-a-token count but is really far more tokens.
    dense = os.path.join(work, "dense.txt")
    lines = ["The passphrase for this file is walnut-41."]
    lines += [f"{n * 7919 % 100003:05d};{n * 104729 % 1000003:06d};{n:04x}" for n in range(2400)]
    lines += ["The closing word of this file is harbor-17."]
    write(dense, "\n".join(lines))
    question = ("The attached file has a passphrase on its first line and a closing word on its last line. "
                'Reply with only JSON: {"passphrase": "...", "closing_word": "..."}. Use "NOT FOUND" for one you cannot see.')
    for route in ("local-coder", "local-fast"):
        reply, err = step("dense-" + route, route, question, 2000, [dense])
        print("  reply:", (reply or err).strip()[:200])
    write(os.path.join(out, "perf.json"), json.dumps(rows, indent=1))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--routes", nargs="+", default=ROUTES,
                        help="route names to score; any route the relay offers")
    parser.add_argument("--runs", type=int, default=2)
    parser.add_argument("--only", nargs="+")
    parser.add_argument("--perf", action="store_true")
    parser.add_argument("--out", default=os.path.join(tempfile.gettempdir(), "ask-local-eval"))
    args = parser.parse_args()
    os.makedirs(args.out, exist_ok=True)
    print(f"Output folder: {args.out}")
    if args.perf:
        run_perf(args.out)
        return
    print_table(run_tasks(args.routes, args.runs, args.only, args.out))


if __name__ == "__main__":
    main()
