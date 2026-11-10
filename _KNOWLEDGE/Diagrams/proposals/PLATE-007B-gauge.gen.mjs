// Generates PLATE-007B-gauge.svg. Run: node PLATE-007B-gauge.gen.mjs
// A pressure gauge with part of its face broken away. The needle rests at
// "all well". Behind the face, the link that should join the works to the
// needle is off.
import fs from 'node:fs';

const f = (n) => n.toFixed(1);
const C = { x: 318, y: 318 };          // dial centre
const RC = 208, RB = 196, RD = 186;    // case, bezel, dial radii
// angles are degrees clockwise from +x (screen sense)
const pt = (deg, rad, c = C) => ({ x: c.x + rad * Math.cos(deg * Math.PI / 180), y: c.y + rad * Math.sin(deg * Math.PI / 180) });
const P = (p) => `${f(p.x)} ${f(p.y)}`;

// scale: 0 at 135 deg, sweeping clockwise 270 deg. tick k of 20 at 135 + 13.5 k.
// the face is broken away from -12 deg to 128 deg, so ticks past k = 15 are gone.
let ticks = '';
for (let k = 0; k <= 15; k++) {
  const a = 135 + 13.5 * k, major = k % 2 === 0;
  ticks += `<line x1="${f(pt(a, RD - 6).x)}" y1="${f(pt(a, RD - 6).y)}" x2="${f(pt(a, RD - (major ? 24 : 15)).x)}" y2="${f(pt(a, RD - (major ? 24 : 15)).y)}"${major ? ' style="stroke-width:1.6"' : ''}/>`;
}
// needle at tick 1.5, well inside "all well"
const NA = 135 + 13.5 * 1.5;
const tip = pt(NA, 146), tail = pt(NA + 180, 34), nl = pt(NA - 90, 5.5), nr = pt(NA + 90, 5.5);

// broken edge of the face, relative to the dial centre, from the rim at 128 deg to the rim at -12 deg
const edge = [[-100, 133], [-74, 116], [-66, 92], [-40, 82], [-34, 58], [-10, 50], [-2, 28], [22, 22], [32, 4], [58, 8], [80, -8], [110, 2], [136, -10], [158, -26]]
  .map(([x, y]) => `${f(C.x + x)} ${f(C.y + y)}`).join(' L ');
const rimA = pt(-12, RD), rimB = pt(128, RD);
const face = `M ${P(rimA)} A ${RD} ${RD} 0 1 0 ${P(rimB)} L ${edge} Z`;

// the works, seen through the break
const TR = 152, TW = 9;                               // Bourdon tube: centre radius, half width
const tube = `M ${P(pt(94, TR + TW))} A ${TR + TW} ${TR + TW} 0 0 0 ${P(pt(10, TR + TW))} L ${P(pt(10, TR - TW))} A ${TR - TW} ${TR - TW} 0 0 1 ${P(pt(94, TR - TW))} Z`;
const tubeMid = `M ${P(pt(92, TR))} A ${TR} ${TR} 0 0 0 ${P(pt(12, TR))}`;
const T = pt(10, TR);                                 // tube tip
const V = { x: C.x + 46, y: C.y + 52 };               // sector pivot
const E = { x: V.x + 50, y: V.y - 30 };               // sector arm end, with its empty eye
const aim = Math.atan2(C.y - V.y, C.x - V.x) * 180 / Math.PI;
const sector = `M ${P(V)} L ${P(pt(aim - 24, 60, V))} A 60 60 0 0 1 ${P(pt(aim + 24, 60, V))} Z`;
const teeth = `M ${P(pt(aim - 24, 60, V))} A 60 60 0 0 1 ${P(pt(aim + 24, 60, V))}`;
const loose = { x: T.x - 5, y: T.y + 50 };            // the link, hanging from the tube tip

const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p7b-t p7b-d">
  <title id="p7b-t">DIA-007B · The needle and the works</title>
  <desc id="p7b-d">An engraved plate of a large pressure gauge. Its needle rests near the low end of the scale, marked all well. Part of the face is broken away. Behind it the curved pressure tube and a toothed sector can be seen, and the link that should join the tube to the sector hangs loose. The dial stands for a model's written reasoning, the works for what the model did. Notes give the measured rates: reasoning did not match the act in 65 of 100 cases, no reasoning was left in 87 of 100, and sabotage was carried on in 7 of 100.</desc>
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
      .h { fill: url(#p7b-h); stroke: none; }
      .hb { fill: url(#p7b-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); stroke: var(--ink); stroke-width: 1; stroke-linejoin: round; }
      .ga { fill: none; stroke: var(--accent); stroke-width: 1.6; stroke-dasharray: 4 3.5; stroke-linecap: round; }
      .ea { fill: var(--paper); stroke: var(--accent); stroke-width: 1.6; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .scd { font-size: 12px; letter-spacing: 0.2em; text-anchor: middle; }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .dial { font-size: 15px; font-style: italic; text-anchor: middle; }
      .n { font-size: 22px; }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p7b-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE VII B</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 7 · SAFETY RISK AND BINDING CONSTRAINTS</text>
  <!-- bench and the pipe the gauge stands on -->
  <rect x="30" y="578" width="900" height="7" class="h"/>
  <line x1="30" y1="578" x2="930" y2="578" class="l"/>
  <rect x="${C.x - 13}" y="${C.y + RC - 4}" width="26" height="30" class="b"/>
  <rect x="${C.x - 24}" y="${C.y + RC + 22}" width="48" height="14" class="hb"/>
  <rect x="${C.x - 13}" y="${C.y + RC + 36}" width="26" height="${578 - (C.y + RC + 36)}" class="b"/>
  <!-- case and bezel -->
  <circle cx="${C.x}" cy="${C.y}" r="${RC}" class="hb" style="stroke-width:1.8"/>
  <circle cx="${C.x}" cy="${C.y}" r="${RB}" class="b"/>
  <!-- back plate, seen through the break -->
  <circle cx="${C.x}" cy="${C.y}" r="${RD}" class="hb"/>
  <!-- the works: tube, sector, and the link hanging loose -->
  <rect x="${C.x - 22}" y="${C.y + TR - 16}" width="44" height="34" class="b"/>
  <path d="${tube}" class="b"/>
  <path d="${tubeMid}" class="thin"/>
  <path d="${sector}" class="b"/>
  <path d="${teeth}" style="fill:none;stroke:var(--ink);stroke-width:5;stroke-dasharray:2 2.4"/>
  <line x1="${f(V.x)}" y1="${f(V.y)}" x2="${f(E.x)}" y2="${f(E.y)}" style="stroke:var(--ink);stroke-width:5;stroke-linecap:round"/>
  <circle cx="${f(V.x)}" cy="${f(V.y)}" r="4.5" class="b"/>
  <line x1="${f(T.x)}" y1="${f(T.y)}" x2="${f(loose.x)}" y2="${f(loose.y)}" style="stroke:var(--ink);stroke-width:4.5;stroke-linecap:round"/>
  <circle cx="${f(T.x)}" cy="${f(T.y)}" r="5.5" class="b"/>
  <circle cx="${f(loose.x)}" cy="${f(loose.y)}" r="4.5" class="b"/>
  <!-- where the link should run: the argument -->
  <line x1="${f(E.x + 7)}" y1="${f(E.y + 0.5)}" x2="${f(T.x - 8)}" y2="${f(T.y - 0.5)}" class="ga"/>
  <circle cx="${f(E.x)}" cy="${f(E.y)}" r="5.5" class="ea"/>
  <!-- the face, with a piece broken away -->
  <path d="${face}" class="b"/>
  <g class="l">${ticks}</g>
  <text x="${f(pt(196, 118).x)}" y="${f(pt(196, 118).y)}" class="dial">all well</text>
  <text x="${f(pt(318, 122).x)}" y="${f(pt(318, 122).y)}" class="dial">alarm</text>
  <text x="${C.x}" y="${C.y - 78}" class="scd">REASONING,</text>
  <text x="${C.x}" y="${C.y - 60}" class="scd">AS WRITTEN</text>
  <path d="M ${P(tip)} L ${P(nl)} L ${P(tail)} L ${P(nr)} Z" class="ink"/>
  <circle cx="${C.x}" cy="${C.y}" r="11" class="ink"/><circle cx="${C.x}" cy="${C.y}" r="3" class="paper"/>
  <!-- notes -->
  <text x="590" y="118" class="it">the dial: the model's written reasoning,</text>
  <text x="590" y="137" class="it">the only part an evaluator can read</text>
  <path d="M 584 124 Q 540 150 ${P(pt(322, RD + 4))}" class="thin"/>
  <text x="590" y="196" class="ita">the link between them is off</text>
  <path d="M 584 193 L ${f((E.x + T.x) / 2 + 4)} ${f((E.y + T.y) / 2 - 5)}" class="la"/>
  <text x="590" y="250" class="it">the works: what the model did</text>
  <path d="M 584 247 L ${P(pt(40, TR + TW + 3))}" class="thin"/>
  <line x1="590" y1="296" x2="900" y2="296" class="thin"/>
  <text x="590" y="320" class="sc">MEASURED, UK AI SECURITY INSTITUTE, 2026</text>
  <text x="590" y="358" class="n">65 in 100</text>
  <text x="590" y="378" class="it">reasoning that did not match the act,</text>
  <text x="590" y="396" class="it">when the most capable model carried a sabotage on</text>
  <text x="590" y="438" class="n">87 in 100</text>
  <text x="590" y="458" class="it">no reasoning left to read at all,</text>
  <text x="590" y="476" class="it">in its cheating cases in a later test</text>
  <text x="590" y="518" class="n">7 in 100</text>
  <text x="590" y="538" class="it">how often it carried the sabotage on.</text>
  <text x="590" y="556" class="it">No model began one unprompted.</text>
  <text x="480" y="645" text-anchor="middle" class="title">The Needle and the Works</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-007B · A gauge reports only through the link to its works. Where it matters most, a model's written reasoning is not linked to what it did.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-007B-gauge.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log('wrote PLATE-007B-gauge.svg');
