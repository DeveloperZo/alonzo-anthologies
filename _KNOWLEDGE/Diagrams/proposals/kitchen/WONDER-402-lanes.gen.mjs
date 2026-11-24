// Generates WONDER-402-lanes.svg. Usage: node WONDER-402-lanes.gen.mjs <out.svg>
// Manner: a river map of time. Length is the time one job takes. Three straight cuts are the forecast,
// the feeling and the job without AI. The fourth, what the clock measured, is a river that wanders
// between the same two lines: its length along the bends is 119, and it is laid out straight beneath to prove it.
// Scale: 5 units of length = 1 percent of the time the job takes without AI.
// Source 2, METR 2025: developers forecast 24% faster, believed afterward 20% faster, measured 19% slower.
import { plate, write, f } from './frame.mjs';
import { rng, straight, ribbon, FLOW_STYLE } from './flow.mjs';
const rnd = rng(4021);
const U = 5, X0 = 130, HW = 20;
const X = (pct) => X0 + pct * U;
const XN = X(100), SPAN = XN - X0;
const cuts = [
  { y: 136, pct: 76, cls: 'sts', bank: 'sight', head: 'THE FORECAST', big: '24% faster', note: 'before they started', soft: true },
  { y: 218, pct: 80, cls: 'st', bank: 'l', head: 'THE FEELING', big: '20% faster', note: 'what they still believed afterward' },
  { y: 300, pct: 100, cls: 'st', bank: 'l', head: 'WITHOUT AI', big: '', note: 'the same developers, the same kind of work' },
];
let g = '';
for (const l of cuts) {
  g += ribbon({ cl: straight(X0, l.y, X(l.pct), l.y), hw: HW, rnd, cls: l.cls, bankCls: l.bank, pitch: 6.4 });
  g += `<rect x="${f(X(l.pct))}" y="${l.y - HW - 6}" width="6" height="${2 * HW + 12}" class="${l.soft ? 'h' : 'ink'}"/>`;
  g += `<text x="${X0 + 8}" y="${l.y - HW - 10}" class="sc">${l.head}</text><text x="${X0 + 150}" y="${l.y - HW - 10}" class="sm">${l.note}</text>`;
  if (l.big) g += `<text x="${XN + 22}" y="${l.y + 9}" class="num">${l.big}</text>`;
}
// the meander: y = MY + A sin(k (x - X0)), two full bends, with A solved so that its length is 1.19 spans
const MY = 426, WAVES = 2, k = 2 * Math.PI * WAVES / SPAN, TARGET = 1.19;
const arc = (A) => { let s = 0; const n = 4000; for (let i = 0; i < n; i++) { const x = (i + 0.5) * SPAN / n; s += Math.sqrt(1 + (A * k * Math.cos(k * x)) ** 2) * SPAN / n; } return s / SPAN; };
let lo = 0, hi = 120; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (arc(m) < TARGET) lo = m; else hi = m; }
const A = (lo + hi) / 2;
const cl = []; for (let x = -24; x <= SPAN + 24; x += 3) cl.push([X0 + x, MY - A * Math.sin(k * x)]);
const river = ribbon({ cl, hw: HW, rnd, cls: 'sta', bankCls: 'la', pitch: 6.4 });
const LY = MY + A + HW + 34;                          // the same river, laid straight
const body = `
  <line x1="${X0}" y1="92" x2="${X0}" y2="${LY + 10}" class="l" style="stroke-width:2.4"/>
  <text x="${X0 - 10}" y="104" text-anchor="end" class="sc">START</text>
  ${g}
  <line x1="${XN + 3}" y1="92" x2="${XN + 3}" y2="${LY + 10}" class="sight" style="stroke:var(--ink)"/>
  <text x="${XN + 12}" y="100" class="sm">where the job ends without AI</text>
  <clipPath id="p402-clip"><rect x="${X0}" y="340" width="${SPAN + 3}" height="200"/></clipPath>
  <g clip-path="url(#p402-clip)">${river}</g>
  <rect x="${XN}" y="${MY - HW - 6}" width="6" height="${2 * HW + 12}" class="fa"/>
  <text x="${X0 + 8}" y="${f(MY - A - HW - 12)}" class="sc" style="fill:var(--accent)">THE CLOCK</text>
  <text x="${X0 + 150}" y="${f(MY - A - HW - 12)}" class="sm">what was measured with AI: the same job, by a longer road</text>
  <text x="${XN + 22}" y="${MY - 2}" class="hugea">19% slower</text>
  <text x="${XN + 22}" y="${MY + 22}" class="ita">along the bends</text>
  <!-- the river laid straight -->
  <path d="M ${X0} ${f(LY)} H ${f(X(119))}" class="la" style="stroke-dasharray:7 5"/>
  <path d="M ${f(X(119))} ${f(LY - 7)} v 14 M ${XN + 3} ${f(LY - 5)} v 10" class="la"/>
  <text x="${f(X(119) + 12)}" y="${f(LY + 5)}" class="ita">the same river, laid straight</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Length is the time one job takes. 16 experienced developers, 246 real issues, each assigned by chance to allow AI or bar it. Randomized trial, early-2025 tools.</text>`;
write(process.argv[2], plate({
  n: 402, roman: 'II', section: 2, sectionName: 'THE PEOPLE WHO SHOULD BE FASTEST', title: 'Time Flies When You’re Having Fun',
  caption: 'Developers forecast 24% faster, clocked 19% slower, and still felt 20% faster.',
  desc: 'A river map in which length is the time one job takes. Three straight cuts leave a starting line. The first, faint and dashed, is the developers\' forecast with AI and stops at 76 percent of the distance, 24 percent faster. The second is what they believed afterward and stops at 80 percent, 20 percent faster. The third is the job without AI and sets the full distance, carried down the plate as a dashed line. Below them a rust river, what the clock measured with AI, wanders in two wide bends between the same start and the same finish. Its length along the bends is 119 percent of the straight distance, 19 percent slower. A dashed rust line beneath lays the same river out straight and runs past the finish line.',
  style: FLOW_STYLE,
  body,
}));
