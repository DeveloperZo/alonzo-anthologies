// Generates PLATE-001-dials.svg. Usage: node gen.mjs <out.svg>
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const f = (n) => (Math.round(n * 10) / 10).toString();
// perspective: ground y = YH + K / z, scale = 1 / z, foreshortening q = H / sqrt(z^2 + H^2)
const YH = 205, K = 280, H = 0.927, R0 = 54, PITCH = 190, KH0 = 18, DZ = 0.45;
let seed = 20261110;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rad = (d) => d * Math.PI / 180;
const ang = (v) => 270 + v * 135; // value -1..1 to pointer angle, gap of the scale faces the viewer
const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(4);
function dial(cx, gy, z, v, hot) {
  const s = 1 / z, q = H / Math.sqrt(z * z + H * H);
  const rx = R0 * s, ry = rx * q, kh = KH0 * s * Math.sqrt(1 - q * q) * 1.36, ty = gy - kh;
  const w = Math.max(0.5, Math.min(1.4, 1.4 * Math.pow(s, 0.6)));
  const tw = Math.max(0.35, 0.7 * Math.pow(s, 0.6));
  let o = '';
  if (rx < 9) { // far: a sliver
    o += `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx)}" ry="${f(Math.max(ry, 0.5))}" class="far" style="stroke-width:${f(Math.min(0.9, 0.35 + kh * 0.25))}"/><path d="M ${f(cx + rx * 0.3)} ${f(ty + Math.max(ry, 0.5) + 0.3)} H ${f(cx + rx)}" class="dash" style="stroke-width:${f(Math.max(0.5, kh * 0.7))}"/>`;
    return o;
  }
  const full = rx >= 30;
  // scale on the panel
  if (full) {
    let d = '';
    for (let i = 0; i <= 18; i++) {
      const a = rad(135 + i * 15), r1 = i % 3 === 0 ? 1.27 : 1.36, r2 = 1.5;
      d += `M ${f(cx + rx * r1 * Math.cos(a))} ${f(gy + ry * r1 * Math.sin(a))} L ${f(cx + rx * r2 * Math.cos(a))} ${f(gy + ry * r2 * Math.sin(a))} `;
    }
    o += `<path d="${d.trim()}" class="thin" style="stroke-width:${f(tw)}"/>`;
  } else if (rx >= 14) {
    o += `<ellipse cx="${f(cx)}" cy="${f(gy)}" rx="${f(rx * 1.42)}" ry="${f(ry * 1.42)}" class="ring" style="stroke-width:${f(tw)}"/>`;
  }
  // cast shadow on the panel, to the right
  if (rx >= 13) o += `<path d="M ${f(cx + rx * 0.2)} ${f(gy + ry * 0.98)} A ${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(gy)} Q ${f(cx + rx * 1.34)} ${f(gy + ry * 0.5)} ${f(cx + rx * 0.2)} ${f(gy + ry * 0.98)} Z" class="${rx >= 30 ? 'h' : 'h2'}"/>`;
  // knob side
  const side = `M ${f(cx - rx)} ${f(ty)} V ${f(gy)} A ${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(gy)} V ${f(ty)} A ${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(ty)} Z`;
  o += `<path d="${side}" class="b" style="stroke-width:${f(w)}"/>`;
  // shadow side, hatched: from 62 degrees round to 0
  const c = Math.cos(rad(62)), sn = Math.sin(rad(62));
  o += `<path d="M ${f(cx + rx * c)} ${f(ty + ry * sn)} A ${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(ty)} V ${f(gy)} A ${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx * c)} ${f(gy + ry * sn)} Z" class="${rx >= 30 ? 'h' : rx >= 13 ? 'h2' : 's'}"/>`;
  if (full) { // knurling on the lit side
    let d = '';
    for (let a = 74; a <= 172; a += 9) d += `M ${f(cx + rx * Math.cos(rad(a)))} ${f(ty + ry * Math.sin(rad(a)))} v ${f(kh)} `;
    o += `<path d="${d.trim()}" class="thin" style="stroke-width:${f(tw)}"/>`;
  }
  o += `<path d="${side}" class="l" style="stroke-width:${f(w)}"/>`;
  // top face
  o += `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx)}" ry="${f(ry)}" class="b" style="stroke-width:${f(w)}"/>`;
  if (rx >= 20) o += `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx * 0.8)}" ry="${f(ry * 0.8)}" class="thin" style="stroke-width:${f(tw)}"/>`;
  const px = (a, r) => f(cx + rx * r * Math.cos(rad(a))), py = (a, r) => f(ty + ry * r * Math.sin(rad(a)));
  const a = ang(v);
  if (hot) {
    const a0 = a - 9; // the earlier setting, drawn wider than a hair so it can be seen
    o += `<line x1="${f(cx)}" y1="${f(ty)}" x2="${px(a0, 0.96)}" y2="${py(a0, 0.96)}" class="ghost"/>`;
    o += `<line x1="${f(cx)}" y1="${f(ty)}" x2="${px(a, 0.96)}" y2="${py(a, 0.96)}" class="hot"/>`;
    o += `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx * 0.1)}" ry="${f(ry * 0.1)}" class="hotdot"/>`;
  } else {
    o += `<line x1="${f(cx)}" y1="${f(ty)}" x2="${px(a, 0.94)}" y2="${py(a, 0.94)}" class="ptr" style="stroke-width:${f(Math.max(0.7, 2.6 * Math.pow(s, 0.8)))}"/>`;
    if (rx >= 20) o += `<ellipse cx="${f(cx)}" cy="${f(ty)}" rx="${f(rx * 0.09)}" ry="${f(ry * 0.09)}" class="s"/>`;
  }
  if (rx >= 50) {
    const fs = 13.5 * Math.pow(s, 0.9);
    o += `<text x="${f(cx)}" y="${f(gy + ry * 1.5 + fs * 1.05)}" class="${hot ? 'num hotnum' : 'num'}" style="font-size:${f(fs)}px">${fmt(v)}</text>`;
  }
  return o;
}
const rows = [];
let row = 0, z = 1;
for (; ; row++, z += DZ) {
  const gy = YH + K / z, pitch = PITCH / z, rx = R0 / z;
  if (rx < 4.2) break;
  const off = row % 2 ? 0.5 : 0;
  let g = '';
  const n = Math.ceil(520 / pitch) + 1;
  for (let j = -n; j <= n; j++) {
    const cx = 480 + (j + off) * pitch;
    if (cx < 20 - rx * 1.5 || cx > 940 + rx * 1.5) continue;
    const hot = row === 0 && j === 0;
    const v = hot ? 0.4173 : Math.round((rnd() * 2 - 1) * 10000) / 10000;
    g += dial(cx, gy, z, v, hot);
  }
  rows.push(`    <!-- row ${row}: z = ${z.toFixed(2)}, ground y = ${f(gy)}, pitch ${f(pitch)} -->\n    <g>${g}</g>`);
}
// beyond: rows of dashes, one every 1.5 units of y, to the horizon
let far = '';
const yStart = YH + K / z;
for (let y = yStart, i = 0; y > YH + 2.2; y -= Math.max(1.7, (y - YH) * 0.1), i++) {
  const zz = K / (y - YH), pitch = PITCH / zz, rx = R0 / zz;
  far += `<line x1="20" y1="${f(y)}" x2="940" y2="${f(y)}" class="dash" style="stroke-width:${f(Math.max(0.45, Math.min(0.9, 9 / zz)))};stroke-dasharray:${f(rx * 2)} ${f(pitch - rx * 2)};stroke-dashoffset:${f(-(480 - 20 + (i % 2 ? pitch / 2 : 0) - rx) % pitch + pitch)}"/>`;
}
rows.reverse();
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p1-t p1-d">
  <title id="p1-t">DIA-001 · Hundreds of billions of dials</title>
  <desc id="p1-d">An engraved plate. A strip of paper across the top carries the sentence "A modern AI model is a very large file of", with the next word hidden under a hatched slip. Below it a panel of identical dials runs back to the horizon and off both sides of the plate. Each dial in the front rows has its setting written under it as a number. One dial at the front is drawn in rust, with a dashed line showing where its pointer stood a moment ago: it has been turned a hair, from 0.4172 to 0.4173.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .s { fill: var(--ink); }
      .h { fill: url(#p1-h); stroke: none; }
      .h2 { fill: url(#p1-h2); stroke: none; }
      .hb { fill: url(#p1-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ring { fill: none; stroke: var(--ink); stroke-dasharray: 0.6 2.4; stroke-linecap: round; }
      .far { fill: var(--paper); stroke: var(--ink); }
      .dash { stroke: var(--ink); fill: none; }
      .ptr { stroke: var(--ink); stroke-linecap: round; }
      .hot { stroke: var(--accent); stroke-width: 3.4; stroke-linecap: round; }
      .hotdot { fill: var(--accent); }
      .ghost { stroke: var(--soft); stroke-width: 1.2; stroke-dasharray: 3 3; }
      .turn { fill: none; stroke: var(--accent); stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .num { text-anchor: middle; letter-spacing: 0.02em; }
      .hotnum { fill: var(--accent); }
      .tape { font-size: 21px; }
      .it { font-size: 13.5px; font-style: italic; }
      .ac { fill: var(--accent); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Fredericka the Great", "Cormorant Garamond", Georgia, serif; font-size: 32px; letter-spacing: 0.01em; }
    </style>
    <pattern id="p1-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p1-h2" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="2.4" class="hl" style="stroke-width:0.5"/>
    </pattern>
    <clipPath id="p1-clip"><rect x="20.4" y="20.4" width="919.2" height="545.6"/></clipPath>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE I</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 1 · WHAT'S BEING BUILT</text>
  <!-- the strip of text. the slip that covered its last word is lifted aside, with the wrong guess written on it -->
  <path d="M 117 122 H 846 L 850 127 H 121 Z" class="h"/>
  <path d="M 112 84 H 846 L 832 103 L 846 122 H 112 L 126 103 Z" class="b"/>
  <text x="150" y="110" class="tape">A modern AI model is a very large file of <tspan font-weight="600">numbers.</tspan></text>
  <rect x="527" y="87" width="97" height="31" class="thin" stroke-dasharray="3 3"/>
  <g transform="translate(22 18) rotate(-6 676 84)">
    <rect x="676" y="62" width="118" height="44" class="h" transform="translate(4 5)"/>
    <rect x="672" y="58" width="118" height="44" class="b"/>
    <circle cx="681" cy="66" r="2.2" class="s"/>
    <text x="731" y="88" text-anchor="middle" class="tape" style="font-style:italic">words</text>
    <line x1="696" y1="81" x2="766" y2="81" class="turn" style="stroke-width:2"/>
  </g>
  <text x="150" y="152" class="it">Cover the next word and ask for a guess.</text>
  <text x="700" y="152" text-anchor="middle" class="it">The guess was “words.” The page says “numbers.”</text>
  <text x="42" y="190" class="it">Hundreds of billions of dials. Each setting is one number.</text>
  <!-- the bank of dials. x = 480 + 190 j / z, ground y = 205 + 280 / z, rows 0.45 apart in z, odd rows staggered half a pitch -->
  <g clip-path="url(#p1-clip)">
    <line x1="20" y1="${YH}" x2="940" y2="${YH}" class="thin"/>
    <g>${far}</g>
${rows.join('\n')}
  </g>
  <!-- front edge of the panel -->
  <rect x="20.4" y="566" width="919.2" height="8" class="h"/>
  <line x1="20.4" y1="566" x2="939.6" y2="566" class="l"/>
  <line x1="20.4" y1="574" x2="939.6" y2="574" class="thin"/>
  <!-- notes under the panel -->
  <text x="480" y="596" text-anchor="middle" class="it ac">So this dial is turned a hair: 0.4172 becomes 0.4173. So are the rest.</text>
  <text x="42" y="596" class="it">Billions of times, trillions of words.</text>
  <text x="918" y="596" text-anchor="end" class="it">One run: $100M to $1B+.</text>
  <!-- title and caption -->
  <text x="480" y="644" text-anchor="middle" class="title">Hundreds of Billions of Dials</text>
  <line x1="300" y1="660" x2="660" y2="660" class="thin"/>
  <text x="480" y="681" text-anchor="middle" class="cap">DIA-001 · The model is the settings: a file of numbers, each nudged a hair after every wrong guess at the next word.</text>
</svg>
`;
if (/\n\s*\n/.test(svg)) throw new Error('blank line in output');
writeFileSync(out, svg, 'utf8');
console.log('wrote', out, svg.length, 'bytes');
