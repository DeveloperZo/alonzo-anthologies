// Generates INFO-407-bill-comes-due.svg. Usage: node INFO-407-bill-comes-due.gen.mjs <out.svg>
// Form: areas to scale. Two squares whose areas are the two bills, beside two strips of the work they bought.
// Scale: square side = 22 * sqrt(dollars), so area is proportional to spend. Strips: 3.7 units = 1 percent.
// Source 19, Jellyfish: 37 to 115 dollars per weekly active user, March to August 2026; new features 57% then 56%,
// maintenance 25% then 24%. Source 18, LeadDev: 18% of organizations measure AI's impact.
import { plate, write, f } from './frame.mjs';
const A = { usd: 37, feat: 57, maint: 25, when: 'March 2026' }, B = { usd: 115, feat: 56, maint: 24, when: 'August 2026' };
const K = 22, GY = 372;
const sa = K * Math.sqrt(A.usd), sb = K * Math.sqrt(B.usd);     // 133.8 and 235.9
const ax = 70, bx = ax + sa + 22;
const SX = 520, SU = 3.7, SH = 40;
const strip = (r, y) => {
  const w1 = r.feat * SU, w2 = r.maint * SU, w3 = (100 - r.feat - r.maint) * SU;
  return `<rect x="${SX}" y="${y}" width="${f(w1)}" height="${SH}" class="hb"/><rect x="${f(SX + w1)}" y="${y}" width="${f(w2)}" height="${SH}" class="ink"/><rect x="${f(SX + w1 + w2)}" y="${y}" width="${f(w3)}" height="${SH}" class="b"/>` +
    `<text x="${f(SX + w1 / 2)}" y="${y + SH + 20}" text-anchor="middle" class="it">${r.feat}%</text><text x="${f(SX + w1 + w2 / 2)}" y="${y + SH + 20}" text-anchor="middle" class="it">${r.maint}%</text>` +
    `<text x="${SX}" y="${y - 9}" class="sm">${r.when}</text>`;
};
// who checks: one hundred marks, eighteen filled
let marks = '';
for (let i = 0; i < 100; i++) { const x = 70 + (i % 50) * 16.6, y = 478 + Math.floor(i / 50) * 22; marks += `<circle cx="${f(x + 6)}" cy="${y}" r="6" class="${i < 18 ? 'ink' : 'off'}"/>`; }
const body = `
  <text x="70" y="104" class="sc">THE BILL: AI SPEND PER WEEKLY ACTIVE USER</text>
  <rect x="${ax}" y="${f(GY - sa)}" width="${f(sa)}" height="${f(sa)}" class="hb"/>
  <rect x="${f(bx)}" y="${f(GY - sb)}" width="${f(sb)}" height="${f(sb)}" class="fa"/>
  <rect x="${f(ax + sa / 2 - 44)}" y="${f(GY - sa / 2 - 26)}" width="88" height="40" class="paper"/>
  <text x="${f(ax + sa / 2)}" y="${f(GY - sa / 2 + 6)}" text-anchor="middle" class="huge">&#36;${A.usd}</text>
  <text x="${f(bx + sb / 2)}" y="${f(GY - sb / 2 + 22)}" text-anchor="middle" class="hugep">&#36;${B.usd}</text>
  <text x="${ax}" y="${GY + 22}" class="it">${A.when}</text>
  <text x="${f(bx)}" y="${GY + 22}" class="ita">${B.when}: about three times the bill</text>
  <text x="${SX}" y="104" class="sc">WHAT IT BOUGHT: SHARE OF THE WORK</text>
  ${strip(A, 148)}
  ${strip(B, 262)}
  <text x="${f(SX + A.feat * SU / 2)}" y="346" text-anchor="middle" class="sm">new features</text>
  <text x="${f(SX + B.feat * SU + B.maint * SU / 2)}" y="346" text-anchor="middle" class="sm">maintenance</text>
  <text x="${f(SX + (B.feat + B.maint) * SU + (100 - B.feat - B.maint) * SU / 2)}" y="346" text-anchor="middle" class="sm">the rest</text>
  <text x="${SX}" y="${GY + 22}" class="it">The mix of work did not move.</text>
  <text x="70" y="452" class="sc">WHO CHECKS: OF EVERY HUNDRED ORGANIZATIONS, THOSE THAT MEASURE THE IMPACT</text>
  ${marks}
  <text x="902" y="544" text-anchor="end" class="num">18 in 100</text>
  <text x="70" y="544" class="sm">The squares are drawn so that area is spend. The strips show the mix of work, not how much of it.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Spend and mix: one vendor's data at list prices. Who checks: a survey of 883 engineering leaders, self-reported.</text>`;
write(process.argv[2], plate({
  n: 407, roman: 'VII', section: 7, sectionName: 'THE CARD AND THE INVOICE', title: 'The Bill Comes Due',
  caption: 'AI spend per weekly active user tripled in five months while the mix of work stayed where it was.',
  desc: 'Two squares drawn so that their areas are two bills for AI spend per weekly active user: 37 dollars in March 2026, and 115 dollars in August 2026 in rust, about three times the area. Beside them, two strips of the same length show the share of the work each bill bought: new features 57 percent then 56 percent, maintenance 25 percent then 24 percent, and the rest. The two strips look the same. Below, one hundred marks stand for one hundred organizations, and eighteen are filled: the share that measures the impact of AI. Vendor data at list prices, and a self-reported survey.',
  style: `.huge { font-size: 34px; } .hugep { font-size: 64px; fill: var(--paper); } .num { font-size: 26px; } .off { fill: none; stroke: var(--soft); stroke-width: 0.8; }`,
  body,
}));
