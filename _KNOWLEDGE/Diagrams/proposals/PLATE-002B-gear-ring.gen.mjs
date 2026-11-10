// Generates PLATE-002B-gear-ring.svg
import fs from 'node:fs';
const out = 'C:/Repos/alonzo-anthologies/_KNOWLEDGE/Diagrams/proposals/PLATE-002B-gear-ring.svg';
const f = (n) => (Math.round(n * 100) / 100).toString();
const rad = (d) => d * Math.PI / 180;
const P = (cx, cy, r, a) => `${f(cx + r * Math.cos(rad(a)))} ${f(cy + r * Math.sin(rad(a)))}`;
const M = 10;                        // module: pitch radius = M * teeth / 2
const CX = 480, CY = 316, G = 578;
const rS = M * 16 / 2, rB = M * 24 / 2;   // 76 and 114
const HD = (rS + rB) / Math.SQRT2;        // half diagonal of the square of centres
const gears = {
  A: { x: CX - HD, y: CY, n: 24, r: rB, t0: -45, spokes: 6, s0: 12 },
  B: { x: CX, y: CY - HD, n: 16, r: rS, t0: 135 + 11.25, spokes: 4, s0: 30 },
  C: { x: CX + HD, y: CY, n: 24, r: rB, t0: 135, spokes: 6, s0: 40 },
  D: { x: CX, y: CY + HD, n: 16, r: rS, t0: 225 + 11.25, spokes: 4, s0: 68 },
};
function toothPath(g, k) {
  const p = 360 / g.n, a = g.t0 + k * p;
  const rr = g.r - 1.25 * M, ra = g.r + 0.95 * M;
  return `M ${P(g.x, g.y, rr, a - 0.28 * p)} L ${P(g.x, g.y, g.r, a - 0.2 * p)} L ${P(g.x, g.y, ra, a - 0.095 * p)} A ${f(ra)} ${f(ra)} 0 0 1 ${P(g.x, g.y, ra, a + 0.095 * p)} L ${P(g.x, g.y, g.r, a + 0.2 * p)} L ${P(g.x, g.y, rr, a + 0.28 * p)}`;
}
function gear(g) {
  const p = 360 / g.n, rr = g.r - 1.25 * M, ra = g.r + 0.95 * M;
  let d = '';
  for (let k = 0; k < g.n; k++) {
    const a = g.t0 + k * p;
    d += (k === 0 ? `M ${P(g.x, g.y, rr, a - 0.28 * p)} ` : `A ${f(rr)} ${f(rr)} 0 0 1 ${P(g.x, g.y, rr, a - 0.28 * p)} `);
    d += `L ${P(g.x, g.y, g.r, a - 0.2 * p)} L ${P(g.x, g.y, ra, a - 0.095 * p)} A ${f(ra)} ${f(ra)} 0 0 1 ${P(g.x, g.y, ra, a + 0.095 * p)} L ${P(g.x, g.y, g.r, a + 0.2 * p)} L ${P(g.x, g.y, rr, a + 0.28 * p)} `;
  }
  d += `A ${f(rr)} ${f(rr)} 0 0 1 ${P(g.x, g.y, rr, g.t0 - 0.28 * p)} Z `;
  // windows between spokes
  const ri = rr - 13, rh = g.r * 0.27, w = g.r * 0.085;
  const sp = 360 / g.spokes;
  const a1 = Math.asin(w / (rh + 5)) * 180 / Math.PI, a2 = Math.asin(w / ri) * 180 / Math.PI;
  let win = '';
  for (let k = 0; k < g.spokes; k++) {
    const s = g.s0 + k * sp, e = s + sp;
    win += `M ${P(g.x, g.y, rh + 5, s + a1)} L ${P(g.x, g.y, ri, s + a2)} A ${f(ri)} ${f(ri)} 0 0 1 ${P(g.x, g.y, ri, e - a2)} L ${P(g.x, g.y, rh + 5, e - a1)} A ${f(rh + 5)} ${f(rh + 5)} 0 0 0 ${P(g.x, g.y, rh + 5, s + a1)} Z `;
  }
  const shadow = `<path d="${d}${win.trim()}" class="sh" fill-rule="evenodd" transform="translate(3.2 4.2)"/>`;
  let s = `<path d="${d}${win.trim()}" class="b" fill-rule="evenodd"/>`;
  // rim shadow: lower right, between ri and rr - 2
  const ro = rr - 2.5;
  s += `<path d="M ${P(g.x, g.y, ro, -25)} A ${f(ro)} ${f(ro)} 0 0 1 ${P(g.x, g.y, ro, 115)} L ${P(g.x, g.y, ri, 115)} A ${f(ri)} ${f(ri)} 0 0 0 ${P(g.x, g.y, ri, -25)} Z" class="h"/>`;
  s += `<circle cx="${f(g.x)}" cy="${f(g.y)}" r="${f(ro)}" class="thin"/>`;
  // hub
  s += `<circle cx="${f(g.x)}" cy="${f(g.y)}" r="${f(rh + 5)}" class="b"/>`;
  s += `<path d="M ${P(g.x, g.y, rh + 5, -25)} A ${f(rh + 5)} ${f(rh + 5)} 0 0 1 ${P(g.x, g.y, rh + 5, 115)} L ${P(g.x, g.y, rh - 1, 115)} A ${f(rh - 1)} ${f(rh - 1)} 0 0 0 ${P(g.x, g.y, rh - 1, -25)} Z" class="h"/>`;
  s += `<circle cx="${f(g.x)}" cy="${f(g.y)}" r="${f(rh - 1)}" class="thin"/>`;
  const rs = g.r * 0.115;
  s += `<circle cx="${f(g.x)}" cy="${f(g.y)}" r="${f(rs)}" class="b"/>`;
  s += `<rect x="${f(g.x - rs * 0.32)}" y="${f(g.y - rs - rs * 0.45)}" width="${f(rs * 0.64)}" height="${f(rs * 0.9)}" class="b" style="stroke-width:1"/>`;
  s += `<circle cx="${f(g.x)}" cy="${f(g.y)}" r="1.4" style="fill:var(--ink)"/>`;
  return { shadow, body: s };
}
// direction arrow: an arc outside the teeth with an open head
function arrow(g, mid, cw) {
  const r = g.r + M + 13, span = 46;
  const a0 = mid - span / 2, a1 = mid + span / 2;
  const tip = cw ? a1 : a0;
  const dir = cw ? 1 : -1;
  const tx = g.x + r * Math.cos(rad(tip)), ty = g.y + r * Math.sin(rad(tip));
  // tangent at tip (direction of travel)
  const tg = tip + 90 * dir;
  const h1 = `${f(tx - 9 * Math.cos(rad(tg - 24)))} ${f(ty - 9 * Math.sin(rad(tg - 24)))}`;
  const h2 = `${f(tx - 9 * Math.cos(rad(tg + 24)))} ${f(ty - 9 * Math.sin(rad(tg + 24)))}`;
  return `<path d="M ${P(g.x, g.y, r, a0)} A ${f(r)} ${f(r)} 0 0 1 ${P(g.x, g.y, r, a1)} M ${h1} L ${f(tx)} ${f(ty)} L ${h2}" class="arr"/>`;
}
const { A, B, C, D } = gears;
const GA = gear(A), GB = gear(B), GC = gear(C), GD = gear(D);
const bar = (g1, g2) => `<line x1="${f(g1.x)}" y1="${f(g1.y)}" x2="${f(g2.x)}" y2="${f(g2.y)}" class="bar-o"/>`;
const bari = (g1, g2) => `<line x1="${f(g1.x)}" y1="${f(g1.y)}" x2="${f(g2.x)}" y2="${f(g2.y)}" class="bar-i"/><line x1="${f(g1.x)}" y1="${f(g1.y)}" x2="${f(g2.x)}" y2="${f(g2.y)}" class="bar-h"/>`;
const frame = [bar(A, B), bar(B, C), bar(C, D), bar(D, A)].join('') + [bari(A, B), bari(B, C), bari(C, D), bari(D, A)].join('');
// the rust tooth: gear C's tooth seated in gear D (direction 135 degrees from C)
const kC = Math.round((135 - C.t0) / 15);
const rust = `<path d="${toothPath(C, kC)} Z" class="rt"/>`;
const mesh = { x: D.x + rS * Math.cos(rad(-45)), y: D.y + rS * Math.sin(rad(-45)) };
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p2b-t p2b-d">
  <title id="p2b-t">DIA-002B · No wheel stops alone</title>
  <desc id="p2b-d">An engraved plate of four toothed wheels on an iron frame, meshed in a closed ring: two large wheels left and right, two small wheels above and below. They are labelled labs, investors, hyperscalers and neoclouds. Arrows show each wheel turning against its neighbours, so each is driven by one and drives the next. One tooth, seated between two teeth of the next wheel, is drawn in rust. A wheel that stops takes the force of the other three on its teeth.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .h { fill: url(#p2b-h); stroke: none; }
      .hb { fill: url(#p2b-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .bar-o { stroke: var(--ink); stroke-width: 25; stroke-linecap: round; }
      .bar-i { stroke: var(--paper); stroke-width: 22.2; stroke-linecap: round; }
      .bar-h { stroke: url(#p2b-h); stroke-width: 22.2; stroke-linecap: round; }
      .sh { fill: var(--ink); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .arr { fill: none; stroke: var(--ink); stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
      .rt { fill: var(--accent); stroke: var(--accent); stroke-width: 1.4; stroke-linejoin: round; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .nm { font-size: 13px; letter-spacing: 0.16em; }
      .it { font-size: 13.5px; font-style: italic; }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p2b-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE II</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 2 · WHY IT'S MOVING SO FAST</text>
  <!-- wheels: module 10. Large 24 teeth, pitch radius 120. Small 16 teeth, pitch radius 80. Centres on a square of side 200, turned 45 degrees about (480, 316). Teeth are phased so every mesh seats a tooth in a gap -->
  <g>${GA.shadow}${GC.shadow}${GB.shadow}${GD.shadow}</g>
  ${GA.body}
  ${GC.body}
  ${GB.body}
  ${GD.body}
  ${rust}
  <!-- direction of turning: neighbours turn opposite ways -->
  ${arrow(A, 180, true)}${arrow(B, 270, false)}${arrow(C, 0, true)}${arrow(D, 90, false)}
  <!-- names -->
  <text x="122" y="214" text-anchor="middle" class="nm">LABS</text>
  <path d="M 122 222 q 10 14 98 16" class="thin"/>
  <text x="332" y="100" text-anchor="end" class="nm">INVESTORS</text>
  <path d="M 340 96 q 38 2 62 26" class="thin"/>
  <text x="838" y="214" text-anchor="middle" class="nm">HYPERSCALERS</text>
  <path d="M 838 222 q -10 14 -98 16" class="thin"/>
  <text x="332" y="542" text-anchor="end" class="nm">NEOCLOUDS</text>
  <path d="M 340 538 q 38 -2 60 -28" class="thin"/>
  <!-- notes -->
  <text x="60" y="462" class="it">Each wheel is turned by one neighbour</text>
  <text x="60" y="480" class="it">and turns the next.</text>
  <text x="900" y="462" text-anchor="end" class="it" style="fill:var(--accent);font-size:14.5px">Stop one wheel, and its teeth</text>
  <text x="900" y="481" text-anchor="end" class="it" style="fill:var(--accent);font-size:14.5px">take the force of the other three.</text>
  <path d="M 688 470 Q 608 474 576 445 L 551 414" class="la"/>
  <!-- title and caption -->
  <text x="480" y="634" text-anchor="middle" class="title">No Wheel Stops Alone</text>
  <line x1="300" y1="656" x2="660" y2="656" class="thin"/>
  <text x="480" y="679" text-anchor="middle" class="cap">DIA-002B · The firms that invest in and sell to one another, drawn as a closed train of gears. Whichever slows first pays first.</text>
</svg>
`;
if (/\n\s*\n/.test(svg)) throw new Error('blank line');
fs.writeFileSync(out, svg);
console.log('ok', svg.length);
