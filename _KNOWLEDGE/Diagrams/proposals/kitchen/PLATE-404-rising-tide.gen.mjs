// Generates PLATE-404-rising-tide.svg. Usage: node PLATE-404-rising-tide.gen.mjs <out.svg>
// Manner: a side elevation, two kitchens drawn one above the other on the same scale.
// Each pass receives the same ten plates. Figures (section 4, source 1): below-average performers
// raised their quality score 43% with AI, above-average performers 17%.
// The plate counts are the kitchen frame, not data.
import { plate, write, f } from './frame.mjs';
import { counter, dish, passFrame, spoon, GATE } from './pass.mjs';
const XP = 440, Y1 = 276, Y2 = 530, N = 10;
// tight kitchen: four wait, one is at the gate, five are out and ticked
let tight = '';
for (let i = 0; i < 4; i++) tight += dish(100 + 68 * i, Y1);
tight += dish(XP - 34, Y1) + spoon(XP - 34, Y1);
for (let i = 0; i < 5; i++) tight += dish(590 + 71 * i, Y1, { tick: true });
// loose kitchen: one arriving, nine through in a run, three of them wrong
const badI = [2, 5, 7];
let loose = dish(XP - 170, Y2);
for (let i = 8; i >= 0; i--) loose += dish(562 + 38 * i, Y2, { bad: badI.includes(i) });
const gx = XP + GATE;
const body = `
  <text x="60" y="88" class="sc">THE TIGHT KITCHEN</text>
  <text x="60" y="344" class="sc">THE LOOSE KITCHEN</text>
  ${counter(Y1)}
  ${passFrame(XP, Y1)}
  ${tight}
  ${counter(Y2)}
  ${passFrame(XP, Y2, { open: true })}
  ${loose}
  <!-- the gap under the propped gate: nothing stands in it -->
  <path d="M ${gx} ${Y2 - 100} V ${Y2 - 5} M ${gx - 6} ${Y2 - 100} h 12 M ${gx - 6} ${Y2 - 5} h 12" class="la" style="stroke-width:1.3"/>
  <text x="${gx - 14}" y="${Y2 - 46}" text-anchor="end" class="ita">waved through</text>
  <!-- notes -->
  <text x="60" y="116" class="it">Every plate stops at the pass,</text>
  <text x="60" y="134" class="it">even on a slammed Friday.</text>
  <text x="590" y="140" class="it">Five out, each one tasted.</text>
  <text x="590" y="158" class="sm">The rest wait their turn.</text>
  <text x="60" y="372" class="it">One chef, a full rail,</text>
  <text x="60" y="390" class="it">and the gate propped up.</text>
  <text x="590" y="396" class="ita">Nine out, none tasted.</text>
  <text x="590" y="416" class="ita">Three should not have left.</text>
  <text x="910" y="${Y1 + 30}" text-anchor="end" class="sm">to the table</text>
  <text x="910" y="${Y2 + 30}" text-anchor="end" class="sm">to the table</text>
  <text x="60" y="${Y1 + 30}" class="sm">from the stations</text>
  <text x="60" y="${Y2 + 30}" class="sm">from the stations</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Same knives, same Monday, the same ${N} plates sent to each pass. At the stations the weaker cooks gained most: 43% against 17%.</text>`;
const svg = plate({
  n: 404, roman: 'IV', section: 4, sectionName: 'TWO KITCHENS, SAME MENU',
  title: 'Rising Tide, Leaky Boats',
  caption: 'The weaker cook gains most at the station, 43% against 17%. The pass decides what reaches the table.',
  desc: 'Two kitchen passes in side elevation, one above the other, each receiving the same ten plates. In the tight kitchen the gate at the pass is down: four plates wait, one is being tasted with a spoon, and five have gone out, each ticked. In the loose kitchen the gate is propped up, leaving a gap marked in rust: nine plates have run through untasted and three of them, drawn in rust, are wrong. A note gives the figures from the consultant study: below-average performers gained 43 percent in quality with AI and above-average performers 17 percent.',
  body,
});
write(process.argv[2], svg);
