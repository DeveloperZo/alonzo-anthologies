// Generator for PLATE-004B-shortest-stave.svg. Run: node gen.mjs <out.svg>
import { writeFileSync } from 'node:fs';
const out = process.argv[2];
const cx = 430, y0 = 300, K = 0.38, T = 11, HB = 205, ZT = 45;
const zm = (-HB + ZT) / 2, half = (ZT + HB) / 2, Rm = 168, Re = 152;
const c = (Rm - Re) / (half * half), slope = -0.08;
const R = z => z <= ZT ? Rm - c * (z - zm) ** 2 : Re + slope * (z - ZT);
const rad = d => d * Math.PI / 180;
const pt = (th, z, off = 0) => { const r = R(z) + off; return [cx + r * Math.sin(rad(th)), y0 - z + r * K * Math.cos(rad(th))]; };
const f = n => (Math.round(n * 10) / 10).toString();
const arc = (a, b, z, off = 0, n = 8) => Array.from({ length: n + 1 }, (_, i) => pt(a + (b - a) * i / n, z, off));
const edge = (th, z1, z2, off = 0, n = 12) => Array.from({ length: n + 1 }, (_, i) => pt(th, z1 + (z2 - z1) * i / n, off));
const P = (pts, close = true) => 'M ' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join(' L ') + (close ? ' Z' : '');
const el = [];
const path = (pts, cls, close = true, extra = '') => el.push(`  <path d="${P(pts, close)}" class="${cls}"${extra}/>`);
// staves: 16 of 22.5 degrees. theta 0 faces the viewer.
const W = 22.5;
const frontH = [50, 36, 0, 52, 40, 30, 54, 44];           // k = 0..7, centres -78.75 + 22.5 k
const backH = [44, 32, 50, 28, 42, 52, 34, 46];            // centres 101.25 + 22.5 k
const SHORT = 2, CUT = 4, GHOST = 190;
const staves = [];
frontH.forEach((h, k) => staves.push({ th: -78.75 + W * k, h, front: true, k }));
backH.forEach((h, k) => staves.push({ th: 101.25 + W * k, h, front: false, k }));
staves.sort((a, b) => Math.cos(rad(a.th)) - Math.cos(rad(b.th)));
const face = (a, b, z1, z2, off) => [...edge(a, z1, z2, off), ...arc(a, b, z2, off), ...edge(b, z2, z1, off), ...arc(b, a, z1, off)];
const top = (a, b, z) => [...arc(a, b, z, 0), ...arc(b, a, z, -T)];
// cast shadow on the floor
el.push('  <!-- cast shadow, then the tub. Screen point of (theta, z): x = 430 + R(z) sin(theta), y = 300 - z + 0.38 R(z) cos(theta) -->');
el.push(`  <ellipse cx="${cx + 62}" cy="${y0 + HB + 10}" rx="${Re + 40}" ry="${(Re + 30) * K}" class="h"/>`);
const drawStave = s => {
  const a = s.th - W / 2, b = s.th + W / 2;
  if (!s.front) {
    const inner = face(a, b, -6, s.h, -T);
    path(inner, 'b');
    if (s.th > 150) path(inner, 'h');
    path(top(a, b, s.h), 'b');
  } else {
    const outer = face(a, b, -HB, s.h, 0);
    path(outer, 'b');
    if (s.th > 50) path(outer, 'h');
    else if (s.th > 30) path(face(b - 7, b, -HB, s.h, 0), 'h');
    path(top(a, b, s.h), 'b');
    // grain
    const g1 = s.th - 4, g2 = s.th + 5;
    path(edge(g1, -HB + 14 + 9 * s.k, -HB + 70 + 13 * s.k, 0, 6), 'grain', false);
    path(edge(g2, s.h - 12, s.h - 50 - 6 * (s.k % 3), 0, 6), 'grain', false);
  }
};
staves.filter(s => !s.front).forEach(drawStave);
// water surface at z = 0
const wr = R(0) - T;
el.push('  <!-- the water stands at z = 0, the top of the shortest stave -->');
el.push(`  <ellipse cx="${cx}" cy="${y0}" rx="${f(wr)}" ry="${f(wr * K)}" class="b" style="stroke-width:0.9"/>`);
const rip = [];
for (let j = -4; j <= 4; j++) {
  const y = y0 + j * 11 + 2, hw = wr * Math.sqrt(Math.max(0, 1 - ((y - y0) / (wr * K)) ** 2)) - 14;
  if (hw < 20) continue;
  for (let i = 0; i < 4; i++) {
    const u = ((i * 0.27 + (j + 4) * 0.19) % 1) * 2 - 1, len = 16 + ((i * 7 + j * 5 + 40) % 5) * 5;
    const x = cx + u * (hw - len / 2);
    rip.push(`M ${f(x - len / 2)} ${f(y)} q ${f(len / 4)} -2 ${f(len / 2)} 0 t ${f(len / 2)} 0`);
  }
}
el.push(`  <path d="${rip.join(' ')}" class="thin" style="opacity:0.75"/>`);
staves.filter(s => s.front).forEach(drawStave);
// hoops: two iron bands round the front
el.push('  <!-- iron hoops -->');
for (const [z1, z2] of [[-34, -54], [-158, -178]]) {
  const band = [...arc(-90, 90, z1, 2.5, 36), ...arc(90, -90, z2, 2.5, 36)];
  path(band, 'b');
  path([...arc(48, 90, z1, 2.5, 10), ...arc(90, 48, z2, 2.5, 10)], 'h');
  path(arc(-88, 46, z1 - 4, 2.5, 30), 'thin', false, ' style="opacity:0.55"');
  for (const th of [6, 13]) { const p = pt(th, (z1 + z2) / 2 - 1, 2.5); el.push(`  <circle cx="${f(p[0])}" cy="${f(p[1])}" r="2.1" class="b" style="stroke-width:0.9"/>`); }
  path([pt(17, z1, 2.5), pt(17.6, z2, 2.5)], 'thin', false);
}
// the spill over the shortest stave
el.push('  <!-- the spill: over the shortest stave and down the outside -->');
const sc = -78.75 + W * SHORT;
const thL = z => { const u = Math.min(1, -z / 80); return sc - 11.25 + 4.2 * u + 0.7 * Math.sin(z / 9) - (z < -170 ? (-170 - z) * 0.09 : 0); };
const thR = z => { const u = Math.min(1, -z / 80); return sc + 11.25 - 4.8 * u + 0.7 * Math.sin(z / 9 + 1.3) + (z < -170 ? (-170 - z) * 0.07 : 0); };
const zs = Array.from({ length: 42 }, (_, i) => -i * (HB - 2) / 41);
const sheet = [pt(sc - 11.25, 0, -T), ...zs.map(z => pt(thL(z), z, 3)), ...zs.slice().reverse().map(z => pt(thR(z), z, 3)), pt(sc + 11.25, 0, -T)];
// puddle on the floor, drawn before the sheet so the sheet lands in it
const bl = pt(thL(-HB + 2), -HB + 2, 3), br = pt(thR(-HB + 2), -HB + 2, 3);
el.push(`  <path d="M ${f(bl[0] + 4)} ${f(bl[1] - 6)} C ${f(bl[0] - 40)} ${f(bl[1] - 4)} 196 ${f(bl[1] + 2)} 190 ${f(bl[1] + 13)} C 186 ${f(bl[1] + 25)} 268 ${f(bl[1] + 30)} 330 ${f(bl[1] + 28)} C 392 ${f(bl[1] + 27)} 436 ${f(bl[1] + 21)} 428 ${f(bl[1] + 13)} C 422 ${f(bl[1] + 7)} ${f(br[0] + 22)} ${f(br[1] + 6)} ${f(br[0] - 2)} ${f(br[1] - 4)} Z" class="b" style="stroke-width:1"/>`);
el.push(`  <path d="M 224 ${f(bl[1] + 14)} q 22 7 58 8 M 300 ${f(bl[1] + 12)} q 30 6 62 2 M 352 ${f(bl[1] + 21)} q 26 1 46 -5 M 246 ${f(bl[1] + 7)} q 16 -3 30 -3" class="thin" style="opacity:0.75"/>`);
path(sheet, 'paper');
path(zs.map(z => pt(thL(z), z, 3)), 'thin', false, ' style="stroke-width:1.1"');
path(zs.map(z => pt(thR(z), z, 3)), 'thin', false, ' style="stroke-width:1.1"');
const dashes = ['22 6 9 7', '11 7 26 6', '17 8 6 5', '8 6 30 7', '14 9 20 6'];
[0.14, 0.31, 0.5, 0.68, 0.86].forEach((u, i) => path(zs.filter(z => z < -3 - 5 * (i % 3)).map(z => pt(thL(z) + (thR(z) - thL(z)) * u + 0.5 * Math.sin(z / 13 + i), z, 3)), 'thin', false, ` style="stroke-dasharray:${dashes[i]}"`));
// the lip: water rounding over the top of the stave
[0.2, 0.5, 0.8].forEach(u => { const th = sc - 11.25 + 22.5 * u, a = pt(th, 0, -T + 1), b = pt(th, -7, 3); el.push(`  <path d="M ${f(a[0])} ${f(a[1])} Q ${f(a[0] + (b[0] - a[0]) * 0.6)} ${f(a[1] - 2)} ${f(b[0])} ${f(b[1])}" class="thin"/>`); });
// the ghost of the stave that was cut
el.push('  <!-- the stave that stood taller: dashed outline from the saw cut (z = 40) up to z = 190 -->');
const ga = -78.75 + W * CUT - W / 2, gb = ga + W, gz = frontH[CUT];
const gface = [...edge(ga, gz, GHOST, 0), ...arc(ga, gb, GHOST, 0), ...edge(gb, GHOST, gz, 0)];
path(gface, 'ah', true, ' style="opacity:0.45"');
path(gface, 'ga', false);
path(top(ga, gb, gz), 'ab');
path(top(ga, gb, GHOST), 'ga');
const lines = el.join('\n');
const gtop = pt(ga + W / 2, GHOST), gmid = pt(gb, 128), notch = pt(sc - 3, 0, -4), strm = pt(thL(-120), -120, 3);
console.log({ gtop, gmid, notch, strm, bl, br, base: pt(0, -HB) });
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p4b-t p4b-d">
  <title id="p4b-t">DIA-004B · The shortest stave</title>
  <desc id="p4b-d">An engraved plate of an open wooden tub built of staves of unequal height and bound by two iron hoops. Water stands inside exactly level with the top of the shortest stave and spills over it, down the outside, into a puddle on the floor. One stave is drawn in a dashed rust outline rising far above the rest: Anthropic's binding pause commitment. Its sawn-off length lies on the floor beside the tub, dated 24 February 2026. The taller stave never held any more water than the shortest one allowed.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .grain { fill: none; stroke: var(--ink); stroke-width: 0.6; stroke-linecap: round; opacity: 0.5; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .h { fill: url(#p4b-h); stroke: none; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ga { fill: none; stroke: var(--accent); stroke-width: 1.8; stroke-dasharray: 5 3.5; stroke-linejoin: round; }
      .ab { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; }
      .ah { fill: url(#p4b-ha); stroke: none; }
      .ahl { stroke: var(--accent); stroke-width: 0.7; }
      .at { fill: none; stroke: var(--accent); stroke-width: 0.7; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14px; font-style: italic; }
      .ac { fill: var(--accent); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Fredericka the Great", "Cormorant Garamond", Georgia, serif; font-size: 32px; letter-spacing: 0.01em; }
    </style>
    <pattern id="p4b-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p4b-ha" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="ahl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE IV</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 4 · WHO WAS SUPPOSED TO SLOW IT</text>
  <text x="480" y="92" text-anchor="middle" class="it" style="font-size:15px">“We felt that it wouldn't actually help anyone for us to stop training AI models.”</text>
  <text x="480" y="111" text-anchor="middle" class="sc">JARED KAPLAN OF ANTHROPIC, TO TIME</text>
${lines}
  <!-- the offcut on the floor: 150 long, the length missing from the stave -->
  <path d="M 668 572 L 816 554 L 850 548 L 852 536 L 836 524 L 816 546 L 668 564 Z" class="h"/>
  <path d="M 664 552 L 812 534 L 832 512 L 684 530 Z" class="ab"/>
  <path d="M 664 552 L 812 534 L 812 546 L 664 564 Z" class="ab"/>
  <path d="M 812 534 L 832 512 L 832 524 L 812 546 Z" class="ab"/>
  <path d="M 812 534 L 832 512 L 832 524 L 812 546 Z" class="ah"/>
  <path d="M 692 543 L 792 531 M 712 531 L 818 518 M 676 557 L 760 547" class="at" style="opacity:0.7"/>
  <g class="ac"><circle cx="652" cy="566" r="1"/><circle cx="646" cy="560" r="0.9"/><circle cx="656" cy="572" r="0.9"/><circle cx="641" cy="569" r="0.8"/><circle cx="660" cy="577" r="0.8"/><circle cx="649" cy="576" r="1"/><circle cx="636" cy="563" r="0.7"/></g>
  <!-- notes -->
  <text x="236" y="212" text-anchor="end" class="it">The shortest stave:</text>
  <text x="236" y="230" text-anchor="end" class="it">the lowest bar any competitor</text>
  <text x="236" y="248" text-anchor="end" class="it">is willing to hold.</text>
  <path d="M 242 244 L ${f(notch[0])} ${f(notch[1])}" class="thin"/>
  <circle cx="${f(notch[0])}" cy="${f(notch[1])}" r="2" style="fill:var(--ink)"/>
  <text x="212" y="414" text-anchor="end" class="it">The water line is the standard.</text>
  <text x="212" y="432" text-anchor="end" class="it">Anything poured in above it</text>
  <text x="212" y="450" text-anchor="end" class="it">runs out here.</text>
  <path d="M 218 428 L ${f(strm[0] + 3)} ${f(strm[1])}" class="thin"/>
  <text x="640" y="196" class="it ac">Anthropic's stave stood this tall:</text>
  <text x="640" y="214" class="it ac">a binding commitment to pause.</text>
  <text x="640" y="232" class="it ac">It never held any more water.</text>
  <path d="M 634 214 L ${f(gmid[0] + 4)} ${f(gmid[1])}" class="at"/>
  <text x="716" y="462" class="it ac">Sawn off 24 February 2026.</text>
  <text x="716" y="480" class="it ac">Four revisions since. Not put back.</text>
  <path d="M 760 488 L 764 514" class="at"/>
  <!-- title and caption -->
  <text x="480" y="642" text-anchor="middle" class="title">The Shortest Stave</text>
  <line x1="300" y1="660" x2="660" y2="660" class="thin"/>
  <text x="480" y="681" text-anchor="middle" class="cap">DIA-004B · A tub fills only to its shortest stave. A safety commitment taller than a rival's adds wood, not water.</text>
</svg>
`;
if (/\n\s*\n/.test(svg)) throw new Error('blank line');
writeFileSync(out, svg);
