# Software factory

<!--
Purpose: Entry point for the software factory: a queue on lemonpepper where frontier models plan and judge, and local models do the direct work.
Status: draft
Owner: zo
Human id: software-factory-readme
Update trigger: when a stage is added, the card format changes, or a replay result changes the design
Last updated: 2026-11-22
-->

Status: v0 runner only. The queue, worktrees, gate, hidden tests and
filing work; there is no model in the loop yet. The worker and the judge
are plug-in commands still to be chosen (harness bake-off next).

## Shape

Frontier models are the interface: they cut a milestone into cards and
judge the result. The local model (`gpt-oss:20b` behind LiteLLM on
lemonpepper) does the direct work. Everything runs on lemonpepper.

```
F:\Factory\
  queue\inbox\ process\ output\ finding\   the state: one card file per job
  runs\<card-id>\       attempts.jsonl, feedback, diff.patch, result.json
  worktrees\<card-id>\  git worktree on branch factory/<card-id>
  log.md                one line per run: the record of factory mistakes
```

Results go where the project already keeps them: milestone Evidence for
work that lands, a TD file for problems found out of scope, and `log.md`
for the factory's own failures. No separate tracker.

## Runner

```
py -3 runner.py --root F:\Factory --repo F:\Programming\Serennovas init
py -3 runner.py --root F:\Factory --repo F:\Programming\Serennovas status
py -3 runner.py --root F:\Factory --repo F:\Programming\Serennovas run-next --worker "<command>" [--judge "<command>"]
```

Standard library only. One card at a time. Per card:

1. **Worktree** on `factory/<id>` at `base`. Never main, never pushed.
2. **Setup** commands (for example `npm ci`).
3. **Baseline**: `accept` is run before any change. Red commands are
   recorded. They must still pass afterwards (new tests are red at base
   by design), unless the card lists them under `ratchet` and the count
   they print did not go up, or under `tolerate_red_at_base`.
4. **Attempts**, up to `1 + retries`: worker, then a scope check (any
   file outside `write` fails the attempt), then the gate (`accept`).
   A failed gate's output is handed to the next attempt.
5. **Hidden tests** (replays only): files copied in from a commit,
   `hidden_accept` run, files removed again. The worker never sees them
   and they are never committed.
6. **Judge**: a command whose last output line is
   `{"verdict":"accept"|"reject","reasons":[...]}`. Without one the
   verdict is `unjudged`.
7. **File**: commit on the card's branch, card moved to `output\` or
   `finding\`, line appended to `log.md`.

### Worker contract

`--worker "patch:<file>"` is the stub: it applies a known diff, so the
plumbing can be tested with no model. Any other value is a command run
in the worktree with these variables set: `FACTORY_CARD`,
`FACTORY_WORKTREE`, `FACTORY_FEEDBACK` (gate output of the last failed
attempt, empty on the first), `FACTORY_RUN_DIR`, `FACTORY_ATTEMPT`. It
edits files. Its exit code is recorded, not trusted: the gate decides.

## Card

JSON. The planner writes it.

| Field | Meaning |
| --- | --- |
| `id` | Card id, also the branch name suffix |
| `milestone`, `criterion` | Which milestone and which acceptance criterion this closes |
| `base` | Commit or branch to start from (`main`, or the parent of a commit for a replay) |
| `workdir` | Where commands run, relative to the repo root |
| `goal` | One plain paragraph: what changes and what does not |
| `read` | Files the worker is given as context. Keep under about 9,000 tokens |
| `write` | Glob patterns of files the worker may change. Anything else fails the attempt |
| `setup` | Commands run once before the baseline |
| `accept` | Gate commands, all must exit 0 |
| `tolerate_red_at_base` | Accept commands excused if already red at base. Avoid: they then catch nothing |
| `ratchet` | `{command: regex}`. A command red at base passes if the number the regex captures (last match) did not go up. For ESLint use `problems \\((\\d+) errors?`: a bare `(\\d+) errors?` matches the later "N errors potentially fixable" line instead |
| `hidden_tests`, `hidden_accept` | Replays: `[{"commit","path"}]` copied in after the worker, and the commands that score them |
| `ignore` | Extra build-output patterns kept out of scope and commits |
| `retries` | Extra attempts after the first. Default 2 |

## Replays

Zo's method (2026-11-22): replay one or two completed milestones from
history, from the commit before they landed, to build and harden the
factory. Score outcome per frontier dollar against a frontier-only run,
not raw tokens. Then run on new milestones and adapt.
