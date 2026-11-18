---
title: "V: How These Interact as a System"
tags: [ai, governance, systems-thinking]
draft: false
---

*Section 5 of 8*

*The previous four sections are not separate problems. They're parts of the same structure: a fast self-amplifying loop, a slow broken self-correcting loop, and a paradox that turns alarm into acceleration.*

Where are the self-amplifying loops? Which loops are supposed to correct them, and which is winning? In the AI system, the self-amplifying loops are large, fast, and well-capitalized. The self-correcting loops are under-resourced, and as sections 3 and 4 showed, actively weakened by the same forces they're meant to check.

![](/ai-governance/part-1/diagrams/DIA-005-loops.svg)

Watch what this structure predicts. Safety research gets published. Safety policies get announced. The pressure for structural reform (liability law, mandatory audits, hard deployment gates) drops. Not because the research is fake. Because its existence signals that the problem is being handled. The visible fix absorbs the urgency that would otherwise push toward the structural fix. Donella Meadows, whose *Thinking in Systems* supplies the frame for this series, calls this *shifting the burden*: the symptomatic solution works just well enough to prevent the fundamental one. This is a pattern to test for, not a measured result: no one has a gauge on reform pressure. What can be seen is the two things coexisting, a visible safety apparatus and unconstrained deployment.

A second self-amplifying loop is forming. AI systems are now used in AI research itself: suggesting architectures, running experiments, writing training code. DeepMind's AlphaProof<sup><a href="sources#part1-ref-17" id="part1-fnref-17">17</a></sup> and Sakana AI's AI Scientist<sup><a href="sources#part1-ref-18" id="part1-fnref-18">18</a></sup> are early documented instances, with widespread use of AI coding tools in ML workflows accelerating behind them. As this matures, it sits on top of the existing capital loop: better AI accelerates the research that produces even better AI. The feedback delay in this loop is shrinking. How fast it fires is genuinely uncertain. The original AI 2027 scenario (Kokotajlo et al., April 2025) was conditional, not a central forecast. Its authors' December 2025 model pushed the automated-coder milestone out to around 2030.<sup><a href="sources#part1-ref-19" id="part1-fnref-19">19</a></sup> Two updates in 2026 pulled it back: by August, Kokotajlo's own median stood at November 2027 and his co-author Eli Lifland's at January 2030.<sup><a href="sources#part1-ref-19a" id="part1-fnref-19a">19a</a></sup> The estimates have swung by years in both directions inside eighteen months, and the forecasters disagree with each other by more than two. The mechanism is real and already in motion.

> [!key]- The one constraint that's already permanent: open weights
> Compute is a flow: you can regulate chips, tax energy, slow permits. But model weights are a stock. DeepSeek-R1 (MIT license, January 20, 2025), Llama 3.x and its distillation chains have permanently exported reasoning-class capabilities outside any government's reach, and the stock keeps growing: 2026 alone added DeepSeek V4, the 600-billion-parameter Llama 5, and Moonshot's Kimi K3, all open-weight.<sup><a href="sources#part1-ref-43" id="part1-fnref-43">43</a></sup> Export controls on chips might slow who builds the *next* generation. They cannot un-release what already exists. AI capability, once in open weights, requires nothing further from the original lab. This is how any information stock behaves once copied: controls can act on materials and machines, not on files already in circulation.

Can AI companies be trusted to self-govern? The structural answer is: **not reliably, and not because the people are uniquely reckless.** The fast loop (capability → capital → compute) runs strong. The slow loop (harm → oversight → slowdown) carries multi-year delays, runs under-resourced, and regulators have weakened it further since 2025. When two loops compete, the faster one governs behavior, regardless of stated intentions.

*Section 6 looks at what these loops are doing to people, starting with where labor displacement is already concentrated and what the industry's framing leaves out.*
