// Generates PLATE-206-plaque-and-rack.svg. Run: node PLATE-206-plaque-and-rack.gen.mjs
// The wall inside a works entrance: a brass plaque with the mission on it,
// and under it the time clock and the card rack that keeps the count.
import fs from 'node:fs';

// ---- the one figure (Part 2, "Frustrated About AI?", second paragraph) ----
// customer support at one firm: nine thousand heads to about five thousand.
const SLOTS = 9;                 // one slot per thousand heads before
const EMPTY = [2, 5, 7, 8];      // four pulled, so five cards remain
// ---------------------------------------------------------------------------
const f = (n) => (Math.round(n * 10) / 10).toString();
const isEmpty = (i) => EMPTY.includes(i);

// rack geometry. slot i: x = X0 + PITCH * i, each pocket SW wide
const X0 = 312, PITCH = 64, SW = 54;
const RX1 = X0 - 10, RX2 = X0 + PITCH * (SLOTS - 1) + SW + 10; // backboard 302 to 888
const RTOP = 200, RBOT = 380;      // backboard top and bottom
const PT = 318, PB = 368;          // pocket front plate, top and bottom
const CW = 46, CL = 150;           // a time card: 46 wide, 150 long
// card tops sit a little unevenly: y = 212 + JIT[i % 5]
const JIT = [0, 3, 1, 4, 2];
const STAMPS = [7, 5, 8, 6, 7, 6, 8, 5, 7];

// one time card, origin at its top left corner. wordless: ruled lines and punch marks only
const card = (n, rust) => {
  const o = rust ? 'ab' : 'b', r = rust ? 'la' : 'thin';
  let rows = '';
  for (let y = 24; y <= CL - 8; y += 10) rows += `M 4 ${y} H ${CW - 4} `;
  let st = '';
  for (let k = 0; k < n; k++) st += `M 7 ${20.5 + 10 * k} h 11 M ${CW / 2 + 5} ${20.5 + 10 * k} h 11 `;
  return `<path d="M 0 0 H ${CW - 8} L ${CW} 8 V ${CL} H 0 Z" class="${o}"/>` +
    `<path d="M 4 14 H ${CW - 4} M ${CW / 2} 14 V ${CL - 8} ${rows}" class="${r}" style="opacity:0.5"/>` +
    `<path d="${st}" class="${r}" style="stroke-width:1.5;opacity:0.85"/>`;
};

let rack = '';
for (let i = 0; i < SLOTS; i++) {
  const x = X0 + PITCH * i, cx = x + SW / 2, e = isEmpty(i);
  rack += `<!-- slot ${i + 1}: ${e ? 'empty' : 'card'} -->`;
  if (e) {
    // the open mouth of an empty pocket, solid rust
    rack += `<rect x="${x}" y="${PT - 9}" width="${SW}" height="22" class="af"/>`;
  } else {
    rack += `<rect x="${x}" y="${PT - 7}" width="${SW}" height="8" class="b"/>`;
    rack += `<g transform="translate(${x + 4} ${212 + JIT[i % 5]})">${card(STAMPS[i], false)}</g>`;
  }
  // front plate with a thumb notch, shadow side hatched
  const plate = `M ${x} ${PT} H ${cx - 10} A 10 10 0 0 0 ${cx + 10} ${PT} H ${x + SW} V ${PB} H ${x} Z`;
  rack += `<path d="${plate}" class="${e ? 'ab' : 'b'}"/>`;
  rack += `<rect x="${x + SW - 10}" y="${PT + 1}" width="9" height="${PB - PT - 2}" class="h"/>`;
  rack += `<path d="${plate}" class="${e ? 'al' : 'l'}"${e ? ' style="stroke-width:2.2"' : ''}/>`;
  rack += `<g class="${e ? 'af' : 'ink'}"><circle cx="${x + 6}" cy="${PB - 6}" r="1.5"/><circle cx="${x + SW - 15}" cy="${PB - 6}" r="1.5"/></g>`;
}

// the wire bin: rim ellipse at y 500, base ellipse at y 566.
// front wire k of 9: angle = 180 * k / 8 degrees round the front of each ellipse
const BX = 770, RIM = { y: 500, rx: 100, ry: 10 }, BASE = { y: 566, rx: 62, ry: 6 };
let wires = '';
for (let k = 0; k <= 8; k++) {
  const t = Math.PI * k / 8;
  wires += `M ${f(BX + RIM.rx * Math.cos(t))} ${f(RIM.y + RIM.ry * Math.sin(t))} L ${f(BX + BASE.rx * Math.cos(t))} ${f(BASE.y + BASE.ry * Math.sin(t))} `;
}
const hoop = (y, rx, ry, sweep) => `M ${BX - rx} ${y} A ${rx} ${ry} 0 0 ${sweep} ${BX + rx} ${y}`;
// the four pulled cards, fanned in the bin: foot at x = 749 + 14 j,
// lifted so the low corner of a tilted card rests on the base: y = 560 - (CW / 2) sin|angle|
const FAN = [-40, -17, 14, 37];
let pulled = '';
FAN.forEach((a, j) => {
  pulled += `<g transform="translate(${749 + 14 * j} ${f(560 - CW / 2 * Math.sin(Math.abs(a) * Math.PI / 180))}) rotate(${a}) translate(${-CW / 2} ${-CL})">${card(STAMPS[EMPTY[j]], true)}</g>`;
});

// clock dial: 12 hour ticks, 60 minute ticks, no numerals
const DC = { x: 167, y: 252 };
let ticks = '', mticks = '';
for (let k = 0; k < 60; k++) {
  const t = Math.PI * k / 30, s = Math.sin(t), c = -Math.cos(t);
  if (k % 5 === 0) ticks += `M ${f(DC.x + 38 * s)} ${f(DC.y + 38 * c)} L ${f(DC.x + 46 * s)} ${f(DC.y + 46 * c)} `;
  else mticks += `M ${f(DC.x + 43 * s)} ${f(DC.y + 43 * c)} L ${f(DC.x + 46 * s)} ${f(DC.y + 46 * c)} `;
}
const screw = (x, y, r, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><circle r="${r}" class="b"/><line x1="${-r + 1.2}" y1="0" x2="${r - 1.2}" y2="0" class="l"/></g>`;

const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p206-t p206-d">
  <title id="p206-t">DIA-206 · The plaque and the rack</title>
  <desc id="p206-d">An engraved plate of the wall inside a works entrance. High on the wall a polished brass plaque, fixed with four screws, is engraved FOR THE BENEFIT OF ALL. Below it hang a time clock and a time-card rack with nine pockets. Five pockets hold a card. Four are empty and drawn in rust, and the four pulled cards stand in a wire bin on the floor beneath. The plaque is the stated purpose. The rack is what was done.</desc>
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
      .h { fill: url(#p206-h); stroke: none; }
      .hb { fill: url(#p206-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .ab { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
      .al { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-linecap: round; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .af { fill: var(--accent); }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .eng { font-size: 20px; font-weight: 600; letter-spacing: 0.17em; }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p206-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE VI</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · GOALS, ASSUMPTIONS, AND COORDINATION</text>
  <!-- floor -->
  <rect x="30" y="574" width="900" height="7" class="h"/>
  <line x1="30" y1="574" x2="930" y2="574" class="l"/>
  <!-- the plaque: brass plate 480 by 68, bevelled, four screws -->
  <rect x="247" y="81" width="480" height="68" class="h"/>
  <rect x="240" y="74" width="480" height="68" class="b"/>
  <path d="M 240 142 L 248 134 H 712 L 720 142 Z M 720 74 L 712 82 V 134 L 720 142 Z" class="h"/>
  <rect x="248" y="82" width="464" height="52" class="l" style="stroke-width:1"/>
  <path d="M 240 74 L 248 82 M 720 74 L 712 82 M 240 142 L 248 134 M 720 142 L 712 134" class="thin"/>
  <rect x="240" y="74" width="480" height="68" class="l" style="stroke-width:2"/>
  <path d="M 282 90 H 678 M 282 126 H 678" class="thin"/>
  ${screw(262, 95, 4.6, 35)}${screw(698, 95, 4.6, -20)}${screw(262, 121, 4.6, 70)}${screw(698, 121, 4.6, 10)}
  <text x="480" y="115" text-anchor="middle" class="eng">FOR THE BENEFIT OF ALL</text>
  <!-- the time clock: case 146 wide, dial centre (167, 252) -->
  <path d="M 100 176 H 246 V 194 H 254 V 322 H 246 V 362 H 236 V 562 H 244 V 574 H 228 V 362 H 100 Z" class="h"/>
  <rect x="98" y="168" width="138" height="8" class="b"/>
  <rect x="86" y="176" width="162" height="12" class="b"/>
  <rect x="94" y="188" width="146" height="128" class="b"/>
  <rect x="227" y="189" width="12" height="126" class="h"/>
  <circle cx="167" cy="252" r="57" class="b" style="stroke-width:2"/>
  <circle cx="167" cy="252" r="50" class="l"/>
  <path d="${ticks}" class="l" style="stroke-width:2"/>
  <path d="${mticks}" class="thin"/>
  <path d="M 167 252 L 167 214" class="l" style="stroke-width:2.2"/>
  <path d="M 167 252 L 153.5 275.4" class="l" style="stroke-width:3.2"/>
  <circle cx="167" cy="252" r="3.6" class="ink"/>
  <path d="M 132 222 A 46 46 0 0 1 150 209" class="thin" style="opacity:0.6"/>
  <!-- the throat where a card is stamped, and the lever -->
  <rect x="94" y="316" width="146" height="40" class="b"/>
  <rect x="227" y="317" width="12" height="38" class="h"/>
  <path d="M 116 324 H 208 L 202 348 H 122 Z" class="b"/>
  <rect x="128" y="332" width="68" height="5" class="ink"/>
  <rect x="240" y="329" width="16" height="12" class="b"/><circle cx="262" cy="335" r="7" class="b"/><circle cx="262" cy="335" r="2.4" class="ink"/>
  <!-- pendulum case -->
  <rect x="104" y="356" width="126" height="200" class="b"/>
  <rect x="219" y="357" width="10" height="198" class="h"/>
  <rect x="116" y="368" width="94" height="176" class="l"/>
  <rect x="120" y="372" width="86" height="168" class="thin"/>
  <path d="M 164 372 L 154.4 492" class="l" style="stroke-width:1.8"/>
  <circle cx="153" cy="508" r="16" class="hb"/><circle cx="153" cy="508" r="6" class="b"/>
  <path d="M 192 380 l -14 14 M 200 386 l -22 22" class="thin" style="opacity:0.6"/>
  <rect x="96" y="556" width="142" height="18" class="b"/>
  <rect x="96" y="566" width="142" height="8" class="h"/>
  <line x1="96" y1="562" x2="238" y2="562" class="thin"/>
  <!-- the rack: slot i at x = ${X0} + ${PITCH} i, i = 0 to 8. filled 1, 2, 4, 5, 7; empty 3, 6, 8, 9 -->
  <path d="M ${RX2 + 10} 194 H ${RX2 + 24} V 402 H ${RX1 - 8} V 394 H ${RX2 + 10} Z" class="h"/>
  <rect x="${RX1 - 10}" y="${RTOP - 2}" width="${RX2 - RX1 + 20}" height="${RBOT - RTOP + 4}" class="b"/>
  <rect x="${RX1}" y="${RTOP}" width="${RX2 - RX1}" height="${RBOT - RTOP}" class="h"/>
  <rect x="${RX1}" y="${RTOP}" width="${RX2 - RX1}" height="${RBOT - RTOP}" class="l"/>
  ${rack}
  <rect x="${RX1 - 16}" y="186" width="${RX2 - RX1 + 32}" height="14" class="b" style="stroke-width:1.8"/>
  <line x1="${RX1 - 16}" y1="196" x2="${RX2 + 16}" y2="196" class="thin"/>
  <rect x="${RX1 - 16}" y="380" width="${RX2 - RX1 + 32}" height="14" class="b" style="stroke-width:1.8"/>
  <rect x="${RX1 - 15}" y="388" width="${RX2 - RX1 + 30}" height="5" class="h"/>
  ${screw(RX1 - 6, 193, 3.6, 30)}${screw(RX2 + 6, 193, 3.6, -40)}${screw(RX1 - 6, 387, 3.6, 80)}${screw(RX2 + 6, 387, 3.6, 15)}
  <!-- the wire bin with the four pulled cards -->
  <path d="${hoop(RIM.y, RIM.rx, RIM.ry, 1)}" class="l"/>
  ${pulled}
  <path d="${wires}" class="l" style="stroke-width:1.3"/>
  <path d="${hoop(533, 81, 8, 0)}" class="l" style="stroke-width:1.1"/>
  <path d="${hoop(BASE.y, BASE.rx, BASE.ry, 0)}" class="l" style="stroke-width:2"/>
  <path d="${hoop(RIM.y, RIM.rx, RIM.ry, 0)}" class="l" style="stroke-width:2.6"/>
  <!-- notes -->
  <text x="746" y="114" class="it" style="font-size:17px">the words</text>
  <line x1="730" y1="108" x2="740" y2="108" class="thin"/>
  <text x="746" y="170" class="it" style="font-size:17px">the actions</text>
  <path d="M 740 166 q -8 3 -10 16" class="thin"/>
  <text x="312" y="446" class="ita">customer support at one firm, 2025:</text>
  <text x="312" y="465" class="ita">nine thousand heads to about five thousand</text>
  <path d="M 462 430 q 8 -14 6 -32" class="la"/>
  <text x="480" y="603" text-anchor="middle" class="sm">Drawn to that count: nine slots, five cards.</text>
  <text x="480" y="645" text-anchor="middle" class="title">The Plaque and the Rack</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-206 · Read the purpose from the rack, not from the plaque.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-206-plaque-and-rack.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log(`slots ${SLOTS}, empty ${EMPTY.length}, cards ${SLOTS - EMPTY.length}`);
