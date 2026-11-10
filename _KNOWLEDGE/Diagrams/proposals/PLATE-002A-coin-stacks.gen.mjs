// Generates PLATE-002A-coin-stacks.svg. Usage: node PLATE-002A-coin-stacks.gen.mjs <out.svg>
//
// Every height on the plate is computed from the figures below, so when the
// prose changes a number, change it here and rerun. Then publish with
// embed-title-font.mjs. If the ratio changes by a whole number, the title
// and the words in WORDS change too.
import fs from 'node:fs';
const out = process.argv[2];
if (!out) { console.error('usage: node PLATE-002A-coin-stacks.gen.mjs <out.svg>'); process.exit(1); }
// ---- figures, in $ billions (section 2 prose) ----
const TOTAL = 856;        // OpenAI compute spending through 2030, internal projection reported September 2026
const REV = 50;           // OpenAI annualized revenue, end of September 2026, as told to investors
const WORDS = {
  title: 'Seventeen Times Over',
  times: 'roughly seventeen times',
  totalBig: 'near $' + TOTAL + ' billion',
  revBig: 'about $' + REV + ' billion',
};
const RATIO = TOTAL / REV;
const NT = Math.floor(TOTAL / 10), RT = TOTAL - NT * 10;   // whole $10B coins and the odd piece, tall stack
const NS = Math.floor(REV / 10), RS = REV - NS * 10;       // the same for the short stack
const f = (n) => (Math.round(n * 100) / 100).toString();
const G = 560;            // ground
const U = 0.53;           // units per $1B
const T = 10 * U;         // one coin = $10B
const RX = 70, RY = 12;
const L = [];
function coin(cx, yb, t, reed) {
  const yt = yb - t;
  let s = '';
  // band (front half of the edge)
  s += `<path d="M ${f(cx - RX)} ${f(yt)} A ${RX} ${RY} 0 0 0 ${f(cx + RX)} ${f(yt)} V ${f(yb)} A ${RX} ${RY} 0 0 1 ${f(cx - RX)} ${f(yb)} Z" class="c"/>`;
  // shadow side: right 37 degrees of sweep
  const a1 = 52 * Math.PI / 180;
  const sx = cx + RX * Math.cos(a1), sy = RY * Math.sin(a1);
  s += `<path d="M ${f(cx + RX)} ${f(yt)} A ${RX} ${RY} 0 0 1 ${f(sx)} ${f(yt + sy)} V ${f(yb + sy)} A ${RX} ${RY} 0 0 0 ${f(cx + RX)} ${f(yb)} Z" class="h"/>`;
  // reeding on the lit side
  if (reed && t > 3) {
    let d = '';
    for (let a = 72; a <= 172; a += 6.5) {
      const r = a * Math.PI / 180;
      const x = cx + RX * Math.cos(r), y = RY * Math.sin(r);
      d += `M ${f(x)} ${f(yt + y + 1.2)} V ${f(yb + y - 1.2)} `;
    }
    s += `<path d="${d.trim()}" class="reed"/>`;
  }
  // top face
  s += `<ellipse cx="${f(cx)}" cy="${f(yt)}" rx="${RX}" ry="${RY}" class="c"/>`;
  return s;
}
function face(cx, yt) {
  return `<ellipse cx="${f(cx)}" cy="${f(yt)}" rx="${f(RX * 0.84)}" ry="${f(RY * 0.84)}" class="thin"/>` +
    `<path d="M ${f(cx - 30)} ${f(yt - 1)} q 30 -7 60 0 M ${f(cx - 34)} ${f(yt + 3)} q 34 7 68 0" class="thin" style="opacity:0.6"/>`;
}
const jit = (i) => 2.4 * Math.sin(i * 1.7) + 1.5 * Math.sin(i * 0.37 + 1) + 0.9 * Math.sin(i * 4.1);
// tall stack
const TX = 560;
let tall = '';
let topX = TX;
for (let i = 0; i < NT; i++) { topX = TX + jit(i); tall += coin(topX, G - i * T, T, true); if (i % 5 === 4) tall += '\n    '; }
if (RT > 0) { topX = TX + jit(NT); tall += coin(topX, G - NT * T, RT * U, false); }
tall += face(topX, G - TOTAL * U);
// short stack
const SX = 208;
let short = '';
let sTop = SX;
const sj = [0, 2.5, -1.8, 1.2, -0.6];
for (let i = 0; i < NS; i++) { sTop = SX + sj[i % sj.length]; short += coin(sTop, G - i * T, T, true); }
if (RS > 0) { sTop = SX + sj[NS % sj.length]; short += coin(sTop, G - NS * T, RS * U, false); }
const sTopY = G - REV * U;
short += face(sTop, sTopY);
// the rule: one division = one year of revenue
const D = REV * U;
const KMAX = Math.ceil(RATIO);
const RXL = 372, RW = 24;
const rTop = G - (KMAX + 0.45) * D;
let rule = `<rect x="${RXL}" y="${f(rTop)}" width="${RW}" height="${f(G - rTop)}" class="b"/>`;
rule += `<rect x="${RXL + RW - 6}" y="${f(rTop)}" width="6" height="${f(G - rTop)}" class="h"/>`;
let ticks = '', nums = '';
for (let k = 1; k <= KMAX; k++) {
  const y = G - k * D;
  ticks += `M ${RXL} ${f(y)} h 7 `;
  nums += `<text x="${RXL + 12.5}" y="${f(y + 3.6)}" class="rn">${k}</text>`;
}
for (let k = 0; k < KMAX; k++) { const y = G - (k + 0.5) * D; ticks += `M ${RXL} ${f(y)} h 3.5 `; }
rule += `<path d="${ticks.trim()}" class="thin" style="stroke-width:0.9"/>` + nums;
rule += `<rect x="${RXL}" y="${f(rTop)}" width="${RW}" height="${f(G - rTop)}" class="l"/>`;
rule += `<line x1="${RXL}" y1="${f(G - TOTAL * U)}" x2="${RXL + RW}" y2="${f(G - TOTAL * U)}" style="stroke:var(--accent);stroke-width:1.6"/>`;
const tallTopY = G - TOTAL * U;
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p2a-t p2a-d">
  <title id="p2a-t">DIA-002A · ${WORDS.title}</title>
  <desc id="p2a-d">An engraved plate of two stacks of coins standing on one ground line, each coin worth ten billion dollars. On the left, a short stack: OpenAI's annualized revenue of about ${REV} billion dollars at the end of September 2026. On the right, a tall column: its compute spending through 2030 in an internal projection reported in September 2026, near ${TOTAL} billion dollars. A wooden rule between them is marked off in heights of the short stack. The tall column reaches ${RATIO.toFixed(1)} on the rule, ${WORDS.times} the short one.</desc>
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
      .c { fill: var(--paper); stroke: var(--ink); stroke-width: 1; stroke-linejoin: round; }
      .h { fill: url(#p2a-h); stroke: none; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .reed { fill: none; stroke: var(--ink); stroke-width: 0.5; opacity: 0.75; }
      .sight { fill: none; stroke: var(--soft); stroke-width: 0.7; stroke-dasharray: 5 4; }
      .sighta { fill: none; stroke: var(--accent); stroke-width: 1.1; stroke-dasharray: 5 4; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 13.5px; font-style: italic; }
      .sm { font-size: 12px; font-style: italic; fill: var(--soft); }
      .big { font-size: 24px; }
      .rn { font-size: 9.5px; text-anchor: middle; }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p2a-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE II</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 2 · WHY IT'S MOVING SO FAST</text>
  <!-- scale: ${U} units = $1B. One coin = $10B. Ground at y = 560 -->
  <rect x="30" y="560" width="900" height="7" class="h"/>
  <line x1="30" y1="560" x2="930" y2="560" class="l"/>
  <!-- sight lines from the stack tops to the rule -->
  <line x1="${f(sTop + RX)}" y1="${f(sTopY)}" x2="${RXL}" y2="${f(sTopY)}" class="sight"/>
  <line x1="${RXL + RW}" y1="${f(tallTopY)}" x2="${f(topX - RX)}" y2="${f(tallTopY)}" class="sighta"/>
  <!-- revenue -->
  <g>${short}</g>
  <!-- the rule: one division = one year of revenue -->
  <g>${rule}</g>
  <!-- the projected spending -->
  <g>
    ${tall}
  </g>
  <!-- notes -->
  <text x="110" y="436" class="it">OpenAI's revenue for a year,</text>
  <text x="110" y="454" class="it">at the September 2026 rate</text>
  <text x="110" y="486" class="big">${WORDS.revBig}</text>
  <path d="M 196 496 q 6 12 8 22" class="thin"/>
  <text x="${RXL - 12}" y="318" text-anchor="end" class="sm">a rule marked off</text>
  <text x="${RXL - 12}" y="334" text-anchor="end" class="sm">in years of that revenue</text>
  <text x="${RXL - 12}" y="${f(tallTopY - 6)}" text-anchor="end" class="it" style="fill:var(--accent);font-size:15px">${RATIO.toFixed(1)} on the rule:</text>
  <text x="${RXL - 12}" y="${f(tallTopY + 13)}" text-anchor="end" class="it" style="fill:var(--accent);font-size:15px">${WORDS.times}</text>
  <text x="662" y="150" class="it">OpenAI's compute spending</text>
  <text x="662" y="168" class="it">through 2030, in an internal</text>
  <text x="662" y="186" class="it">projection reported in September 2026</text>
  <text x="662" y="220" class="big">${WORDS.totalBig}</text>
  <path d="M 654 160 q -12 -4 -20 -12" class="thin"/>
  <text x="662" y="398" class="sm">each coin, $10 billion</text>
  <path d="M 654 394 q -10 0 -20 4" class="thin"/>
  <!-- title and caption -->
  <text x="480" y="634" text-anchor="middle" class="title">${WORDS.title}</text>
  <line x1="300" y1="656" x2="660" y2="656" class="thin"/>
  <text x="480" y="679" text-anchor="middle" class="cap">DIA-002A · One year of OpenAI's revenue beside its projected compute spending, in the same coin and on the same ground.</text>
</svg>
`;
if (/\n\s*\n/.test(svg)) throw new Error('blank line');
fs.writeFileSync(out, svg);
console.log('ok', svg.length);

