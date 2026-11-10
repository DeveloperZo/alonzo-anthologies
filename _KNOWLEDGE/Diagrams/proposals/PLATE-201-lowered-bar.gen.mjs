// Generates PLATE-201-lowered-bar.svg: a high-jump pit in two-point perspective,
// drawn in the manner of a mid-century athletics coaching manual (ink line and stipple).
// Run: node PLATE-201-lowered-bar.gen.mjs
import { writeFileSync } from 'node:fs';
// ---- camera. World units are metres: x across the pit, y up, z away from the run-up.
// The eye looks level (verticals stay vertical), so the horizon sits at eye height.
const E = [-5.5, 1.5, -7];
const TH = (36 * Math.PI) / 180;
const F = 1360, X0 = 575, YH = 270;
const fx = Math.sin(TH), fz = Math.cos(TH);
const proj = (x, y, z) => {
  const dx = x - E[0], dz = z - E[2];
  const d = dx * fx + dz * fz;
  const r = dx * fz - dz * fx;
  return [X0 + (F * r) / d, YH - (F * (y - E[1])) / d, d];
};
const unproj = (sx, sy) => {
  const d = (F * E[1]) / (sy - YH);
  const r = ((sx - X0) * d) / F;
  return [E[0] + d * fx + r * fz, E[2] + d * fz - r * fx, d];
};
const n1 = (v) => (Math.round(v * 10) / 10).toString();
const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;
const poly = (pts3, cls, extra = '') => `<path d="M ${pts3.map((p) => pt(proj(...p))).join(' L ')} Z" class="${cls}"${extra}/>`;
const line3 = (a, b, cls, extra = '') => `<path d="M ${pt(proj(...a))} L ${pt(proj(...b))}" class="${cls}"${extra}/>`;
// ---- deterministic random
let seed = 20260211;
const rnd = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
// the scene fades out toward the frame instead of being cut by a box
const fade = (sx, sy) => smooth(30, 80, sx) * smooth(930, 880, sx) * smooth(590, 566, sy);
// ---- the pit, in metres
const XN = -2, XF = 2, PW = 0.11, PH = 2.5; // standards 4 m apart, 11 cm square, 2.5 m tall
const HOLE0 = 0.2, HOLESTEP = 0.1, HOLEN = 22; // peg holes every 10 cm from 0.2 m to 2.3 m
const HOLD = 2.0; // the original height
const HNEW = 0.3; // the hole now in use: second from the bottom
const BARR = 0.03; // bar radius
const BARY = HNEW + 0.015 + BARR, SAG = 0.035, BARHALF = 1.88, SUP = 1.8;
const BED = { x0: -2.7, x1: 2.9, z0: 1.1, z1: 3.4 }; // the sand pit, set back from the bar
const barY = (x) => BARY - SAG * (1 - (x / SUP) ** 2);
// ---- exclusion zones in plate units, so no mark touches a label
const LAB2 = { cx: 592, cy: 531, w: 232, h: 30, a: -7.2 };
const inLab2 = (sx, sy) => {
  const a = (-LAB2.a * Math.PI) / 180, dx = sx - LAB2.cx, dy = sy - LAB2.cy;
  const u = dx * Math.cos(a) - dy * Math.sin(a), v = dx * Math.sin(a) + dy * Math.cos(a);
  return Math.abs(u) < LAB2.w / 2 && Math.abs(v) < LAB2.h / 2;
};
const barPts = [];
for (let i = 0; i <= 60; i++) { const x = -BARHALF + (2 * BARHALF * i) / 60; barPts.push(proj(x, barY(x), 0)); }
const nearBar = (sx, sy, lim) => barPts.some((p) => Math.hypot(p[0] - sx, p[1] - sy) < lim);
// dropped pegs on the grass: centre (x, z), heading in degrees
const DROPPED = [{ x: -2.84, z: -0.22, a: 34 }, { x: -3.08, z: 0.12, a: -24 }];
const nearDropped = (sx, sy) => DROPPED.some((p) => { const s = proj(p.x, 0, p.z); return Math.hypot(s[0] - sx, (s[1] - sy) * 1.6) < 34; });
// ---- ground regions
const inApron = (x, z) => z < BED.z0 && Math.abs(x) < 2.3 + 0.2 * (BED.z0 - z);
const inBed = (x, z) => x > BED.x0 && x < BED.x1 && z > BED.z0 && z < BED.z1;
// ---- stipple collectors
const dots = { ink: [], soft: [], top: [], tree: [], under: [] };
// dots keep a minimum spacing from their neighbours, so tone reads as stipple and not as noise
const grid = new Map();
const dot = (sx, sy, k = 'ink', minD = 1.9) => {
  const ix = Math.floor(sx / 4), iy = Math.floor(sy / 4);
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
    const c = grid.get(k + ':' + (ix + a) + ':' + (iy + b));
    if (c && c.some((q) => Math.hypot(q[0] - sx, q[1] - sy) < minD)) return;
  }
  const key = k + ':' + ix + ':' + iy;
  if (!grid.has(key)) grid.set(key, []);
  grid.get(key).push([sx, sy]);
  dots[k].push(`M${n1(sx)} ${n1(sy)}h.01`);
};
// stipple a 3D quad a + u (b - a) + v (c - a); dens(u, v) is the keep probability
const stippleQuad = (a, b, c, n, dens, test = () => true, k = 'ink') => {
  for (let i = 0; i < n; i++) {
    const u = rnd(), v = rnd();
    const dn = dens(u, v);
    if (rnd() > dn) continue;
    const p = [0, 1, 2].map((j) => a[j] + u * (b[j] - a[j]) + v * (c[j] - a[j]));
    const s = proj(...p);
    if (!test(s[0], s[1])) continue;
    if (rnd() > fade(s[0], s[1]) + 0.02) continue;
    dot(s[0], s[1], k, 0.95 + 3.1 * (1 - Math.min(1, dn)));
  }
};
const out = [];
// ---- 1. distant tree line on the horizon, stippled
{
  const top = (sx) => 256 + 5 * Math.sin(sx / 23) + 3.5 * Math.sin(sx / 9.1 + 1) + 4 * Math.sin(sx / 57 + 2);
  for (let i = 0; i < 6500; i++) {
    const sx = 34 + rnd() * 892, t = rnd();
    const sy = top(sx) + t * (283 - top(sx));
    if (rnd() > 0.2 + 0.8 * t * t) continue;
    if (rnd() > smooth(30, 110, sx) * smooth(930, 850, sx)) continue;
    dot(sx, sy, 'tree', 1.2 + 2.2 * (1 - t));
  }
  let d = '';
  for (let sx = 60; sx < 900; ) { const len = 20 + rnd() * 60; d += `M ${n1(sx)} 284.5 h ${n1(len)} `; sx += len + 6 + rnd() * 16; }
  out.push(`<path d="${d.trim()}" class="fs"/>`);
}
// ---- 2. ground: grass tufts outside the apron, fine cinder stipple on it
{
  let tufts = '';
  for (let i = 0; i < 5200; i++) {
    const sx = 30 + rnd() * 900, sy = 288 + rnd() * 302;
    const [x, z, d] = unproj(sx, sy);
    if (inBed(x, z)) continue;
    if (rnd() > fade(sx, sy)) continue;
    if (inApron(x, z)) {
      if (rnd() > 0.2 || inLab2(sx, sy)) continue;
      dot(sx, sy, 'soft');
      continue;
    }
    if (nearDropped(sx, sy)) continue;
    const s = (F * 0.06) / d;
    if (s < 3) { if (rnd() < 0.12) dot(sx, sy, 'soft'); continue; }
    if (rnd() > (d > 8.4 ? 0.14 : 0.34)) continue;
    const lean = (rnd() - 0.5) * 0.5;
    for (const k of [-1, 0, 1]) {
      const h = s * (0.7 + rnd() * 0.5) * (k === 0 ? 1.15 : 0.85);
      tufts += `M ${n1(sx + k * s * 0.18)} ${n1(sy)} q ${n1(k * s * 0.1)} ${n1(-h * 0.6)} ${n1((k * 0.45 + lean) * s)} ${n1(-h)} `;
    }
  }
  out.push(`<path d="${tufts.trim()}" class="gr"/>`);
  // apron edges: where the cinder meets the grass, a broken line
  for (const sgn of [-1, 1]) {
    let d = '';
    for (let z = BED.z0; z > -2.4; ) {
      const len = 0.12 + rnd() * 0.3;
      const a = proj(sgn * (2.3 + 0.2 * (BED.z0 - z)), 0, z), b = proj(sgn * (2.3 + 0.2 * (BED.z0 - z + len)), 0, z - len);
      if (fade(a[0], a[1]) > 0.5 && fade(b[0], b[1]) > 0.3) d += `M ${pt(a)} L ${pt(b)} `;
      z -= len + 0.05 + rnd() * 0.08;
    }
    out.push(`<path d="${d.trim()}" class="fi"/>`);
  }
  // rake marks: arcs of radius r about the middle of the bar, lying on the ground
  let rk = '';
  for (const r of [1.7, 2.45, 3.2]) {
    let pen = false;
    let run = 0;
    for (let a = 14; a <= 118; a += 2) {
      const x = -r * Math.cos((a * Math.PI) / 180), z = -r * Math.sin((a * Math.PI) / 180) + 0.1;
      const s = proj(x, 0, z);
      const ok = inApron(x, z) && !inLab2(s[0], s[1]) && fade(s[0], s[1]) > 0.55 && run > 0;
      if (ok) { rk += `${pen ? 'L' : 'M'} ${pt(s)} `; pen = true; run--; } else { pen = false; if (run <= -1 - Math.floor(rnd() * 2)) run = 3 + Math.floor(rnd() * 9); else run--; }
    }
  }
  out.push(`<path d="${rk.trim()}" class="fs"/>`);
}
// ---- 3. the landing pit: raked sand flush with the ground inside a low timber kerb
const boxG = (x0, x1, y0, y1, z0, z1) => poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], 'b') + poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'b') + poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], 'b');
{
  const { x0, x1, z0, z1 } = BED, kh = 0.07, kw = 0.1, sy0 = 0.02;
  out.push(poly([[x0, sy0, z0], [x1, sy0, z0], [x1, sy0, z1], [x0, sy0, z1]], 'b'));
  out.push(boxG(x0, x1, 0, kh, z1 - kw, z1));
  out.push(boxG(x1 - kw, x1, 0, kh, z0, z1));
  // rake rows: row j at z = z0 + 0.3 + 0.17 j, running across the pit
  let d = '';
  for (let z = z0 + 0.3; z < z1 - 0.15; z += 0.17) {
    for (let x = x0 + 0.3 + rnd() * 0.3; x < x1 - 0.3; ) {
      const len = 0.35 + rnd() * 1.1, xe = Math.min(x1 - 0.2, x + len);
      d += `M ${pt(proj(x, sy0, z))} Q ${pt(proj((x + xe) / 2, sy0, z + 0.03))} ${pt(proj(xe, sy0, z))} `;
      x = xe + 0.08 + rnd() * 0.25;
    }
  }
  out.push(`<path d="${d.trim()}" class="fs"/>`);
  out.push(boxG(x0, x0 + kw, 0, kh, z0, z1));
  out.push(boxG(x0, x1, 0, kh, z0, z0 + kw));
  // sand tone, gathering toward the far kerb and in the lee of the left kerb
  stippleQuad([x0 + 0.24, sy0, z0 + 0.24], [x1 - 0.12, sy0, z0 + 0.24], [x0 + 0.24, sy0, z1 - 0.12], 16000, (u, v) => 0.06 + 0.22 * v ** 1.5 + 0.4 * (1 - u) ** 6);
  // kerb faces toward the run-up are in shade: the darkest tone on the pit
  stippleQuad([x0, 0, z0], [x1, 0, z0], [x0, kh, z0], 5000, (u, v) => 0.62 - 0.25 * v);
  stippleQuad([x0 + kw, sy0, z1 - kw], [x1 - kw, sy0, z1 - kw], [x0 + kw, kh, z1 - kw], 2500, () => 0.5);
  // shadow of the far kerb end on the grass
  stippleQuad([x1, 0, z0], [x1 + 0.2, 0, z0 + 0.05], [x1, 0, z1], 1500, (u) => (1 - u) ** 0.8);
}
// ---- 4. shadows on the ground under the bar and beside the standards
stippleQuad([-BARHALF, 0, 0.05], [BARHALF, 0, 0.05], [-BARHALF, 0, 0.42], 30000, (u, v) => Math.min(1, 1.25 * Math.sin(Math.PI * v) ** 0.8), (sx, sy) => !inLab2(sx, sy));
for (const xc of [XN, XF]) stippleQuad([xc + 0.1, 0, -0.03], [xc + 1.25, 0, 0.2], [xc + 0.1, 0, 0.09], 5000, (u) => (1 - u) ** 0.5);
// ---- standards
const box = (x0, x1, y0, y1, z0, z1, top = true) => {
  const o = [];
  o.push(poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], 'b'));
  if (top) o.push(poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'b'));
  o.push(poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], 'b'));
  return o.join('');
};
// a peg in plate units: tapered shaft from tip a to shoulder b, then a round knob
const pegShape = (a, b, knob, stub = false, cls = 'pg') => {
  const k = F / a[2], wa = stub ? 0.016 * k : 0.009 * k, wb = 0.016 * k, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, nx = -uy, ny = ux;
  let o = `<path d="M ${n1(a[0] + nx * wa)} ${n1(a[1] + ny * wa)} L ${n1(b[0] + nx * wb)} ${n1(b[1] + ny * wb)} L ${n1(b[0] - nx * wb)} ${n1(b[1] - ny * wb)} L ${n1(a[0] - nx * wa)} ${n1(a[1] - ny * wa)} Z" class="${cls}"/>`;
  if (knob) { const r = 0.031 * k; o += `<circle cx="${n1(b[0] + ux * r * 0.8)}" cy="${n1(b[1] + uy * r * 0.8)}" r="${n1(r)}" class="pk"/>`; }
  return o;
};
const standard = (xc, pegDir) => {
  const o = [], w = PW / 2, bh = 0.085;
  // cross foot: the z beam's far half, the x beam, then the z beam's near half
  o.push(box(xc - w, xc + w, 0, bh, w, 0.42));
  o.push(box(xc - 0.42, xc + 0.42, 0, bh, -w, w));
  o.push(box(xc - w, xc + w, 0, bh, -0.42, -w));
  stippleQuad([xc - 0.42, 0, -w], [xc + 0.42, 0, -w], [xc - 0.42, bh, -w], 500, (u, v) => 0.95 - 0.5 * v, () => true, 'top');
  stippleQuad([xc - w, 0, -0.42], [xc + w, 0, -0.42], [xc - w, bh, -0.42], 120, (u, v) => 0.95 - 0.5 * v, () => true, 'top');
  // the post: lit side (with the holes) and shaded front
  o.push(poly([[xc - w, bh, -w], [xc - w, bh, w], [xc - w, PH, w], [xc - w, PH, -w]], 'b'));
  o.push(poly([[xc - w, bh, -w], [xc + w, bh, -w], [xc + w, PH, -w], [xc - w, PH, -w]], 'b'));
  // soft parallel strokes down the shaded front, running with the post
  let d = '';
  for (const f of [0.36, 0.56, 0.74, 0.9]) {
    for (let y = bh + 0.02; y < PH - 0.03; ) {
      const len = 0.25 + rnd() * (f > 0.7 ? 0.9 : 0.45);
      d += `M ${pt(proj(xc - w + PW * f, y, -w))} L ${pt(proj(xc - w + PW * f, Math.min(PH - 0.02, y + len), -w))} `;
      y += len + 0.03 + rnd() * (f > 0.7 ? 0.06 : 0.22);
    }
  }
  o.push(`<path d="${d.trim()}" class="fi"/>`);
  stippleQuad([xc - w, bh, -w], [xc + w, bh, -w], [xc - w, PH, -w], 2600, (u) => 0.08 + 0.9 * u ** 1.6, () => true, 'top');
  // cap
  o.push(box(xc - w - 0.015, xc + w + 0.015, PH, PH + 0.04, -w - 0.015, w + 0.015, false));
  // peg holes: hole i at height 0.2 + 0.1 i, i = 0 to 21
  for (let i = 0; i < HOLEN; i++) {
    const y = HOLE0 + HOLESTEP * i, s = proj(xc - w, y, 0);
    if (Math.abs(y - HNEW) < 1e-6) continue;
    o.push(`<ellipse cx="${n1(s[0])}" cy="${n1(s[1])}" rx="${n1((0.02 * fx * F) / s[2])}" ry="${n1((0.021 * F) / s[2])}" class="ink"/>`);
  }
  // the painted mark at the original height, just under its hole
  o.push(poly([[xc - w, HOLD - 0.15, -w], [xc - w, HOLD - 0.15, w], [xc - w, HOLD - 0.03, w], [xc - w, HOLD - 0.03, -w]], 'ink'));
  o.push(poly([[xc - w, HOLD - 0.15, -w], [xc + w, HOLD - 0.15, -w], [xc + w, HOLD - 0.03, -w], [xc - w, HOLD - 0.03, -w]], 'ink'));
  // the peg now in use: knob on the outer side, tapered shaft pointing at the other standard
  if (pegDir > 0) o.push(pegShape(proj(xc + w + 0.22, HNEW, 0), proj(xc + w, HNEW, 0), false, false, 'pk') + pegShape(proj(xc - w, HNEW, 0), proj(xc - w - 0.035, HNEW, 0), true, true, 'pk'));
  else o.push(pegShape(proj(xc - w - 0.22, HNEW, 0), proj(xc - w, HNEW, 0), false, false, 'pk'));
  return o.join('');
};
const farStd = standard(XF, -1);
const nearStd = standard(XN, 1);
// the bar as a ribbon of plate points at height y0 (sagging between its supports)
const barOutline = (y0) => {
  const up = [], dn = [];
  for (let i = 0; i <= 48; i++) {
    const x = -BARHALF + (2 * BARHALF * i) / 48, s = proj(x, y0 - SAG * (1 - (x / SUP) ** 2), 0), t = (BARR * F) / s[2];
    up.push([s[0], s[1] - t]); dn.unshift([s[0], s[1] + t]);
  }
  return { up, dn };
};
// where the bar used to rest: its ghost, in broken outline, at the original height
const g0 = proj(-BARHALF, HOLD + 0.015 + BARR, 0), g1 = proj(BARHALF, HOLD + 0.015 + BARR, 0);
const gb = barOutline(HOLD + 0.015 + BARR);
const ghost = `<path d="M ${[...gb.up, ...gb.dn].map(pt).join(' L ')} Z" class="ghost"/>`;
// the bar: 3.76 m long, 6 cm round, sagging 3.5 cm between its supports
let bar = '';
{
  const { up, dn } = barOutline(BARY);
  // a paper knockout round the bar keeps it clear of whatever lies behind
  bar = `<path d="M ${[...up, ...dn].map(pt).join(' L ')} Z" class="ko"/><path d="M ${[...up, ...dn].map(pt).join(' L ')} Z" class="bar"/>`;
  // roundness: a lit line along the upper third, a dark one along the belly
  const mid = (f) => up.map((q, i) => { const r = dn[dn.length - 1 - i]; return [q[0], q[1] + (r[1] - q[1]) * f]; });
  bar += `<path d="M ${mid(0.3).slice(2, -2).map(pt).join(' L ')}" class="barhi"/><path d="M ${mid(0.8).slice(1, -1).map(pt).join(' L ')}" class="barlo"/>`;
  // the near end face
  const e = proj(-BARHALF, barY(-BARHALF), 0);
  bar += `<ellipse cx="${n1(e[0])}" cy="${n1(e[1])}" rx="${n1((BARR * fx * F) / e[2])}" ry="${n1((BARR * F) / e[2])}" class="bar"/>`;
  // still quivering: short echo strokes above and below the middle of the span
  for (const [off, half] of [[0.085, 0.55], [-0.085, 0.55], [0.135, 0.3], [-0.135, 0.3]]) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const x = 0.1 - half + (2 * half * i) / 12; pts.push(proj(x, barY(x) + off, 0)); }
    bar += `<path d="M ${pts.map(pt).join(' L ')}" class="fi" style="stroke-width:1.1"/>`;
  }
}
// the old pegs, pulled and dropped on the grass
let dropped = '';
for (const p of DROPPED) {
  const ca = Math.cos((p.a * Math.PI) / 180), sa = Math.sin((p.a * Math.PI) / 180), L = 0.17;
  const a = proj(p.x - L * ca, 0.02, p.z - L * sa), b = proj(p.x + L * ca, 0.02, p.z + L * sa), h = proj(p.x + (L + 0.05) * ca, 0.02, p.z + (L + 0.05) * sa);
  stippleQuad([p.x - L * ca + 0.02, 0, p.z - L * sa + 0.05], [p.x + L * ca + 0.02, 0, p.z + L * sa + 0.05], [p.x - L * ca + 0.1, 0, p.z - L * sa + 0.09], 90, () => 0.9);
  dropped += pegShape(a, b, true);
}
// ---- labels
const gAng = (Math.atan2(g1[1] - g0[1], g1[0] - g0[0]) * 180) / Math.PI;
const gm = [(g0[0] + g1[0]) / 2, (g0[1] + g1[1]) / 2 - 6];
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p201b-t p201b-d">
  <title id="p201b-t">DIA-201 · The bar, lowered</title>
  <desc id="p201b-d">A stippled ink drawing of a high-jump pit seen from the run-up at three-quarter view, in the manner of an old athletics coaching manual. Two tall standards with rows of peg holes stand in front of a low sand pit. High on each standard a painted band and a ghost of the bar in broken outline show where the bar used to rest, labelled September 2023: pause if capability outruns control. The crossbar, drawn in rust, now rests on pegs in the lowest holes, barely above the ground and still quivering, labelled February 2026: no pause. The two old pegs lie dropped on the grass beside the near standard.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.3; stroke-linejoin: round; stroke-linecap: round; }
      .far .b { stroke-width: 1.05; }
      .near .b { stroke-width: 1.7; }
      .fi { fill: none; stroke: var(--ink); stroke-width: 0.65; stroke-linecap: round; stroke-linejoin: round; }
      .fs { fill: none; stroke: var(--soft); stroke-width: 0.6; stroke-linecap: round; stroke-linejoin: round; }
      .gr { fill: none; stroke: var(--ink); stroke-width: 0.6; stroke-linecap: round; opacity: 0.8; }
      .di { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; }
      .ds { fill: none; stroke: var(--soft); stroke-width: 0.9; stroke-linecap: round; }
      .dt { fill: none; stroke: var(--soft); stroke-width: 1.25; stroke-linecap: round; }
      .ghost { fill: none; stroke: var(--soft); stroke-width: 0.9; stroke-linecap: round; stroke-dasharray: 5 4; }
      .bar { fill: var(--accent); stroke: var(--ink); stroke-width: 1.3; stroke-linejoin: round; }
      .ko { fill: var(--paper); stroke: var(--paper); stroke-width: 9; stroke-linejoin: round; }
      .barhi { fill: none; stroke: var(--paper); stroke-width: 1.3; stroke-linecap: round; opacity: 0.75; }
      .barlo { fill: none; stroke: var(--ink); stroke-width: 1; stroke-linecap: round; opacity: 0.55; }
      .pg { fill: var(--paper); stroke: var(--ink); stroke-width: 1.2; stroke-linejoin: round; }
      .pk { fill: var(--ink); stroke: var(--ink); stroke-width: 1; }
      .peg { fill: none; stroke: var(--ink); stroke-linecap: round; }
      .ink { fill: var(--ink); }
      .af { fill: var(--accent); }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 15.5px; font-style: italic; }
      .ita { font-size: 18px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE I</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · FRUSTRATED ABOUT AI?</text>
  <!-- far ground, grass, cinder apron and rake marks -->
  ${out.slice(0, 5).join('\n  ')}
  <path d="${dots.tree.join('')}" class="dt"/>
  <path d="${dots.soft.join('')}" class="ds"/>
  <!-- the sand pit -->
  ${out.slice(5).join('\n  ')}
  <path d="${dots.ink.join('')}" class="di"/>
  <!-- far standard, the old height, the bar, near standard -->
  <g class="far">${farStd}</g>
  ${ghost}
  ${bar}
  <g class="near">${nearStd}</g>
  <path d="${dots.top.join('')}" class="di"/>
  <!-- the old pegs on the grass -->
  ${dropped}
  <text transform="translate(${n1(gm[0])} ${n1(gm[1] - 13)}) rotate(${n1(gAng)})" text-anchor="middle" class="it">September 2023: pause if capability outruns control</text>
  <text transform="translate(${LAB2.cx} ${LAB2.cy + 6}) rotate(${LAB2.a})" text-anchor="middle" class="ita">February 2026: no pause</text>
  <text x="480" y="606" text-anchor="middle" class="sm">Four revisions since, to July 2026. The bar has not gone back up.</text>
  <text x="480" y="645" text-anchor="middle" class="title">The Bar, Lowered</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-201 · A standard set by the one who must clear it is set where it can be cleared.</text>
</svg>
`;
writeFileSync(new URL('./PLATE-201-lowered-bar.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log('wrote', svg.length, 'bytes; dots', dots.ink.length, dots.soft.length);
