// Generates PLATE-203-volume-knob.svg. Run: node PLATE-203-volume-knob.gen.mjs
// The front of a valve wireless set, cropped close. A small volume knob that
// has just been turned down, a large tuning dial held by a wire-and-lead seal,
// and a speaker grille that keeps playing.
import fs from 'node:fs';

const f = (n) => n.toFixed(1);
const rad = (deg) => deg * Math.PI / 180;
// angles are degrees clockwise from +x (screen sense)
const pt = (deg, r, c) => ({ x: c.x + r * Math.cos(rad(deg)), y: c.y + r * Math.sin(rad(deg)) });
const P = (p) => `${f(p.x)} ${f(p.y)}`;

// ---- the tuning dial ----
const C = { x: 650, y: 296 };                 // dial centre
const RB = 184, RF = 168, RS = 154;           // bezel outer, face, scale baseline
// scale: 240 degree sweep over the top, tick k of 60 at 150 + 4 k degrees
let ticks = '';
for (let k = 0; k <= 60; k++) {
  const a = 150 + 4 * k, len = k % 10 === 0 ? 24 : k % 5 === 0 ? 17 : 10;
  const p0 = pt(a, RS, C), p1 = pt(a, RS - len, C);
  ticks += `<line x1="${f(p0.x)}" y1="${f(p0.y)}" x2="${f(p1.x)}" y2="${f(p1.y)}"${k % 10 === 0 ? ' style="stroke-width:2.2"' : ''}/>`;
}
// bezel screws at 45 + 90 i degrees, on the middle of the bezel ring
let screws = '';
for (let i = 0; i < 4; i++) {
  const a = 45 + 90 * i, s = pt(a, (RB + RF) / 2, C);
  screws += `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="5" class="b" style="stroke-width:1.1"/><line x1="${f(s.x - 3.2)}" y1="${f(s.y + 2.2)}" x2="${f(s.x + 3.2)}" y2="${f(s.y - 2.2)}" class="l" style="stroke-width:1.2"/>`;
}
const NA = 285;                               // where the pointer was set
const KS = 62, KB = 52;                       // tuning knob: skirt and body radii
const BL = 50, BW = 15;                       // grip bar: half length, half width
// the seal wire runs square to the grip bar, through a hole drilled across it,
// between two staples on the cabinet at radius RB + 15
const WA = NA - 90, RW = RB + 15;
const A = pt(WA, RW, C), B = pt(WA + 180, RW, C);
const inP = pt(WA, BW, C), outP = pt(WA + 180, BW, C);
const S = { x: B.x + 7, y: B.y + 72 };        // the lead seal, hanging from staple B
// two strands twisted together: offset = +/- 2.3 sin(2 pi s / 11) across the run
const twist = (p, q) => {
  const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const strand = (sign) => {
    let d = '';
    for (let s = 0; s <= L; s += 1.1) {
      const o = sign * 2.3 * Math.sin(2 * Math.PI * s / 11);
      d += `${s === 0 ? 'M' : 'L'} ${f(p.x + ux * s - uy * o)} ${f(p.y + uy * s + ux * o)} `;
    }
    return d.trim();
  };
  return { a: strand(1), b: strand(-1), line: `M ${P(p)} L ${P(q)}` };
};
const runs = [twist(A, inP), twist(outP, B), twist(B, { x: S.x, y: S.y - 17 })];
const wireHalo = runs.map((r) => `<path d="${r.line}" class="halo"/>`).join('');
const wire = runs.map((r) => `<path d="${r.a}" class="al" style="stroke-width:1.8"/><path d="${r.b}" class="al" style="stroke-width:1.8"/>`).join('');
const staple = (p) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="9.5" class="b"/><circle cx="${f(p.x)}" cy="${f(p.y)}" r="5" class="l" style="stroke-width:2.6"/>`;

// ---- the volume knob ----
const V = { x: 152, y: 462 };
const VS = 50, VB = 41;                       // skirt and body radii
// printed scale: dot k of 9 at 150 + 30 k degrees, radius 1.1 + 0.42 k (louder clockwise)
let dots = '';
for (let k = 0; k <= 8; k++) {
  const d = pt(150 + 30 * k, 64, V);
  dots += `<circle cx="${f(d.x)}" cy="${f(d.y)}" r="${(1.1 + 0.42 * k).toFixed(2)}"/>`;
}
const VNOW = 180, VOLD = 324;                 // where it points now, where it pointed
// fresh pencil ticks at each setting it was left at on the way down: 324 - 48 i degrees
let fresh = '';
for (let i = 0; i < 3; i++) {
  const a = VOLD - 48 * i, p0 = pt(a - 1.5, 73, V), p1 = pt(a + 1.5, 86, V);
  fresh += `<line x1="${f(p0.x)}" y1="${f(p0.y)}" x2="${f(p1.x)}" y2="${f(p1.y)}"/>`;
}
// the turn: an arc at radius 96, anticlockwise from the old setting to the new
const RT = 96, t0 = pt(VOLD, RT, V), t1 = pt(VNOW + 6, RT, V);
const tdir = VNOW + 6 - 90;                   // direction of travel at the arrow tip
const h1 = pt(tdir + 180 - 24, 11, t1), h2 = pt(tdir + 180 + 24, 11, t1);
const vnow0 = pt(VNOW, 13, V), vnow1 = pt(VNOW, VB - 3, V);
const vold0 = pt(VOLD, 13, V), vold1 = pt(VOLD, VB - 3, V);

// ---- the grille ----
// slat i of 7 at y = 124 + 32 i, 13 deep
let slats = '';
for (let i = 0; i < 7; i++) {
  const y = 124 + 32 * i;
  slats += `<rect x="30" y="${y}" width="266" height="13" class="b"/><rect x="30" y="${y + 13}" width="266" height="4" class="ink" style="opacity:0.55"/>`;
}
// sound: arc j of 3 centred on the grille edge, radius 36 + 19 j, spanning 60 degrees
const G = { x: 296, y: 232 };
let sound = '';
for (let j = 0; j < 3; j++) {
  const r = 36 + 19 * j, p0 = pt(-30, r, G), p1 = pt(30, r, G);
  sound += `<path d="M ${P(p0)} A ${r} ${r} 0 0 1 ${P(p1)}"/>`;
}

// ---- wood grain on the cabinet front ----
// line i of 20 at y = 102 + 22 i, wavering by 1.4 sin(x / 41 + i), drawn only
// where it stays clear of every part and every note by the margins below
const clearOf = (x, y) => {
  if (Math.hypot(x - C.x, y - C.y) < RB + 34) return false;      // dial, shadow, staples
  if (Math.hypot(x - V.x, y - V.y) < RT + 16) return false;       // volume knob and its arrow
  if (x < 396 && y < 376) return false;                           // grille and sound
  const boxes = [[310, 150, 480, 182], [244, 412, 480, 520], [690, 474, 930, 526], [826, 330, 884, 480]];
  return !boxes.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1);
};
let grain = '';
for (let i = 0; i < 20; i++) {
  const y0 = 102 + 22 * i;
  let run = [];
  const flush = () => { if (run.length > 12) grain += `<path d="M ${run.join(' L ')}"/>`; run = []; };
  for (let x = 30; x <= 930; x += 4) {
    const y = y0 + 1.4 * Math.sin(x / 41 + i);
    if (clearOf(x, y0)) run.push(`${x} ${f(y)}`); else flush();
  }
  flush();
}

const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p203-t p203-d">
  <title id="p203-t">DIA-203 · The volume knob</title>
  <desc id="p203-d">An engraved plate of the front of an old valve wireless set, cropped close. On the left a slatted speaker grille gives out sound. Below it is a small volume knob with fresh pencil ticks and an arrow showing it has just been turned down. It stands for content filters, rate limits, thresholds and usage caps. On the right is a large tuning dial whose pointer is held in place by a twisted wire run through its knob and closed with a lead seal. It stands for incentives, goals and competition. The same station plays.</desc>
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
      .h { fill: url(#p203-h); stroke: none; }
      .hb { fill: url(#p203-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .ab { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
      .al { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-linecap: round; }
      .af { fill: var(--accent); stroke: var(--accent); stroke-width: 1.5; }
      .ps { fill: none; stroke: var(--paper); stroke-width: 1.2; stroke-linecap: round; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
      .x { fill: url(#p203-x); stroke: none; }
      .halo { fill: none; stroke: var(--paper); stroke-width: 10; stroke-linecap: butt; }
      .knurl { fill: none; stroke: var(--ink); stroke-dasharray: 2 2.6; }
      .ghost { fill: none; stroke: var(--ink); stroke-width: 2.2; stroke-dasharray: 3.5 4; stroke-linecap: round; opacity: 0.8; }
      .pencil { fill: none; stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; }
    </style>
    <pattern id="p203-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <!-- grille cloth: the same hatch laid both ways -->
    <pattern id="p203-x" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/><line x1="0" y1="0" x2="4.5" y2="0" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE III</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · CONSTANTS, BUFFERS, AND INFRASTRUCTURE</text>
  <!-- the cabinet front, running off both sides: top moulding y 70 to 84, plinth y 542 to 566 -->
  <rect x="30" y="70" width="900" height="14" class="b"/>
  <rect x="30" y="84" width="900" height="6" class="h"/>
  <line x1="30" y1="76" x2="930" y2="76" class="thin" style="opacity:0.6"/>
  <rect x="30" y="542" width="900" height="24" class="b"/>
  <rect x="30" y="555" width="900" height="11" class="h"/>
  <line x1="30" y1="548" x2="930" y2="548" class="thin" style="opacity:0.6"/>
  <rect x="30" y="566" width="900" height="7" class="h"/>
  <line x1="30" y1="566" x2="930" y2="566" class="l" style="stroke-width:1.8"/>
  <g class="thin" style="opacity:0.18">${grain}</g>
  <!-- the speaker grille, running off the left: frame x 30 to 308, opening x 30 to 296, y 112 to 350 -->
  <path d="M 30 100 H 294 Q 308 100 308 114 V 348 Q 308 362 294 362 H 30" class="b"/>
  <path d="M 300 106 Q 308 106 308 114 V 348 Q 308 362 294 362 H 30 V 354 H 292 Q 300 354 300 346 Z" class="h"/>
  <path d="M 30 112 H 290 Q 296 112 296 118 V 344 Q 296 350 290 350 H 30 Z" class="x"/>
  ${slats}
  <path d="M 30 112 H 290 Q 296 112 296 118 V 344 Q 296 350 290 350 H 30" class="l"/>
  <path d="M 30 100 H 294 Q 308 100 308 114 V 348 Q 308 362 294 362 H 30" class="l" style="stroke-width:1.8"/>
  <g class="l" style="stroke-width:1.8">${sound}</g>
  <!-- the tuning dial: bezel, face, scale -->
  <circle cx="${C.x + 8}" cy="${C.y + 9}" r="${RB + 1}" class="h"/>
  <circle cx="${C.x}" cy="${C.y}" r="${RB}" class="b" style="stroke-width:2"/>
  <circle cx="${C.x}" cy="${C.y}" r="${RB - 5}" class="thin"/>
  <circle cx="${C.x}" cy="${C.y}" r="${RF}" class="b"/>
  <path d="M ${C.x - RF} ${C.y} A ${RF} ${RF} 0 1 1 ${C.x + RF} ${C.y} A ${RF} ${RF} 0 1 1 ${C.x - RF} ${C.y} Z M ${C.x - RF + 7} ${C.y + 8} A ${RF} ${RF} 0 1 0 ${C.x + RF + 7} ${C.y + 8} A ${RF} ${RF} 0 1 0 ${C.x - RF + 7} ${C.y + 8} Z" class="h" fill-rule="evenodd" clip-path="url(#p203-face)"/>
  <clipPath id="p203-face"><circle cx="${C.x}" cy="${C.y}" r="${RF}"/></clipPath>
  ${screws}
  <path d="M ${P(pt(150, RS, C))} A ${RS} ${RS} 0 1 1 ${P(pt(30, RS, C))}" class="l"/>
  <path d="M ${P(pt(150, RS - 30, C))} A ${RS - 30} ${RS - 30} 0 1 1 ${P(pt(30, RS - 30, C))}" class="thin"/>
  <g class="l">${ticks}</g>
  <!-- the tuning knob: shadow, knurled skirt, body, pointer -->
  <circle cx="${C.x + 7}" cy="${C.y + 8}" r="${KS + 1}" class="h"/>
  <circle cx="${C.x}" cy="${C.y}" r="${KS}" class="b"/>
  <circle cx="${C.x}" cy="${C.y}" r="${KS - 4.5}" class="knurl" style="stroke-width:9"/>
  <circle cx="${C.x}" cy="${C.y}" r="${KB}" class="b"/>
  <path d="M ${P(pt(-20, KB, C))} A ${KB} ${KB} 0 0 1 ${P(pt(110, KB, C))} A ${KB + 18} ${KB + 18} 0 0 0 ${P(pt(-20, KB, C))} Z" class="h"/>
  <circle cx="${C.x}" cy="${C.y}" r="${KB}" class="l" style="stroke-width:1.8"/>
  <!-- the seal: wire from staple A, through the grip bar, to staple B, then down to the lead -->
  ${wireHalo}
  ${wire}
  <g transform="rotate(${NA} ${C.x} ${C.y})">
    <path d="M ${C.x + BL - 4} ${C.y - 5} L ${C.x + RS - 8} ${C.y} L ${C.x + BL - 4} ${C.y + 5} Z" class="ink" style="stroke:var(--ink);stroke-width:1;stroke-linejoin:round"/>
    <rect x="${C.x - BL}" y="${C.y - BW}" width="${2 * BL}" height="${2 * BW}" rx="7" class="b"/>
    <path d="M ${C.x - BL + 3} ${C.y + 5} H ${C.x + BL - 3} V ${C.y + BW - 6} Q ${C.x + BL - 3} ${C.y + BW - 1} ${C.x + BL - 8} ${C.y + BW - 1} H ${C.x - BL + 8} Q ${C.x - BL + 3} ${C.y + BW - 1} ${C.x - BL + 3} ${C.y + BW - 6} Z" class="h"/>
    <line x1="${C.x - BL + 8}" y1="${C.y - BW + 5}" x2="${C.x + BL - 8}" y2="${C.y - BW + 5}" class="thin"/>
    <rect x="${C.x - BL}" y="${C.y - BW}" width="${2 * BL}" height="${2 * BW}" rx="7" class="l" style="stroke-width:1.8"/>
  </g>
  <circle cx="${f(inP.x)}" cy="${f(inP.y)}" r="2.6" class="ink"/><circle cx="${f(outP.x)}" cy="${f(outP.y)}" r="2.6" class="ink"/>
  ${staple(A)}${staple(B)}
  <path d="${runs[0].a.split(' L ').slice(0, 5).join(' L ')}" class="al"/><path d="${runs[2].a.split(' L ').slice(0, 5).join(' L ')}" class="al"/>
  <path d="M ${f(S.x - 4)} ${f(S.y + 17)} l -3 12 M ${f(S.x + 4)} ${f(S.y + 17)} l 4 11" class="al" style="stroke-width:1.8"/>
  <circle cx="${f(S.x)}" cy="${f(S.y)}" r="19" class="af"/>
  <circle cx="${f(S.x)}" cy="${f(S.y)}" r="13.5" class="ps"/>
  <path d="M ${f(S.x - 7)} ${f(S.y - 4)} h 14 M ${f(S.x - 7)} ${f(S.y + 4)} h 14" class="ps" style="stroke-width:2"/>
  <!-- the volume knob: printed dots, shadow, knurled skirt, body, index -->
  <g class="ink">${dots}</g>
  <circle cx="${V.x + 5}" cy="${V.y + 6}" r="${VS + 1}" class="h"/>
  <circle cx="${V.x}" cy="${V.y}" r="${VS}" class="b"/>
  <circle cx="${V.x}" cy="${V.y}" r="${VS - 4}" class="knurl" style="stroke-width:8"/>
  <circle cx="${V.x}" cy="${V.y}" r="${VB}" class="b"/>
  <path d="M ${P(pt(-20, VB, V))} A ${VB} ${VB} 0 0 1 ${P(pt(110, VB, V))} A ${VB + 14} ${VB + 14} 0 0 0 ${P(pt(-20, VB, V))} Z" class="h"/>
  <circle cx="${V.x}" cy="${V.y}" r="${VB}" class="l" style="stroke-width:1.8"/>
  <line x1="${f(vold0.x)}" y1="${f(vold0.y)}" x2="${f(vold1.x)}" y2="${f(vold1.y)}" class="ghost"/>
  <line x1="${f(vnow0.x)}" y1="${f(vnow0.y)}" x2="${f(vnow1.x)}" y2="${f(vnow1.y)}" style="stroke:var(--ink);stroke-width:4.5;stroke-linecap:round"/>
  <circle cx="${V.x}" cy="${V.y}" r="9" class="b"/>
  <g class="pencil">${fresh}</g>
  <path d="M ${P(t0)} A ${RT} ${RT} 0 0 0 ${P(t1)}" class="l"/>
  <path d="M ${P(h1)} L ${P(t1)} L ${P(h2)}" class="l"/>
  <!-- notes -->
  <text x="326" y="170" class="sm">The same station plays.</text>
  <text x="268" y="452" class="it">content filters, rate limits,</text>
  <text x="268" y="471" class="it">thresholds, usage caps</text>
  <line x1="262" y1="447" x2="${f(pt(345, VS + 5, V).x)}" y2="${f(pt(345, VS + 5, V).y)}" class="thin"/>
  <text x="268" y="499" class="sm">It turns. The set gets quieter.</text>
  <text x="908" y="496" text-anchor="end" class="ita">incentives, goals, competition:</text>
  <text x="908" y="515" text-anchor="end" class="ita">sealed at this setting</text>
  <path d="M ${f(S.x + 6)} 480 Q ${f(S.x + 11)} ${f(S.y + 52)} ${f(S.x + 5)} ${f(S.y + 36)}" class="la"/>
  <text x="480" y="645" text-anchor="middle" class="title">The Volume Knob</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-203 · A parameter changes how loud the system is, not what it plays.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-203-volume-knob.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log('wrote PLATE-203-volume-knob.svg');
