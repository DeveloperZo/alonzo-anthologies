// Generates PLATE-007A-wall.svg. Usage: node gen-007a.mjs <out.svg>
import fs from 'node:fs';
const out = process.argv[2];
const f = (n) => (Math.round(n * 10) / 10).toString();
let seed = 7007;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const H = 690;
const BX = 42, BW = 146;           // bay i spans x = 42 + 146 i
const YT = 236, CH = 21, NC = 10;  // wall top, course height, courses
const YG = YT + CH * NC;           // ground, 446
const bay = (i) => BX + BW * i;
const mid = (i) => bay(i) + BW / 2;
const L = [];
const p = (s) => L.push(s);
// ---- wall presence: per course, a list of [x0, x1, kind] ----
const GC = 118; // centre of the breach in bay 0
const gapL = [], gapR = [];
for (let c = 0; c < NC; c++) {
  gapL.push(GC - (31 - 0.5 * c) - rnd() * 6);
  gapR.push(GC + (27 - 0.4 * c) + rnd() * 6);
}
const endR = (c) => (c >= 8 ? bay(2) : bay(2) + (c % 2 ? 6 : -8));
const PIER0 = bay(3), PIER1 = bay(3) + BW * 8 / 27; // 8 of 27 parts of the bay
const rows = [];
for (let c = 0; c < NC; c++) {
  const r = [];
  r.push([30, gapL[c], 'old']);
  if (c === 0) { r.push([gapR[c], 250, 'old']); r.push([288, endR(c), 'old']); }
  else r.push([gapR[c], endR(c), 'old']);
  if (c >= 8) r.push([bay(2), bay(4), 'new']);
  else r.push([PIER0, PIER1, 'new']);
  rows.push(r);
}
// ---- stones ----
const stones = []; // {x0,x1,c,kind}
for (let c = 0; c < NC; c++) {
  // joints for old work: irregular. for new work: regular, half-lapped
  const jo = []; let x = 30 - rnd() * 30; while (x < 345) { x += 25 + rnd() * 22; jo.push(x); }
  const jn = []; for (let k = 0; k <= 8; k++) jn.push(bay(2) + 36.5 * k + (c % 2 ? 18.25 : 0));
  for (const [a, b, kind] of rows[c]) {
    const js = (kind === 'old' ? jo : jn).filter((j) => j > a + 7 && j < b - 7);
    const xs = [a, ...js, b];
    for (let k = 0; k < xs.length - 1; k++) stones.push({ x0: xs[k], x1: xs[k + 1], c, kind });
  }
}
const yc = (c) => YT + CH * c;
// exposed top edges of a course interval: interval minus the union of intervals above
function exposed(c, a, b) {
  if (c === 0) return [[a, b]];
  let segs = [[a, b]];
  for (const [u, v] of rows[c - 1]) {
    const nx = [];
    for (const [s, e] of segs) {
      if (v <= s || u >= e) { nx.push([s, e]); continue; }
      if (u > s) nx.push([s, u]);
      if (v < e) nx.push([v, e]);
    }
    segs = nx;
  }
  return segs.filter(([s, e]) => e - s > 0.2);
}
// ---- svg ----
p(`<svg viewBox="0 0 960 ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p7a-t p7a-d">`);
p(`  <title id="p7a-t">DIA-007A · A wall in six lengths</title>`);
p(`  <desc id="p7a-d">An engraved plate of one stone wall seen from the front, divided into six lengths, one for each constraint. The first two lengths, the electricity grid and chip supply, are old masonry at full height: the first has a breach with a road running through it, the second is cracked with stones fallen from the top. The next two, product liability and the EU AI Act, are new work: liability is two courses of footing, and the EU AI Act is raised to full height for eight twenty-sevenths of its length and footing for the rest. The fifth length, interpretability, is only pegs and string with a dashed outline where the wall would stand. The sixth, open weights, is bare ground.</desc>`);
p(`  <defs>`);
p(`    <style>`);
p(`      @import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');`);
p(`      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }`);
p(`      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }`);
p(`      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }`);
p(`      .paper { fill: var(--paper); }`);
p(`      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }`);
p(`      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }`);
p(`      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }`);
p(`      .h { fill: url(#p7a-h); stroke: none; }`);
p(`      .hb { fill: url(#p7a-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }`);
p(`      .hl { stroke: var(--ink); stroke-width: 0.6; }`);
p(`      .st { fill: var(--paper); stroke: var(--ink); stroke-width: 0.8; stroke-linejoin: round; }`);
p(`      .sh { fill: url(#p7a-h); stroke: var(--ink); stroke-width: 0.8; stroke-linejoin: round; }`);
p(`      .dk { fill: url(#p7a-x); stroke: var(--ink); stroke-width: 0.7; stroke-linejoin: round; }`);
p(`      .g { fill: none; stroke: var(--soft); stroke-width: 1; stroke-dasharray: 5 4; }`);
p(`      .ga { fill: none; stroke: var(--accent); stroke-width: 1.4; stroke-dasharray: 5 4; }`);
p(`      .road { fill: none; stroke: var(--accent); stroke-width: 1.6; stroke-linecap: round; }`);
p(`      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }`);
p(`      .tier { font-size: 10.5px; letter-spacing: 0.16em; text-anchor: middle; }`);
p(`      .pt { font-size: 12px; font-style: italic; text-anchor: middle; fill: var(--soft); }`);
p(`      .name { font-size: 11px; letter-spacing: 0.1em; text-anchor: middle; }`);
p(`      .stat { font-size: 14px; font-style: italic; text-anchor: middle; }`);
p(`      .it { font-size: 13px; font-style: italic; }`);
p(`      .cap { font-size: 12.5px; fill: var(--soft); }`);
p(`      .title { font-family: "Fredericka the Great", "Cormorant Garamond", Georgia, serif; font-size: 32px; letter-spacing: 0.01em; }`);
p(`    </style>`);
p(`    <pattern id="p7a-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`);
p(`      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>`);
p(`    </pattern>`);
p(`    <pattern id="p7a-x" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">`);
p(`      <line x1="0" y1="0" x2="0" y2="2.2" class="hl" style="stroke-width:1"/>`);
p(`    </pattern>`);
p(`  </defs>`);
p(`  <rect width="960" height="${H}" class="paper"/>`);
p(`  <rect x="14" y="14" width="932" height="${H - 28}" class="l" style="stroke-width:1.2"/>`);
p(`  <rect x="20" y="20" width="920" height="${H - 40}" class="thin"/>`);
p(`  <text x="42" y="50" class="sc">PLATE VII A</text>`);
p(`  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 7 · SAFETY RISK AND BINDING CONSTRAINTS</text>`);
p(`  <text x="480" y="98" text-anchor="middle" class="it" style="font-size:15px">A binding constraint limits what is possible, not merely what is permitted:</text>`);
p(`  <text x="480" y="118" text-anchor="middle" class="it" style="font-size:15px">a wall, rather than a posted speed limit.</text>`);
// group brackets
p(`  <!-- the three patterns. bay i spans x = ${BX} + ${BW} i; each bracket covers two bays -->`);
const groups = [['PHYSICAL', 'never built to govern, and gone around'], ['LEGAL', 'sound in design, not yet raised'], ['STRUCTURAL', 'facts that limit what governance can reach']];
groups.forEach((g, k) => {
  const x0 = bay(2 * k) + 8, w = 2 * BW - 16, cx = bay(2 * k) + BW;
  p(`  <text x="${cx}" y="160" class="tier">${g[0]}</text><text x="${cx}" y="177" class="pt">${g[1]}</text><path d="M ${x0} 194 v -6 h ${w} v 6" class="thin"/>`);
});
// what shows through the breach: horizon and a road
p(`  <!-- through the breach: a horizon, and the road that goes through -->`);
const RC = GC + 3;
p(`  <line x1="${f(GC - 46)}" y1="396" x2="${f(GC + 46)}" y2="396" class="thin" style="stroke:var(--soft)"/>`);
p(`  <path d="M ${f(RC - 17)} ${YG} Q ${f(RC - 7)} 424 ${f(RC - 3)} 396 M ${f(RC + 17)} ${YG} Q ${f(RC + 7)} 424 ${f(RC + 3)} 396" class="road"/>`);
p(`  <path d="M ${f(RC)} 440 v -7 M ${f(RC)} 427 v -6 M ${f(RC)} 416 v -5 M ${f(RC)} 407 v -4" class="thin" style="stroke:var(--accent)"/>`);
// shadowed returns on right-facing broken ends
p(`  <!-- shadowed returns: the thickness of the wall seen at each broken end -->`);
{
  let s = '  <g class="dk">';
  for (let c = 0; c < NC; c++) s += `<rect x="${f(gapL[c])}" y="${yc(c)}" width="9" height="${CH}"/>`;
  for (let c = 0; c < 8; c++) s += `<rect x="${f(endR(c))}" y="${yc(c)}" width="9" height="${CH}"/>`;
  s += '</g>';
  p(s);
}
// stones
p(`  <!-- masonry: ${NC} courses of ${CH}, wall top y = ${YT}, ground y = ${YG}. old work irregular, new work in regular half-lap -->`);
for (let c = 0; c < NC; c++) {
  let s = '  <g>';
  for (const st of stones.filter((q) => q.c === c)) {
    const hatched = st.kind === 'old' ? rnd() < 0.3 : rnd() < 0.07;
    s += `<rect x="${f(st.x0)}" y="${yc(c)}" width="${f(st.x1 - st.x0)}" height="${CH}" class="${hatched ? 'sh' : 'st'}"/>`;
  }
  s += '</g>';
  p(s);
}
// weathering on the old work: short chips
{
  let s = '  <path class="thin" d="';
  for (const st of stones.filter((q) => q.kind === 'old')) {
    if (rnd() < 0.35) { const x = st.x0 + 4 + rnd() * (st.x1 - st.x0 - 12), y = yc(st.c) + 5 + rnd() * 10; s += `M ${f(x)} ${f(y)} l ${f(3 + rnd() * 5)} ${f(rnd() * 3 - 1.5)} `; }
  }
  p(s.trim() + '"/>');
}
// heavy outline
p(`  <!-- outline of the standing work -->`);
{
  let d = '';
  for (let c = 0; c < NC; c++) for (const [a, b] of rows[c]) {
    d += `M ${f(a)} ${yc(c)} v ${CH} M ${f(b)} ${yc(c)} v ${CH} `;
    for (const [s, e] of exposed(c, a, b)) d += `M ${f(s)} ${yc(c)} H ${f(e)} `;
  }
  p(`  <path d="${d.trim()}" class="l" style="stroke-width:1.6"/>`);
}
// coping on work that reaches full height
p(`  <!-- coping stones where the wall reaches its full height -->`);
{
  let s = '  <g class="b">';
  const cope = (a, b) => { const n = Math.max(1, Math.round((b - a) / 44)); const w = (b - a + 6) / n; for (let k = 0; k < n; k++) s += `<rect x="${f(a - 3 + w * k)}" y="${YT - 9}" width="${f(w)}" height="9"/>`; };
  cope(30, gapL[0] - 6); cope(gapR[0] + 6, 250 - 5); cope(288 + 5, endR(0) - 4); cope(PIER0, PIER1);
  s += '</g>';
  p(s);
  p(`  <g class="h"><rect x="30" y="${YT}" width="${f(gapL[0] - 30)}" height="4.5"/><rect x="${f(gapR[0])}" y="${YT}" width="${f(250 - gapR[0])}" height="4.5"/><rect x="288" y="${YT}" width="${f(endR(0) - 288)}" height="4.5"/><rect x="${PIER0}" y="${YT}" width="${f(PIER1 - PIER0)}" height="4.5"/></g>`);
}
// the crack in bay 1
{
  let x = 270, y = yc(1); let d = `M ${x} ${y}`;
  for (let c = 1; c < 8; c++) { const dx1 = rnd() * 10 - 6, dx2 = rnd() * 12 - 5; d += ` l ${f(dx1)} ${f(CH * 0.55)} l ${f(dx2)} ${f(CH * 0.45)}`; x += dx1 + dx2; }
  p(`  <path d="${d}" class="l" style="stroke-width:1.5"/>`);
  p(`  <path d="M 270 ${yc(4) + 6} l 14 9 l 3 12 M 262 ${yc(6) + 2} l -12 8" class="thin"/>`);
}
// fallen stones
p(`  <!-- fallen stones at the breach and under the crack -->`);
const block = (x, y, w, h, rot, cls) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})"><rect x="${f(-w / 2)}" y="${f(-h)}" width="${w}" height="${h}" class="b"/>${cls === 'hb' ? `<rect x="${f(-w / 2)}" y="${f(-h)}" width="${f(w * 0.42)}" height="${h}" class="h"/>` : `<path d="M ${f(-w / 2 + 5)} ${f(-h + 5)} h ${f(w * 0.3)}" class="thin"/>`}</g>`;
p(`  <g>${block(62, YG, 30, 17, -8, 'b')}${block(176, YG, 32, 18, 5, 'hb')}${block(194, YG - 17, 24, 15, -17, 'b')}${block(254, YG, 30, 18, 9, 'b')}${block(292, YG, 26, 16, -6, 'hb')}</g>`);
// dressed blocks waiting on the liability footing
p(`  <!-- dressed blocks waiting on the footing -->`);
p(`  <g>${block(bay(2) + 96, yc(8), 36, 19, 0, 'b')}${block(bay(2) + 121, yc(8) - 19, 36, 19, 0, 'b')}${block(bay(2) + 60, yc(8), 36, 19, 0, 'hb')}</g>`);
// intended height over unfinished work
p(`  <!-- where the wall was meant to stand: soft dashes over unfinished work, rust dashes where nothing has been built -->`);
p(`  <path d="M ${f(endR(0) + 14)} ${YT} H ${PIER0 - 8} M ${f(PIER1 + 8)} ${YT} H ${bay(4)}" class="g"/>`);
p(`  <path d="M ${bay(4)} ${YT} H ${bay(5)} V ${YG - 3} M ${bay(4)} ${YT} V ${yc(8) - 4}" class="ga"/>`);
p(`  <text x="${bay(2) + 78}" y="${YT - 8}" text-anchor="middle" class="pt" style="font-size:11.5px">intended height</text>`);
// pegs and string in bay 4
p(`  <!-- pegs and string: marked out, never built -->`);
{
  const xs = [bay(4) + 20, bay(4) + 73, bay(4) + 128];
  let s = `  <path d="M ${xs[0]} ${YG - 24} Q ${(xs[0] + xs[1]) / 2} ${YG - 21.5} ${xs[1]} ${YG - 24} Q ${(xs[1] + xs[2]) / 2} ${YG - 21.5} ${xs[2]} ${YG - 24}" class="thin" style="stroke-width:0.9"/>`;
  p(s);
  s = '  <g class="hb" style="stroke-width:1.1">';
  for (const x of xs) s += `<path d="M ${x - 3} ${YG} L ${x - 3.6} ${YG - 30} L ${x} ${YG - 34} L ${x + 3.6} ${YG - 30} L ${x + 3} ${YG} Z"/>`;
  s += '</g>';
  p(s);
  s = '  <g class="thin">';
  for (const x of xs) s += `<path d="M ${x - 4.2} ${YG - 25.5} h 8.4 M ${x - 4.2} ${YG - 23} h 8.4"/>`;
  s += '</g>';
  p(s);
}
// open ground in bay 5
p(`  <!-- open ground: tufts, nothing else -->`);
{
  let s = '  <path class="thin" d="';
  for (const x of [bay(5) + 22, bay(5) + 58, bay(5) + 97, bay(5) + 128, bay(4) + 46, bay(4) + 100]) s += `M ${x} ${YG} q -2 -6 -5 -8 M ${x + 1} ${YG} q 0 -7 1 -10 M ${x + 2} ${YG} q 2 -5 6 -7 `;
  p(s.trim() + '"/>');
}
p(`  <text x="${mid(5)}" y="${YT + 86}" text-anchor="middle" class="it" style="fill:var(--accent)">Nothing to wall in.</text>`);
p(`  <text x="${mid(5)}" y="${YT + 104}" text-anchor="middle" class="it" style="fill:var(--accent)">The models are out.</text>`);
// ground
p(`  <!-- ground -->`);
p(`  <rect x="30" y="${YG}" width="900" height="7" class="h"/>`);
p(`  <line x1="30" y1="${YG}" x2="930" y2="${YG}" class="l"/>`);
// EU scale: 27 parts under bay 3, the first 8 raised. SCALE: bay width ${BW} = 27 member states
p(`  <!-- SCALE for the EU AI Act length: ${BW} units = 27 member states, so 8 states = ${f(BW * 8 / 27)} units raised to full height -->`);
{
  let d = '';
  for (let k = 0; k <= 27; k++) d += `M ${f(bay(3) + BW * k / 27)} ${YG + 11} v ${k === 0 || k === 8 || k === 27 ? 7 : 3.5} `;
  p(`  <path d="${d.trim()}" class="thin"/>`);
}
// labels
const labels = [
  ['ELECTRICITY GRID', 'bypassed', ['Four firms signed 10+ GW', 'of nuclear power in 18', 'months. It slows the rest.']],
  ['CHIP SUPPLY', 'weakening', ['A $2.5B smuggling case,', 'a domestic 7nm fab, and', 'models that need fewer.']],
  ['PRODUCT LIABILITY', 'forming', ['Suits filed, one settled.', 'No appeals court has yet', 'set a binding precedent.']],
  ['EU AI ACT', '8 of 27 raised', ['Penalties apply from', '2 August 2026. 8 of 27', 'states had an enforcer.']],
  ['INTERPRETABILITY', 'marked out, not built', ['Should cap what ships, as', 'in any high-stakes field.', 'Not yet workable at scale.']],
  ['OPEN WEIGHTS', 'out of reach', ['A released model cannot', 'be recalled. Each one', 'shrinks what rules reach.']],
];
labels.forEach((lb, i) => {
  const x = mid(i);
  let s = `  <text x="${x}" y="${YG + 40}" class="name">${lb[0]}</text><text x="${x}" y="${YG + 59}" class="stat">${lb[1]}</text>`;
  lb[2].forEach((t, j) => { s += `<text x="${x}" y="${YG + 78 + 15 * j}" class="pt">${t}</text>`; });
  p(s);
});
const TY = YG + 78 + 30 + 58;
p(`  <!-- title and caption -->`);
p(`  <text x="480" y="${TY}" text-anchor="middle" class="title">A Wall in Six Lengths</text>`);
p(`  <line x1="300" y1="${TY + 18}" x2="660" y2="${TY + 18}" class="thin"/>`);
p(`  <text x="480" y="${TY + 39}" text-anchor="middle" class="cap">DIA-007A · Six constraints on AI, drawn as the wall the word implies. No length of it stands whole.</text>`);
p(`</svg>`);
fs.writeFileSync(out, L.join('\n') + '\n');
console.log('wrote', out, 'TY', TY, 'H', H);
