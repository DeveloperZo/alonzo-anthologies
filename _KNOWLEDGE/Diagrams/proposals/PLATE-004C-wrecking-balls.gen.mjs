// Generates PLATE-004C-wrecking-balls.svg. Run: node PLATE-004C-wrecking-balls.gen.mjs
// Two iron balls whose weights stand in the ratio of the money.
// Same material, so weight goes with volume and radius with the cube root.
import fs from 'node:fs';

// ---- figures (sources in DIA-004C-momentum.md) ----
const BIG = 856e9;   // OpenAI projected compute spending through 2030 (section 2, source 6b)
const SMALL = 84e6;  // UK AI Security Institute, one year's budget (as on DIA-004A)
const CAISI = 10e6;  // US CAISI, FY2026 (source 26a)
// ---------------------------------------------------
const ratio = BIG / SMALL;                   // 10,190
const R = 160;                               // big ball radius, plate units
const r = R / Math.cbrt(ratio);              // small ball radius, true to weight
const caisiWidth = Math.cbrt(CAISI / SMALL); // 0.49: "half as wide"
// equal and opposite speeds, balls lock: big ball keeps (M-m)/(M+m) of its speed
const lost = (2 * SMALL) / (BIG + SMALL);    // 1/5095
const f = (n) => n.toFixed(1);

const B = { x: 378, y: 401 }, P1 = { x: 420, y: 102 };
const S = { x: B.x + R + r + 7, y: 401 }, P2 = { x: 640, y: 102 };
const toward = (a, b, d) => {
  const L = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: a.x + (b.x - a.x) / L * d, y: a.y + (b.y - a.y) / L * d };
};
const lug = toward(B, P1, R + 6), top = toward(S, P2, r);
// motion marks: arcs behind each ball, centred on the ball
const arcL = (c, rad, deg) => {
  const t = deg * Math.PI / 180;
  return `M ${f(c.x - rad * Math.cos(t))} ${f(c.y - rad * Math.sin(t))} A ${f(rad)} ${f(rad)} 0 0 0 ${f(c.x - rad * Math.cos(t))} ${f(c.y + rad * Math.sin(t))}`;
};
const arcR = (c, rad, deg) => {
  const t = deg * Math.PI / 180;
  return `M ${f(c.x + rad * Math.cos(t))} ${f(c.y - rad * Math.sin(t))} A ${f(rad)} ${f(rad)} 0 0 1 ${f(c.x + rad * Math.cos(t))} ${f(c.y + rad * Math.sin(t))}`;
};
// rivets: x = 60 + 60 i
const rivets = Array.from({ length: 15 }, (_, i) => `<circle cx="${60 + 60 * i}" cy="91" r="1.8"/>`).join('');
const half = caisiWidth > 0.45 && caisiWidth < 0.55 ? 'half' : f(caisiWidth) + ' times';
const lostWords = Math.round(1 / lost / 1000) === 5 ? 'a five-thousandth' : '1/' + Math.round(1 / lost);
const widthWords = Math.round(R / r) === 22 ? 'a twenty-second' : '1/' + Math.round(R / r);

const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p4c-t p4c-d">
  <title id="p4c-t">DIA-004C · The heavier ball keeps going</title>
  <desc id="p4c-d">An engraved plate of two wrecking balls hung from one girder and swinging toward each other. The left ball is enormous and stands for OpenAI's projected compute spending through 2030, 856 billion dollars. The right ball is the size of a marble and stands for one year of the UK AI Security Institute's budget, 84 million dollars. Their weights are drawn in the true ratio of 10,190 to 1.</desc>
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
      .h { fill: url(#p4c-h); stroke: none; }
      .hb { fill: url(#p4c-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hx { fill: url(#p4c-x); stroke: none; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .acc { fill: var(--accent); }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p4c-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p4c-x" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <clipPath id="p4c-ball"><circle cx="${B.x}" cy="${B.y}" r="${R}"/></clipPath>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE IV C</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART I · SECTION 4 · WHO WAS SUPPOSED TO SLOW IT</text>
  <!-- girder, running off both sides -->
  <rect x="30" y="80" width="900" height="22" class="hb"/>
  <line x1="30" y1="85" x2="930" y2="85" class="thin"/><line x1="30" y1="97" x2="930" y2="97" class="thin"/>
  <g class="ink">${rivets}</g>
  <path d="M ${P1.x - 12} 102 h 24 l -6 12 h -12 Z" class="b"/><path d="M ${P2.x - 6} 102 h 12 l -3 7 h -6 Z" class="b"/>
  <!-- ground -->
  <rect x="30" y="575" width="900" height="7" class="h"/>
  <line x1="30" y1="575" x2="930" y2="575" class="l"/>
  <!-- the large ball: centre (${B.x},${B.y}), radius ${R} -->
  <line x1="${P1.x}" y1="112" x2="${f(lug.x)}" y2="${f(lug.y)}" style="stroke:var(--ink);stroke-width:6.5;stroke-linecap:round;stroke-dasharray:11 7"/>
  <line x1="${P1.x}" y1="112" x2="${f(lug.x)}" y2="${f(lug.y)}" class="l"/>
  <circle cx="${B.x}" cy="${B.y}" r="${R}" class="paper"/>
  <g clip-path="url(#p4c-ball)">
    <rect x="${B.x - R}" y="${B.y - R}" width="${2 * R}" height="${2 * R}" class="h"/>
    <circle cx="${B.x - 30}" cy="${B.y - 34}" r="${R - 6}" class="paper"/>
    <path d="M ${B.x + 20} ${B.y + R} A ${R} ${R} 0 0 0 ${B.x + R} ${B.y + 20} L ${B.x + R} ${B.y + R} Z" class="hx"/>
  </g>
  <path d="M ${B.x - 118} ${B.y - 62} A 134 134 0 0 1 ${B.x - 52} ${B.y - 123}" class="thin"/>
  <circle cx="${B.x}" cy="${B.y}" r="${R}" class="l" style="stroke-width:1.8"/>
  <circle cx="${f(lug.x)}" cy="${f(lug.y)}" r="8" class="b"/><circle cx="${f(lug.x)}" cy="${f(lug.y)}" r="3" class="b"/>
  <g class="thin"><path d="${arcL(B, R + 16, 20)}"/><path d="${arcL(B, R + 30, 15)}"/><path d="${arcL(B, R + 44, 10)}"/></g>
  <!-- the small ball: radius = ${R} / cbrt(${Math.round(ratio)}) = ${f(r)} -->
  <line x1="${P2.x}" y1="109" x2="${f(top.x)}" y2="${f(top.y)}" class="thin" style="stroke-width:0.9"/>
  <circle cx="${f(S.x)}" cy="${S.y}" r="${f(r)}" class="acc"/>
  <g class="thin"><path d="${arcR(S, r + 7, 25)}"/><path d="${arcR(S, r + 14, 20)}"/></g>
  <!-- notes -->
  <text x="56" y="150" class="it">OpenAI's projected compute spending</text>
  <text x="56" y="169" class="it">through 2030: $856 billion</text>
  <path d="M 150 178 q 16 34 62 72" class="thin"/>
  <text x="612" y="300" class="ita">the UK AI Security Institute's</text>
  <text x="612" y="319" class="ita">budget for one year: $84 million</text>
  <path d="M 632 328 Q 612 372 ${f(S.x + r + 4)} ${f(S.y - 5)}" class="la"/>
  <text x="612" y="444" class="sm">US CAISI's ball, at $10 million a year,</text>
  <text x="612" y="461" class="sm">would be ${half} as wide.</text>
  <text x="612" y="500" class="it">If they meet at equal speed, the large</text>
  <text x="612" y="519" class="it">ball keeps all but ${lostWords}</text>
  <text x="612" y="538" class="it">of its own.</text>
  <text x="480" y="600" text-anchor="middle" class="sm">Drawn to weight, as two balls of the same iron: ${Math.round(ratio).toLocaleString('en-US')} parts to 1, which makes the small ball ${widthWords} as wide.</text>
  <text x="480" y="645" text-anchor="middle" class="title">The Heavier Ball Keeps Going</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-004C · Projected spending against one year of the largest oversight budget, as two wrecking balls drawn to weight.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-004C-wrecking-balls.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log(`ratio ${ratio.toFixed(0)}, small radius ${r.toFixed(2)}, CAISI width ${caisiWidth.toFixed(2)}, speed lost 1/${(1 / lost).toFixed(0)}`);
