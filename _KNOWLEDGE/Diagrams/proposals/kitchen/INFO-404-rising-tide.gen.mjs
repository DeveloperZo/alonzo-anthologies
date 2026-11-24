// Generates INFO-404-rising-tide.svg. Usage: node INFO-404-rising-tide.gen.mjs <out.svg>
// Form: a slope chart. Each group starts at its own score without AI, set to 100, and rises to its score with AI.
// Scale: 8.2 units = 1 index point. Source 1: below-average performers +43%, above-average +17% (quality score).
// Source 5: developers +26.08% tasks completed. Source 6: DORA 2025, AI still negatively associated with delivery stability.
import { plate, write, f } from './frame.mjs';
const XL = 200, XR = 560, Y100 = 500, U = 8.2;
const Y = (v) => Y100 - (v - 100) * U;
const lines = [
  { v: 143, big: '+43%', a: 'below-average performers', b: 'consultants, quality score', w: 4, cls: 'l' },
  { v: 126.08, big: '+26.08%', a: 'developers, tasks completed', b: 'the less experienced gained more', w: 1.4, cls: 'sight', ink: true },
  { v: 117, big: '+17%', a: 'above-average performers', b: 'consultants, quality score', w: 2, cls: 'l' },
];
let g = '';
for (const l of lines) {
  g += `<line x1="${XL}" y1="${Y100}" x2="${XR}" y2="${f(Y(l.v))}" class="${l.cls}" style="stroke-width:${l.w};${l.ink ? 'stroke:var(--ink);' : ''}"/>`;
  g += `<circle cx="${XR}" cy="${f(Y(l.v))}" r="${l.w > 3 ? 8 : 6}" class="${l.ink ? 'b' : 'ink'}"/>`;
  g += `<text x="${XR + 22}" y="${f(Y(l.v) + 6)}" class="${l.w > 3 ? 'huge' : 'num'}">${l.big}</text>`;
  g += `<text x="${XR + (l.w > 3 ? 172 : l.big.length > 4 ? 140 : 100)}" y="${f(Y(l.v) - 4)}" class="it">${l.a}</text><text x="${XR + (l.w > 3 ? 172 : l.big.length > 4 ? 140 : 100)}" y="${f(Y(l.v) + 13)}" class="sm">${l.b}</text>`;
}
const body = `
  <text x="${XL}" y="104" text-anchor="middle" class="sc">WITHOUT AI</text>
  <text x="${XR}" y="104" text-anchor="middle" class="sc">WITH AI</text>
  <line x1="${XL}" y1="118" x2="${XL}" y2="${Y100 + 20}" class="thin"/>
  <line x1="${XR}" y1="118" x2="${XR}" y2="${Y100 + 20}" class="thin"/>
  <line x1="${XL}" y1="${Y100}" x2="${XR}" y2="${Y100}" class="sight"/>
  ${g}
  <circle cx="${XL}" cy="${Y100}" r="8" class="ink"/>
  <text x="${XL - 18}" y="${Y100 - 8}" text-anchor="end" class="it">each group's own</text>
  <text x="${XL - 18}" y="${Y100 + 10}" text-anchor="end" class="it">score, set level</text>
  <text x="${XR + 22}" y="${Y100 + 5}" class="sm">no change</text>
  <text x="60" y="${Y100 + 62}" class="ita" style="font-size:17px">That is the station. Across whole teams, delivery stability is still worse where AI use is higher.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">A field experiment of 758 consultants, three field experiments covering 4,867 developers, and a survey of about 5,000 (an association).</text>`;
write(process.argv[2], plate({
  n: 404, roman: 'IV', section: 4, sectionName: 'TWO KITCHENS, SAME MENU', title: 'Rising Tide, Leaky Boats',
  caption: 'The weaker performers gain most at the station, 43% against 17%. What reaches the table is decided past it.',
  desc: 'A slope chart with two posts, without AI on the left and with AI on the right. Three lines start from one point on the left, each group\'s own score without AI set level. The heaviest line climbs steepest: below-average consultants, up 43 percent in quality score. A dashed line climbs to 26.08 percent: developers across three field experiments, tasks completed, with the less experienced gaining more. The shallowest line is above-average consultants, up 17 percent. A rust sentence beneath says that across whole teams delivery stability is still worse where AI use is higher.',
  style: `.num { font-size: 26px; } .huge { font-size: 46px; }`,
  body,
}));
