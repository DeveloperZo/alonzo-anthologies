// Generates WONDER-407-spend.svg. Usage: node WONDER-407-spend.gen.mjs <out.svg>
// Manner: a flow map over time. One river of spend widens threefold from March to August while the two
// streams of work it pays for keep their width.
// Scale: 1.6 units of width = 1 dollar for the spend river, and 1 percentage point for the two work streams.
// Only the two end months are reported, so each stream is drawn straight between them.
// Source 19, Jellyfish: 37 to 115 dollars per weekly active user, March to August 2026; new features 57% then 56%,
// maintenance 25% then 24%. Source 18, LeadDev: 18% of organizations measure AI's impact.
import { plate, write, f } from './frame.mjs';
import { rng, straight, ribbon, chev, FLOW_STYLE } from './flow.mjs';
const rnd = rng(4071);
const U = 1.6, XA = 150, XB = 800;
const taper = (a, b) => { const n = Math.round((XB - XA) / 4); return (i) => (a + (b - a) * i / n) * U / 2; };
const spend = ribbon({ cl: straight(XA, 208, XB, 208), hw: taper(37, 115), rnd, cls: 'sta', bankCls: 'la', pitch: 6.2 });
const feat = ribbon({ cl: straight(XA, 388, XB, 388), hw: taper(57, 56), rnd, pitch: 6.2 });
const maint = ribbon({ cl: straight(XA, 482, XB, 482), hw: taper(25, 24), rnd, pitch: 6.2 });
let marks = '';
for (let i = 0; i < 100; i++) marks += `<circle cx="${f(XA + 3.2 + i * 6.5)}" cy="548" r="2.9" class="${i < 18 ? 'ink' : 'off'}"/>`;
const body = `
  <line x1="${XA}" y1="112" x2="${XA}" y2="514" class="thin"/><line x1="${XB}" y1="112" x2="${XB}" y2="514" class="thin"/>
  ${spend}${feat}${maint}
  ${chev(470, 208, 1, 'la')}${chev(470, 388, 1)}
  <text x="${XA}" y="100" class="sc" style="fill:var(--accent)">THE BILL: AI SPEND PER WEEKLY ACTIVE USER</text>
  <text x="${XA - 12}" y="217" text-anchor="end" class="numa">&#36;37</text>
  <text x="${XB + 14}" y="222" class="hugea">&#36;115</text>
  <text x="${XB + 14}" y="246" class="ita">three times</text>
  <text x="${XB + 14}" y="264" class="ita">the bill</text>
  <text x="${XA}" y="328" class="sc">WHAT IT BOUGHT: NEW FEATURES, AS A SHARE OF THE WORK</text>
  <text x="${XA - 12}" y="397" text-anchor="end" class="num">57%</text>
  <text x="${XB + 14}" y="397" class="num">56%</text>
  <text x="${XA}" y="452" class="sc">MAINTENANCE, AS A SHARE OF THE WORK</text>
  <text x="${XA - 12}" y="491" text-anchor="end" class="num">25%</text>
  <text x="${XB + 14}" y="491" class="num">24%</text>
  <text x="${XA}" y="530" class="sc">MARCH 2026</text>
  <text x="${XB}" y="530" text-anchor="end" class="sc">AUGUST 2026</text>
  ${marks}
  <text x="${XB + 14}" y="552" class="sm">18 in 100 measure</text>
  <text x="${XB + 14}" y="567" class="sm">the impact</text>
  <text x="480" y="590" text-anchor="middle" class="sm">Width is the number. Spend and mix: one vendor's data at list prices, drawn straight between the two months; mix is not volume. Marks: a survey of 883.</text>`;
write(process.argv[2], plate({
  n: 407, roman: 'VII', section: 7, sectionName: 'THE CARD AND THE INVOICE', title: 'The Bill Comes Due',
  caption: 'AI spend per weekly active user tripled in five months while the mix of work stayed where it was.',
  desc: 'A flow map over five months, March 2026 on the left and August 2026 on the right. At the top a rust river of AI spend per weekly active user widens from 37 dollars to 115 dollars, about three times as wide. Beneath it two dark streams of work keep their width from one side to the other: new features, 57 percent of the work and then 56, and maintenance, 25 percent and then 24. At the foot a row of one hundred small marks stands for one hundred organizations, and eighteen are filled: the share that measures the impact of AI. Vendor data at list prices, and a self-reported survey.',
  style: FLOW_STYLE + ' .off { fill: none; stroke: var(--soft); stroke-width: 0.7; }',
  body,
}));
