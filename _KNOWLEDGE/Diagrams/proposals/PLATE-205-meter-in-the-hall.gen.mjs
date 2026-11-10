// Generator for PLATE-205-meter-in-the-hall.svg. Run: node PLATE-205-meter-in-the-hall.gen.mjs
// Two identical houses in section. The house is drawn once (id p205-house) and used twice:
// the second house is the first translated by DX = 480 units. Only the meter moves.
import { writeFileSync } from 'node:fs';
const out = new URL('./PLATE-205-meter-in-the-hall.svg', import.meta.url);
const f = n => (Math.round(n * 10) / 10).toString();
const P = pts => 'M ' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join(' L ') + ' Z';
// house geometry. X is the outer face of the left party wall of house one.
const X = 110, W = 260, T = 14, DX = 480;
const L = X, R = X + W, IL = L + T, IR = R - T, CX = X + W / 2;
const APEX = 78, S = 132 / 130, RT = 13;           // roof: apex, slope, vertical thickness
const roof = x => APEX + S * Math.abs(x - CX);
const AF = 214, UF = 330, GF = 444, BF = 526, SL = 8; // floor tops: attic, upper, ground, basement. slab 8 thick
const EV = 10;                                     // eaves overhang
// meter: board 40 by 52, centred MX from the wall. hall centre y, basement centre y
const MX = X + 44, MHALL = 392, MBASE = 489, MS = 1.12; // MS: both meters drawn at the same scale
const h = [];
// chimney behind the roof
const c1 = CX + 48, c2 = CX + 72;
h.push(`      <rect x="${c1}" y="72" width="${c2 - c1}" height="${f(roof(c2) - 72)}" class="br"/>`);
h.push(`      <rect x="${c1 + 16}" y="72" width="8" height="${f(roof(c2) - 72)}" class="h"/>`);
h.push(`      <rect x="${c1 - 3}" y="67" width="${c2 - c1 + 6}" height="5" class="b"/>`);
// attic gable wall, in brick, with a round window
const iy = x => roof(x) + RT;
h.push(`      <path d="${P([[IL, AF], [IL, iy(IL)], [CX, iy(CX)], [IR, iy(IR)], [IR, AF]])}" class="brs"/>`);
h.push(`      <circle cx="${CX}" cy="166" r="15" class="b"/><circle cx="${CX}" cy="166" r="11" class="thin"/><path d="M ${CX - 11} 166 H ${CX + 11} M ${CX} 155 V 177" class="thin"/>`);
// roof, cut
h.push(`      <path d="${P([[L - EV, roof(L - EV)], [CX, APEX], [R + EV, roof(R + EV)], [R + EV, iy(R + EV)], [CX, iy(CX)], [L - EV, iy(L - EV)]])}" class="hbp"/>`);
h.push(`      <circle cx="${CX}" cy="${APEX + 1}" r="4" class="b"/>`);
// shadow side of the rooms
h.push(`      <rect x="${IR - 12}" y="${AF + SL}" width="12" height="${UF - AF - SL}" class="h" style="opacity:0.55"/>`);
h.push(`      <rect x="${IR - 12}" y="${UF + SL}" width="12" height="${GF - UF - SL}" class="h" style="opacity:0.55"/>`);
// basement in shadow
h.push(`      <rect x="${IL}" y="${GF + SL}" width="${IR - IL}" height="${BF - GF - SL}" class="x"/>`);
h.push(`      <rect x="${IL}" y="${GF + SL}" width="${IR - IL}" height="${BF - GF - SL}" class="h"/>`);
// party walls, cut, from footing to roof
h.push(`      <path d="${P([[L, iy(L)], [IL, iy(IL)], [IL, BF + SL], [L, BF + SL]])}" class="hb"/>`);
h.push(`      <path d="${P([[R, iy(R)], [IR, iy(IR)], [IR, BF + SL], [R, BF + SL]])}" class="hb"/>`);
// footings
h.push(`      <rect x="${L - 8}" y="${BF + SL}" width="${T + 16}" height="8" class="hb"/><rect x="${IR - 8}" y="${BF + SL}" width="${T + 16}" height="8" class="hb"/>`);
// floors, cut. stair wells: upper floor open from X+140, ground floor open X+154 to X+226
const UE = X + 140, G1 = X + 154, G2 = X + 226, FOOT = X + 238;
h.push(`      <rect x="${IL}" y="${AF}" width="${IR - IL}" height="${SL}" class="hb"/>`);
h.push(`      <rect x="${IL}" y="${UF}" width="${UE - IL}" height="${SL}" class="hb"/>`);
h.push(`      <rect x="${IL}" y="${GF}" width="${G1 - IL}" height="${SL}" class="hb"/><rect x="${G2}" y="${GF}" width="${IR - G2}" height="${SL}" class="hb"/>`);
h.push(`      <rect x="${IL}" y="${BF}" width="${IR - IL}" height="${SL}" class="hb"/>`);
// upper window, seen in the front wall
const wx = X + 39, wy = 246, ww = 76, wh = 60;
h.push(`      <rect x="${wx - 4}" y="${wy - 4}" width="${ww + 8}" height="${wh + 8}" class="b"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" class="l"/>`);
h.push(`      <path d="M ${wx + ww / 2} ${wy} V ${wy + wh} M ${wx} ${wy + 20} H ${wx + ww}" class="l" style="stroke-width:1.1"/>`);
h.push(`      <rect x="${wx - 9}" y="${wy + wh + 4}" width="${ww + 18}" height="5" class="b"/>`);
// skirting on the upper floor and in the hall
h.push(`      <path d="M ${IL} ${UF - 6} H ${UE - 2} M ${IL} ${GF - 6} H ${X + 77}" class="thin"/>`);
// front door with fanlight, seen from inside the hall. leaf X+78 to X+122
const dx = X + 82, dw = 44, dt = 364;
h.push(`      <rect x="${dx - 5}" y="343" width="${dw + 10}" height="${GF - 343}" class="b"/>`);
h.push(`      <rect x="${dx}" y="348" width="${dw}" height="12" class="l" style="stroke-width:1.1"/><path d="M ${dx + 11} 348 V 360 M ${dx + 22} 348 V 360 M ${dx + 33} 348 V 360" class="thin"/>`);
h.push(`      <rect x="${dx}" y="${dt}" width="${dw}" height="${GF - dt}" class="b"/>`);
h.push(`      <rect x="${dx + 6}" y="${dt + 6}" width="${dw - 12}" height="30" class="l" style="stroke-width:1"/><rect x="${dx + 6}" y="${dt + 46}" width="${dw - 12}" height="28" class="l" style="stroke-width:1"/>`);
h.push(`      <rect x="${dx + dw - 8}" y="${dt}" width="8" height="${GF - dt}" class="h" style="opacity:0.7"/>`);
h.push(`      <circle cx="${dx + 7}" cy="${dt + 41}" r="2.2" class="ink"/><path d="M ${dx + dw} ${dt + 12} h 3 M ${dx + dw} ${dt + 66} h 3" class="l"/>`);
// stairs, cut. upper flight: 9 risers from the ground floor at X+238 up to the upper floor at X+140
const up = [[FOOT, GF]], n1 = 9, r1 = (GF - UF) / n1, t1 = (FOOT - UE) / (n1 - 1);
for (let k = 1; k <= n1; k++) { const x0 = FOOT - t1 * (k - 1), y1 = GF - r1 * k; up.push([x0, y1]); if (k < n1) up.push([x0 - t1, y1]); }
const s1 = r1 / t1, so = 9;
up.push([UE, UF + SL + so + 3], [FOOT - so / s1, GF]);
h.push(`      <path d="${P(up)}" class="hbp"/>`);
// lower flight, stacked under it: 7 risers from the ground floor at X+154 down to the basement at X+226
const dn = [[G1, GF]], n2 = 7, r2 = (BF - GF) / n2, t2 = (G2 - G1) / (n2 - 1);
for (let k = 1; k <= n2; k++) { const x0 = G1 + t2 * (k - 1), y1 = GF + r2 * k; dn.push([x0, y1]); if (k < n2) dn.push([x0 + t2, y1]); }
const s2 = r2 / t2;
dn.push([G1 + (BF - GF - r2 - so) / s2, BF], [G1, GF + r2 + so]);
h.push(`      <path d="${P(dn)}" class="l"/>`);
// handrail of the upper flight, 30 units above the nosings
h.push(`      <path d="M ${f(FOOT - 2)} ${GF} V ${f(GF - r1 - 30)} L ${f(UE + 2)} ${f(UF - 30)} V ${UF}" class="l" style="stroke-width:1.8"/>`);
const meterAt = (x, y, cls, top) => `  <g class="${cls}"><line x1="${x}" y1="${top}" x2="${x}" y2="${f(y - 26 * MS)}" class="mt" style="stroke-width:3.2"/><use href="#p205-meter" transform="translate(${x} ${y}) scale(${MS})"/></g>`;
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p205-t p205-d">
  <title id="p205-t">DIA-205 · The meter in the hall</title>
  <desc id="p205-d">An engraved plate of two identical narrow Dutch houses side by side, cut through in a builder's section: a basement, a ground floor with the front hall and front door, an upper floor and a gabled roof. In the left house the electricity meter is down in the basement, in hatched shadow. In the right house the same meter, drawn in rust, hangs on the hall wall beside the front door. A note says the house with the meter in the front hall used about 30 percent less electricity. Nothing else differs between the two.</desc>
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
      .h { fill: url(#p205-h); stroke: none; }
      .hb { fill: url(#p205-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hbp { fill: url(#p205-hp); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .x { fill: url(#p205-x); stroke: none; }
      .br { fill: url(#p205-br); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .brs { fill: url(#p205-br); stroke: none; opacity: 0.6; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .mt { stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }
      .mhall { color: var(--accent); fill: var(--paper); stroke-width: 2; }
      .mbase { color: var(--ink); fill: var(--paper); fill-opacity: 0.35; stroke-width: 1.3; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p205-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p205-hp" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="4.5" height="4.5" class="paper"/><line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p205-x" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="3" class="hl" style="stroke-width:0.75"/>
    </pattern>
    <!-- brick courses: 7 units high, joints staggered -->
    <pattern id="p205-br" width="22" height="14" patternUnits="userSpaceOnUse">
      <path d="M 0 0 H 22 M 0 7 H 22 M 5 0 V 7 M 16 7 V 14" class="hl"/>
    </pattern>
    <!-- one electricity meter on its board, 40 by 52, origin at the centre of the board. colour comes from the group that uses it -->
    <g id="p205-meter" class="mt">
      <rect x="-20" y="-26" width="40" height="52"/>
      <circle cx="0" cy="-7" r="14.5"/>
      <circle cx="0" cy="-7" r="10.5" style="stroke-width:0.9"/>
      <path d="M -9.1 -1.8 L -7.4 -2.8 M -10.3 -9.8 L -8.4 -9.3 M -5.3 -16.1 L -4.3 -14.4 M 2.7 -17.1 L 2.2 -15.2 M 9.1 -12.3 L 7.4 -11.3 M 10.3 -4.2 L 8.4 -4.7" style="stroke-width:0.9"/>
      <path d="M 0 -7 L 5.6 -13.2" style="stroke-width:1.6"/>
      <circle cx="0" cy="-7" r="1.7" style="fill:currentColor;fill-opacity:1;stroke:none"/>
      <rect x="-12" y="12" width="24" height="8" style="stroke-width:1"/>
      <path d="M -6 12 V 20 M 0 12 V 20 M 6 12 V 20" style="stroke-width:0.8"/>
    </g>
    <!-- the house, drawn once in the position of house one (outer wall faces x = ${L} and x = ${R}). house two is this group translated by ${DX} -->
    <g id="p205-house">
${h.join('\n')}
    </g>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE V</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · VISIBILITY, RULES, AND RULE-MAKERS</text>
  <!-- street level at y = ${GF}, outside the houses -->
  <g><rect x="30" y="${GF}" width="${L - 30}" height="7" class="h"/><rect x="${R}" y="${GF}" width="${L + DX - R}" height="7" class="h"/><rect x="${R + DX}" y="${GF}" width="${930 - R - DX}" height="7" class="h"/></g>
  <path d="M 30 ${GF} H ${L} M ${R} ${GF} H ${L + DX} M ${R + DX} ${GF} H 930" class="l"/>
  <!-- the two houses: x = ${X} and x = ${X} + ${DX} -->
  <use href="#p205-house"/>
  <use href="#p205-house" x="${DX}"/>
  <!-- the only difference. left: meter in the basement at (${MX}, ${MBASE}). right: the same meter in the hall at (${MX} + ${DX}, ${MHALL}) -->
${meterAt(MX, MBASE, 'mbase', GF + SL)}
  <rect x="${MX - 26}" y="${GF + SL}" width="52" height="${BF - GF - SL}" class="x" style="opacity:0.8"/>
${meterAt(MX + DX, MHALL, 'mhall', UF + SL)}
  <!-- notes -->
  <text x="${MX - 20}" y="574" class="it">the meter in the basement</text>
  <line x1="${MX}" y1="556" x2="${MX}" y2="${MBASE + 33}" class="thin"/>
  <text x="${L + DX - 16}" y="384" text-anchor="end" class="ita">the meter in the front hall:</text>
  <text x="${L + DX - 16}" y="403" text-anchor="end" class="ita">about 30 percent less</text>
  <text x="${L + DX - 16}" y="422" text-anchor="end" class="ita">electricity used</text>
  <line x1="${L + DX - 10}" y1="392" x2="${MX + DX - 25}" y2="392" class="la"/>
  <text x="480" y="262" text-anchor="middle" class="sm">The houses were the same.</text>
  <text x="480" y="280" text-anchor="middle" class="sm">Nothing else differed.</text>
  <text x="480" y="494" text-anchor="middle" class="sm">As Donella Meadows tells it,</text>
  <text x="480" y="511" text-anchor="middle" class="sm">of a Dutch housing development.</text>
  <text x="480" y="645" text-anchor="middle" class="title">The Meter in the Hall</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-205 · Two identical houses: where the meter could be seen, less was used.</text>
</svg>
`;
writeFileSync(out, svg);
