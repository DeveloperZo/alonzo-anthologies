// Generates PLATE-202-switch-panel.svg. Run: node PLATE-202-switch-panel.gen.mjs
// A wall-mounted switch panel. Three heavy lever switches, each already thrown
// up to ON, each with an engraved nameplate. The fourth position has a
// nameplate and a blank cover screwed down where the lever would be.
import fs from 'node:fs';

// panel slab on the wall
const PX = 60, PY = 74, PW = 840, PH = 424, DEPTH = 10;
// four positions spaced by rule: cx = 172.5 + 205 i, i = 0..3 (panel centre 480, pitch 205)
const cx = (i) => 172.5 + 205 * i;
// one position, top to bottom (all y in plate units)
const EW = 112;                 // escutcheon width
const ET = 96, EB = 378;        // escutcheon top and bottom
const ST = 208, SB = 330, SW = 24; // slot top, bottom, width
const BALL = 250;               // ball joint of the lever, in the upper half of the slot
const ON_Y = 125, OFF_Y = 359;  // baselines of the engraved words
const GT = 138, GB = 216, GW = 36; // lever grip: top, bottom, width
const NT = 398, NH = 58, NW = 180; // nameplate top, height, width
// notes under the panel: baselines y = 536 + 19 k
const noteY = (k) => 536 + 19 * k;

const screw = (x, y, r, deg, cls = 'b', lcls = 'l') => {
  const a = deg * Math.PI / 180, dx = (r - 0.6) * Math.cos(a), dy = (r - 0.6) * Math.sin(a);
  return `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/><line x1="${(x - dx).toFixed(1)}" y1="${(y - dy).toFixed(1)}" x2="${(x + dx).toFixed(1)}" y2="${(y + dy).toFixed(1)}" class="${lcls}"/>`;
};

// escutcheon: bevelled plate with hatched shadow sides and four screws
const escutcheon = (x, blank) => {
  const L = x - EW / 2, R = x + EW / 2, b = blank ? 'ab' : 'b', h = blank ? 'ha' : 'h', t = blank ? 'la' : 'thin', l = blank ? 'al' : 'l';
  const sw = blank ? ' style="stroke-width:2.4"' : ' style="stroke-width:1.8"';
  let s = `<rect x="${L + 7}" y="${ET + 8}" width="${EW}" height="${EB - ET}" class="h" style="opacity:0.75"/>`;
  s += `<rect x="${L}" y="${ET}" width="${EW}" height="${EB - ET}" class="${b}"${sw}/>`;
  s += `<path d="M ${R} ${ET} L ${R - 8} ${ET + 8} V ${EB - 8} H ${L + 8} L ${L} ${EB} H ${R} Z" class="${h}"/>`;
  s += `<rect x="${L + 8}" y="${ET + 8}" width="${EW - 16}" height="${EB - ET - 16}" class="${t}"/>`;
  s += `<path d="M ${L} ${ET} l 8 8 M ${R} ${ET} l -8 8 M ${L} ${EB} l 8 -8 M ${R} ${EB} l -8 -8" class="${t}"/>`;
  s += `<rect x="${L}" y="${ET}" width="${EW}" height="${EB - ET}" class="${l}"${sw}/>`;
  const angs = blank ? [20, 110, 65, 150] : [35, 140, 80, 10];
  [[L + 19, ET + 19], [R - 19, ET + 19], [L + 19, EB - 19], [R - 19, EB - 19]].forEach(([sx, sy], k) => { s += screw(sx, sy, 5.5, angs[k] + 17 * x % 40, b, l); });
  return s;
};

// lever, thrown up: a ball joint in the upper half of the slot, a shaft, a ferrule and a turned grip.
// the OFF end of the slot is left empty. shadow falls down and right.
const leverShape = (x) => `M ${x - 6} ${BALL} V ${GB + 8} H ${x - 12} V ${GB} H ${x - GW / 2} V ${GT + GW / 2} A ${GW / 2} ${GW / 2} 0 0 1 ${x + GW / 2} ${GT + GW / 2} V ${GB} H ${x + 12} V ${GB + 8} H ${x + 6} V ${BALL} A 9 9 0 0 1 ${x - 6} ${BALL} Z`;
const lever = (x) => {
  let s = '';
  // cast shadow of the lever on the plate
  s += `<path d="${leverShape(x)}" class="h" style="opacity:0.7" transform="translate(15 11)"/>`;
  // slot, cut through the plate, cross-hatched dark
  s += `<rect x="${x - SW / 2}" y="${ST}" width="${SW}" height="${SB - ST}" rx="${SW / 2}" class="xb"/>`;
  // ball joint
  s += `<circle cx="${x}" cy="${BALL}" r="9" class="b"/>`;
  // shaft
  s += `<rect x="${x - 6}" y="${GB + 8}" width="12" height="${BALL - 6 - GB - 8}" class="b"/><rect x="${x + 1.5}" y="${GB + 8}" width="4.5" height="${BALL - 6 - GB - 8}" class="h"/>`;
  // ferrule
  s += `<rect x="${x - 12}" y="${GB}" width="24" height="8" class="b"/><rect x="${x + 4}" y="${GB}" width="8" height="8" class="h"/>`;
  // grip
  const g = `M ${x - GW / 2} ${GB} V ${GT + GW / 2} A ${GW / 2} ${GW / 2} 0 0 1 ${x + GW / 2} ${GT + GW / 2} V ${GB} Z`;
  s += `<path d="${g}" class="b"/>`;
  s += `<path d="M ${x + 7} ${GB} V ${GT + 2} A ${GW / 2} ${GW / 2} 0 0 1 ${x + GW / 2} ${GT + GW / 2} V ${GB} Z" class="h"/>`;
  s += `<path d="M ${x - GW / 2} ${GB - 8} H ${x + GW / 2} M ${x - GW / 2} ${GB - 13} H ${x + GW / 2} M ${x - GW / 2 + 2} ${GT + 20} H ${x + GW / 2 - 2} M ${x - 9} ${GT + 27} V ${GB - 20}" class="thin"/>`;
  s += `<path d="${g}" class="l" style="stroke-width:2"/>`;
  return s;
};

const words = (x) => `<text x="${x + 1.5}" y="${ON_Y}" class="eng">ON</text><text x="${x + 1.5}" y="${OFF_Y}" class="eng">OFF</text>`;

const nameplate = (x, maker, product) => {
  const L = x - NW / 2;
  let s = `<rect x="${L + 4}" y="${NT + 5}" width="${NW}" height="${NH}" class="h" style="opacity:0.75"/>`;
  s += `<rect x="${L}" y="${NT}" width="${NW}" height="${NH}" class="b"/>`;
  s += `<rect x="${L + 4}" y="${NT + 4}" width="${NW - 8}" height="${NH - 8}" class="thin"/>`;
  s += screw(L + 13, NT + NH / 2, 3.6, 30 + x % 70) + screw(L + NW - 13, NT + NH / 2, 3.6, 120 + x % 50);
  s += `<text x="${x + 1}" y="${NT + 24}" class="mk">${maker}</text><text x="${x + 1}" y="${NT + 44}" class="pr">${product}</text>`;
  return s;
};

const note = (x, lines, cls = 'it') => lines.map((t, k) => `<text x="${x}" y="${noteY(k)}" text-anchor="middle" class="${cls}">${t}</text>`).join('');

const pos = [
  { maker: 'GOOGLE', product: 'AI OVERVIEWS', note: ['14 May 2024: switched on', 'for all US users,', 'with no opt-out.'] },
  { maker: 'LINKEDIN', product: 'AI TRAINING', note: ['2024: member posts used', 'for training, the opt-out', 'switch already set to on.'] },
  { maker: 'MICROSOFT 365', product: 'COPILOT', note: ['January 2025: bundled in,', 'and the price raised.'] },
  { maker: 'META · WHATSAPP', product: 'ASSISTANT', note: ['2024: no off switch.'], blank: true },
];

let body = '';
pos.forEach((p, i) => {
  const x = cx(i);
  body += `  <g>${escutcheon(x, p.blank)}${p.blank ? '' : words(x) + lever(x)}${nameplate(x, p.maker, p.product)}</g>\n`;
  body += `  ${note(x, p.note, p.blank ? 'ita' : 'it')}\n`;
});

const R = PX + PW, B = PY + PH;
const bolts = [[PX + 22, PY + 22, 40], [R - 22, PY + 22, 115], [PX + 22, B - 22, 150], [R - 22, B - 22, 70]].map(([x, y, a]) => screw(x, y, 7, a)).join('');

const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p202-t p202-d">
  <title id="p202-t">DIA-202 · Already switched on</title>
  <desc id="p202-d">An engraved plate of a switch panel bolted to a wall. Three heavy lever switches stand in a row, each lever already thrown up to the word ON, with the OFF end of its slot empty. Their nameplates read Google AI Overviews, LinkedIn AI training and Microsoft 365 Copilot. The fourth position, nameplate Meta WhatsApp assistant, has no lever at all: a blank cover, drawn in rust, is screwed down where the switch would be. Notes under each give the date and the default: switched on for all US users on 14 May 2024 with no opt-out, member posts used for training in 2024 with the opt-out switch already set to on, bundled into Microsoft 365 in January 2025 with the price raised, and in 2024 no off switch.</desc>
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
      .h { fill: url(#p202-h); stroke: none; }
      .hb { fill: url(#p202-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .ab { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
      .al { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-linecap: round; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
      .ha { fill: url(#p202-ha); stroke: none; }
      .hla { stroke: var(--accent); stroke-width: 0.7; }
      .xb { fill: url(#p202-x); stroke: var(--ink); stroke-width: 1.6; }
      .eng { font-size: 15px; font-weight: 600; letter-spacing: 0.2em; text-anchor: middle; }
      .mk { font-size: 10.5px; letter-spacing: 0.18em; text-anchor: middle; fill: var(--soft); }
      .pr { font-size: 13.5px; font-weight: 600; letter-spacing: 0.14em; text-anchor: middle; }
    </style>
    <pattern id="p202-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p202-ha" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hla"/>
    </pattern>
    <!-- cross-hatch for the dark inside of a slot -->
    <pattern id="p202-x" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="3" height="3" class="paper"/><path d="M 0 0 V 3 M 0 0 H 3" style="stroke:var(--ink);stroke-width:1.5"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE II</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · BENEATH THE SEARCH RESULT</text>
  <!-- the panel: a slab ${PW} by ${PH}, its thickness shown hatched on the right and under side -->
  <path d="M ${R} ${PY} l ${DEPTH} ${DEPTH} V ${B + DEPTH} H ${PX + DEPTH} L ${PX} ${B} H ${R} Z" class="hb"/>
  <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" class="b" style="stroke-width:2"/>
  <rect x="${PX + 7}" y="${PY + 7}" width="${PW - 14}" height="${PH - 14}" class="thin"/>
  ${bolts}
  <!-- four positions, cx = 172.5 + 205 i -->
${body}  <text x="480" y="645" text-anchor="middle" class="title">Already Switched On</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-202 · Four products, four defaults: each arrived switched on, and one came with no switch.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-202-switch-panel.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log('wrote PLATE-202-switch-panel.svg');
