// Generates INFO-406-own-pot.svg. Usage: node INFO-406-own-pot.gen.mjs <out.svg>
// Form: unit grids. Each grid is 100 quiz points, filled to the score.
// Source 16, Shen and Tamkin (Anthropic): 67% without AI, 50% with AI (randomized, 52 mostly junior engineers).
// Habit groups among the AI users, observed, two to four engineers each: 86%, 39%, 24%.
import { plate, write, f } from './frame.mjs';
// a 10 by 10 grid with its top-left at (x, y), filled from the bottom row up, left to right
function grid(x, y, n, cell, gap, cls) {
  let on = '', off = '';
  for (let i = 0; i < 100; i++) {
    const r = 9 - Math.floor(i / 10), c = i % 10;
    const rect = `<rect x="${f(x + c * (cell + gap))}" y="${f(y + r * (cell + gap))}" width="${cell}" height="${cell}"/>`;
    if (i < n) on += rect; else off += rect;
  }
  return `<g class="${cls}">${on}</g><g class="off">${off}</g>`;
}
const BIG = { cell: 15, gap: 3 }, W = 10 * 15 + 9 * 3;       // 177
const SM = { cell: 9, gap: 2 }, w = 10 * 9 + 9 * 2;           // 108
const habits = [
  { n: 86, a: 'generated, then made', b: 'sure they understood', c: 'two engineers' },
  { n: 39, a: 'handed the whole', b: 'job over', c: '' },
  { n: 24, a: 'had the AI debug', b: 'for them', c: '' },
];
const HX = (i) => 552 + i * 124, HY = 214;
const body = `
  <text x="78" y="110" class="sc">THE TRIAL: GROUPS ASSIGNED BY CHANCE</text>
  <line x1="78" y1="120" x2="492" y2="120" class="thin" style="opacity:0.5"/>
  ${grid(78, 150, 67, BIG.cell, BIG.gap, 'on')}
  ${grid(304, 150, 50, BIG.cell, BIG.gap, 'ona')}
  <text x="78" y="${150 + W + 58}" class="huge">67%</text><text x="80" y="${150 + W + 84}" class="it">worked without AI</text>
  <text x="304" y="${150 + W + 58}" class="hugea">50%</text><text x="306" y="${150 + W + 84}" class="ita">worked with AI</text>
  <text x="552" y="110" class="sc">THE AI USERS, SORTED BY HABIT</text>
  <line x1="552" y1="120" x2="900" y2="120" class="thin" style="opacity:0.5"/>
  <text x="552" y="150" class="sm">Observed, not assigned. Two to four engineers</text>
  <text x="552" y="166" class="sm">in each group: a pattern, not proof.</text>
  ${habits.map((h, i) => grid(HX(i), HY, h.n, SM.cell, SM.gap, 'on') +
    `<text x="${HX(i)}" y="${HY + w + 44}" class="num">${h.n}%</text><text x="${HX(i)}" y="${HY + w + 68}" class="sm">${h.a}</text><text x="${HX(i)}" y="${HY + w + 84}" class="sm">${h.b}</text>` + (h.c ? `<text x="${HX(i)}" y="${HY + w + 104}" class="sm" style="fill:var(--ink)">(${h.c})</text>` : '')).join('')}
  <text x="78" y="500" class="it">Each grid is a comprehension quiz: one hundred points, filled to the score.</text>
  <text x="78" y="520" class="sm">The widest gap between the two trial groups was on debugging. Speed did not differ significantly.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">52 mostly junior engineers. The two large grids are a randomized trial run by researchers at Anthropic, an AI vendor.</text>`;
write(process.argv[2], plate({
  n: 406, roman: 'VI', section: 6, sectionName: 'THE COOK TASTES FROM HIS OWN POT', title: 'Tasting From Your Own Pot',
  caption: 'With AI, engineers scored 50% on comprehension against 67% without. By habit the score ran from 24 to 86.',
  desc: 'Five grids of one hundred squares, each filled to a comprehension quiz score. Two large grids show the randomized trial: engineers who worked without AI scored 67 percent, and engineers who worked with AI scored 50 percent, filled in rust. Three smaller grids sort the AI users by habit: those who generated code and then made themselves understand it scored 86 percent, those who handed the whole job over scored 39 percent, and those who had the AI debug for them scored 24 percent. The habit groups were observed, not assigned, with two to four engineers each.',
  style: `.on rect { fill: var(--ink); } .ona rect { fill: var(--accent); } .off rect { fill: none; stroke: var(--soft); stroke-width: 0.7; } .huge { font-size: 50px; } .hugea { font-size: 50px; fill: var(--accent); } .num { font-size: 30px; }`,
  body,
}));
