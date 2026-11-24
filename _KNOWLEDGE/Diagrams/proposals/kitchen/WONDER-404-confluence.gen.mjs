// Generates WONDER-404-confluence.svg. Usage: node WONDER-404-confluence.gen.mjs <out.svg>
// Manner: a flow map of a confluence. Three streams of equal width take up the tool, swell by different amounts,
// run together and meet the pass.
// Scale: every stream is 56 units wide without AI, so 0.56 units = 1 percent. The dashed lines keep that width.
// Source 1: below-average consultants +43% quality score, above-average +17%.
// Source 5: developers +26.08% tasks completed (4,867 developers, three field experiments).
// Source 6, DORA 2025: AI still negatively associated with delivery stability. No size is drawn for it.
import { plate, write, f } from './frame.mjs';
import { rng, straight, bezier, join, ribbon, ghost, smooth, offsetLine, chev, FLOW_STYLE } from './flow.mjs';
const rnd = rng(4041);
const B = 28;                                        // half-width without AI
const TOOL = 312, MEET = 640, PASS = 800, MY = 318;
const streams = [
  { y: 150, g: 43, head: 'BELOW-AVERAGE CONSULTANTS', big: '+43%', note: 'quality score', heavy: true },
  { y: 318, g: 26.08, head: 'DEVELOPERS', big: '+26.08%', note: 'tasks completed' },
  { y: 486, g: 17, head: 'ABOVE-AVERAGE CONSULTANTS', big: '+17%', note: 'quality score' },
];
const hws = streams.map((s) => B * (1 + s.g / 100));
const total = hws.reduce((a, b) => a + 2 * b, 0);
let slotTop = MY - total / 2, g = '';
streams.forEach((s, k) => {
  const slot = slotTop + hws[k]; slotTop += 2 * hws[k];
  const cl = join(straight(60, s.y, TOOL + 90, s.y), bezier([[TOOL + 90, s.y], [TOOL + 250, s.y], [MEET - 150, slot], [MEET, slot]], 60), straight(MEET, slot, PASS, slot));
  const n0 = Math.round((TOOL - 60) / 4), n1 = Math.round((TOOL + 90 - 60) / 4);
  const hw = (i) => B + (hws[k] - B) * smooth((i - n0) / (n1 - n0));
  g += ribbon({ cl, hw, rnd, pitch: 6.2, bank: true });
  g += ghost(offsetLine(cl, B).slice(n0)) + ghost(offsetLine(cl, -B).slice(n0));
  g += chev(140, s.y, 1);
  g += `<text x="60" y="${s.y - B - 30}" class="sc">${s.head}</text><text x="60" y="${s.y - B - 12}" class="sm">${s.note}</text>`;
  g += `<text x="${TOOL + 96}" y="${s.y - hws[k] - 12}" class="${s.heavy ? 'huge' : 'num'}">${s.big}</text>`;
});
const body = `
  ${g}
  <line x1="${TOOL}" y1="90" x2="${TOOL}" y2="540" class="sight" style="stroke:var(--ink)"/>
  <text x="${TOOL - 8}" y="548" text-anchor="end" class="sm">without AI</text>
  <text x="${TOOL + 8}" y="548" class="sm">with it</text>
  <!-- the pass -->
  <rect x="${PASS}" y="${f(MY - total / 2 - 22)}" width="12" height="${f(total + 44)}" class="hb"/>
  <text x="${PASS + 6}" y="${f(MY - total / 2 - 32)}" text-anchor="middle" class="sc">THE PASS</text>
  <text x="${PASS + 26}" y="${MY - 30}" class="ita">What reaches</text>
  <text x="${PASS + 26}" y="${MY - 12}" class="ita">the table is</text>
  <text x="${PASS + 26}" y="${MY + 6}" class="ita">decided here.</text>
  <text x="${PASS + 26}" y="${MY + 34}" class="sm">Across whole</text>
  <text x="${PASS + 26}" y="${MY + 50}" class="sm">teams, delivery</text>
  <text x="${PASS + 26}" y="${MY + 66}" class="sm">stability is still</text>
  <text x="${PASS + 26}" y="${MY + 82}" class="sm">worse where AI</text>
  <text x="${PASS + 26}" y="${MY + 98}" class="sm">use is higher.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Width is the number. Each stream starts at the same width, its own score without AI (dashed). The team finding is an association from a survey of about 5,000.</text>`;
write(process.argv[2], plate({
  n: 404, roman: 'IV', section: 4, sectionName: 'TWO KITCHENS, SAME MENU', title: 'Rising Tide, Leaky Boats',
  caption: 'The weaker performers gain most at the station, 43% against 17%. What reaches the table is decided past it.',
  desc: 'A flow map of three streams that start at the same width and run from left to right. Past a dashed line where the tool is taken up, each swells: below-average consultants by 43 percent in quality score, developers by 26.08 percent in tasks completed, and above-average consultants by 17 percent. Dashed lines inside each stream keep its width without AI. The three run together into one river and meet a wall labelled the pass. A note beyond it says that what reaches the table is decided there, and that across whole teams delivery stability is still worse where AI use is higher.',
  style: FLOW_STYLE,
  body,
}));
