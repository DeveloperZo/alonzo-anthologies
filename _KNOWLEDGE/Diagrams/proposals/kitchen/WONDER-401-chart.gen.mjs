// Generates WONDER-401-chart.svg. Usage: node WONDER-401-chart.gen.mjs <out.svg>
// Manner: an old coastal chart. The frontier of what the AI does well is a coastline. Inside it is land,
// outside it is open water, and the same tool that carries a task ashore loses the next one at sea.
// Source 1, Dell'Acqua et al., 758 consultants: inside the frontier 12.2% more tasks finished, 25.1% faster,
// quality more than 40% higher; outside it, 19 percentage points less likely to be right.
// The towns and wrecks stand for tasks in general. They are not a count from the study.
import { plate, write, f } from './frame.mjs';
let seed = 401;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const X0 = 50, X1 = 910, Y0 = 84, Y1 = 566;
// the coast: big capes and bays, then roughened
const capes = [[552, Y0], [504, 116], [588, 150], [524, 186], [606, 226], [548, 262], [482, 300], [566, 338], [510, 372], [600, 410], [536, 446], [576, 482], [498, 520], [550, Y1]];
const coast = [];
for (let i = 0; i < capes.length - 1; i++) {
  const [ax, ay] = capes[i], [bx, by] = capes[i + 1], n = 7;
  for (let k = 0; k < n; k++) { const t = k / n; coast.push([ax + (bx - ax) * t + (k ? (rnd() - 0.5) * 9 : 0), ay + (by - ay) * t + (k ? (rnd() - 0.5) * 5 : 0)]); }
}
coast.push(capes[capes.length - 1]);
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${f(x)} ${f(y)}`).join(' ');
const shift = (d, soft = 0) => coast.map(([x, y], i) => [x + d + soft * Math.sin(i / 3.1), y]);
// water lines, fading out to sea
let water = '';
[9, 20, 33, 48, 66, 88].forEach((d, i) => { water += `<path d="${line(shift(d, i * 0.9))}" style="fill:none;stroke:var(--ink);stroke-width:${f(0.9 - i * 0.09)};opacity:${f(0.75 - i * 0.1)}"/>`; });
// the beach: stipple just inland of the coast
let sand = '';
for (let i = 0; i < 900; i++) { const j = Math.floor(rnd() * (coast.length - 1)); const [x, y] = coast[j]; const d = 3 + rnd() * rnd() * 34; sand += `M ${f(x - d)} ${f(y + (rnd() - 0.5) * 8)} h 0.01 `; }
// towns ashore (tasks that landed) and wrecks offshore (tasks that did not)
const towns = [[384, 128], [440, 166], [398, 218], [456, 246], [414, 296], [372, 354], [448, 362], [408, 420], [460, 474], [388, 500], [434, 538]];
const wrecks = [[640, 134], [656, 300], [634, 456], [628, 538]];
const town = ([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" class="b" style="stroke-width:1.2"/><circle cx="${x}" cy="${y}" r="1.8" class="ink"/>`;
const wreck = ([x, y]) => `<path d="M ${x - 7} ${y - 7} L ${x + 7} ${y + 7} M ${x - 7} ${y + 7} L ${x + 7} ${y - 7}" class="la" style="stroke-width:2.2"/>`;
const LAT = 338, pin = [522, LAT], pout = [606, LAT];
// compass rose
const rose = (cx, cy, R) => {
  let s = `<circle cx="${cx}" cy="${cy}" r="${R}" class="thin"/><circle cx="${cx}" cy="${cy}" r="${R - 6}" class="thin" style="opacity:0.5"/>`;
  for (let k = 0; k < 16; k++) {
    const a = k * Math.PI / 8, len = k % 4 === 0 ? R - 2 : k % 2 === 0 ? R * 0.62 : R * 0.36, wdt = k % 4 === 0 ? 7 : 4.5;
    const tx = cx + len * Math.sin(a), ty = cy - len * Math.cos(a);
    const lx = cx + wdt * Math.sin(a - Math.PI / 2), ly = cy - wdt * Math.cos(a - Math.PI / 2);
    const rx = cx + wdt * Math.sin(a + Math.PI / 2), ry = cy - wdt * Math.cos(a + Math.PI / 2);
    s += `<path d="M ${f(lx)} ${f(ly)} L ${f(tx)} ${f(ty)} L ${cx} ${cy} Z" class="ink"/><path d="M ${f(rx)} ${f(ry)} L ${f(tx)} ${f(ty)} L ${cx} ${cy} Z" class="bt" style="stroke-width:0.7"/>`;
  }
  return s + `<text x="${cx}" y="${cy - R - 7}" text-anchor="middle" class="sc">N</text>`;
};
const body = `
  <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" class="l"/>
  <rect x="${X0 + 5}" y="${Y0 + 5}" width="${X1 - X0 - 10}" height="${Y1 - Y0 - 10}" class="thin"/>
  <clipPath id="p401-clip"><rect x="${X0 + 5}" y="${Y0 + 5}" width="${X1 - X0 - 10}" height="${Y1 - Y0 - 10}"/></clipPath>
  <g clip-path="url(#p401-clip)">
    ${water}
    <path d="${sand.trim()}" style="fill:none;stroke:var(--ink);stroke-width:1.3;stroke-linecap:round;opacity:0.7"/>
    <path d="${line(coast)}" class="l" style="stroke-width:2.4"/>
    <!-- one line of latitude through two tasks that look alike -->
    <line x1="${X0 + 5}" y1="${LAT}" x2="${X1 - 5}" y2="${LAT}" class="sight"/>
  </g>
  ${towns.map(town).join('')}${wrecks.map(wreck).join('')}
  ${town(pin)}${wreck(pout)}
  <text x="884" y="${LAT - 9}" text-anchor="end" class="sm">one latitude, two tasks that look</text>
  <text x="884" y="${LAT + 17}" text-anchor="end" class="sm">equally hard: one ashore, one lost</text>
  <!-- the land -->
  <text x="80" y="122" class="sc">ASHORE: WHAT THE AI DOES WELL</text>
  <text x="78" y="196" class="huge">+12.2%</text><text x="80" y="220" class="it">more tasks finished</text>
  <text x="78" y="300" class="huge">+25.1%</text><text x="80" y="324" class="it">faster</text>
  <text x="78" y="420" class="huge">+40%</text><text x="80" y="444" class="it">and more, in the quality of the work</text>
  <text x="80" y="536" class="sm">A survey of 758 consultants, assigned by chance</text>
  <!-- the sea -->
  <text x="884" y="122" text-anchor="end" class="sc" style="fill:var(--accent)">OPEN WATER: OUTSIDE IT</text>
  <text x="884" y="216" text-anchor="end" class="hugea">−19</text>
  <text x="884" y="244" text-anchor="end" class="ita">points less likely</text>
  <text x="884" y="264" text-anchor="end" class="ita">to get the answer right</text>
  ${rose(820, 470, 46)}
  <text x="478" y="110" text-anchor="end" class="sm">the jagged frontier</text>`;
write(process.argv[2], plate({
  n: 401, roman: 'I', section: 1, sectionName: 'DOES IT MAKE YOU BETTER?', title: 'A Double-Edged Knife',
  caption: 'One tool, one study: better work ashore of a jagged frontier, worse answers in the water beyond it.',
  desc: 'A coastal chart. A jagged coastline runs from top to bottom: the frontier of what the AI does well. To the left is land, marked with small towns for tasks and three large figures: 12.2 percent more tasks finished, 25.1 percent faster, and quality up 40 percent and more. To the right is open water, ruled with fading water lines and marked with rust crosses for wrecks, and one large rust figure: minus 19, the percentage points by which consultants using AI were less likely to get the answer right. A dashed line of latitude runs through one town and one wreck that sit level with each other, two tasks that look equally hard. A compass rose sits in the lower right. From a preregistered field experiment of 758 consultants.',
  style: `.huge { font-size: 54px; } .hugea { font-size: 84px; fill: var(--accent); }`,
  body,
}));
