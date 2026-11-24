# Division of labor: Cowork and Claude Code

Zo uses Claude Code (the CLI) for code-level implementation and Cowork
for higher-altitude work: strategy, planning, cross-repo decisions,
research synthesis, roadmap thinking, reviewing outputs.

## Why

Claude Code is better at granular file edits and tight build and test
loops. Cowork should operate where it adds more value than Claude Code
would: orchestration, cross-cutting questions, framing, planning.

## How to apply

In Cowork, default to higher-level framing. Do not volunteer to write
line-by-line code or run tight implementation loops unless asked. If the
work is clearly code-level, suggest handing off to Claude Code and offer
to define the brief instead. Reach for plans, decision frameworks,
comparisons, and research synthesis rather than mechanical file edits.

Docs and context authoring (files like the ones in this folder) sit on
the Cowork side of the line.

## Do not stop for trivial checks

Said by Zo on 2026-11-17, after being asked to confirm a one-command
connectivity test and then to approve a commit: "dont pester me with
trivial validation criteria like that."

Reading of it (the session's interpretation, not Zo's words): do not
end a turn on a question about a small check or a routine next step.
Verify what can be verified directly, state the result in a line, and
carry on. If a check can only be run by Zo, name it once and keep
working on whatever does not depend on it. Save questions for choices
that change the direction of the work.

## Diagrams: clarity before polish

Zo's correction on 2026-11-18, about DIA-106 and DIA-107: the form was
gold plated and the pictures were not clear. The high-level diagrams of
a set must be readable by his wife, who is not technical.

How to apply: in an overview diagram, lead with a plain name that says
what the piece does, and put the program name in small print. No
insider words (frontier, harness, token, relay, runtime, container,
port). No shape code that needs a legend. Technical vocabulary belongs
in the detailed diagrams only. Check the words before the layout.

Order matters too (same day): number a set from most general to most
specific. X00 is the overview, X01 to X99 are closer looks, and a higher
hundred may be more complex. Do not draw technical specs until asked.

## Test what the person will do, not the plumbing (2026-11-18)

Zo asked why web search was missing from the first build and why the fix
arrived in pieces. Both were my fault: I checked that a search ran from
inside the container and left the real test (a recent question in a
signed-in chat) to him, then fixed one symptom per complaint. For anything
he will use by hand, run it the way he will before calling it done, with a
vague real-world question, and list every gap found in one report.

## Branch names (2026-11-23)

Zo, after a branch was pushed as `claude/project-thread-...`: "dont ever
branch names with claude or a tool. Use the feat or milestone its
associated with."

Name a branch for the feature or milestone it carries, in the repo's own
style: `feat/play-mode-achievements`, `diagrams/site-and-home-library`.
Never put the name of an assistant, a tool or a session id in a branch
name, even when the session was handed a default branch name that has one.
