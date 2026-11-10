// Generator for PLATE-203-stone-in-stream.svg
// A sequence strip of three frames, drawn only in flowing line.
// Run: node _KNOWLEDGE/Diagrams/proposals/PLATE-203-stone-in-stream.gen.mjs
import { writeFileSync } from 'node:fs';

// ---------- layout (all by rule) ----------
const W = 280, H = 448;            // one frame
const GAP = 16;                    // gutter between frames
const FX = i => 44 + (W + GAP) * i; // frame i left edge: 44, 340, 636
const FY = 92;                     // frame top
const STEP = 4;                    // sampling pitch along a current line

// ---------- deterministic random ----------
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(203);
const f1 = v => (Math.round(v * 10) / 10).toString();

// ---------- the river: one family of current lines ----------
// b(x; Y) is periodic in x with period W, so a line leaves one frame at the
// height where it enters the next. dB/dY stays above 0.6, so lines never cross.
const TAU = Math.PI * 2;
function b(x, Y) {
  const k = TAU * x / W;
  return Y + 17 * Math.sin(k + 0.9 + Y / 160) + 9 * Math.sin(2 * k + 2.1 - Y / 60) + 3.5 * Math.sin(3 * k + 0.4 + Y / 45);
}
// line labels Y, with spacing that bunches and opens (8 to 14 units)
const lines = [];
{
  let Y = -34, i = 0;
  while (Y < H + 34) {
    const heavy = i % 3 === 0;
    const weight = heavy ? 3.0 + R() * 0.9 : 0.8 + R() * 0.8;
    // strokes laid round a circle of length W, so the pattern is periodic too
    const strokes = [];
    let s = R() * W; const end = s + W;
    while (s < end - 24) {
      let len = 45 + R() * 130;
      const gap = 10 + R() * 20;
      if (s + len > end - gap) len = end - gap - s;
      strokes.push({ s, e: s + len, w: weight * (0.8 + R() * 0.4), skew: 1.7 + R() * 0.9 });
      s += len + gap;
    }
    lines.push({ Y, strokes });
    Y += 9 + 4.5 * (1 + Math.sin(i * 0.9 + 0.6)) * 0.5 + R() * 1.5;
    i++;
  }
}

// ---------- the stone ----------
// The stone lies on a current line midway between two drawn lines, at the place
// where that line runs level, so the water parts evenly above and below it.
let CX = 108, YC = 196;
{
  let bestS = 1e9;
  for (let i = 0; i < lines.length - 1; i++) {
    const Y = (lines[i].Y + lines[i + 1].Y) / 2;
    if (Y < 150 || Y > 235) continue;
    for (let x = 92; x <= 124; x++) { const sl = Math.abs(b(x + 1, Y) - b(x - 1, Y)); if (sl < bestS) { bestS = sl; CX = x; YC = Y; } }
  }
}
const c = x => b(x, YC);           // the centre current line
const CY = c(CX);
const SR = 24;                     // stone radius
function stonePath(rot) {
  const pts = [];
  for (let k = 0; k < 72; k++) {
    const t = TAU * k / 72;
    const r = SR * (1 + 0.10 * Math.cos(2 * t + 0.6) + 0.07 * Math.cos(3 * t + 1.9) + 0.03 * Math.cos(5 * t));
    const x = 1.16 * r * Math.cos(t), y = 0.92 * r * Math.sin(t);
    pts.push([x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return 'M ' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L ') + ' Z';
}

// ---------- frame two: the current parts and rejoins ----------
// h(t): half thickness of the parted water at distance t downstream of the stone.
// It is zero at both frame edges, so the lines meet the river exactly there.
const HMAX = 34, WAKE = 150, LAM = 58;
function h(t) {
  if (t <= 0) return HMAX * Math.exp(-(t / 44) * (t / 44));
  if (t >= WAKE) return 0;
  const q = Math.cos(Math.PI * t / (2 * WAKE));
  return HMAX * q * q;
}
function part(x, Y) {
  const d = b(x, Y) - c(x);
  const hh = h(x - CX);
  const e = Math.exp(-Math.abs(d) / LAM);
  return { y: c(x) + d + Math.sign(d) * hh * e, squeeze: 1 - (hh / LAM) * e };
}

// ---------- ribbons: a line that swells and thins ----------
function ribbon(pts) {              // pts: [x, y, width]
  if (pts.length < 3) return '';
  const L = [], Rr = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(pts.length - 1, i + 1)];
    let dx = p1[0] - p0[0], dy = p1[1] - p0[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    Rr.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const all = L.concat(Rr.reverse()).map(p => [Math.round(p[0] * 10), Math.round(p[1] * 10)]);
  let d = 'M' + all[0][0] / 10 + ' ' + all[0][1] / 10 + 'l';
  for (let i = 1; i < all.length; i++) d += (i > 1 ? ' ' : '') + (all[i][0] - all[i - 1][0]) / 10 + ' ' + (all[i][1] - all[i - 1][1]) / 10;
  return d + 'z';
}
// swell profile along a stroke, u from 0 to 1, heavier toward the head
function swell(u, skew) { const v = Math.pow(u, skew); return Math.pow(Math.sin(Math.PI * v), 0.75); }
function water(mode) {
  let d = '';
  for (const ln of lines) for (const st of ln.strokes) for (const shift of [0, -W]) {
    const s = st.s + shift, e = st.e + shift;
    if (e < -8 || s > W + 8) continue;
    const pts = [];
    const n = Math.max(4, Math.round((e - s) / STEP));
    for (let i = 0; i <= n; i++) {
      const x = s + (e - s) * i / n;
      if (x < -12 || x > W + 12) continue;
      let y, w = st.w * swell(i / n, st.skew);
      if (mode === 'part') { const p = part(x, ln.Y); y = p.y; w *= Math.pow(Math.max(0.35, p.squeeze), 0.8); }
      else y = b(x, ln.Y);
      pts.push([x, y, Math.max(0.05, w)]);
    }
    d += ribbon(pts);
  }
  return d;
}

// ---------- frame one: the splash ----------
// The water is entered at E. Rings are ellipses round E (the surface seen at a
// slant), the spray stands up from the lip, and the stone is cut by the near lip.
const EX = CX, EY = CY + 2;
const DRX = 98, DRY = 38;          // the broken water round the stone
const LIPX = 35, LIPY = 12.5;      // the hole the stone goes through
function ell(a, k) { return [EX + DRX * k * Math.cos(a), EY + DRY * k * Math.sin(a)]; }
function arc(rx, ry, a0, a1, wt, skew) {
  const pts = [];
  for (let i = 0; i <= 30; i++) { const u = i / 30, a = a0 + (a1 - a0) * u; pts.push([EX + rx * Math.cos(a), EY + ry * Math.sin(a), Math.max(0.05, wt * swell(u, skew))]); }
  return ribbon(pts);
}
function rings() {
  let d = '';
  // near lip heavy, far lip light
  d += arc(LIPX, LIPY, 0.08, Math.PI - 0.08, 3.4, 1);
  // two widening rings, broken into arcs: radius factor, weight, arcs, phase
  for (const [k, wt, n, ph] of [[0.64, 2.8, 4, 0.55], [0.92, 1.7, 5, 0.2]]) for (let j = 0; j < n; j++)
    d += arc(DRX * k, DRY * k, ph + TAU * j / n + 0.09, ph + TAU * (j + 1) / n - 0.09, wt * (Math.sin(ph + TAU * (j + 0.5) / n) > 0 ? 1 : 0.7), 0.9);
  return d;
}
// spray tongue j of N stands on the far lip at angle a and leans outward
function crown() {
  let d = '', drops = '';
  const N = 9;
  for (let j = 0; j < N; j++) {
    const a = Math.PI + 0.12 + (Math.PI - 0.24) * j / (N - 1);
    const ca = Math.cos(a), mid = 1 - Math.abs(ca);
    const bx = EX + LIPX * ca, by = EY + LIPY * Math.sin(a);
    const ht = 38 + 46 * mid + R() * 12;
    const lean = ca * (22 + R() * 8) + (R() - 0.5) * 6;
    const qx = bx + lean * 0.12, qy = by - ht * 0.8;      // control point: rises, then falls outward
    const tx = bx + lean, ty = by - ht;
    const pts = [];
    for (let i = 0; i <= 22; i++) {
      const u = i / 22, v = 1 - u;
      pts.push([v * v * bx + 2 * v * u * qx + u * u * tx, v * v * by + 2 * v * u * qy + u * u * ty, 0.1 + (5.4 + 2.4 * mid) * Math.pow(v, 0.9) * Math.min(1, Math.pow(u / 0.16, 0.6))]);
    }
    d += ribbon(pts);
    const ox = lean === 0 ? 0 : Math.sign(lean);
    drops += `<circle cx="${f1(tx + ox * 6 + lean * 0.12)}" cy="${f1(ty - 5)}" r="${f1(1.5 + mid)}"/>`;
    if (j % 2 === 0 && mid > 0.3) drops += `<circle cx="${f1(tx + ox * 13 + lean * 0.3)}" cy="${f1(ty + 3)}" r="1.2"/>`;
  }
  // three short tongues on the near lip
  for (const [a, ht] of [[0.62, 13], [1.5, 9], [2.5, 14]]) {
    const bx = EX + LIPX * Math.cos(a), by = EY + LIPY * Math.sin(a);
    const pts = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([bx + Math.cos(a) * 9 * u * u, by - ht * u, 0.1 + 3.6 * Math.pow(1 - u, 0.8) * Math.min(1, Math.pow(u / 0.2, 0.6))]); }
    d += ribbon(pts);
  }
  return { d, drops };
}

// ---------- frame two: the eddy behind the stone ----------
function spiral(t, off, r0, dir, turns, wt) {
  const ex = CX + t, ey = c(ex) + off;
  const pts = []; const n = Math.round(turns * 28);
  for (let i = 0; i <= n; i++) {
    const u = i / n, th = turns * TAU * u;
    const r = r0 * Math.exp(-0.2 * th);
    const a = (dir > 0 ? -2.2 : 2.2) + dir * th;
    pts.push([ex + r * Math.cos(a), ey + r * Math.sin(a), Math.max(0.05, wt * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.5)), 0.8))]);
  }
  return ribbon(pts);
}
function eddy() {
  let d = '';
  d += spiral(47, -12, 11.5, 1, 1.8, 2.6) + spiral(47, 12, 11.5, -1, 1.8, 2.6);
  d += spiral(82, -6.5, 6, 1, 1.3, 1.7) + spiral(87, 6.5, 6, -1, 1.3, 1.7);
  d += spiral(112, 0, 3.6, 1, 0.9, 1.1);
  return d;
}

// ---------- assemble ----------
const crownParts = crown();
const facets = 'M -17 -6 q 10 -9 24 -6 M -8 4 q 12 -5 26 1 M -19 6 q 6 8 18 9';
const frameRule = i => `<rect x="${FX(i)}" y="${FY}" width="${W}" height="${H}" class="fr"/>`;
const NOTE_Y = FY + H + 27;
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p203b-t p203b-d">
  <title id="p203b-t">DIA-203 · A stone in the stream</title>
  <desc id="p203b-d">Three tall frames side by side show one stretch of a river, drawn only in long flowing current lines that swell and thin, in the manner of a woodblock print. In the first frame a rust stone has just been dropped in: it breaks the surface, spray standing up round it and broken rings widening on the water. In the second the stone lies on the bed, the current lines part round it, close up behind it, and two small eddies curl in its wake. The third frame, a little way downstream, holds no stone, and its current lines are the very same lines as the undisturbed water of the first frame.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .fr { fill: none; stroke: var(--ink); stroke-width: 0.9; }
      .w { fill: var(--ink); stroke: none; }
      .halo { fill: var(--paper); stroke: var(--paper); stroke-width: 4; stroke-linejoin: round; }
      .stone { fill: var(--accent); stroke: none; }
      .facet { fill: none; stroke: var(--paper); stroke-width: 1.1; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14px; font-style: italic; }
      .ita { font-size: 14px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <clipPath id="p203b-lip"><rect x="${EX - 60}" y="${f1(EY - 80)}" width="120" height="80"/><ellipse cx="${EX}" cy="${f1(EY)}" rx="${LIPX}" ry="${LIPY}"/></clipPath>
    <clipPath id="p203b-clip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
    <!-- the river undisturbed: one line set, used whole in frame three and under the splash in frame one -->
    <path id="p203b-river" class="w" d="${water('base')}"/>
    <path id="p203b-stone" class="stone" d="${stonePath(0)}"/>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE III</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · CONSTANTS, BUFFERS, AND INFRASTRUCTURE</text>
  <text x="${FX(0) + 2}" y="${FY - 9}" class="sm">one</text>
  <text x="${FX(1) + 2}" y="${FY - 9}" class="sm">two</text>
  <text x="${FX(2) + 2}" y="${FY - 9}" class="sm">three</text>
  <!-- frame one: the stone goes in. stone centre (${CX}, ${f1(CY)}) frame-local -->
  <g transform="translate(${FX(0)} ${FY})" clip-path="url(#p203b-clip)">
    <use href="#p203b-river"/>
    <ellipse cx="${EX}" cy="${f1(EY)}" rx="${DRX}" ry="${DRY}" class="paper"/>
    <ellipse cx="${EX}" cy="${f1(EY - 52)}" rx="90" ry="74" class="paper"/>
    <path class="halo" d="${crownParts.d}"/>
    <g class="halo">${crownParts.drops}</g>
    <path class="w" d="${crownParts.d}"/>
    <g class="w">${crownParts.drops}</g>
    <g clip-path="url(#p203b-lip)"><g transform="translate(${CX} ${f1(CY)}) rotate(-24)"><use href="#p203b-stone"/><path d="${facets}" class="facet"/></g></g>
    <path class="w" d="${rings()}"/>
  </g>
  <!-- frame two: the same lines, parted by h(t) and met again at both edges -->
  <g transform="translate(${FX(1)} ${FY})" clip-path="url(#p203b-clip)">
    <path class="w" d="${water('part')}"/>
    <path class="w" d="${eddy()}"/>
    <g transform="translate(${CX} ${f1(CY)}) rotate(8)"><use href="#p203b-stone"/><path d="${facets}" class="facet"/></g>
  </g>
  <!-- frame three: the river undisturbed, the identical line set -->
  <g transform="translate(${FX(2)} ${FY})" clip-path="url(#p203b-clip)">
    <use href="#p203b-river"/>
  </g>
  ${frameRule(0)}${frameRule(1)}${frameRule(2)}
  <text x="${FX(0) + W / 2}" y="${NOTE_Y}" text-anchor="middle" class="ita">a filter, a rate limit, a threshold, a usage cap</text>
  <text x="${FX(1) + W / 2}" y="${NOTE_Y}" text-anchor="middle" class="it">the current goes round</text>
  <text x="${FX(2) + W / 2}" y="${NOTE_Y}" text-anchor="middle" class="it">downstream, the same river</text>
  <text x="480" y="645" text-anchor="middle" class="title">A Stone in the Stream</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-203 · A system absorbs a parameter change and carries on.</text>
</svg>
`;
if (/\n\s*\n/.test(svg.trim())) throw new Error('blank line inside svg');
if (/[—§]/.test(svg)) throw new Error('banned character');
writeFileSync(new URL('./PLATE-203-stone-in-stream.svg', import.meta.url), svg);
console.log('wrote', svg.length, 'bytes;', lines.length, 'lines; stone at', CX, f1(CY));
