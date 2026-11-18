# Routing work to the local models

<!--
Purpose: Tells a frontier harness which work it can hand to the two local routes through ask-local.ps1, which it must check, and which it must keep.
Status: working
Owner: zo
Human id: home-library-client-routing
Update trigger: when a model behind a route changes, the context window changes, or ask-local.ps1 changes how it sizes or sends a request; rerun eval/run_eval.py and update the table
Last updated: 2026-11-18
-->

This is a working reference, built from two small evaluation runs on
2026-11-18. Twelve tasks, two runs each per model.
The inputs, tests and runner are in `eval/` beside this file. Read
"Limits" at the end before leaning on any single number.

## Rule of thumb

One model answers every route: `gpt-oss:20b`. The routes differ only in
how much it thinks before it answers. It is always loaded, so there is
no wait when you change route.

**Send to `local-fast` (the default, thinks briefly).** Work that reads
a lot and returns a little: summaries, pulling fields into JSON, sorting
items into categories, answering questions about up to roughly 9,000
real tokens of documents, checking statements against a document,
spotting a bug in a short file, a small function from a numbered spec,
an exact small edit to a whole file. Short answers come back in 1 to 3
seconds.

**Send to `local-think` (same model, thinks first).** Anything with
ordering, counting or comparing, a rewrite to a strict style rule, and a
retry of something `local-fast` got wrong. About three times slower. The
tool allows it an 8000 token reply, because thinking counts against the
limit.

**Keep on the frontier model.** Planning and design judgement. Any
multi-step reasoning whose answer no machine can check. Code whose spec
has many rules that interact. Final wording that will be published. Any
single input above about 9,000 real tokens, unless you split it first.

**Send local, but always check.**

| Work | Cheap check before you trust it |
| --- | --- |
| Any reply | The tool exits 0. It exits 4, and prints nothing to standard output, when the reply was cut off or the model did not see the whole input |
| JSON | Strip a code fence, then parse. Check the keys and the count |
| Summary | Treat as a pointer, not a source. Verify any name, date or id you will repeat |
| Rewrite to a style rule | Search the reply for the banned characters and words. Send it back once naming what is left |
| New code | Run tests. Feed failures back once on `local-think` |
| Whole-file edit | Diff against the original. Reject if any line outside the asked change differs |

`local-coder` still exists as an old name for `local-fast`.

## Why one model: the bake-off

After the first scoring run below, the same script was run again on
2026-11-18 against the two routes as they were then, the main model at
low thinking effort, and two newer 9B models from Ollama's library.
Twelve tasks, two runs each, 24 runs per row.

| Model | Pass | Partial | Fail | Seconds for all 24 | Tokens out |
| --- | --- | --- | --- | --- | --- |
| `gpt-oss:20b`, low effort (now `local-fast`) | 18 | 4 | 2 | 80 | 10,818 |
| `gpt-oss:20b`, default effort (now `local-think`) | 19 | 2 | 3 | 246 | 39,391 |
| `qwen2.5-coder:14b` (was `local-coder`) | 14 | 8 | 2 | 87 | 6,087 |
| `ornith-1.5:9b` (candidate, removed) | 18 | 0 | 6 | 337 | 41,541 |
| `mimo-v2.6:9b` (candidate, removed) | 16 | 3 | 5 | 218 | 17,553 |

What it showed:

- At low effort the main model matched its own default-effort score
  within one task and ran three times faster. It lost ground only on
  the ordering puzzle (t10) and the strict rewrite (t04), which is what
  `local-think` is for.
- It beat the coder model at the same speed, including on the code
  tasks (the harder function: 14 of 15 tests against 9 of 15).
- All six failures of `ornith-1.5:9b` were replies that ran out of
  tokens while thinking. `mimo-v2.6:9b` failed both write-a-function
  tasks.
- So one model serves every route, and the 6 to 30 second swap between
  two models is gone.

The second row also reran the first scoring run's `local-fast` and
landed within one task of it (19, 2, 3 against 18, 3, 3).

## Proof run: what a hand-off saves

On 2026-11-18 the batch tool indexed 27 documents under `_KNOWLEDGE`
(Architecture, Stories, Context) into JSON: title, purpose, status and
open items.

| Measure | Value |
| --- | --- |
| Files | 27 of 27 returned, 27 of 27 parsed with the right keys |
| Tokens read by the local model | 60,169 |
| Tokens written by the local model | 7,271 |
| Model time | 61 seconds |
| Tokens the harness then read | about 2,500 (the 27 replies) |

The harness never opened the 27 files. One reply was checked by hand
against its source: three of its four open items were found word for
word and the fourth was not looked up. The `status` field came back as
NOT STATED for documents that do state one in a different form, so
treat a missing value as "look yourself", not as "absent".

## Results of the first scoring run

This run was made when `local-coder` was `qwen2.5-coder:14b` and
`local-fast` ran at default thinking effort. Read `local-coder` below
as that model, and `local-fast` below as today's `local-think`.

Result columns show run 1, then run 2. PASS, PARTIAL and FAIL come from
the machine checks in `eval/run_eval.py` unless the row says judgement.
Tokens out include hidden reasoning on `local-fast`.

| Task | Route | Result | Objective measure | Tokens in | Tokens out | Seconds | How it failed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| t01 Summarize a 15,000 character doc in 8 to 10 bullets | local-fast | PASS, PASS (screen only) | 9 and 10 bullets, every number and id found in the source. Judgement: 1 wrong claim in each summary | 4098 | 1271, 1009 | 16.3, 7.0 | Run 1 said the sitemap "lists only 40 URLs" (the doc says it lists only one host). Run 2 said the `.node-version` file pins Node (the doc says it does not) |
| t01 | local-coder | PASS, PASS (screen only) | 10 bullets each. Judgement: 0 wrong claims, but thin (179 and 144 words, no ids) | 4339 | 259, 193 | 10.5, 2.5 | Run 1 left out the duplicate site, one of the two main points |
| t02 Extract 10 fields from a paragraph to JSON | local-fast | PASS, PASS | 10 of 10 fields, bare JSON | 440 | 485, 678 | 3.3, 4.5 | |
| t02 | local-coder | PASS, PASS | 10 of 10 fields, bare JSON | 405 | 116, 116 | 1.7, 1.4 | |
| t03 Sort 20 commit subjects into 4 categories | local-fast | PASS, PASS | 20 of 20 against my labels | 516 | 1090, 1093 | 7.3, 7.5 | |
| t03 | local-coder | PASS, PASS | 20 of 20, JSON inside a code fence | 493 | 172, 172 | 2.2, 2.1 | Ignored "only JSON" (harmless once stripped) |
| t04 Rewrite: no em dashes, no listed jargon, keep every fact | local-fast | PARTIAL, FAIL | 1 and 2 rule breaks. A third run passed clean | 377 | 2403, 1878 | 16.5, 12.8 | Wrote non-breaking hyphens and narrow spaces (character U+2011, so the date no longer matches "2026-11-17"). Run 2 also turned the date into "November 17, 2026" |
| t04 | local-coder | PARTIAL, PARTIAL | 1 rule break each | 356 | 194, 191 | 2.4, 2.3 | Left 2 of the 7 em dashes in, both runs |
| t05 Write `slugify` from a 5 rule spec | local-fast | PASS, PASS | 14 of 14 tests | 208 | 436, 407 | 3.0, 2.8 | |
| t05 | local-coder | PASS, PASS | 14 of 14 tests | 172 | 162, 175 | 2.0, 2.1 | |
| t06 Write a doc header parser from a 7 rule spec | local-fast | PARTIAL, PARTIAL | 14 of 15 tests | 513 | 2528, 2918 | 17.1, 19.2 | Missed one rule (text on the same line as the opening marker) |
| t06 | local-coder | FAIL, FAIL | 9 of 15 tests | 473 | 296, 291 | 3.6, 3.5 | Stripped each line before testing whether it was indented, so every rule about indented lines was dead code |
| t07 Edit `verify.ps1` (135 lines): add one parameter, use it in 4 places, change nothing else | local-fast | FAIL, PASS | Run 1 cut off mid-file. Run 2: 4 of 4 uses, parses, 0 other lines differ | 1784 | 5000, 2574 | 33.1, 15.8 | Run 1 spent the 5000 token limit on thinking and half a file (`finish: length`) |
| t07 | local-coder | PASS, PASS | 4 of 4 uses, parses, 0 other lines differ | 1794 | 1651, 1651 | 20.6, 20.2 | |
| t08 Find one planted bug in 89 lines of Python | local-fast | PASS, PASS | Right line, right fix | 1051 | 540, 1106 | 3.5, 6.7 | |
| t08 | local-coder | PASS, PASS | Right line, right fix | 1091 | 47, 58 | 1.1, 0.7 | |
| t09 Answer 8 questions over three docs, about 10,000 tokens in | local-fast | PASS, PASS | 8 of 8, including one "NOT STATED" | 9604 | 1326, 1059 | 18.8, 6.9 | |
| t09 | local-coder | PARTIAL, PARTIAL | 6 of 8 | 10194 | 103, 107 | 4.4, 1.6 | Gave the LM Studio speed (165) for the Ollama question, and invented port 3001 for a database the docs never mention |
| t10 Order 8 jobs with dependencies for the fewest model switches | local-fast | FAIL, PASS | Run 1 no reply. Run 2 optimal (3 switches, proven by brute force) | 210 | none, 2410 | 24.7, 14.5 | Run 1 used all 4000 tokens thinking and returned no text |
| t10 | local-coder | PARTIAL, PARTIAL | Valid order, 7 switches, claimed 3. Best is 3 | 172 | 39, 43 | 1.1, 0.5 | Returned the jobs in alphabetical order and stated a switch count it had not counted |
| t11 Find the 5 of 12 statements that contradict a doc | local-fast | PASS, PASS | 5 of 5 found, 0 false alarms | 1332 | 1010, 781 | 6.3, 4.8 | |
| t11 | local-coder | FAIL, FAIL | 4 of 5 found, 4 and 3 false alarms | 1379 | 32, 28 | 0.8, 0.4 | Flagged true statements, missed the one that needed a careful read |
| t12 Reply with only a JSON array of exactly five strings, sorted by port | local-fast | PASS, PASS | Bare array, 5 strings, right content | 1130 | 638, 414 | 4.1, 2.5 | |
| t12 | local-coder | PARTIAL, PARTIAL | Format exact, content wrong | 1162 | 24, 25 | 0.7, 0.4 | Not sorted. Run 2 also included a service with a port above the limit |

Pass counts over 24 runs per route:

| Route | Pass | Partial | Fail |
| --- | --- | --- | --- |
| local-fast | 18 | 3 | 3 |
| local-coder | 12 | 8 | 4 |

Two of the three `local-fast` failures were the reply limit, not the
model's ability. With `-MaxTokens 8000` the same two tasks passed 3 of 3
each (t07 and t10). `local-coder` failed or half-failed every task that
needed reasoning over what it read (t09 as first briefed, t10, t11,
t12), and its two runs were nearly identical each time.

### Speed and limits

| Measure | local-fast | local-coder |
| --- | --- | --- |
| Long reply (about 700 words asked) | 1464 tokens in 8.9 s, 164 tokens a second | 699 tokens in 8.3 s, 84 tokens a second |
| One word reply, model just swapped in (cold) | 9.8 s | 3.7 s |
| Same call again (warm) | 0.3 s | 0.1 s |
| First task after a swap, compared with its second run | about 9 s slower | about 8 s slower |
| Hidden reasoning before a short answer | 400 to 2,500 tokens, 5,000 on the ordering puzzle | none |

- **Input too large by the tool's count.** The tool refuses, calls
  nothing, and exits with code 3: "ask-local: too large. About 18022
  tokens in, 2000 reserved for the reply, and the window is 16384. Split
  the input and ask again."
- **Input too large in fact, but not by the tool's count.** The tool
  counts four characters to a token. On this repo's markdown the relay
  reported 3.4 to 3.6 characters to a token, and far fewer on lines of
  digits. A 41,000 character file of numbers passed the tool's check
  (about 10,300 by its count). `local-coder` then reported 8194 tokens
  in, lost the instruction and the first line of the file, and answered
  a different question in plain prose with exit code 0. `local-fast`
  returned no text (`finish: length`, exit code 1) after 19.5 seconds.

## Failure patterns and guards

1. **Hidden reasoning eats the reply limit (`local-fast`).** Example:
   t10 run 1 returned nothing at 4000 tokens; t07 run 1 stopped half way
   through the file at 5000. When some text has come back the tool exits
   0, so a cut-off file looks like a success. Guard: read `finish` in
   the `-Stats` line and reject anything but `stop`. Set `-MaxTokens` to
   8000 for reasoning or whole-file output. A plain retry also works
   here, because this route varies between runs.
2. **Confident wrong answers on counting, sorting and comparing
   (`local-coder`).** Example: t10 claimed 3 switches for an order that
   has 7; t12 returned five ports unsorted; t09 answered a question the
   documents cannot answer with a real-looking port. Asking it to work
   step by step first did not help (2 of 2 still wrong on t10 and t12).
   Guard: keep this work off `local-coder`. Send it to `local-fast`, or
   keep it on the frontier model.
3. **Silent overflow.** Example: the digit file above. Guard: budget at
   3 characters to a token for prose and code, and 1.5 for tables of
   numbers or ids. Compare `tokens_in` from `-Stats` with what you
   expected; a count near 8,200 when you sent more means the front was
   cut off. Split large inputs yourself.
4. **Style rules half followed.** Example: `local-coder` left 2 of 7 em
   dashes in on both runs, and again when the brief included a before
   and after example. `local-fast` removed them but added non-breaking
   hyphens and narrow spaces (4 of its 24 replies had such characters),
   which breaks any exact match on a date or an id. Guard: search the
   reply for the banned characters; normalise Unicode hyphens and spaces
   to plain ones; send the text back once, naming what is left ("this
   still contains em dashes") which fixed `local-coder` 2 of 2. Telling
   `local-fast` "plain ASCII punctuation only" gave 2 of 2 clean.
5. **Small wrong claims in fluent summaries (`local-fast`).** Example:
   one wrong claim in each summary of about 25 (see t01). The screen
   that checks every number against the source did not catch them,
   because the numbers were real and the sentence around them was not.
   `local-coder` made no wrong claim but said much less and once dropped
   a main point. Guard: use a local summary to decide what to read, not
   as a fact source. For facts you will repeat, ask for extraction to
   JSON instead (10 of 10 on both routes).
6. **Rules in a spec dropped (`local-coder`).** Example: t06, 9 of 15
   tests on both runs, and still 9 of 15 after it was shown the failing
   tests. `local-fast` went from 14 of 15 to 15 of 15 with the same
   feedback, 2 of 2. Guard: always run tests; send failures to
   `local-fast` once; if it still fails, the frontier model writes it.
7. **Code fences around "only JSON" (`local-coder`).** 9 of its 14 JSON
   replies were fenced. `local-fast` never did this. Guard: strip one
   fence before parsing. Do not spend prompt words on it.
8. **The same prompt gives the same wrong answer (`local-coder`).** Its
   two runs matched almost token for token on every task. Guard: do not
   retry it unchanged. Change the brief, name the fault, or change
   route.

## How to brief a local model

What raised the pass rate here:

- **Put the questions after the documents on long inputs.** `local-coder`
  went from 6 of 8 to 8 of 8 on the 10,000 token task (2 of 2) when the
  questions followed the text. The tool attaches `-File` content after
  the prompt, so for a long input put the document and then the
  questions in the prompt itself (standard input) and skip `-File`.
- **Give the exact output shape.** A JSON skeleton with a type per key,
  or one example line such as `{"1": "repo"}`. Every JSON reply in the
  48 runs parsed once fences were stripped.
- **Give a word for "I cannot tell".** "Use the exact string NOT STATED"
  worked on `local-fast` every time. Without an exit, expect a guess.
- **Number the rules and add one worked example** for code specs. The
  example input and output did more than extra prose.
- **Number the lines** when asking where a bug is. Both routes named the
  right line 2 of 2.
- **Ask for the whole file back on an edit**, say "change nothing else",
  then diff. `local-coder` returned 135 lines with only the asked lines
  changed, twice. The file plus the reply must fit: about 12 output
  tokens a line.
- **Tell `local-fast` to use plain ASCII punctuation** whenever the
  reply will be matched or pasted into a file.
- **Size `-MaxTokens` for thinking plus answer on `local-fast`.** The
  default of 2000 is too small for anything but a short answer.
- **On failure, say what failed.** Test output or the named fault, not
  the same prompt again.
- **Batch by route.** A swap cost 4 to 10 seconds here.

What did not help: asking `local-coder` to reason step by step before
the answer, giving it a before and after example for the em dash rule,
and asking it to quote the document before judging each statement (that
cut its false alarms on one run of two and never found the missed
statement).

## Tally

| Batch | Tokens in | Tokens out | Seconds |
| --- | --- | --- | --- |
| The 48 scored runs | 86,376 | 39,199 | 348 |
| of which local-fast | 42,316 | 33,054 | 259 |
| of which local-coder | 44,060 | 6,145 | 89 |
| Briefing and retry variants (25 runs) | 37,616 | 35,226 | 249 |
| Speed and limit probes, smoke runs | 10,142 | 4,418 | about 75 |
| Total | 134,134 | 78,843 | about 11 minutes of model time |

About 213,000 tokens ran on the desktop and none of them were frontier
tokens. One failed call reported no counts, so the true total is a
little higher.

**Estimate, not a measurement:** in a docs-and-scripts session like the
ones this repo sees, roughly 20 to 40 percent of the fresh tokens a
frontier harness reads or writes are the kind of work that passed here
(reading files to pull out a few facts, summaries to decide what to
open, labelling, mechanical edits, small functions). After the 16,384
token window, the checks above and the cost of reading the local reply
back, a realistic saving is nearer 15 to 25 percent. This rests on three
things only: the task types that passed in this run, the shape of the
session that ran this evaluation (most of its reading was whole
documents and scripts that a local route could have reduced first), and
no logs from real sessions. Planning, tool calls and the conversation
itself stay on the frontier model and are the larger share. Measure it
properly by tagging hand-offs with `-Task` and comparing Langfuse totals
with the frontier bill over a week.

## Limits

- **Sample size.** Twelve tasks, two runs each per route. One input per
  task. A pass here means "worked twice on one example", not a rate.
- **Runs.** Two per task and route. Three for the `-MaxTokens 8000`
  rechecks, two for each other variant, one extra for t04 on
  `local-fast`.
- **Judgement.** The wrong-claim counts for t01 are my reading of each
  summary against the source. The category labels for t03 and the
  expected answers for t09, t11 and t12 are mine. The rewrite check
  (t04) is mechanical and does not prove the meaning was kept; I read
  the replies and found no change in meaning apart from the date format.
  Everything else is a machine check.
- **Question placement.** The t09 score for `local-coder` depends on
  where the questions sit, as shown above. The table records the first
  brief, the way `-File` sends it.
- **Size of the near-limit task.** 9,604 tokens on `local-fast` and
  10,194 on `local-coder` for the same text. Nothing between that and
  the hard limit was tested with a prose document.
- **Sampling settings.** The tool sends no temperature, so each route
  ran on its defaults.
- **Date and versions.** 2026-11-18. Ollama 0.40.16. `gpt-oss:20b`
  (id f38aa0c53da5) and `qwen2.5-coder:14b` (id 9ec8897f747e), both at
  context 16384, behind the LiteLLM relay on lemonpepper. Judge:
  claude-fable-5-2.

## Run it again

```powershell
python anthologies/home-library-series/client/eval/run_eval.py
python anthologies/home-library-series/client/eval/run_eval.py --perf
```

The first prints the pass table for every task on both routes. The
second prints the speed, cold start and size-limit probes. Replies and
`results.json` go to a temp folder (or `--out`), never into the repo.
The inputs in `eval/inputs/` are pinned copies, so a later edit to the
real documents does not change the expected answers.
