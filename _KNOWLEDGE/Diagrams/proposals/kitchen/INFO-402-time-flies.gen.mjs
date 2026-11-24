// Generates INFO-402-time-flies.svg. Usage: node INFO-402-time-flies.gen.mjs <out.svg>
// Form: a number line with three marks and the gap between two of them bracketed.
// Scale: 11.5 units = 1 percent, zero at x = 470. Source 2, METR 2025.
import { plate, write, f } from './frame.mjs';
const FORECAST = 24, FELT = 20, CLOCK = -19, U = 11.5, X0 = 470, AY = 330;
const X = (v) => X0 + v * U;
let ticks = '';
for (let v = -30; v <= 30; v += 5) { const big = v % 10 === 0; ticks += `<line x1="${X(v)}" y1="${AY - (big ? 9 : 5)}" x2="${X(v)}" y2="${AY + (big ? 9 : 5)}" class="${big ? 'l' : 'thin'}"/>`; if (big && v !== 0) ticks += `<text x="${X(v)}" y="${AY + 28}" text-anchor="middle" class="sm">${Math.abs(v)}%</text>`; }
const gap = FELT - CLOCK;
const body = `
  <text x="${X(-30)}" y="${AY + 56}" class="sc">SLOWER WITH AI</text>
  <text x="${X(30)}" y="${AY + 56}" text-anchor="end" class="sc">FASTER WITH AI</text>
  <line x1="${X(-30)}" y1="${AY}" x2="${X(30)}" y2="${AY}" class="l" style="stroke-width:2"/>
  ${ticks}
  <line x1="${X0}" y1="${AY - 34}" x2="${X0}" y2="${AY + 34}" class="l" style="stroke-width:2"/>
  <text x="${X0}" y="${AY + 56}" text-anchor="middle" class="sm">the same work, without AI</text>
  <!-- forecast -->
  <line x1="${X(FORECAST)}" y1="${AY}" x2="${X(FORECAST)}" y2="160" class="sight" style="stroke:var(--ink)"/>
  <circle cx="${X(FORECAST)}" cy="${AY}" r="9" class="b"/>
  <text x="900" y="124" text-anchor="end" class="num">24% faster</text>
  <text x="900" y="146" text-anchor="end" class="it">their forecast, before starting</text>
  <!-- felt -->
  <line x1="${X(FELT)}" y1="${AY}" x2="${X(FELT)}" y2="236" class="l"/>
  <circle cx="${X(FELT)}" cy="${AY}" r="9" class="ink"/>
  <text x="${X(FELT) - 12}" y="232" text-anchor="end" class="num">20% faster</text>
  <text x="${X(FELT) - 12}" y="254" text-anchor="end" class="it">what they believed afterward</text>
  <!-- clock -->
  <line x1="${X(CLOCK)}" y1="${AY}" x2="${X(CLOCK)}" y2="176" class="la"/>
  <circle cx="${X(CLOCK)}" cy="${AY}" r="13" class="fa"/>
  <text x="${X(CLOCK) + 14}" y="150" text-anchor="middle" class="hugea">19% slower</text>
  <text x="${X(CLOCK) + 14}" y="172" text-anchor="middle" class="ita">what the clock measured</text>
  <!-- the gap between the clock and the feeling -->
  <path d="M ${X(CLOCK)} ${AY + 84} v 18 H ${X(FELT)} v -18" class="la"/>
  <text x="${(X(CLOCK) + X(FELT)) / 2}" y="${AY + 150}" text-anchor="middle" class="hugea">${gap} points</text>
  <text x="${(X(CLOCK) + X(FELT)) / 2}" y="${AY + 176}" text-anchor="middle" class="ita">between the clock and the feeling</text>
  <text x="480" y="584" text-anchor="middle" class="sm">16 experienced open-source developers, 246 real issues, each assigned by chance to allow AI or bar it. Randomized trial, early-2025 tools.</text>`;
write(process.argv[2], plate({
  n: 402, roman: 'II', section: 2, sectionName: 'THE PEOPLE WHO SHOULD BE FASTEST', title: 'Time Flies When You’re Having Fun',
  caption: 'Developers forecast 24% faster, clocked 19% slower, and still felt 20% faster.',
  desc: 'A number line running from 30 percent slower with AI on the left to 30 percent faster on the right, with the same work done without AI at the centre. An open mark at 24 percent faster is the developers\' forecast before starting. A dark mark at 20 percent faster is what they believed afterward. A large rust mark at 19 percent slower is what the clock measured. A rust bracket under the line spans from the clock\'s mark to the belief: 39 points between the clock and the feeling. From a randomized trial of 16 experienced developers on 246 issues.',
  style: `.num { font-size: 26px; } .hugea { font-size: 40px; fill: var(--accent); }`,
  body,
}));
