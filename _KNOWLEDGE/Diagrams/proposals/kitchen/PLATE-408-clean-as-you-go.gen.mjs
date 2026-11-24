// Generates PLATE-408-clean-as-you-go.svg. Usage: node PLATE-408-clean-as-you-go.gen.mjs <out.svg>
// Manner: the loose kitchen of DIA-404, in the same side elevation, with three repairs drawn in rust.
// A structural picture. No figure on it is measured: section 8 says no study here tests these fixes.
import { plate, write, f } from './frame.mjs';
import { counter, dish, passFrame, spoon, GATE } from './pass.mjs';
const XP = 470, Y = 486, K = { k: 1.4 };
let q = '';
for (let i = 0; i < 4; i++) q += dish(122 + 68 * i, Y, K);
let out = '';
for (let i = 0; i < 5; i++) out += dish(616 + 66 * i, Y, { tick: true, k: 1.4 });
const body = `
  <text x="60" y="88" class="sc">THE LOOSE KITCHEN, REPAIRED</text>
  ${counter(Y)}
  ${passFrame(XP, Y)}
  ${q}
  ${dish(XP - 34, Y, K)}${spoon(XP - 34, Y, 'la')}
  ${out}
  <!-- 1: the cap, a stop on the counter and a rule over the four that may wait -->
  <rect x="62" y="${Y - 58}" width="12" height="58" class="ba"/><path d="M 62 ${Y - 58} h 12 M 58 ${Y - 58} h 20" class="la"/>
  <path d="M 90 ${Y - 62} v -8 H 358 v 8" class="la" style="stroke-width:1.3"/>
  <!-- 3: the cost sheet, clipped to the post -->
  <g transform="translate(${XP + 126} ${Y - 196})"><rect x="0" y="0" width="58" height="76" class="ba"/><rect x="19" y="-6" width="20" height="10" class="ba"/><path d="M 8 18 h 42 M 8 30 h 42 M 8 42 h 42 M 8 54 h 42 M 30 12 v 52" class="la" style="stroke-width:0.9"/></g>
  <!-- keys beside the three repairs -->
  <text x="84" y="${Y - 78}" class="ita">a</text>
  <text x="${XP - 74}" y="${Y - 70}" class="ita">b</text>
  <text x="${XP + 192}" y="${Y - 186}" class="ita">c</text>
  <!-- notes -->
  <text x="60" y="200" class="ita">a. A cap on the tickets.</text>
  <text x="60" y="219" class="sm">When four are waiting, the cooks stop</text>
  <text x="60" y="235" class="sm">firing and help clear the pass.</text>
  <text x="352" y="200" class="ita">b. A second spoon.</text>
  <text x="352" y="219" class="sm">Not the cook's: a check written</text>
  <text x="352" y="235" class="sm">from the card, not from the pot.</text>
  <text x="640" y="200" class="ita">c. The weekly food-cost check.</text>
  <text x="640" y="219" class="sm">Spend set beside what shipped</text>
  <text x="640" y="235" class="sm">and what came back.</text>
  <text x="60" y="${Y + 32}" class="sm">from the stations</text>
  <text x="910" y="${Y + 32}" text-anchor="end" class="sm">to the table</text>
  <text x="60" y="122" class="it">The same pass as the lower kitchen on Plate IV. The gate is down again,</text>
  <text x="60" y="140" class="it">and every plate that leaves has been tasted.</text>
  <text x="480" y="574" text-anchor="middle" class="sm">Three repairs, one for each check that broke. A count of what is fitted, not a measurement: no study in this piece tests them.</text>`;
const svg = plate({
  n: 408, roman: 'VIII', section: 8, sectionName: 'THE KITCHEN DECIDES',
  title: 'Clean As You Go',
  caption: 'The loose kitchen with its three checks closed: a cap at the pass, a second spoon, a weekly look at the bill.',
  desc: 'The loose kitchen from plate four, in the same side elevation, repaired. The gate at the pass is down again. Three repairs are drawn in rust. A stop on the counter and a rule over the queue cap the plates waiting at four. A second tasting spoon, not the cook\'s own, rests in the plate at the gate. A cost sheet is clipped up beside the pass for a weekly check of spend against what shipped. Five plates have gone out and each is ticked. A note says this is a count of what is fitted and not a measurement, because no study in the piece tests these fixes.',
  body,
});
write(process.argv[2], svg);
