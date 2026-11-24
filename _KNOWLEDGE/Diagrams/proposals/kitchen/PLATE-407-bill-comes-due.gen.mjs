// Generates PLATE-407-bill-comes-due.svg. Usage: node PLATE-407-bill-comes-due.gen.mjs <out.svg>
// Manner: a ledger exhibit. Two till receipts hung from one rail, printed at one line per dollar, and the plate each paid for.
// Figures (section 7, source 19, Jellyfish, vendor data at list prices): AI spend per weekly active user $37 in March 2026
// and $115 in August 2026. Work mix: new features 57% then 56%, maintenance 25% then 24%.
// Source 18 (LeadDev): 18% of organizations say they measure AI's impact.
// Scale: one printed line = $1 = 3.5 units.
import { plate, write, f } from './frame.mjs';
const A = { full: true, usd: 37, feat: 57, maint: 25, x: 150, when: 'March 2026' };
const B = { usd: 115, feat: 56, maint: 24, x: 440, when: 'August 2026' };
const U = 3.5, RY = 92, W = 110;
function receipt(r, accent) {
  const h = r.usd * U + 16, y1 = RY + 6 + h;
  let teeth = '';
  for (let k = 0; k < 10; k++) teeth += ` l ${-W / 20} ${k % 1 === 0 ? 5 : 5} l ${-W / 20} -5`;
  let lines = '';
  for (let i = 0; i < r.usd; i++) { const y = RY + 16 + i * U; lines += `M ${r.x + 10} ${f(y)} h ${i % 5 === 4 ? 52 : 44} M ${r.x + W - 30} ${f(y)} h 20 `; }
  return `<path d="M ${r.x + 7} ${RY + 13} V ${f(y1 + 7)} h ${W} V ${RY + 13} Z" class="h"/>` +
    `<path d="M ${r.x} ${RY + 6} H ${r.x + W} V ${f(y1)}${teeth} Z" class="b"/>` +
    `<path d="${lines.trim()}" class="thin" style="stroke-width:0.55"/>` +
    `<rect x="${r.x + W / 2 - 9}" y="${RY - 6}" width="18" height="20" class="hb"/>`;
}
// a plate seen from above, the food divided by the mix of work
function mix(r, cx, cy) {
  const R = 70, Rin = 52;
  const pt = (pct, rad) => { const a = pct / 100 * 2 * Math.PI; return [cx + rad * Math.sin(a), cy - rad * Math.cos(a)]; };
  const wedge = (p0, p1) => { const [x0, y0] = pt(p0, Rin), [x1, y1] = pt(p1, Rin); return `M ${cx} ${cy} L ${f(x0)} ${f(y0)} A ${Rin} ${Rin} 0 ${p1 - p0 > 50 ? 1 : 0} 1 ${f(x1)} ${f(y1)} Z`; };
  const m1 = r.feat, m2 = r.feat + r.maint;
  const lab = (t, short) => (r.full ? t + ' ' : '') + short;
  return `<circle cx="${cx + 5}" cy="${cy + 6}" r="${R}" class="h"/><circle cx="${cx}" cy="${cy}" r="${R}" class="b"/><circle cx="${cx}" cy="${cy}" r="${Rin + 6}" class="thin"/>` +
    `<path d="${wedge(0, m1)}" class="hb" style="stroke-width:1"/><path d="${wedge(m1, m2)}" class="ink" style="opacity:0.82"/><path d="${wedge(m2, 100)}" class="b" style="stroke-width:1"/>` +
    `<text x="${cx + R + 14}" y="${cy + 22}" class="sm">${lab('new features', r.feat + '%')}</text>` +
    `<text x="${cx - R - 12}" y="${cy + 44}" text-anchor="end" class="sm">${lab('maintenance', r.maint + '%')}</text>` +
    `<text x="${cx - R - 8}" y="${cy - 40}" text-anchor="end" class="sm">${lab('the rest', (100 - r.feat - r.maint) + '%')}</text>`;
}
const endB = RY + 6 + B.usd * U + 16, endA = RY + 6 + A.usd * U + 16;
const body = `
  <line x1="46" y1="${RY}" x2="914" y2="${RY}" class="l" style="stroke-width:2.4"/>
  ${receipt(A)}
  ${receipt(B)}
  <!-- where the first bill ended, carried across to the second -->
  <line x1="${A.x + W}" y1="${f(endA)}" x2="${B.x - 6}" y2="${f(endA)}" class="sight"/>
  <path d="M ${B.x + W + 12} ${f(endA)} V ${f(endB)} M ${B.x + W + 6} ${f(endA)} h 12 M ${B.x + W + 6} ${f(endB)} h 12" class="la" style="stroke-width:1.3"/>
  <!-- the plates -->
  ${mix(A, 236, 430)}
  ${mix(B, 770, 430)}
  <!-- notes -->
  <text x="${A.x + W + 16}" y="${RY + 34}" class="it">${A.when}</text>
  <text x="${A.x + W + 16}" y="${RY + 64}" class="big">$${A.usd}</text>
  <text x="${B.x + W + 30}" y="${RY + 34}" class="ita">${B.when}</text>
  <text x="${B.x + W + 30}" y="${RY + 64}" class="biga">$${B.usd}</text>
  <text x="${B.x + W + 30}" y="${RY + 86}" class="ita">about three times the bill,</text>
  <text x="${B.x + W + 30}" y="${RY + 104}" class="ita">five months on</text>
  <text x="${A.x + W + 16}" y="${RY + 84}" class="sm">AI spend per weekly</text>
  <text x="${A.x + W + 16}" y="${RY + 100}" class="sm">active user</text>
  <text x="236" y="548" text-anchor="middle" class="it">what it bought, in March</text>
  <text x="770" y="548" text-anchor="middle" class="it">what it bought, in August</text>
  <text x="480" y="584" text-anchor="middle" class="sm">One printed line is one dollar. The plates show the mix of work, not how much of it. In one survey, 18% of organizations measure the impact at all.</text>`;
const svg = plate({
  n: 407, roman: 'VII', section: 7, sectionName: 'THE CARD AND THE INVOICE',
  title: 'The Bill Comes Due',
  caption: 'AI spend per weekly active user tripled in five months, $37 to $115, while the mix of work stayed where it was.',
  desc: 'Two till receipts hang from one rail, each printed at one line per dollar. The March 2026 receipt is 37 lines long. The August 2026 receipt is 115 lines long, about three times the length, and a rust bracket marks the extra. Below each receipt is the plate it paid for, seen from above and divided by the mix of work: 57 percent new features and 25 percent maintenance in March, 56 percent and 24 percent in August. The two plates look the same. A note says the plates show the mix of work and not its volume, and that in one survey 18 percent of organizations measure the impact of AI at all. Vendor data at list prices.',
  body,
});
write(process.argv[2], svg);
