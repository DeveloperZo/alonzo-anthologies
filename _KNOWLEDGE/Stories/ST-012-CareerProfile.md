# ST-012 A visual career profile that starts a conversation

<!--
Purpose: Plan for producing the visual career profile (the cover-letter replacement) as three competing directions, each built, grilled and verified by its own agents, then judged against each other.
Status: planned
Owner: zo
Human id: career-profile
Update trigger: when a phase completes, the rubric changes, or a direction is picked
Last updated: 2026-10-19
-->

## Summary

Zo does not send cover letters. He sends one visual page that gets him into a conversation. The first attempt (2026-10-19, artifact "Career Profile 2026") failed: a generic dark theme with orange accents, a grid of four stats and a panel of verified claims. It had no identity, and it closed every gap a reader might have asked about. This plan replaces it with three competing directions. Each direction gets its own builder, its own griller and its own verifier. A judge then compares the three.

## User story

**As** Zo, **I want** a one-page visual profile that only I could have made and that leaves a hiring manager with questions to ask, **so that** the first conversation starts on my stories instead of my resume.

## What the page must do

1. **Identity.** At least one element only Zo would make: retro games, Factorio, systems thinking (stocks, flows, loops), or the "anthologies" idea of a career as a set of stories.
2. **Hooks.** Exactly three hooks: a phrase, an image or a gap that makes a reader ask "tell me about that". A hook teases. It does not prove.
3. **A plot.** The page reads as one arc with a turn in it, not as a list of roles.
4. **Restraint.** At most two numbers on the whole page. Words are kept to the minimum the plot needs.
5. **Truth.** Every claim exists in the fact register below. Teasing is allowed, inventing is not.

## Banned (each one fails the review on sight)

- A dark background with a single orange accent, or any gradient wash
- Grids of stat tiles, KPI cards, "by the numbers" panels
- Emoji; the fonts Inter, Roboto and Arial
- A heading on every block ("THE DEMONSTRATIONS", "THE EXPERT WITNESSES")
- Any sentence that reads like a resume bullet
- Em dashes and the section symbol (repo CLAUDE.md)

## Inputs every agent gets

- **Fact register**, the only allowed source of claims:
  - `resumeContent/src/data/quests.data.tsx` and `resumeContent/src/data/profile.data.ts`
  - `career-as-system-v1.md` (career as a stock-and-flow system: reputation flywheel, AI leverage compound, energy brake)
  - `_KNOWLEDGE/Context/resume-spa.md` (which claims were dropped as unsupported)
  - Zo's corrections from 2026-10-19:
    - Manor was the small loan company (2016).
    - At Productive Edge (2020) his title was Senior Consultant and his function was Software Architect. That is where his execution became formally recognized.
- **Settled:** 7M covered lives; target role is Director or Senior Manager, hands-on.
- **Still open, do not print:** "Seven teams" and "HIPAA vendor evaluations" (both dropped as unsupported, now back in the data).
- **Identity sources**:
  - the resume SPA's play theme (Press Start 2P, the TV frame, seasonal and time-of-day colors, quest titles such as "The Developer's Forge")
  - the career factory (play-mode home)
  - the AI governance series on the site
  - Zo's original profile, described in Phase 0
- **Format:** the Veritasium structure, used as a shape, never as section labels.
  - a misconception hook
  - words and pictures working together
  - slow System 2 learning turning into System 1 pattern recognition
  - demonstration moments
  - outside voices
- **Medium:** one Design canvas artifact per direction, one artboard sized 1600 x 1000, exportable to PNG and PDF.

## Phase 0: Zo answers three questions (gate)

Ask once, before any agent runs:

1. Three stories you enjoy telling in interviews, one rough sentence each.
2. One thing that is unmistakably you, visual or verbal: a phrase, a game, a color, an object.
3. The target role, plus the covered-lives figure (settled: 7M).

If Zo skips this, agents mine identity from the identity sources and mark every hook "unvetted". Also record a short description of the original profile, since agents cannot see the image:
- It was blue and white, with four numbered circles: Continuous Learning, Proven Problem Solver, Immediate Actions, Company Recognized Problem Solver.
- It had a dotted timeline from 2012 to 2026 with icons (rocket, puzzle piece, tools, cube, a "Future Ahead" sign).
- Its closing band: "Engineering leadership that aligns architecture, delivery, and business outcomes."

Keep the phrases that worked: "Smaller Companies, Bigger Change", "Future Ahead", "Level up".

### Phase 0 answers (Zo, 2026-10-19)

- **Identity:**
  - Space games, Mass Effect and Factorio above all.
  - Connecting ideas from different topics.
  - Blue. Lofi jazz and hip hop vibes. Thunderstorms are calming.
- **Brand line:** "Teammates choose me because a difficult problem is likely to get easier with me included." This is the thesis the page argues. Phrasing it is the builders' job, but the meaning must not drift.
- **Story 1:** He refactored an application and learned what maintenance really costs across the SDLC.
- **Story 2:** He left Boeing for a smaller company and met mentors who transformed how he applied his work ethic.
- **Story 3:** Not given. The brand line serves as the third hook, or the griller proposes one from the fact register and marks it unvetted.
- **Target role:** Director or Senior Manager who stays hands-on.
- **Scale:** say 7M covered lives, everywhere.

These answers override the generic identity sources. Every direction is blue-led, calm rather than loud, and connects at least two unrelated topics. The banned dark background with an orange accent stays banned.

## The three directions

| | A. The Anthology | B. The Tech Tree | C. The Loop |
|---|---|---|---|
| Picture | A lofi album: the cover is a rainy blue window, and the tracklist is the contents page. Each role is a track with a provocative title and one teaser line. The last track, "Vol. II", is unreleased | A Mass Effect galaxy map crossed with a Factorio research tree. Roles are star systems. Career moves are relay jumps, and the jump from Boeing to the smaller company is the big one. Mentors are crew. A glowing "Next research: ?" system | A storm system drawn as the career-as-system diagram: hard problems roll in like weather, reusable structure comes out, the reputation flywheel turns, and calm sits at the center |
| Where the hooks live | Chapter titles | Unlock edges and the empty node | Loop labels and the one break in the loop |
| Main risk | Too wordy | Reads as a skills chart | Too abstract to hire from |

## Agents (7, run in this order)

Per direction (A, B, C in parallel):

1. **Builder.** Writes a text sketch first: the layout in words and every line of copy, marked with the three hooks and the plot turn. It does not build yet.
2. **Griller**, a separate agent that never sees the other directions:
   - attacks the sketch against "What the page must do" and the banned list
   - marks each line as identity, hook, plot or filler
   - cuts the filler
   - checks every claim against the fact register
   - asks the hardest question a skeptical hiring manager would ask of each hook
   
   It returns concrete edits, not opinions.
3. **Builder again.** Applies the edits it accepts and argues against the ones it rejects in writing, then builds the artifact.
4. **Verifier**, the griller's second pass on the built artboard source. It runs the review checklist below and fails anything that does not pass. One round of fixes is allowed. After that the direction goes to judging as it stands, with its failures listed.

Then one **Judge** across all three. It sees the three artifacts, the verifier reports and nothing else, so it is not anchored on the builders' reasoning.

## Review checklist (verifier and judge)

- Cover the name. Could this be someone else's profile? If yes, it fails.
- Name the three hooks. For each, what question would a reader ask?
- What is the plot turn, in one sentence?
- Count the numbers on the page. More than two fails.
- Any item from the banned list? Fail.
- Is every claim in the fact register?
- At 25% zoom, as a thumbnail in an email, does one image still read?

## Judging output

For each direction, the judge reports:
- its single strongest strength and its single weakest weakness
- a score out of 5 on each of identity, hooks, plot, restraint and truth

Then, across all three:
- **The strongest of all:** the one element worth keeping no matter which direction wins.
- **The weakest of all:** the one failure that must not appear in the final page.
- **A recommendation:** one direction to finish, plus any element to borrow from another direction, in one paragraph.

Zo picks. Only the picked direction is finished.

## Cost guard

Seven agents and three canvases. Text sketches come before any build, so a weak direction dies cheaply. No agent may render, screenshot or run a browser unless the verifier cannot judge without seeing it.

## Acceptance criteria

- **AC-1** Phase 0 answers (or the "unvetted" fallback) are recorded in this file.
- **AC-2** Three canvas artifacts exist, one per direction, each with its sketch, griller edits and verifier report saved beside this file under `_KNOWLEDGE/Stories/ST-012/`.
- **AC-3** Each verifier report passes the checklist or lists its failures.
- **AC-4** The judge report states, for each direction, its strongest strength and weakest weakness, and states the strongest and weakest of all, with a recommendation.
- **AC-5** Zo has picked a direction.

## Status

- Current: `ready` (AC-1 met: Phase 0 answered 2026-10-19)
- Next: Zo says "run it", then the builders write text sketches.
- Last updated: `2026-10-19`
