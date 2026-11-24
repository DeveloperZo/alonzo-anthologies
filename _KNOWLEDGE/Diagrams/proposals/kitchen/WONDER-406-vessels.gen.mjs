// Generates WONDER-406-vessels.svg. Usage: node WONDER-406-vessels.gen.mjs <out.svg>
// Manner: a plate of gauged vessels. Understanding is a stock, and each vessel stands filled to a quiz score.
// Scale: 3.3 units of depth = 1 point of score, one staff for all five vessels.
// Source 16, Shen and Tamkin (Anthropic): 67% without AI, 50% with AI (randomized, 52 mostly junior engineers).
// Habit groups among the AI users, observed, two to four engineers each: 86%, 39%, 24%.
import { plate, write, f } from './frame.mjs';
import { rng, FLOW_STYLE } from './flow.mjs';
const rnd = rng(4061);
const G = 508, U = 3.3, TOP = G - 100 * U;            // ground, scale, the brim at 100
const Y = (v) => G - v * U;
// one vessel filled to v. Water is drawn as wobbling lines, six units apart, under a heavier surface.
function vessel(x, w, v, cls, bankCls) {
  let s = '';
  for (let y = G - 4; y > Y(v) + 3; y -= 6) {
    const ph = rnd() * 6.28, amp = 0.6 + rnd() * 0.8; let d = `M ${x + 3} ${f(y)}`;
    for (let px = x + 7; px <= x + w - 3; px += 4) d += ` L ${px} ${f(y + amp * Math.sin(px / 17 + ph))}`;
    s += `<path d="${d}" class="${cls}"/>`;
  }
  let d = `M ${x + 2} ${f(Y(v))}`; const ph = rnd() * 6.28;
  for (let px = x + 6; px <= x + w - 2; px += 4) d += ` L ${px} ${f(Y(v) + 1.6 * Math.sin(px / 11 + ph))}`;
  s += `<path d="${d}" class="${bankCls}" style="stroke-width:2"/>`;
  s += `<path d="M ${x} ${TOP - 14} V ${G} H ${x + w} V ${TOP - 14}" class="l" style="stroke-width:2.4"/>`;
  s += `<path d="M ${x - 7} ${TOP - 14} H ${x + 3} M ${x + w - 3} ${TOP - 14} H ${x + w + 7}" class="l" style="stroke-width:2.4"/>`;
  return s;
}
const big = [{ x: 104, v: 67, a: 'worked without AI' }, { x: 290, v: 50, a: 'worked with AI', accent: true }];
const small = [
  { x: 536, v: 86, a: 'generated, then made', b: 'sure they understood', c: '(two engineers)' },
  { x: 664, v: 39, a: 'handed the whole', b: 'job over' },
  { x: 792, v: 24, a: 'had the AI debug', b: 'for them' },
];
let g = '';
for (const b of big) {
  g += vessel(b.x, 140, b.v, b.accent ? 'sta' : 'st', b.accent ? 'la' : 'l');
  g += `<text x="${b.x + 70}" y="${f(Y(b.v) - 16)}" text-anchor="middle" class="${b.accent ? 'hugea' : 'huge'}">${b.v}%</text>`;
  g += `<text x="${b.x + 70}" y="${G + 24}" text-anchor="middle" class="${b.accent ? 'ita' : 'it'}">${b.a}</text>`;
}
for (const s of small) {
  g += vessel(s.x, 92, s.v, 'st', 'l');
  g += `<text x="${s.x + 46}" y="${f(Y(s.v) - 12)}" text-anchor="middle" class="num">${s.v}%</text>`;
  g += `<text x="${s.x + 46}" y="${G + 20}" text-anchor="middle" class="sm">${s.a}</text><text x="${s.x + 46}" y="${G + 36}" text-anchor="middle" class="sm">${s.b}</text>` + (s.c ? `<text x="${s.x + 46}" y="${G + 52}" text-anchor="middle" class="sm" style="fill:var(--ink)">${s.c}</text>` : '');
}
// the staff
let staff = `<line x1="76" y1="${TOP}" x2="76" y2="${G}" class="l"/>`;
for (let v = 0; v <= 100; v += 10) staff += `<line x1="${v % 50 === 0 ? 64 : 70}" y1="${f(Y(v))}" x2="76" y2="${f(Y(v))}" class="thin"/>` + (v % 50 === 0 ? `<text x="60" y="${f(Y(v) + 4)}" text-anchor="end" class="sm">${v}</text>` : '');
const body = `
  <rect x="50" y="${G}" width="860" height="7" class="h"/><line x1="50" y1="${G}" x2="910" y2="${G}" class="l"/>
  ${staff}
  ${g}
  <!-- the level without AI, carried across -->
  <line x1="248" y1="${f(Y(67))}" x2="900" y2="${f(Y(67))}" class="sight" style="stroke:var(--ink)"/>
  <text x="483" y="${f(Y(67) - 24)}" text-anchor="middle" class="sm">the level</text>
  <text x="483" y="${f(Y(67) - 8)}" text-anchor="middle" class="sm">without AI</text>
  <text x="104" y="100" class="sc">THE TRIAL: GROUPS ASSIGNED BY CHANCE</text>
  <text x="104" y="120" class="sm">A comprehension quiz, scored out of one hundred.</text>
  <text x="536" y="100" class="sc">THE AI USERS, SORTED BY HABIT</text>
  <text x="536" y="120" class="sm">Observed, not assigned. A pattern, not proof.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Depth is the score, on one staff. 52 mostly junior engineers, in a randomized trial run by researchers at Anthropic, an AI vendor.</text>`;
write(process.argv[2], plate({
  n: 406, roman: 'VI', section: 6, sectionName: 'THE COOK TASTES FROM HIS OWN POT', title: 'Tasting From Your Own Pot',
  caption: 'With AI, engineers scored 50% on comprehension against 67% without. By habit the score ran from 24 to 86.',
  desc: 'Five open vessels stand on one ground line beside a staff marked from zero to one hundred. Each is filled with water, drawn as fine wobbling lines, to a comprehension quiz score. Two wide vessels show the randomized trial: engineers who worked without AI, filled to 67, and engineers who worked with AI, filled in rust to 50. A dashed line carries the level of 67 across the plate. Three narrower vessels sort the AI users by habit: those who generated code and then made sure they understood it stand above that line at 86, those who handed the whole job over at 39, and those who had the AI debug for them at 24. The habit groups were observed, not assigned, with two to four engineers each.',
  style: FLOW_STYLE,
  body,
}));
