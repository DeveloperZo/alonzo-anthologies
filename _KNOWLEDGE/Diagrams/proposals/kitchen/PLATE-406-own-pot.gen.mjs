// Generates PLATE-406-own-pot.svg. Usage: node PLATE-406-own-pot.gen.mjs <out.svg>
// Manner: a still life on the stove, drawn as an engraving. The spoon's path closes on the pot it came from.
// Figure (section 6, source 13, Konstantinou et al.): shown buggy code, the models' accuracy in judging
// a test's expected answer dropped by about 6 to 16 points, depending on model and prompt.
import { plate, write, f } from './frame.mjs';
const G = 520;                                  // the stove top
const PX = 300;                                 // pot centre
let seed = 406;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
let grains = '';
for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI, r = 6 + rnd() * 44; grains += `M ${f(556 + r * Math.cos(a) * 0.9)} ${f(G - 2 - Math.abs(r * Math.sin(a)) * 0.12)} h 0.01 `; }
const body = `
  <rect x="30" y="${G}" width="900" height="8" class="h"/><line x1="30" y1="${G}" x2="930" y2="${G}" class="l"/>
  <!-- the pot -->
  <path d="M ${PX - 120} 372 V ${G - 22} Q ${PX - 120} ${G} ${PX - 98} ${G} H ${PX + 98} Q ${PX + 120} ${G} ${PX + 120} ${G - 22} V 372" class="b"/>
  <path d="M ${PX + 62} 386 V ${G} H ${PX + 98} Q ${PX + 120} ${G} ${PX + 120} ${G - 22} V 372 Q ${PX + 100} 384 ${PX + 62} 386 Z" class="h"/>
  <ellipse cx="${PX}" cy="372" rx="120" ry="17" class="b"/>
  <ellipse cx="${PX}" cy="375" rx="108" ry="12.5" class="h"/>
  <ellipse cx="${PX}" cy="375" rx="108" ry="12.5" class="thin"/>
  <path d="M ${PX - 120} 398 h -26 q -10 0 -10 10 v 6 q 0 10 10 10 h 26 M ${PX + 120} 398 h 26 q 10 0 10 10 v 6 q 0 10 -10 10 h -26" class="l" style="stroke-width:2.2"/>
  <path d="M ${PX - 100} 430 Q ${PX} 444 ${PX + 60} 438 M ${PX - 100} 470 Q ${PX} 484 ${PX + 60} 478" class="thin" style="opacity:0.6"/>
  <!-- the spoon's path: out of the pot, up, and back into the same pot -->
  <path d="M ${PX - 52} 366 C ${PX - 150} 250 ${PX - 60} 150 ${PX + 4} 168 C ${PX + 96} 190 ${PX + 120} 290 ${PX + 50} 366" class="sight" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:7 5"/>
  <path d="M ${PX + 61} 348 l -11 18 l -3 -21" class="l" style="stroke-width:1.2"/>
  <!-- the spoon, at the top of its path -->
  <g transform="translate(${PX + 4} 168) rotate(-24)">
    <path d="M 16 -3.5 L 170 -7 Q 178 0 170 7 L 16 3.5 Z" class="b"/>
    <path d="M 16 3.5 L 170 7 Q 174 4 175 1 L 16 0 Z" class="h"/>
    <ellipse cx="-8" cy="0" rx="27" ry="18" class="b"/><ellipse cx="-8" cy="1" rx="19" ry="11.5" class="h"/><ellipse cx="-8" cy="1" rx="19" ry="11.5" class="thin"/>
  </g>
  <!-- what went in, and what was called for -->
  <g transform="translate(500 ${G - 29}) rotate(78) scale(1.7)"><path d="M -12 -26 H 12 L 15 24 H -15 Z" class="b"/><path d="M -12 -26 H 12 L 11 -40 H -11 Z" class="hb"/><path d="M 4 -24 L 13 24 H 15 L 12 -26 Z" class="h"/><text x="0" y="-4" text-anchor="middle" transform="rotate(-90 0 2)" style="font-size:6.5px;letter-spacing:0.16em">SALT</text></g>
  <path d="${grains.trim()}" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-linecap:round"/>
  <path d="M 846 ${G} V ${G - 62} H 906 V ${G} Z" class="b"/><path d="M 890 ${G - 62} H 906 V ${G} H 890 Z" class="h"/><rect x="842" y="${G - 76}" width="68" height="14" class="hb"/><rect x="866" y="${G - 84}" width="20" height="8" class="b"/>
  <text x="868" y="${G - 28}" text-anchor="middle" class="lab">SUGAR</text>
  <!-- the recipe card on its stand -->
  <path d="M 664 ${G} L 684 ${G - 46} M 806 ${G} L 786 ${G - 46}" class="l" style="stroke-width:2.2"/>
  <g transform="rotate(-3 738 330)">
    <rect x="660" y="197" width="170" height="278" class="h"/>
    <rect x="653" y="190" width="170" height="278" class="b"/>
    <text x="738" y="226" text-anchor="middle" class="lab" style="font-size:13px;letter-spacing:0.28em">THE SAUCE</text>
    <line x1="671" y1="238" x2="805" y2="238" class="thin"/>
    <path d="M 673 266 h 130 M 673 286 h 108 M 673 306 h 124 M 673 326 h 86 M 673 346 h 116" class="thin" style="opacity:0.55"/>
    <text x="673" y="392" class="it">To finish, it</text>
    <text x="673" y="410" class="it">should taste</text>
    <text x="673" y="446" class="big" style="font-style:italic;font-size:30px">sweet.</text>
  </g>
  <!-- the gap: the path never reaches the card -->
  <path d="M ${PX + 112} 262 H 600" class="la" style="stroke-dasharray:7 5"/><path d="M 600 252 v 20" class="la"/>
  <text x="${PX + 118}" y="244" class="ita">The spoon never reaches the card.</text>
  <!-- notes -->
  <text x="62" y="118" class="it">The cook tastes his sauce with his</text>
  <text x="62" y="136" class="it">own spoon, from his own pot.</text>
  <text x="62" y="162" class="sm">It tastes like what he made.</text>
  <text x="462" y="${G - 70}" class="sm">the salt: what went in</text>
  <text x="910" y="${G - 110}" text-anchor="end" class="sm">the sugar:</text>
  <text x="910" y="${G - 94}" text-anchor="end" class="sm">lid still on</text>
  <text x="480" y="566" text-anchor="middle" class="sm">Shown code with a bug in it, AI models judging a test's expected answer were about 6 to 16 points less accurate.</text>`;
const svg = plate({
  n: 406, roman: 'VI', section: 6, sectionName: 'THE COOK TASTES FROM HIS OWN POT',
  title: 'Tasting From Your Own Pot',
  caption: 'A test written from the code tastes the cook\u2019s own sauce. It cannot tell him the card said sweet.',
  desc: 'A still life on a stove top. A large pot of sauce stands on the left. A dashed path rises from the pot, passes through a wooden spoon held above it and returns to the same pot. On the right a recipe card on a stand reads: to finish, it should taste sweet. A dashed rust line sets out from the spoon toward the card and stops short, with the note that the spoon never reaches the card. A salt cellar lies tipped over beside the pot with salt spilled from it. A jar of sugar stands by the card with its lid still on. A note gives the finding: shown buggy code, AI models judging a test\'s expected answer were about 6 to 16 points less accurate.',
  style: `.lab { font-size: 10px; letter-spacing: 0.16em; }`,
  body,
});
write(process.argv[2], svg);
