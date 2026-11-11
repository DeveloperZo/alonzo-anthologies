---
title: "If the Machine Does the Work, Where Does the Work Go?"
tags: [ai, software-delivery, systems-thinking]
draft: false
version: "1.0"
---

*An analysis · November 2026 · v1.0 · 7 min read*

More output means more progress. Most of us run on that belief, and for most of history it was a fair one. Producing anything took effort, so a pile of finished work was decent evidence that something useful had happened. Software teams built their dashboards on it: tickets closed, changes merged, features shipped.

Now there is a new number on the dashboard. In April 2025, Satya Nadella said as much as 30% of the code in Microsoft's repositories was written by software, and Sundar Pichai told analysts that AI generates just over 30% of Google's.<sup><a href="#where-the-work-goes-ref-1" id="where-the-work-goes-fnref-1">1</a></sup> Neither company has said how the share is counted. The figures were offered, and widely received, as a measure of progress.

Here is a fact that does not fit. One vendor that tracks about 10,000 developers across 1,255 teams reports that engineers using AI are completing twice as many code changes. By its own account, the company-level results are flat.<sup><a href="#where-the-work-goes-ref-2" id="where-the-work-goes-fnref-2">2</a></sup>

<div class="hero-question">
If a machine can do twice the work, why don't we get twice the result?
</div>

The answer starts a long way from software, on a living room floor.

## 1:30 a.m. in Little Rock

In August 2016, Jesse Newton of Little Rock, Arkansas, had his robot vacuum scheduled to run at 1:30 a.m. Some time after midnight, his dog pooped on the living room rug. The robot started on time, drove through it, and kept going on its route. Newton woke around 3 a.m. to find it tracked through the house. His account was shared more than 200,000 times.<sup><a href="#where-the-work-goes-ref-3" id="where-the-work-goes-fnref-3">3</a></sup>

Picture a person doing the same chore. They would never have got that far. Walking in with the vacuum, they would see the rug, put the vacuum down, and fetch paper towels. Nobody vacuums that.

That small scene holds three jobs. The first is looking at the floor and deciding what it needs, which that night was not a vacuum at all. The second is the vacuuming. The third is looking again afterwards to see whether the floor is clean. A person does all three and only notices the middle one, because the looking never stops while they work.

The robot took over the middle job only. Nobody had handed the other two to anyone.

Software has the same three jobs. Deciding what to build and saying it precisely. Building it. Finding out whether what was built is right. AI has taken a large share of the middle.

Watch what the robot's own record would show for that night. It ran on schedule. It finished its route. By every measure it had, the job was done.

## The advice: don't schedule it

iRobot knew about the problem and had no fix for it yet. Its advice to owners was not to run the vacuum when a pet might leave a mess on the floor.<sup><a href="#where-the-work-goes-ref-4" id="where-the-work-goes-fnref-4">4</a></sup>

Follow that advice through. To use the machine safely, the owner has to inspect the floor before every run. That is the first job, handed back, and it defeats the point of a schedule. It is also an instruction that nothing enforces. The robot would run either way.

This is the place where the old belief breaks. Output was a good signal while it was costly. A handwritten letter told you someone thought the matter worth an evening. A thousand identical emails tell you nothing, because sending them cost nothing. When the doing becomes free, the amount done stops carrying information, and it can carry harm at the same speed.

The belief was reasonable. It described a world where doing was the expensive part. The share-of-code figures still measure that world. They are the robot's route.

The software evidence points the same way, with one honest complication. In 2024, Google's DORA research linked rising AI adoption to an estimated 7.2% drop in delivery stability and a 1.5% drop in throughput.<sup><a href="#where-the-work-goes-ref-5" id="where-the-work-goes-fnref-5">5</a></sup> A year later, with about 90% of respondents using AI, the same research found that throughput had turned positive: teams were releasing more. What it named as the continuing problem was making sure software works as intended before it reaches users. Its summary called AI a mirror and a multiplier, one that makes strong organisations more efficient and exposes the weak points of fragmented ones.<sup><a href="#where-the-work-goes-ref-6" id="where-the-work-goes-fnref-6">6</a></sup> More is going out. Whether it is right is the open question.

The complication is that even speed has proved hard to measure. In early 2025, METR found experienced developers took 19% longer with AI on their own projects while believing they had been 20% faster.<sup><a href="#where-the-work-goes-ref-7" id="where-the-work-goes-fnref-7">7</a></sup> By February 2026, METR said that result was out of date and that developers were probably faster. It also said it could no longer measure the effect cleanly, in part because many developers declined to work without AI at all.<sup><a href="#where-the-work-goes-ref-8" id="where-the-work-goes-fnref-8">8</a></sup> What survives both studies is the gap between how fast the work feels and what can be shown.

One project shows what free output does to the people who check it. The maintainers of curl paid for reports of security flaws. Once such reports cost nothing to write, they arrived in volume, and each still took a person's time to disprove. The project ended the payments in January 2026. In the final week it received seven submissions, and none described a vulnerability.<sup><a href="#where-the-work-goes-ref-9" id="where-the-work-goes-fnref-9">9</a></sup>

## Thousands of Play-Doh models

iRobot's fix arrived in September 2021. The new model could see pet waste and steer around it. Getting there took years. Its chief executive said the team had made "many, many thousands" of Play-Doh models to train it.<sup><a href="#where-the-work-goes-ref-10" id="where-the-work-goes-fnref-10">10</a></sup>

Notice what did not change. The robot did not get better at vacuuming. The middle job was already done well. What changed is that the machine could now look before it acted, so the check ran every time, at the machine's own pace, without waiting for a person.

The company then did something more telling. It promised to replace any robot that failed to avoid the mess, within the first year and for solid waste only.<sup><a href="#where-the-work-goes-ref-11" id="where-the-work-goes-fnref-11">11</a></sup> That is a narrow promise. It is also a promise about the state of the floor, and not about the route.

The same three moves are where software teams now stand.

- **Inputs that are enforced.** "Don't run it if the dog has made a mess" is a rule written in a sentence. A rule that matters has to be built into the system, where the machine cannot run past it.
- **Checks that keep pace.** A person reading every change cannot keep up with a machine that writes all day. The check has to run itself, and people have to be able to trust it.
- **A measure of the result.** DORA's delivery measures already separate the two. Deployment frequency counts what went out. Change fail rate counts how much of it needed immediate repair.<sup><a href="#where-the-work-goes-ref-12" id="where-the-work-goes-fnref-12">12</a></sup>

Take code review. On many teams, reviewing a teammate's change was a ritual: every change got a look, and most looks found nothing. When each developer produces far more code, the same ritual spreads the same attention thinner, until every review is a rubber stamp. The purpose of review was never to look at everything. It was to catch what can hurt. One way to keep that purpose is to stamp most changes on purpose and spend real attention on the few that carry risk. It is one possible path of many. What matters is that the practice is chosen for what it does, and not for how it looks.

> [!note]- Where AI helps and where it collides
> AI works with the process when it sits in the middle with strong ends around it, and when it helps at the ends: drafting a specification for a person to correct, or writing the tests. The curl maintainer who ended the payments also acknowledged strong reports that a developer had found with AI's help.<sup><a href="#where-the-work-goes-ref-9">9</a></sup> The tool was the same in both cases. What differed was whether someone had framed the question carefully and checked the answer before sending it.
>
> AI collides with the process when it stands in for the ends. A vague request gets built exactly as written, and the output arrives faster than anyone can check it.

So where does the work go? To the two ends. Saying precisely what is wanted, and finding out whether it was delivered.

Curling is a good picture of that job. One player aims a heavy stone, slides it down the ice and lets go. From that moment nobody on the team may touch it. Two teammates run ahead of it with brooms, sweeping the ice so the stone travels farther and straighter, and the captain at the far end calls the line. Nobody scores for throwing. Points are counted only at the end, by where the stones have come to rest.<sup><a href="#where-the-work-goes-ref-13" id="where-the-work-goes-fnref-13">13</a></sup>

AI does not replace any of those people. The player still aims and the teammates still sweep. What changes is the stone, which moves faster and faster. A faster stone leaves the sweepers less time to do anything about it. Thrown hard enough, it runs past the back line and is out of play. A stone thrown too softly stops short of the far line and is taken off the ice.<sup><a href="#where-the-work-goes-ref-13">13</a></sup> The two score the same: nothing.

That is the trap ahead. A team that lets everything through has built an unstoppable force. A team that answers by checking everything, until nothing ships, has built an immovable object. On the scoreboard there is little difference between them. A fair bet is that more software teams will land at one of those extremes before they learn to throw at a weight they can still sweep.

![](/where-the-work-goes/diagrams/DIA-301-two-stones.svg)

## What the route cannot tell you

Any tool that makes doing cheap turns knowing into the job: knowing what is worth doing, and knowing whether it worked. That was always where the judgment sat. It was easy to miss while the doing took all day.

A process built for this counts the outcomes that matter, and stops counting the activity a machine makes easy to produce. That is harder than it sounds, because activity is the number that goes up.

There is reason for some hope in how the vacuum story ended. The problem was solved, and nobody had to slow the machine to solve it. An engineering team stopped asking how much floor it covered and spent years on a different question.

The route was never the point. The floor was.

For the same gap between a measure and the thing it was meant to track, in a larger system, see [[ai-governance/part-1/index|Part 1: Can AI Self-Govern?]]

## Sources

1. <span id="where-the-work-goes-ref-1"></span>"Satya Nadella says AI now writing 30% of Microsoft's code, warns real change still many years away," *SiliconANGLE*, April 29, 2025. https://siliconangle.com/2025/04/29/satya-nadella-says-ai-now-writing-30-microsofts-code-warns-real-change-still-many-years-away/. Nadella at LlamaCon; Pichai's figure from an earnings call the week before. The article notes that neither company's yardstick is clear.

2. <span id="where-the-work-goes-ref-2"></span>Faros AI, "The AI Productivity Paradox" (AI Engineering Report 2025). https://www.faros.ai/ai-productivity-paradox. Vendor telemetry from about 10,000 developers across 1,255 teams. Company-reported, and the vendor sells engineering analytics.

3. <span id="where-the-work-goes-ref-3"></span>"'Pooptastrophe': Man's Roomba Runs Over Dog Poop," *NBC New York*, August 13, 2016, updated August 16, 2016. https://www.nbcnewyork.com/news/local/pooptastrophe-mans-roomba-runs-over-dog-poop/1330769/. The 1:30 a.m. schedule, waking around 3 a.m., and more than 200,000 shares.

4. <span id="where-the-work-goes-ref-4"></span>Olivia Solon, "Roomba creator responds to reports of 'poopocalypse': 'We see this a lot'," *The Guardian*, August 15, 2016. https://www.theguardian.com/technology/2016/aug/15/roomba-robot-vacuum-poopocalypse-facebook-post. Reports iRobot's response. The Guardian page could not be opened in this pass, so nothing is quoted from it. Newton's location, the scheduling advice and the absence of a fix were confirmed in Anthony Thurston's report for Digital Trends, republished by Fox News, August 17, 2016. https://www.foxnews.com/tech/irobot-responds-to-roomba-poopocalypse-complaints

5. <span id="where-the-work-goes-ref-5"></span>Google Cloud, "Announcing the 2024 DORA report," October 22, 2024. https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report. Survey-based associations, not a demonstration of cause.

6. <span id="where-the-work-goes-ref-6"></span>Google, "How are developers using AI? Inside our 2025 DORA report," September 23, 2025. https://blog.google/technology/developers/dora-report-2025/. Nearly 5,000 technology professionals surveyed.

7. <span id="where-the-work-goes-ref-7"></span>METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," July 10, 2025. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/. Sixteen developers, 246 tasks. The authors call it a snapshot of one setting.

8. <span id="where-the-work-goes-ref-8"></span>METR, update on its developer productivity experiment, February 24, 2026. https://metr.org/blog/2026-02-24-uplift-update/. A follow-up with 57 developers produced estimates METR considers unreliable because of who chose to take part and which tasks they submitted.

9. <span id="where-the-work-goes-ref-9"></span>"Curl shutters bug bounty program to remove incentive for submitting AI slop," *The Register*, January 21, 2026. https://www.theregister.com/2026/01/21/curl_ends_bug_bounty/. Also reports the maintainer's acknowledgement of strong AI-assisted reports.

10. <span id="where-the-work-goes-ref-10"></span>"The newest Roomba is finally smart enough to avoid pet poop," *Popular Science*, updated November 22, 2021. https://www.popsci.com/technology/irobot-roomba-new-pet-poop-feature/. The Roomba j7+, the years of development, and Colin Angle's remark on the models.

11. <span id="where-the-work-goes-ref-11"></span>iRobot, "Pet Owner Official Promise." https://irobot.com/pet-promise. The terms as listed on iRobot's product pages: one year from purchase, replacement only, solid cat or dog waste.

12. <span id="where-the-work-goes-ref-12"></span>DORA, "DORA's software delivery performance metrics." https://dora.dev/guides/dora-metrics-four-keys/. Defines deployment frequency and change fail rate.

13. <span id="where-the-work-goes-ref-13"></span>Capital Curling Club, "Curling basics." https://capitalcurlingclub.org/curling-basics.html. The roles on a four-player team, what sweeping does, the rule against touching a moving stone, the removal of stones that stop short of the far hog line or pass the back line, and scoring by where the stones rest at the end.

## Revision history

| Version | Date | What changed |
| --- | --- | --- |
| 1.0 | November 2026 | First draft. Not yet published. |
