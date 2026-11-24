# Software factory

<!--
Purpose: Entry point for the software factory: a queue on lemonpepper where frontier models plan and judge, and local models do the direct work.
Status: draft
Owner: zo
Human id: software-factory-readme
Update trigger: when a stage is added, the card format changes, or a replay result changes the design
Last updated: 2026-11-23
-->

Status: v0. Worker is Aider on the local model (`worker_aider.py`);
judge is a frontier model (`judge.py`). M-UI-050 replayed end to end on
the local model on 2026-11-23 (4 of 4 cards, hidden tests 4 of 4).

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
   `{"verdict":"accept"|"reject","reasons":[...]}`, run after every
   attempt whose gate passes. A reject goes back to the worker as
   feedback for the next attempt; a judge error stops the card. Without
   a judge the verdict is `unjudged`. `judge.py` is the frontier judge:
   it sends the card and `diff.patch` to `FACTORY_JUDGE_ROUTE` through
   LiteLLM and logs its tokens to `judge-usage.jsonl`.
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

## Carve-out (planner's only code exception)

A card cannot edit or read a file that alone exceeds the card budget (~9k tokens).
When the item needs a change inside such a file, the planner may first carve the
code to be changed out into a new small file, with no behaviour change:

1. Make the carve-out in a scratch worktree, never in the play repo itself:
   `git -C <repo> worktree add <root>/carve/<name> <base>`, edit there, then
   `git -C <root>/carve/<name> diff > <root>/carveouts/<name>.patch` (add new files
   with `git add -N` first so they appear in the diff).
2. Pure move only: the moved code keeps its names, logic and exports. The old file
   imports it back. No renames, no fixes, no new behaviour, no test changes unless an
   import path must follow the move.
3. Run it as its own card through the runner, gated and judged like any card, with
   the stub worker: write the card (criterion "carve-out: no behaviour change",
   scope = the old file plus the new file), then
   `runner.py ... run-next --worker "patch:<root>/carveouts/<name>.patch" --judge ...`.
   The patch worker does not retry, so a red gate or a judge reject means fix the
   patch and re-run a new card id.
4. The accepted carve-out commit is the base for the cards that follow.
5. Remove the scratch worktree afterwards (`git worktree remove`).

Carve-outs count as frontier work in scoring (planner cost), and the report lists
them separately from local cards.

## Intent (planner, before any card)

Before cutting a single card, the planner writes `<root>/intent.md`:

1. **User-visible change:** at most five bullets. Each bullet states one thing a user will
   see or do differently, and quotes the sentence of the item it serves, word for word.
2. **Not doing:** every change the planner considered that no item sentence asks for
   (extra controls, links, fallbacks, refactors, "while we are here" fixes), one line each.
3. **Where the item is silent:** choose the fewest new screens, steps, controls and links.
   When two readings are possible, take the one that changes the least for the user, and
   say so in one line.

Cards are cut only for the bullets in section 1. A card whose criterion cannot be traced to
a bullet is not cut. Carve-outs serve a bullet and say which one. The report shows each
planner's intent.md beside the blind reviewer's verdict on intent.
