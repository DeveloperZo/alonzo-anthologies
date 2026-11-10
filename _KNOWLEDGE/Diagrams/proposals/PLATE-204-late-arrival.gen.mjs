// Generates PLATE-204-late-arrival.svg: a metro platform at night, poster manner.
// Run: node _KNOWLEDGE/Diagrams/proposals/PLATE-204-late-arrival.gen.mjs
import { writeFileSync } from 'node:fs';
// One-point perspective. Vanishing point VP = (570, 455). Focal length F = 520 units.
// World in metres, eye at the origin looking down +Z, X to the right, Y up.
// screen x = 570 + F X / Z, screen y = 455 - F Y / Z.
const VP = [570, 455], F = 520;
const r = (n) => Math.round(n * 10) / 10;
const P = (X, Y, Z) => [r(VP[0] + (F * X) / Z), r(VP[1] - (F * Y) / Z)];
const poly = (pts, cls, extra = '') => `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" class="${cls}"${extra}/>`;
// Station section: platform floor Y = -1.6 (eye 1.6 m up), left wall X = -5.5, platform edge X = 1.5,
// track bed Y = -2.7, right wall X = 5.7, ceiling Y = 3.75, end wall Z = 26. Near plane Z = 3 (outside the picture, clipped).
const FL = -1.6, LW = -5.5, PE = 1.5, TB = -2.7, RW = 5.7, CE = 3.75, ZN = 3, ZF = 26;
const out = [];
const add = (s) => out.push('    ' + s);
// ceiling, walls, track bed (painter order, far planes first)
add('<!-- ceiling, right wall, end wall, track bed: every receding edge runs to VP (570, 455) -->');
add(poly([P(LW, CE, ZF), P(RW, CE, ZF), P(RW, CE, ZN), P(LW, CE, ZN)], 't10'));
add(poly([P(RW, CE, ZF), P(RW, TB, ZF), P(RW, TB, ZN), P(RW, CE, ZN)], 't16'));
add(poly([P(LW, CE, ZF), P(RW, CE, ZF), P(RW, TB, ZF), P(LW, TB, ZF)], 't28'));
// right wall frieze band, Y 0.6 to 1.1
add(poly([P(RW, 1.1, ZF), P(RW, 0.6, ZF), P(RW, 0.6, ZN), P(RW, 1.1, ZN)], 't55'));
// ceiling strip lamps over the platform (X = -2) and over the track (X = 3.6), 2 m long every 3.5 m
for (const X of [-2, 3.6]) for (let z = 11; z < 25; z += 3.5) add(poly([P(X - 0.16, CE, z + 2), P(X + 0.16, CE, z + 2), P(X + 0.16, CE, z), P(X - 0.16, CE, z)], 't80'));
// track bed is the bare night ground: paint it solid
add(poly([P(PE, TB, ZF), P(RW, TB, ZF), P(RW, TB, ZN), P(PE, TB, ZN)], 'night'));
// tunnel portal in the end wall: X 1.9 to 5.3, springing at Y 0.2, crown at Y 1.6
{
  const a = P(1.9, TB, ZF), b = P(1.9, 0.2, ZF), c = P(5.3, 0.2, ZF), d = P(5.3, TB, ZF);
  const rx = r((c[0] - b[0]) / 2), ry = r(P(0, 0.2, ZF)[1] - P(0, 1.6, ZF)[1]);
  add('<!-- tunnel mouth, and the train that has left: rear at Z = 31, lamps at X = 2.7 and 4.5 -->');
  add(`<path d="M ${a} L ${b} A ${rx} ${ry} 0 0 1 ${c} L ${d} Z" class="night"/>`);
  // rails, X = 2.9 and 4.3, 0.09 m wide, running from the near plane to the train at Z = 31
  for (const X of [2.9, 4.3]) add(poly([P(X - 0.045, TB + 0.15, 31), P(X + 0.045, TB + 0.15, 31), P(X + 0.045, TB + 0.15, ZN), P(X - 0.045, TB + 0.15, ZN)], 't55'));
  // everything inside the bore is clipped to the mouth: the near jamb hides the left of the train
  add(`<clipPath id="p204b-mouth"><path d="M ${a} L ${b} A ${rx} ${ry} 0 0 1 ${c} L ${d} Z"/></clipPath>`);
  add('<g clip-path="url(#p204b-mouth)">');
  // far wall of the bore, X = 5.3, from the mouth back to the train, its edges running to VP
  add(poly([P(5.3, 1.6, ZF), d, P(5.3, TB, 31), P(5.3, 1.6, 31)], 't16'));
  // rear of the train, Z = 31
  const zt = 31;
  const t1 = P(2.2, 1.0, zt), t2 = P(5.0, TB + 0.25, zt);
  add(`<rect x="${t1[0]}" y="${t1[1]}" width="${r(t2[0] - t1[0])}" height="${r(t2[1] - t1[1])}" rx="5" class="t10"/>`);
  const w1 = P(2.75, 0.55, zt), w2 = P(4.45, -0.55, zt);
  add(`<rect x="${w1[0]}" y="${w1[1]}" width="${r(w2[0] - w1[0])}" height="${r(w2[1] - w1[1])}" rx="2" class="t16"/>`);
  for (const X of [2.7, 4.5]) {
    const [x, y] = P(X, -1.5, zt);
    add(`<circle cx="${x}" cy="${y}" r="14" class="glow" style="fill-opacity:0.2"/><circle cx="${x}" cy="${y}" r="6" class="glow"/>`);
  }
  add('</g>');
}
// left wall and its poster panels
add('<!-- left wall with poster panels, then the lit platform -->');
add(poly([P(LW, CE, ZF), P(LW, FL, ZF), P(LW, FL, ZN), P(LW, CE, ZN)], 't20'));
for (let z = 4.4; z < 24; z += 3.3) add(poly([P(LW, 0.9, z + 2), P(LW, -0.7, z + 2), P(LW, -0.7, z), P(LW, 0.9, z)], 't45'));
// platform floor, lit
add(poly([P(LW, FL, ZF), P(PE, FL, ZF), P(PE, FL, ZN), P(LW, FL, ZN)], 'lit'));
// safety line, X 0.75 to 1.0
add(poly([P(0.75, FL, ZF), P(1.0, FL, ZF), P(1.0, FL, ZN), P(0.75, FL, ZN)], 'night'));
// way out at the far end of the platform, X -4.2 to -2.8
{
  const a = P(-4.2, 0.7, ZF), b = P(-2.8, FL, ZF);
  add(`<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" class="lit"/>`);
}
// luggage left on the platform: a case standing at Z = 6.6, a holdall beside it
{
  const z = 6.6, s = F / z;
  const [x0, yb] = P(-1.25, FL, z);
  const w = r(0.56 * s), h = r(0.74 * s);
  add('<!-- what the delay leaves behind: a case and a holdall, Z = 6.6 -->');
  add(`<g class="night"><rect x="${x0}" y="${r(yb - h - 3)}" width="${w}" height="${h}" rx="5"/><rect x="${r(x0 + 5)}" y="${r(yb - 5)}" width="6" height="5" rx="2"/><rect x="${r(x0 + w - 11)}" y="${r(yb - 5)}" width="6" height="5" rx="2"/><path d="M ${r(x0 + w * 0.3)} ${r(yb - h - 3)} v -27 h ${r(w * 0.4)} v 27 h -3.4 v -23.4 h ${r(-(w * 0.4 - 6.8))} v 23.4 Z"/></g>`);
  add(`<path d="M ${r(x0 + 9)} ${r(yb - h + 12)} v ${r(h - 28)} M ${r(x0 + w - 9)} ${r(yb - h + 12)} v ${r(h - 28)}" class="seam" style="stroke:var(--p204b-lit);stroke-width:1.6;stroke-opacity:0.5"/>`);
  const [hx, hy] = P(-0.5, FL, z);
  const hw = r(0.72 * s), hh = r(0.34 * s);
  add(`<g class="night"><path d="M ${hx} ${hy} v ${r(-hh * 0.6)} q 0 ${r(-hh * 0.4)} ${r(hw * 0.14)} ${r(-hh * 0.4)} h ${r(hw * 0.72)} q ${r(hw * 0.14)} 0 ${r(hw * 0.14)} ${r(hh * 0.4)} v ${r(hh * 0.6)} Z"/></g>`);
  add(`<path d="M ${r(hx + hw * 0.28)} ${r(hy - hh)} q ${r(hw * 0.22)} ${r(-hh * 0.75)} ${r(hw * 0.44)} 0" class="strap"/>`);
}
// the indicator board, frontal, hung at Z = 5.2 (100 units per metre), 0.35 m deep, so only its underside shows
const BX = 64, BY = 100, BW = 740, BH = 236;
{
  const zb = 5.2, zk = 5.55;
  const Xl = ((BX - VP[0]) * zb) / F, Xr = ((BX + BW - VP[0]) * zb) / F, Yb = ((VP[1] - (BY + BH)) * zb) / F;
  add('<!-- the indicator board: front face at Z = 5.2, underside receding to VP -->');
  for (const X of [-3.5, 0.8]) { const a = P(X, CE, zb); add(`<rect x="${r(a[0] - 2.5)}" y="${a[1]}" width="5" height="${r(BY - a[1])}" class="t55"/>`); }
  add(poly([[BX, BY + BH], [BX + BW, BY + BH], P(Xr, Yb, zk), P(Xl, Yb, zk)], 't45'));
  add(`<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" class="night"/>`);
  add(`<rect x="${BX + 1.25}" y="${BY + 1.25}" width="${BW - 2.5}" height="${BH - 2.5}" class="case"/>`);
}
// flap tiles: 45 cells per row at pitch 15.7, x = 81 + 15.7 i. cells 0 to 28 the service, 31 to 44 its state
const N = 45, X0 = 81, PITCH = (BW - 34) / N, TW = PITCH - 1.7, TH = 26;
const rowsY = { d: [136, 168, 200], a: [262, 294] };
const rows = [
  ['d', 0, 'THE MODEL', 'DEPARTED', false],
  ['d', 1, 'ITS SUCCESSOR', 'DEPARTED', false],
  ['d', 2, 'THE ONE AFTER', 'BOARDING', false],
  ['a', 0, 'REPORT OF HARM FROM THE FIRST', '18 MONTHS LATE', true],
  ['a', 1, "THE REGULATOR'S RESPONSE", 'DELAYED: YEARS', false],
];
add(`<text x="${X0}" y="125" class="bh">DEPARTURES</text>`);
add(`<text x="${X0}" y="251" class="bh">ARRIVALS</text>`);
for (const [grp, i, name, state, late] of rows) {
  const y = rowsY[grp][i];
  let tiles = '';
  for (let c = 0; c < N; c++) tiles += `<rect x="${r(X0 + c * PITCH)}" y="${y}" width="${r(TW)}" height="${TH}" rx="1.5"/>`;
  add(`<g class="${late ? 'glow' : 'tile'}">${tiles}</g>`);
  add(`<line x1="${X0}" y1="${y + 13}" x2="${r(X0 + N * PITCH - 1.7)}" y2="${y + 13}" class="seam"${late ? ' style="stroke-opacity:0.3"' : ''}/>`);
  const xs = (str, c0) => [...str].map((_, k) => r(X0 + (c0 + k) * PITCH + TW / 2)).join(' ');
  const cls = late ? 'flap late' : 'flap';
  add(`<text x="${xs(name, 0)}" y="${y + 19.2}" class="${cls}">${name}</text>`);
  add(`<text x="${xs(state, 31)}" y="${y + 19.2}" class="${cls}">${state}</text>`);
}
const scene = out.join('\n');
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p204b-t p204b-d">
  <title id="p204b-t">DIA-204 · The late arrival</title>
  <desc id="p204b-d">A metro platform at night, drawn as a transport poster in flat shapes and one-point perspective. A large split-flap indicator board hangs over the platform. Under DEPARTURES it lists THE MODEL, departed; ITS SUCCESSOR, departed; THE ONE AFTER, boarding. Under ARRIVALS it lists REPORT OF HARM FROM THE FIRST, 18 months late, picked out in rust; and THE REGULATOR'S RESPONSE, delayed: years. Down the tunnel the two red tail lamps of the train that has just left are receding. On the empty lit platform stand a suitcase and a holdall.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; --p204b-night: #2A2A35; --p204b-lit: #F2EEE3; --p204b-glow: #D29183; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; --p204b-night: #1E2128; --p204b-lit: #E8E5DC; --p204b-glow: #D29183; } }
      /* The picture is a night scene in both schemes: its ground is always the dark of the pair and its lights the pale one, so dark mode does not turn it into a negative. Rust inside the picture is the on-dark rust in both. */
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .night { fill: var(--p204b-night); }
      .lit { fill: var(--p204b-lit); }
      .t10 { fill: var(--p204b-lit); fill-opacity: 0.10; }
      .t16 { fill: var(--p204b-lit); fill-opacity: 0.16; }
      .t20 { fill: var(--p204b-lit); fill-opacity: 0.20; }
      .t28 { fill: var(--p204b-lit); fill-opacity: 0.28; }
      .t45 { fill: var(--p204b-lit); fill-opacity: 0.45; }
      .t55 { fill: var(--p204b-lit); fill-opacity: 0.55; }
      .t80 { fill: var(--p204b-lit); fill-opacity: 0.80; }
      .tile { fill: var(--p204b-lit); fill-opacity: 0.13; }
      .glow { fill: var(--p204b-glow); }
      .case { fill: none; stroke: var(--p204b-lit); stroke-width: 2.5; }
      .seam { fill: none; stroke: var(--p204b-night); stroke-width: 1; }
      .strap { fill: none; stroke: var(--p204b-night); stroke-width: 3.2; stroke-linecap: round; }
      .edge { fill: none; stroke: var(--ink); stroke-width: 1.4; }
      .flap { font-size: 17.5px; font-weight: 600; text-anchor: middle; fill: var(--p204b-lit); }
      .late { fill: var(--p204b-night); }
      .bh { font-size: 11.5px; font-weight: 600; letter-spacing: 0.3em; fill: var(--p204b-lit); fill-opacity: 0.8; }
      .note { font-size: 14.5px; font-style: italic; fill: var(--p204b-glow); }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <clipPath id="p204b-clip"><rect x="40" y="66" width="880" height="530"/></clipPath>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE IV</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · DELAYS, BRAKES, AND ENGINE SPEED</text>
  <rect x="40" y="66" width="880" height="530" class="night"/>
  <g clip-path="url(#p204b-clip)">
${scene}
    <text x="702" y="487" class="note">the train the report is about</text>
  </g>
  <rect x="40" y="66" width="880" height="530" class="edge"/>
  <text x="480" y="645" text-anchor="middle" class="title">The Late Arrival</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-204 · The report of harm pulls in two trains after the one that caused it.</text>
</svg>
`;
if (/\n\s*\n/.test(svg.trim())) throw new Error('blank line in svg');
if (/[—§]/.test(svg)) throw new Error('banned character');
writeFileSync(new URL('./PLATE-204-late-arrival.svg', import.meta.url), svg);
console.log('wrote PLATE-204-late-arrival.svg');
