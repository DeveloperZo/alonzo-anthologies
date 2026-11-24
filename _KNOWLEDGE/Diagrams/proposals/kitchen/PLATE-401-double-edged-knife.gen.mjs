// Generates PLATE-401-double-edged-knife.svg. Usage: node PLATE-401-double-edged-knife.gen.mjs <out.svg>
// Manner: a marked document. A menu cut in two along a jagged line, the knife still in the cut.
// Figures (section 1, source 1, Dell'Acqua et al.): quality more than 40% higher, 25.1% faster,
// 12.2% more tasks inside the frontier; 19 percentage points less likely to be right outside it.
// The dishes are the kitchen frame. Which dish falls on which side is arbitrary, and that is the point.
import { plate, write, f } from './frame.mjs';
const X0 = 60, X1 = 570, Y0 = 86, Y1 = 490;
const COLX = [88, 246, 404];            // x = 88 + 158 c
const ROWY = (i) => 195 + 50 * i;       // row baselines
const HEAD = ['STARTERS', 'MAINS', 'SWEETS'];
const DISH = [
  ['Onion soup', 'Green salad', 'Crab cakes', 'Beet salad', 'Oysters', 'Chicken livers'],
  ['Roast chicken', 'Short rib', 'Grilled fish', 'Risotto', 'Steak and chips', 'Lamb chops'],
  ['Lemon tart', 'Bread pudding', 'Ice cream', 'Cheese plate', 'Apple pie', 'Custard'],
];
const KEEP = [4, 2, 5];                 // rows above the cut in each column
// the cut: teeth inside the gap under the last kept row of each column, a long step in each gutter
const mid = (c) => ROWY(KEEP[c] - 1) + 23;
const cut = [];
const span = [[X0, 214], [238, 372], [396, X1]];
span.forEach(([a, b], c) => {
  const n = Math.round((b - a) / 26);
  for (let k = 0; k <= n; k++) cut.push([a + (b - a) * k / n, mid(c) + (k % 2 ? 9 : -8)]);
});
const pts = (a) => a.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
const upper = `M ${X0} ${Y0} L ${X1} ${Y0} L ${pts([...cut].reverse())} Z`;
const lower = `M ${pts(cut)} L ${X1} ${Y1} L ${X0} ${Y1} Z`;
const LT = `translate(5 12) rotate(1.5 ${X0} ${f(cut[0][1])})`;
let up = '', lo = '';
DISH.forEach((col, c) => col.forEach((d, i) => {
  const x = COLX[c], y = ROWY(i), w = d.length * 7.4;
  if (i < KEEP[c]) {
    up += `<text x="${x}" y="${y}" class="dish">${d}</text><path d="M ${x + 104} ${y - 5} l 4 5 l 8 -12" class="l" style="stroke-width:1.2"/>`;
  } else {
    lo += `<text x="${x}" y="${y}" class="dish">${d}</text><path d="M ${x - 4} ${y - 4.5} q ${f(w / 2)} -3 ${f(w + 8)} 0.5" class="la"/>`;
  }
}));
const heads = HEAD.map((h, c) => `<text x="${COLX[c]}" y="158" class="hd">${h}</text><line x1="${COLX[c]}" y1="165" x2="${COLX[c] + 124}" y2="165" class="thin"/>`).join('');
// the knife, drawn tip at the origin and pointing left, then turned 20 degrees and set in the cut
const knife = `<g transform="translate(578 ${f(mid(2) + 12)}) rotate(19)">
    <path d="M 0 0 Q 96 -20 232 -23 L 232 40 Q 104 44 0 0 Z" class="b"/>
    <path d="M 0 0 Q 104 44 232 40 L 232 29 Q 112 31 14 4 Z" class="h"/>
    <path d="M 14 4 Q 112 31 232 29" class="thin"/>
    <path d="M 46 -5 Q 130 -13 222 -14" class="thin" style="opacity:0.55"/>
    <rect x="232" y="-24" width="15" height="42" class="hb"/>
    <path d="M 247 -22 L 338 -17 Q 358 -15 358 1 Q 358 17 338 18 L 247 17 Z" class="b"/>
    <path d="M 247 -22 L 338 -17 Q 358 -15 358 1 Q 358 17 338 18 L 247 17 Z" class="h"/>
    <circle cx="270" cy="-1" r="3.4" class="b" style="stroke-width:1"/><circle cx="298" cy="0" r="3.4" class="b" style="stroke-width:1"/><circle cx="326" cy="1" r="3.4" class="b" style="stroke-width:1"/>
  </g>`;
const body = `
  <!-- shadows -->
  <path d="${upper}" class="h" transform="translate(7 7)"/>
  <g transform="${LT}"><path d="${lower}" class="h" transform="translate(7 7)"/></g>
  <!-- upper piece -->
  <path d="${upper}" class="b"/>
  <text x="${(X0 + X1) / 2}" y="124" text-anchor="middle" class="mh">TONIGHT</text>
  <line x1="${X0 + 28}" y1="134" x2="${X1 - 28}" y2="134" class="thin"/>
  ${heads}
  ${up}
  <!-- lower piece, dropped away from the cut -->
  <g transform="${LT}"><path d="${lower}" class="b"/>${lo}</g>
  ${knife}
  <!-- notes -->
  <text x="612" y="112" class="it">Above the cut, the work the tool</text>
  <text x="612" y="130" class="it">does well. With it, consultants turned in</text>
  <text x="612" y="164" class="big">quality up over 40%</text>
  <text x="612" y="186" class="sm">25.1% faster, 12.2% more tasks finished</text>
  <text x="612" y="276" class="ita">Below it, the same tool, and they were</text>
  <text x="612" y="310" class="biga">19 points less likely</text>
  <text x="612" y="332" class="ita">to get the answer right.</text>
  <text x="${X0 + 4}" y="548" class="sm">Nothing printed on the menu says which side of the cut a dish will fall.</text>
  <text x="${X0 + 4}" y="566" class="sm">A preregistered field experiment, 758 consultants.</text>`;
const svg = plate({
  n: 401, roman: 'I', section: 1, sectionName: 'DOES IT MAKE YOU BETTER?',
  title: 'A Double-Edged Knife',
  caption: 'One tool, one study: better work on one side of a jagged line, worse answers on the other.',
  desc: 'A menu card cut in two along a jagged line, with a chef\'s knife lying at the end of the cut. Dishes on the upper piece are ticked. Dishes on the lower piece, which has dropped away, are struck through in rust. Notes give the figures from a field experiment of 758 consultants: on tasks inside what the AI did well, quality rose by more than 40 percent, work was 25.1 percent faster and 12.2 percent more tasks were finished. On a task outside it, consultants using AI were 19 percentage points less likely to get the answer right. The cut does not follow the order of the menu.',
  style: `.dish { font-size: 15px; } .hd { font-size: 10.5px; letter-spacing: 0.18em; fill: var(--soft); } .mh { font-size: 15px; letter-spacing: 0.3em; }`,
  body,
});
write(process.argv[2], svg);
