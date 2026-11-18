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
