// Generates PLATE-004A-loupes.svg. Usage: node PLATE-004A-loupes.gen.mjs <out.svg>
//
// Every width on the plate is computed from the figures below, so when the
// prose changes a number, change it here and rerun. Then publish with
// embed-title-font.mjs.
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
if (!out) { console.error('usage: node PLATE-004A-loupes.gen.mjs <out.svg>'); process.exit(1); }

// ---- figures (source of each is in the DIA-004A spec) ----
const TOTAL = 856e9;                       // OpenAI compute spending through 2030, internal projection reported September 2026 (section 2)
const TOTAL_LABEL = 'near $856 billion';
const TOTAL_NOTE = 'OpenAI’s projected compute spending through 2030';
const TICKS = [[0, '$0'], [200e9, '$200B'], [400e9, '$400B'], [600e9, '$600B'], [856e9, '$856B']];
const UK = 84e6;                           // UK AI Security Institute, per year
const FINE = 15e6;                         // largest single AI-specific fine to date, EUR 15M, drawn at parity with the dollar (sources 13d)
const CAISI = 10e6;                        // US CAISI, FY2026 enacted appropriation (source 26a)
const M1 = 100, M2 = 10000;                // the two magnifications

const X0 = 80, W = 800;                    // the bar: 800 units wide = TOTAL
const w = (v, m = 1) => +(W * v / TOTAL * m).toPrecision(3);
const tick = ([v, label]) => {
  const x = +(X0 + W * v / TOTAL).toFixed(1);
  return `<line x1="${x}" y1="144" x2="${x}" y2="152" class="thin"/><text x="${v === 0 ? X0 - 6 : x}" y="166" class="tick"${v === 0 ? ' style="text-anchor:end"' : ''}>${label}</text>`;
};
const times = (m) => '× ' + m.toLocaleString('en-US');

const svg = `<svg viewBox="0 0 960 760" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p4-t p4-d">
  <title id="p4-t">DIA-004A · The brake, drawn to scale</title>
  <desc id="p4-d">An engraved plate. One long hatched bar spans the page: ${TOTAL_LABEL}, ${TOTAL_NOTE}. Three oversight figures are drawn on the same scale beneath it and are too thin to see: the UK AI Security Institute's yearly budget, the largest AI fine imposed to date, and the yearly budget of the US institute. A magnifying glass at ${M1} diameters shows the UK institute as a sliver. A second glass at ${M2.toLocaleString('en-US')} diameters shows the fine and the US budget as short bars.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --glass: #F8F5EC; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --glass: #262A33; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .sight { fill: none; stroke: var(--soft); stroke-width: 0.7; stroke-dasharray: 5 4; }
      .hb { fill: url(#p4-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .bar { fill: var(--ink); }
      .fine { fill: var(--accent); }
      .glass { fill: var(--glass); }
      .rim-o { fill: none; stroke: var(--ink); stroke-width: 9; }
      .rim-i { fill: none; stroke: var(--paper); stroke-width: 6; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 13px; font-style: italic; }
      .sm { font-size: 12px; font-style: italic; fill: var(--soft); }
      .tick { font-size: 11px; text-anchor: middle; fill: var(--soft); }
      .pow { font-size: 15px; letter-spacing: 0.12em; text-anchor: middle; }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Fredericka the Great", "Cormorant Garamond", Georgia, serif; font-size: 32px; letter-spacing: 0.01em; }
    </style>
    <pattern id="p4-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <clipPath id="p4-c1"><circle cx="250" cy="430" r="104"/></clipPath>
    <clipPath id="p4-c2"><circle cx="668" cy="440" r="128"/></clipPath>
  </defs>
  <rect width="960" height="760" class="paper"/>
  <rect x="14" y="14" width="932" height="732" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="720" class="thin"/>
  <text x="42" y="50" class="sc">PLATE IV</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 4 · WHO WAS SUPPOSED TO SLOW IT</text>
  <!-- the top bar: ${W} units = ${TOTAL_LABEL} -->
  <text x="${X0}" y="104" class="it" style="font-size:15px">${TOTAL_NOTE}</text>
  <text x="${X0 + W}" y="104" text-anchor="end" style="font-size:15px">${TOTAL_LABEL}</text>
  <rect x="${X0}" y="114" width="${W}" height="30" class="hb"/>
  ${TICKS.map(tick).join('')}
  <!-- the same scale, continued: three bars at their true widths -->
  <line x1="${X0}" y1="152" x2="${X0}" y2="250" class="thin"/>
  <rect x="${X0}" y="186" width="${w(UK)}" height="14" class="bar"/>
  <rect x="${X0}" y="208" width="${w(FINE)}" height="14" class="fine"/>
  <rect x="${X0}" y="230" width="${w(CAISI)}" height="14" class="bar"/>
  <text x="94" y="197" class="it">UK AI Security Institute, $84M a year</text>
  <text x="94" y="219" class="it" style="fill:var(--accent)">The largest AI fine to date, €15M (Italy, December 2024)</text>
  <text x="94" y="241" class="it">US CAISI, $10M a year</text>
  <text x="492" y="219" class="sm">(all three are drawn. None is wide enough to hold ink.)</text>
  <!-- sight lines -->
  <path d="M 80 250 L 147 415 M 80 250 L 262 327" class="sight"/>
  <path d="M 205 480 L 558 374 M 205 480 L 600 548" class="sight"/>
  <!-- glass one -->
  <line x1="176" y1="504" x2="112" y2="568" style="stroke:var(--ink);stroke-width:15;stroke-linecap:round"/>
  <line x1="176" y1="504" x2="112" y2="568" style="stroke:var(--paper);stroke-width:12;stroke-linecap:round"/>
  <line x1="150" y1="534" x2="116" y2="568" style="stroke:url(#p4-h);stroke-width:6"/>
  <circle cx="250" cy="430" r="104" class="glass"/>
  <g clip-path="url(#p4-c1)">
    <line x1="200" y1="320" x2="200" y2="540" class="l"/>
    <rect x="200" y="372" width="${w(UK, M1)}" height="20" class="bar"/>
    <rect x="200" y="420" width="${w(FINE, M1)}" height="20" class="fine"/>
    <rect x="200" y="468" width="${w(CAISI, M1)}" height="20" class="bar"/>
    <text x="218" y="387" class="it">UK institute</text>
    <text x="214" y="435" class="it" style="fill:var(--accent)">the fine: a hair</text>
    <text x="214" y="483" class="it">US CAISI: a hair</text>
  </g>
  <circle cx="250" cy="430" r="108" class="rim-o"/>
  <circle cx="250" cy="430" r="108" class="rim-i"/>
  <path d="M 178 372 A 92 92 0 0 1 232 340" class="thin" style="opacity:0.6"/>
  <text x="270" y="572" class="pow">${times(M1)}</text>
  <!-- glass two -->
  <line x1="762" y1="534" x2="826" y2="598" style="stroke:var(--ink);stroke-width:15;stroke-linecap:round"/>
  <line x1="762" y1="534" x2="826" y2="598" style="stroke:var(--paper);stroke-width:12;stroke-linecap:round"/>
  <circle cx="668" cy="440" r="128" class="glass"/>
  <g clip-path="url(#p4-c2)">
    <line x1="590" y1="300" x2="590" y2="580" class="l"/>
    <rect x="590" y="366" width="${w(UK, M2)}" height="24" class="hb"/>
    <rect x="590" y="430" width="${w(FINE, M2)}" height="24" class="fine"/>
    <rect x="590" y="496" width="${w(CAISI, M2)}" height="24" class="bar"/>
    <text x="600" y="358" class="it">UK institute, off the glass</text>
    <text x="600" y="422" class="it" style="fill:var(--accent)">the largest fine to date</text>
    <text x="600" y="488" class="it">US CAISI</text>
  </g>
  <circle cx="668" cy="440" r="132" class="rim-o"/>
  <circle cx="668" cy="440" r="132" class="rim-i"/>
  <path d="M 578 366 A 116 116 0 0 1 646 326" class="thin" style="opacity:0.6"/>
  <text x="640" y="606" class="pow">${times(M2)}</text>
  <!-- title and caption -->
  <text x="480" y="668" text-anchor="middle" class="title">The Brake, Drawn to Scale</text>
  <line x1="300" y1="686" x2="660" y2="686" class="thin"/>
  <text x="480" y="707" text-anchor="middle" class="cap">DIA-004A · One scale throughout. Two oversight budgets and the largest fine to date are thinner than the ink until magnified.</text>
</svg>
`;
if (/\n\s*\n/.test(svg)) throw new Error('blank line in output');
writeFileSync(out, svg, 'utf8');
console.log('wrote', out, '| widths at x1, x' + M1 + ', x' + M2 + ':',
  [['UK', UK], ['fine', FINE], ['CAISI', CAISI]].map(([n, v]) => `${n} ${w(v)} / ${w(v, M1)} / ${w(v, M2)}`).join('; '));
