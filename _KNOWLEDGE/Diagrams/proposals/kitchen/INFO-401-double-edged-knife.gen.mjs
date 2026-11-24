// Generates INFO-401-double-edged-knife.svg. Usage: node INFO-401-double-edged-knife.gen.mjs <out.svg>
// Form: a map. One field of tasks, cut by a jagged frontier. The figures sit on the side they belong to.
// Source 1, Dell'Acqua et al.: inside the frontier 12.2% more tasks, 25.1% faster, quality more than 40% higher;
// outside it, 19 percentage points less likely to be right. The dots are tasks in general, not a count from the study.
import { plate, write, f } from './frame.mjs';
const X0 = 50, X1 = 910, Y0 = 84, Y1 = 566;
// the frontier: a jagged line from top to bottom, wandering about x = 540
const fr = [[556, Y0], [500, 118], [590, 150], [520, 186], [604, 226], [548, 262], [478, 300], [566, 338], [508, 372], [600, 410], [534, 446], [574, 482], [496, 520], [552, Y1]];
const path = fr.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
const outside = `${path} L ${X1} ${Y1} L ${X1} ${Y0} Z`;
// tasks: [x, y]. Inside ones are ink, outside ones rust.
const inside = [[372, 126], [432, 160], [386, 214], [452, 238], [408, 290], [368, 352], [446, 356], [404, 418], [456, 470], [384, 496], [430, 534]];
const out = [[628, 132], [640, 300], [622, 452], [612, 536]];
const pairIn = [512, 338], pairOut = [596, 338];
const dot = ([x, y], cls) => `<circle cx="${x}" cy="${y}" r="7" class="${cls}"/>`;
const body = `
  <path d="${outside}" class="h" style="opacity:0.55"/>
  <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" class="l"/>
  <path d="${path}" class="l" style="stroke-width:2.6"/>
  ${inside.map((p) => dot(p, 'ink')).join('')}${out.map((p) => dot(p, 'fa')).join('')}
  ${dot(pairIn, 'ink')}${dot(pairOut, 'fa')}
  <path d="M ${pairIn[0]} ${pairIn[1] + 14} v 8 H ${pairOut[0]} v -8" class="thin"/>
  <rect x="640" y="352" width="230" height="44" class="paper"/>
  <text x="${pairOut[0] + 18}" y="368" class="sm">two tasks that look equally hard,</text>
  <text x="${pairOut[0] + 18}" y="384" class="sm">one on each side of the line</text>
  <!-- inside -->
  <text x="78" y="118" class="sc">INSIDE WHAT THE AI DOES WELL</text>
  <text x="78" y="196" class="huge">+12.2%</text><text x="80" y="220" class="it">more tasks finished</text>
  <text x="78" y="308" class="huge">+25.1%</text><text x="80" y="332" class="it">faster</text>
  <text x="78" y="420" class="huge">+40%</text><text x="80" y="444" class="it">and more, in the quality of the work</text>
  <!-- outside -->
  <rect x="664" y="100" width="232" height="180" class="paper"/>
  <text x="884" y="118" text-anchor="end" class="sc" style="fill:var(--accent)">OUTSIDE IT</text>
  <text x="884" y="204" text-anchor="end" class="hugea">−19</text>
  <text x="884" y="232" text-anchor="end" class="ita">points less likely</text>
  <text x="884" y="252" text-anchor="end" class="ita">to get the answer right</text>
  <rect x="640" y="474" width="256" height="74" class="paper"/>
  <text x="884" y="496" text-anchor="end" class="sm">The frontier is jagged. Nothing about</text>
  <text x="884" y="512" text-anchor="end" class="sm">a task says which side it will fall on.</text>
  <text x="884" y="536" text-anchor="end" class="sm">758 consultants, assigned by chance.</text>`;
write(process.argv[2], plate({
  n: 401, roman: 'I', section: 1, sectionName: 'DOES IT MAKE YOU BETTER?', title: 'A Double-Edged Knife',
  caption: 'One tool, one study: better work on one side of a jagged frontier, worse answers on the other.',
  desc: 'A field of tasks drawn as dots and cut from top to bottom by a jagged line, the frontier of what the AI does well. To the left, inside it, the dots are dark and three large figures read: 12.2 percent more tasks finished, 25.1 percent faster, and quality up 40 percent and more. To the right, outside it, the ground is hatched, the dots are rust and one large rust figure reads minus 19: consultants using AI were 19 percentage points less likely to get the answer right. Two dots that sit level with each other, one on each side of the line, are bracketed as two tasks that look equally hard. From a preregistered field experiment of 758 consultants.',
  style: `.huge { font-size: 54px; } .hugea { font-size: 84px; fill: var(--accent); }`,
  body,
}));
