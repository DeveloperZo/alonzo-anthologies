// Generates PLATE-403-too-much-of-a-good-thing.svg. Usage: node PLATE-403-too-much-of-a-good-thing.gen.mjs <out.svg>
// Manner: a tracker's field sketch, seen from straight above, in stipple. No figure is drawn: the prints carry it.
// The only figure is arithmetic: ten US gallons of water at about 8.34 lb a gallon is about 83 lb.
// Strides: 70 units before the water; after it, each stride is 0.9 of the one before (illustrative, not data).
import { plate, write, f } from './frame.mjs';
let seed = 403;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const Y = 352;                                  // the line of travel
const print = (x, side, deep) => {
  const y = Y + side * 17;
  const sole = 'M -3 -6 C 5 -8.5 15 -7 17 0 C 15 7 5 8.5 -3 6 C -5 2 -5 -2 -3 -6 Z';
  const heel = 'M -15 -5 C -11 -6 -8 -5.5 -7 -4.5 L -7 4.5 C -8 5.5 -11 6 -15 5 C -17 2 -17 -2 -15 -5 Z';
  const t = `translate(${f(x)} ${f(y)}) rotate(${side * -4}) scale(1.4)`;
  return (deep ? `<g transform="${t} translate(2.6 2.8) scale(1.18)"><path d="${sole}" class="h"/><path d="${heel}" class="h"/></g>` : '') +
    `<g transform="${t}"><path d="${sole}" class="ink"/><path d="${heel}" class="ink"/></g>`;
};
// before the water: even strides
let prints = '', x = 84, side = 1; const before = [];
for (let i = 0; i < 3; i++) { prints += print(x, side, false); before.push(x); x += 70; side = -side; }
// the cache: ten ring marks where the jugs stood
const CX0 = 236, CY0 = 250;
let rings = '';
for (let i = 0; i < 10; i++) { const cx = CX0 + (i % 5) * 27, cy = CY0 + Math.floor(i / 5) * 27; rings += `<circle cx="${cx}" cy="${cy}" r="10.5" class="thin" style="stroke-dasharray:3 2.5"/>`; }
// after: each stride nine tenths of the last
let stride = 70; const after = []; x = 296;
for (let i = 0; i < 11; i++) { prints += print(x, side, true); after.push(x); stride *= 0.9; x += stride; side = -side; }
const lastA = after[after.length - 2], lastB = after[after.length - 1];
// stopped: both feet together, and the load set down
const stopX = lastB + 36;
prints += print(stopX, 1, true) + print(stopX + 2, -1, true);
const JX = stopX + 58, JY = Y - 34;
let jugs = '';
for (let i = 0; i < 10; i++) {
  const cx = JX + (i % 4) * 31 + (Math.floor(i / 4) % 2) * 15, cy = JY + Math.floor(i / 4) * 30;
  jugs += `<circle cx="${f(cx + 3)}" cy="${f(cy + 3.5)}" r="14" class="h"/><circle cx="${f(cx)}" cy="${f(cy)}" r="14" class="b"/><circle cx="${f(cx)}" cy="${f(cy)}" r="9.5" class="thin"/><circle cx="${f(cx - 3)}" cy="${f(cy - 3)}" r="3.6" class="ink"/><path d="M ${f(cx + 2)} ${f(cy + 8)} q 6 -1 7 -7" class="l" style="stroke-width:2"/>`;
}
// sand: stipple, denser along two ridges, never inside the band the prints walk in
let dots = '';
for (let i = 0; i < 9000; i++) {
  const px = 40 + rnd() * 880, py = 78 + rnd() * 500;
  const ridge = Math.min(Math.abs(py - (150 + 40 * Math.sin(px / 150))), Math.abs(py - (520 + 26 * Math.sin(px / 120 + 2))));
  if (Math.abs(py - Y) < 44) continue;
  if (px > 215 && px < 520 && py > 180 && py < 300) continue;
  if (px > 700 && py > 230 && py < 300) continue;
  if (py > 396 && py < 468 && (px < 210 || px > 640)) continue;
  if (rnd() > Math.exp(-ridge / 60) + 0.06) continue;
  dots += `M ${f(px)} ${f(py)} h 0.01 `;
}
const brk = (a, b, y, cls) => `<path d="M ${f(a)} ${y - 5} v 5 H ${f(b)} v -5" class="${cls}"/>`;
const body = `
  <path d="${dots.trim()}" style="fill:none;stroke:var(--ink);stroke-width:1.7;stroke-linecap:round;opacity:0.7"/>
  ${rings}
  ${prints}
  ${jugs}
  <!-- one stride before, one stride after -->
  ${brk(before[0], before[1], Y + 52, 'thin')}
  ${brk(lastA, lastB, Y + 52, 'la')}
  <!-- notes -->
  <text x="${before[0] - 8}" y="${Y + 74}" class="sm">one stride, dry</text>
  <text x="${CX0 - 12}" y="${CY0 - 44}" class="it">Ten gallons of water, handed over here.</text>
  <text x="${CX0 - 12}" y="${CY0 - 26}" class="it">The thirst ends at this spot.</text>
  <text x="${f(lastA - 4)}" y="${Y + 76}" text-anchor="middle" class="ita">one stride,</text>
  <text x="${f(lastA - 4)}" y="${Y + 94}" text-anchor="middle" class="ita">carrying it</text>
  <text x="908" y="${JY - 62}" text-anchor="end" class="ita">Ten gallons weighs about</text>
  <text x="908" y="${JY - 32}" text-anchor="end" class="biga">83 lb</text>
  <text x="908" y="${JY + 122}" text-anchor="end" class="sm">set down, not finished</text>`;
const svg = plate({
  n: 403, roman: 'III', section: 3, sectionName: 'TEN GALLONS',
  title: 'Too Much of a Good Thing',
  caption: 'Ten gallons of water ends the thirst and becomes the load. The limit moves from the throat to the legs.',
  desc: 'A trail of bootprints across sand, seen from above. On the left the strides are long and even. Ten ring marks show where ten jugs of water stood and were picked up. From there the prints are pressed deeper and each stride is shorter than the last, until both feet stop together beside ten jugs set down on the sand. A note gives the weight of ten gallons of water, about 83 pounds. Brackets compare one stride before the water with one stride after it.',
  body,
});
write(process.argv[2], svg);
