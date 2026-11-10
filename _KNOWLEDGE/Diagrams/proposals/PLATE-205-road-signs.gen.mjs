// Generates PLATE-205-road-signs.svg: a road-safety poster in flat fills.
// Run: node PLATE-205-road-signs.gen.mjs
//
// PERSPECTIVE. One pinhole camera, level, looking along +Z.
//   eye 6 m above the road surface, focal length F plate units,
//   vanishing point (CX, YH), horizon y = YH.
//   A world point (X right, Y up, Z away, metres) lands at
//     x = CX + F X / Z,   y = YH + F (6 - Y) / Z.
//   Road, tracks, deck, piers, banks, cliffs, water rings: all projected from world
//   coordinates by that one rule. Signs are flat boards facing the eye, sized by
//   F / Z at their foot. Mountains sit at infinity, so their bases lie on the horizon.
//   Poster licence, stated: the two lettered boards are hoardings, larger than a
//   real road sign, so that the lettering can be read on the plate.
import { writeFileSync } from 'node:fs';
const F = 720, EYE = 6, CX = 338, YH = 200;
const PX0 = 40, PX1 = 920, PY0 = 64, PY1 = 598; // the picture panel
const r1 = (n) => Math.round(n * 10) / 10;
const P = (X, Y, Z) => [CX + (F * X) / Z, YH + (F * (EYE - Y)) / Z];
const pts = (a) => a.map((p) => `${r1(p[0])},${r1(p[1])}`).join(' ');
const poly = (a, cls, extra = '') => `<polygon points="${pts(a)}" class="${cls}"${extra}/>`;
const dpath = (a) => 'M ' + a.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(' L ') + ' Z';
// ---- road centreline: straight, then a 70 degree right-hand arc, then straight over the bridge
const ZS = 9, ZA = 12.5, R = 7, PH = (70 * Math.PI) / 180, XC = -2, HW = 2.75;
const L1 = ZA - ZS, L2 = R * PH;
const EX = XC + R - R * Math.cos(PH), EZ = ZA + R * Math.sin(PH), DX = Math.sin(PH), DZ = Math.cos(PH);
function C(u) {
  if (u < L1) return { x: XC, z: ZS + u, dx: 0, dz: 1 };
  if (u < L1 + L2) { const t = (u - L1) / R; return { x: XC + R - R * Math.cos(t), z: ZA + R * Math.sin(t), dx: Math.sin(t), dz: Math.cos(t) }; }
  const v = u - L1 - L2; return { x: EX + v * DX, z: EZ + v * DZ, dx: DX, dz: DZ };
}
// world point at distance u along the road, t metres to the left of the centreline
const Wd = (u, t) => { const c = C(u); return [c.x - t * c.dz, c.z + t * c.dx]; };
const W = (u, t, Y = 0) => { const w = Wd(u, t); return P(w[0], Y, w[1]); };
const UA = L1 + L2 + 1.5;          // near abutment
const B1 = UA + 4.6, B2 = UA + 12.6; // the two broken ends: 8 m of deck is gone
const UB = UA + 15.4;              // far abutment
const UE = UB + 30;
const TH = 0.8, DEPTH = 4.0;       // deck girder depth, and the river below the road
const range = (a, b, s) => { const o = []; for (let u = a; u < b - 1e-6; u += s) o.push(u); o.push(b); return o; };
// jagged break lines: [t, du]
const JN = [[2.75, 0.3], [1.9, -0.25], [1.0, 0.35], [0.2, -0.2], [-0.7, 0.4], [-1.7, -0.3], [-2.75, 0.2]];
const JF = [[-2.75, -0.25], [-1.8, 0.3], [-0.9, -0.35], [0.0, 0.25], [0.9, -0.3], [1.9, 0.2], [2.75, -0.2]];
const jagU = (J, t) => { const s = [...J].sort((a, b) => a[0] - b[0]); for (let i = 0; i < s.length - 1; i++) if (t >= s[i][0] && t <= s[i + 1][0]) return s[i][1] + ((s[i + 1][1] - s[i][1]) * (t - s[i][0])) / (s[i + 1][0] - s[i][0]); return 0; };
// ---- surfaces
const nearRoad = [
  ...range(0, B1 + JN[0][1], 0.3).map((u) => W(u, HW)),
  ...JN.slice(1, -1).map(([t, du]) => W(B1 + du, t)),
  ...range(0, B1 + JN[6][1], 0.3).reverse().map((u) => W(u, -HW)),
];
const farRoad = [
  ...JF.slice(0, -1).map(([t, du]) => W(B2 + du, t)),
  ...range(B2 + JF[6][1], UE, 0.5).map((u) => W(u, HW)),
  ...range(B2 + JF[0][1], UE, 0.5).reverse().map((u) => W(u, -HW)),
];
const strip = (us, t, Y0, Y1) => [...us.map((u) => W(u, t, Y0)), ...[...us].reverse().map((u) => W(u, t, Y1))];
const fasciaN = strip(range(UA - 0.2, B1 + JN[6][1], 0.4), -HW, 0, -TH);
const fasciaF = strip(range(B2 + JF[0][1], UB + 0.2, 0.4), -HW, 0, -TH);
const endFaceF = [...JF.map(([t, du]) => W(B2 + du, t, 0)), ...[...JF].reverse().map(([t, du]) => W(B2 + du, t, -TH))];
// far-side parapet, a low wall 0.7 m high on the far edge of each stub
const parN = strip(range(UA - 0.2, B1 + JN[0][1], 0.4), HW, 0, 0.7);
const parF = strip(range(B2 + JF[6][1], UB + 0.2, 0.4), HW, 0, 0.7);
const pier = (u) => {
  const a = u - 0.55, b = u + 0.55, t0 = -1.5, t1 = 1.5;
  const side = [W(a, t0, -TH), W(b, t0, -TH), W(b, t0, -DEPTH), W(a, t0, -DEPTH)];
  const end = [W(a, t0, -TH), W(a, t1, -TH), W(a, t1, -DEPTH), W(a, t0, -DEPTH)];
  return poly(end, 'k2') + poly(side, 'ink');
};
// ---- banks
const AN = Wd(UA, -HW), AF = Wd(UA, HW), BN = Wd(UB, -HW), BF = Wd(UB, HW);
const NE = [[4.3, 8], [4.55, 12], AN, AF, [2.3, 30], [1.2, 50], [0.3, 100], [-0.5, 400]];
const FE = [[23, 10], [21.5, 16], BN, BF, [19.5, 31], [23, 38], [34, 50], [70, 70], [200, 110]];
const top = (E) => E.map(([x, z]) => P(x, 0, z));
const face = (E) => [...E.map(([x, z]) => P(x, 0, z)), ...[...E].reverse().map(([x, z]) => P(x, -DEPTH, z))];
const nearGround = [...top(NE), [CX, YH], [-600, YH], [-600, 1200]];
const farGround = [...top(FE), [1900, 215], [1900, 900]];
// ---- tyre tracks: a tone ribbon with ink tread blocks, 0.34 m wide, 1.7 m apart
const TC = [0.85, -0.85], TW = 0.19;
let ribbons = '', tread = '';
for (const tc of TC) {
  const uEnd = B1 + Math.min(jagU(JN, tc + TW), jagU(JN, tc - TW), jagU(JN, tc)) - 0.03;
  const us = range(0, uEnd, 0.3);
  ribbons += dpath([...us.map((u) => W(u, tc + TW)), ...[...us].reverse().map((u) => W(u, tc - TW))]) + ' ';
  const step = 0.44, len = 0.27, sk = 0.13;
  for (let u = 0.1; u + len + sk < uEnd; u += step) {
    tread += dpath([W(u, tc + TW), W(u + sk, tc), W(u, tc - TW), W(u + len, tc - TW), W(u + len + sk, tc), W(u + len, tc + TW)]) + ' ';
  }
}
// ---- water rings under the gap, true circles on the water plane
const SPL = Wd(B1 + 3.4, -0.4);
const ring = (r) => { const a = []; for (let i = 0; i < 48; i++) { const q = (i / 48) * 2 * Math.PI; a.push(P(SPL[0] + r * Math.cos(q), -DEPTH, SPL[1] + r * Math.sin(q))); } return dpath(a); };
// streaks on the water: lines of constant depth, so horizontal on the plate
const streak = (x0, x1, z) => { const a = P(x0, -DEPTH, z), b = P(x1, -DEPTH, z); if (a[0] < 452) return ''; return `<path d="M ${r1(a[0])} ${r1(a[1])} H ${r1(b[0])}" style="stroke-width:${r1(Math.max(1, Math.min(3, (F / z) * 0.085)))}"/>`; };
const streaks = [[6.6, 8.6, 17.4], [16.5, 19.5, 18.4], [18.6, 21, 20.6], [10.5, 13.5, 31], [17.5, 21, 36], [7.5, 9.5, 42], [11, 15, 50], [20, 26, 58], [11, 14, 72], [16, 23, 88], [30, 42, 100], [18, 26, 135], [34, 52, 170], [60, 85, 150]].map((q) => streak(...q)).join('');
// ---- signs: foot on the ground at world (X, Z); k = plate units per metre there
const foot = (X, Z) => { const p = P(X, 0, Z); return { x: p[0], y: p[1], k: F / Z }; };
const onArc = (deg, rad) => { const t = (deg * Math.PI) / 180; return [XC + R - rad * Math.cos(t), ZA + rad * Math.sin(t)]; };
const S1 = foot(...onArc(22, R + HW + 1.15));
const S2 = foot(...onArc(46, R + HW + 1.9));
const S3 = foot(1.0, 22.9);
const TREE = foot(-6.3, 15.7);
const log = (n, s, w, h) => console.log(n, 'foot', r1(s.x), r1(s.y), 'k', r1(s.k), 'board m', r1(w / s.k), r1(h / s.k));
// sign 1: warning triangle, 1.5 m side, foot of the triangle 2.0 m up
const t1a = 1.5 * S1.k, t1b = S1.y - 2.0 * S1.k, t1h = t1a * 0.866;
const tri = (inset) => { const a = t1a - inset * 3.464, by = t1b - inset, hh = a * 0.866; return [[S1.x - a / 2, by], [S1.x + a / 2, by], [S1.x, by - hh]]; };
const sign1 =
  `<rect x="${r1(S1.x - 2.5)}" y="${r1(t1b - 4)}" width="5" height="${r1(S1.y - t1b + 4)}" class="ink"/>` +
  `<polygon points="${pts(tri(0))}" class="inkr"/>` +
  `<polygon points="${pts(tri(7.5))}" class="paper"/>` +
  `<path d="M ${r1(S1.x - 3.2)} ${r1(t1b - 39)} h 6.4 l -1.4 19 h -3.6 Z" class="ink"/><circle cx="${r1(S1.x)}" cy="${r1(t1b - 13.5)}" r="3.1" class="ink"/>`;
// sign 2: the polite board
const w2 = 104, h2 = 72, b2 = S2.y - 1.15 * S2.k, x2 = S2.x - w2 / 2, y2 = b2 - h2;
const sign2 =
  `<rect x="${r1(S2.x - 0.3 * w2 - 2)}" y="${r1(b2 - 2)}" width="4" height="${r1(S2.y - b2 + 2)}" class="ink"/><rect x="${r1(S2.x + 0.3 * w2 - 2)}" y="${r1(b2 - 2)}" width="4" height="${r1(S2.y - b2 + 2)}" class="ink"/>` +
  `<rect x="${r1(x2)}" y="${r1(y2)}" width="${w2}" height="${h2}" rx="5" class="ink"/><rect x="${r1(x2 + 3.5)}" y="${r1(y2 + 3.5)}" width="${w2 - 7}" height="${h2 - 7}" rx="2.5" class="paper"/>` +
  `<text x="${r1(S2.x)}" y="${r1(y2 + 24)}" text-anchor="middle" class="s2">PLEASE</text><text x="${r1(S2.x)}" y="${r1(y2 + 41)}" text-anchor="middle" class="s2">CONSIDER</text><text x="${r1(S2.x)}" y="${r1(y2 + 58)}" text-anchor="middle" class="s2">SLOWING</text>`;
// sign 3: the certificate, with its small plate
const w3 = 116, h3 = 86, b3 = S3.y - 2.15 * S3.k, x3 = S3.x - w3 / 2, y3 = b3 - h3;
const sign3 =
  `<rect x="${r1(S3.x - 0.36 * w3 - 2)}" y="${r1(b3 - 2)}" width="4" height="${r1(S3.y - b3 + 2)}" class="ink"/><rect x="${r1(S3.x + 0.36 * w3 - 2)}" y="${r1(b3 - 2)}" width="4" height="${r1(S3.y - b3 + 2)}" class="ink"/>` +
  `<rect x="${r1(x3)}" y="${r1(y3)}" width="${w3}" height="${h3}" class="rust"/><rect x="${r1(x3 + 4.5)}" y="${r1(y3 + 4.5)}" width="${w3 - 9}" height="${h3 - 9}" class="pl"/>` +
  `<circle cx="${r1(S3.x)}" cy="${r1(y3)}" r="10.5" class="plate"/><path d="M ${r1(S3.x - 4.6)} ${r1(y3 + 0.4)} l 3.2 3.6 l 6 -7.6" class="tick"/>` +
  `<text x="${r1(S3.x)}" y="${r1(y3 + 29)}" text-anchor="middle" class="s3a">BRIDGE</text><text x="${r1(S3.x)}" y="${r1(y3 + 49)}" text-anchor="middle" class="s3b">CERTIFIED</text><text x="${r1(S3.x)}" y="${r1(y3 + 69)}" text-anchor="middle" class="s3b">SAFE</text>` +
  `<rect x="${r1(x3 + 1)}" y="${r1(b3 + 4)}" width="${w3 - 2}" height="20" class="plate"/><text x="${r1(S3.x)}" y="${r1(b3 + 17.8)}" text-anchor="middle" class="s3c">inspected by its builder</text>`;
log('sign1', S1, t1a, t1h); log('sign2', S2, w2, h2); log('sign3', S3, w3, h3); log('tree', TREE, 0, 0);
console.log('A', W(UA, 0).map(r1), 'B', W(UB, 0).map(r1), 'break1', W(B1, 0).map(r1), 'break2', W(B2, 0).map(r1), 'splash', P(SPL[0], -DEPTH, SPL[1]).map(r1));
console.log('sign2 box', r1(x2), r1(y2), r1(x2 + w2), r1(b2), 'sign3 box', r1(x3), r1(y3), r1(x3 + w3), r1(b3 + 24), 'tri', pts(tri(0)));
// ---- tree: trunk and a canopy of discs, in plate units from the foot
const T = TREE, tk = T.k;
const canopy = [[-0.2, 5.6, 1.9], [1.3, 5.0, 1.5], [0.9, 6.5, 1.5], [-0.9, 6.8, 1.5], [-1.2, 4.6, 1.5], [0.5, 4.15, 1.35], [1.75, 4.0, 0.95], [2.15, 5.9, 0.9], [-0.1, 7.5, 1.1], [1.0, 3.45, 0.78], [1.72, 3.74, 0.6]]
  .map(([x, y, r]) => `<circle cx="${r1(T.x + x * tk)}" cy="${r1(T.y - y * tk)}" r="${r1(r * tk)}"/>`).join('');
const trunk = `<path d="M ${r1(T.x - 0.28 * tk)} ${r1(T.y)} L ${r1(T.x - 0.16 * tk)} ${r1(T.y - 3.4 * tk)} L ${r1(T.x + 0.2 * tk)} ${r1(T.y - 3.4 * tk)} L ${r1(T.x + 0.3 * tk)} ${r1(T.y)} Z"/>`;
console.log('tree x', r1(T.x), 'top', r1(T.y - 8.6 * tk), 'canopy bottom about', r1(T.y - 2.6 * tk));
// ---- tones: opaque mixes of ink into paper, so overlapping flats never compound
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (p, a, b) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * p).toString(16).padStart(2, '0')).join('').toUpperCase();
const LP = '#F2EEE3', LI = '#2A2A35', DP = '#1E2128', DI = '#E8E5DC';
const tones = (p, i) => `--g1: ${mix(0.09, p, i)}; --g2: ${mix(0.17, p, i)}; --g3: ${mix(0.27, p, i)}; --g4: ${mix(0.4, p, i)}; --g5: ${mix(0.72, p, i)};`;
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p205b-t p205b-d">
  <title id="p205b-t">DIA-205 · Three signs before the bridge</title>
  <desc id="p205b-d">A road-safety poster in flat colour. A pale road runs up from the foreground, bends right and crosses a river on a bridge whose middle span has fallen. Fresh tyre tracks follow the road past three signs and stop at the broken edge, and rings spread on the water below. The first sign is a warning triangle almost swallowed by a roadside tree. The second is a board that reads PLEASE CONSIDER SLOWING. The third, in rust at the bridge approach, reads BRIDGE CERTIFIED SAFE, with a small plate beneath: inspected by its builder.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: ${LP}; --ink: ${LI}; --soft: #6B6873; --accent: #A85B49; ${tones(LP, LI)} }
      @media (prefers-color-scheme: dark) { :root { --paper: ${DP}; --ink: ${DI}; --soft: #B8B5AD; --accent: #D29183; ${tones(DP, DI)} } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .ink { fill: var(--ink); }
      .inkr { fill: var(--ink); stroke: var(--ink); stroke-width: 5; stroke-linejoin: round; }
      .g1 { fill: var(--g1); } .g2 { fill: var(--g2); } .g3 { fill: var(--g3); } .g4 { fill: var(--g4); }
      .k2 { fill: var(--g5); }
      .softf { fill: var(--soft); }
      .rust { fill: var(--accent); }
      .pl { fill: none; stroke: var(--paper); stroke-width: 1.3; }
      .plate { fill: var(--paper); stroke: var(--accent); stroke-width: 2.2; }
      .tick { fill: none; stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
      .ring { fill: none; stroke: var(--paper); stroke-linejoin: round; }
      .wl { fill: none; stroke: var(--paper); stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .s2 { font-size: 13px; letter-spacing: 0.1em; }
      .s3a { font-size: 12px; font-weight: 600; letter-spacing: 0.22em; fill: var(--paper); }
      .s3b { font-size: 15.5px; font-weight: 600; letter-spacing: 0.05em; fill: var(--paper); }
      .s3c { font-size: 10.5px; font-style: italic; }
      .nk { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; }
      .nt { font-size: 13.5px; }
      .rev { fill: var(--paper); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <clipPath id="p205b-clip"><rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}"/></clipPath>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE V</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · VISIBILITY, RULES, AND RULE-MAKERS</text>
  <!-- the picture. camera: eye 6 m up, focal ${F}, vanishing point (${CX}, ${YH}); x = ${CX} + ${F} X / Z, y = ${YH} + ${F} (6 - Y) / Z. signs are flat boards facing the eye, sized by ${F} / Z at the foot; the two lettered boards are hoardings (${r1(w2 / S2.k)} by ${r1(h2 / S2.k)} m and ${r1(w3 / S3.k)} by ${r1(h3 / S3.k)} m) so the lettering reads -->
  <g clip-path="url(#p205b-clip)">
    <!-- mountains at infinity, bases on the horizon -->
    <polygon points="40,200 40,186 96,170 150,184 214,176 262,192 300,200 478,200 524,178 566,146 612,164 668,118 720,150 772,126 834,96 880,128 920,112 920,200" class="g1"/>
    <polygon points="560,200 618,170 660,182 724,140 770,168 812,150 868,176 920,158 920,200" class="g3"/>
    <!-- the river, 4.5 m below the road -->
    <rect x="${PX0}" y="${YH}" width="${PX1 - PX0}" height="${PY1 - YH}" class="g4"/>
    <g class="wl">${streaks}</g>
    <path d="${ring(0.5)}" class="ring" style="stroke-width:3.6"/><path d="${ring(1.15)}" class="ring" style="stroke-width:2.8"/><path d="${ring(1.85)}" class="ring" style="stroke-width:2"/><path d="${ring(2.6)}" class="ring" style="stroke-width:1.3"/>
    <!-- far bank and its cliff -->
    ${poly(farGround, 'g2')}
    ${poly(face(FE), 'softf')}
    <!-- far stub of the bridge -->
    ${pier(UA + 13.8)}
    ${poly(parF, 'ink')}
    ${poly(farRoad, 'paper')}
    ${poly(fasciaF, 'ink')}
    ${poly(endFaceF, 'ink')}
    <!-- near stub: pier, girder, parapet -->
    ${pier(UA + 3.5)}
    ${poly(parN, 'ink')}
    ${poly(fasciaN, 'ink')}
    <!-- near bank -->
    ${poly(face(NE), 'softf')}
    ${poly(nearGround, 'g2')}
    <!-- the road, and the deck up to the break at u = ${r1(B1)} m -->
    ${poly(nearRoad, 'paper')}
    <!-- tyre tracks: ${TW * 2} m wide, ${TC[0] * 2} m apart, ending on the broken edge -->
    <path d="${ribbons.trim()}" class="g4"/>
    <path d="${tread.trim()}" class="ink"/>
    <!-- sign 1 and the tree that hides it -->
    ${sign1}
    <g class="ink">${trunk}${canopy}</g>
    <!-- sign 2 -->
    ${sign2}
    <!-- sign 3, the accent -->
    ${sign3}
    <!-- notes -->
    <text x="56" y="${r1(T.y - 6.5 * tk)}" class="nk rev">VISIBILITY</text>
    <text x="56" y="${r1(T.y - 6.5 * tk + 18)}" class="nt rev">the warning stands</text>
    <text x="56" y="${r1(T.y - 6.5 * tk + 35)}" class="nt rev">where nobody</text>
    <text x="56" y="${r1(T.y - 6.5 * tk + 52)}" class="nt rev">sees it in time</text>
    <text x="${r1(x2 + 6)}" y="${r1(y2 - 46)}" class="nk">RULES</text>
    <text x="${r1(x2 + 6)}" y="${r1(y2 - 28)}" class="nt">advice, with no</text>
    <text x="${r1(x2 + 6)}" y="${r1(y2 - 11)}" class="nt">penalty behind it</text>
    <text x="${r1(S3.x)}" y="152" text-anchor="middle" class="nk">WHO WRITES THEM</text>
    <text x="${r1(S3.x)}" y="170" text-anchor="middle" class="nt">the builder passed</text>
    <text x="${r1(S3.x)}" y="187" text-anchor="middle" class="nt">its own bridge</text>
  </g>
  <rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" class="l" style="stroke-width:2.2"/>
  <text x="480" y="645" text-anchor="middle" class="title">Three Signs Before the Bridge</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-205 · A hidden warning, a polite request and a builder's own certificate: none of them stops the car.</text>
</svg>
`;
const clean = svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n';
if ([0x2014, 0xa7].some((c) => clean.includes(String.fromCharCode(c)))) throw new Error('banned character in output');
writeFileSync(new URL('./PLATE-205-road-signs.svg', import.meta.url), clean);
console.log('wrote', clean.length, 'bytes');
