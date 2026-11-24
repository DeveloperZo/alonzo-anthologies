// Generates PLATE-402-time-flies.svg. Usage: node PLATE-402-time-flies.gen.mjs <out.svg>
// Manner: an instrument face read against real figures. A sixty-minute kitchen timer.
// Scale: one full turn of the dial = the time the job takes without AI (set to 60 minutes).
// Figures (section 2, source 2, METR 2025): forecast 24% faster, measured 19% slower, believed afterward 20% faster.
import { plate, write, f } from './frame.mjs';
const FORECAST = -24, FELT = -20, CLOCK = 19;         // percent change in time taken
const CX = 330, CY = 325;
const pol = (r, min) => { const a = (min / 60) * 2 * Math.PI; return [CX + r * Math.sin(a), CY - r * Math.cos(a)]; };
const mins = (pct) => 60 * (1 + pct / 100);            // 45.6, 48, 71.4
// an arc from 0 to m minutes at radius r0, growing to r1 (a spiral when r1 != r0)
function sweep(m, r0, r1) {
  let d = '';
  const n = Math.ceil(m * 2);
  for (let k = 0; k <= n; k++) { const t = k / n; const [x, y] = pol(r0 + (r1 - r0) * t, m * t); d += (k ? ' L ' : 'M ') + f(x) + ' ' + f(y); }
  return d;
}
let ticks = '', nums = '';
for (let m = 0; m < 60; m++) {
  const big = m % 5 === 0;
  const [x1, y1] = pol(big ? 196 : 201, m), [x2, y2] = pol(208, m);
  ticks += `M ${f(x1)} ${f(y1)} L ${f(x2)} ${f(y2)} `;
  if (big) { const [x, y] = pol(180, m); nums += `<text x="${f(x)}" y="${f(y + 5.5)}" text-anchor="middle" class="num">${m === 0 ? 60 : m}</text>`; }
}
const mF = mins(FORECAST), mB = mins(FELT), mC = mins(CLOCK);
const eF = pol(120, mF), eB = pol(138, mB), eC = pol(166, mC);
const hand = pol(150, mC);
const body = `
  <!-- the timer: case, bezel, dial -->
  <circle cx="${CX}" cy="${CY}" r="232" class="hb"/>
  <circle cx="${CX}" cy="${CY}" r="218" class="b"/>
  <circle cx="${CX}" cy="${CY}" r="212" class="thin"/>
  <path d="${ticks.trim()}" class="thin" style="stroke-width:0.9"/>
  ${nums}
  <text x="${CX}" y="${CY + 64}" text-anchor="middle" class="sc">MINUTES</text>
  <!-- forecast, feeling, clock: each sweep starts at the top -->
  <path d="${sweep(mF, 120, 120)}" class="sight" style="stroke-width:1.6;stroke-dasharray:6 5"/>
  <path d="${sweep(mB, 138, 138)}" class="l" style="stroke-width:2.6"/>
  <path d="${sweep(mC, 152, 166)}" class="la" style="stroke-width:4.2"/>
  <circle cx="${f(eF[0])}" cy="${f(eF[1])}" r="3.2" style="fill:var(--soft)"/>
  <circle cx="${f(eB[0])}" cy="${f(eB[1])}" r="4" class="ink"/>
  <circle cx="${f(eC[0])}" cy="${f(eC[1])}" r="5.5" class="fa"/>
  <!-- the hand, stopped where the clock stopped -->
  <path d="M ${CX} ${CY} L ${f(hand[0])} ${f(hand[1])}" class="l" style="stroke-width:3"/>
  <circle cx="${CX}" cy="${CY}" r="9" class="b"/><circle cx="${CX}" cy="${CY}" r="2.6" class="ink"/>
  <!-- notes -->
  <text x="622" y="118" class="it">Set the dial so the job takes</text>
  <text x="622" y="136" class="it">one full turn without AI.</text>
  <path d="M 614 124 Q 470 70 ${CX + 8} ${CY - 222}" class="thin"/>
  <text x="622" y="204" class="sm">Before they started, the developers</text>
  <text x="622" y="221" class="sm">forecast it would run ${-FORECAST}% faster.</text>
  <text x="622" y="282" class="it">Afterward, they still believed</text>
  <text x="622" y="314" class="big">${-FELT}% faster</text>
  <text x="622" y="398" class="ita">The clock, on the same work:</text>
  <text x="622" y="432" class="biga">${CLOCK}% slower</text>
  <text x="622" y="454" class="ita">past the bell and into a second turn</text>
  <text x="622" y="528" class="sm">Sixteen experienced developers, 246 real issues,</text>
  <text x="622" y="545" class="sm">each assigned by chance to allow AI or bar it.</text>`;
const svg = plate({
  n: 402, roman: 'II', section: 2, sectionName: 'THE PEOPLE WHO SHOULD BE FASTEST',
  title: 'Time Flies When You\u2019re Having Fun',
  caption: 'Developers forecast 24% faster, clocked 19% slower, and still felt 20% faster.',
  desc: 'A sixty-minute kitchen timer. One full turn of the dial stands for the time a job takes without AI. A dashed sweep from the top stops at 45.6 minutes: the developers\' forecast of 24 percent faster. A solid sweep stops at 48 minutes: what they believed afterward, 20 percent faster. A heavy rust sweep goes all the way round, past sixty and on to 11.4 minutes of a second turn: what the clock measured, 19 percent slower. The hand rests there. From a randomized trial of 16 experienced developers on 246 issues.',
  style: `.num { font-size: 15px; }`,
  body,
});
write(process.argv[2], svg);
