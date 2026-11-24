// Generates PLATE-405-hurry-up-and-wait.svg. Usage: node PLATE-405-hurry-up-and-wait.gen.mjs <out.svg>
// Manner: a queue drawn to scale, read top to bottom: the ticket rail, the pass, the door.
// Figures (section 5, source 7, Faros 2026, high AI adoption against low): 66.2% more epics completed,
// 11.7% fewer deployments a week, 57.9% more incidents a month, changes more than five times as long in review.
// Scale: the low-adoption team is 20 tickets on the rail and 20 plates out the door. The piles at the pass are not to scale.
import { plate, write, f } from './frame.mjs';
import { counter, dish, passFrame } from './pass.mjs';
const BASE = 20, EPICS = 66.2, DEPLOYS = -11.7;
const hiT = BASE * (1 + EPICS / 100);          // 33.24 tickets
const hiP = BASE * (1 + DEPLOYS / 100);        // 17.66 plates
const RY = 92, TP = 25.4, TX = 60;               // rail, ticket pitch, first ticket
let tickets = '';
for (let i = 0; i < Math.ceil(hiT); i++) {
  const w = 20 * Math.min(1, hiT - i), x = TX + TP * i;
  if (w < 19) { tickets += `<path d="M ${f(x)} ${RY} V ${RY + 58} H ${f(x + w)} V ${RY} Z" class="bt"/>`; continue; }   // the last, part of a ticket
  tickets += `<path d="M ${f(x)} ${RY} V ${RY + 58} l ${f(w / 4)} -3 l ${f(w / 4)} 3 l ${f(w / 4)} -3 l ${f(w / 4)} 3 V ${RY} Z" class="bt"/>` +
    `<path d="M ${f(x + 3)} ${RY + 12} h ${f(Math.max(0.5, w - 6))} M ${f(x + 3)} ${RY + 21} h ${f(Math.max(0.5, w - 9))} M ${f(x + 3)} ${RY + 30} h ${f(Math.max(0.5, w - 6))} M ${f(x + 3)} ${RY + 39} h ${f(Math.max(0.5, w - 11))}" class="thin" style="stroke-width:0.5"/>`;
}
const mark = TX + TP * BASE - 2.7;
// plates out the door, 28 units apart
const PY = 566, PP = 42.6, PX = 74;
let out = '';
for (let i = 0; i < BASE; i++) {
  const x = PX + PP * i, full = i < Math.floor(hiP);
  if (full) out += dish(x, PY, { k: 0.86 });
  else out += `<g transform="translate(${x} ${PY}) scale(0.86)"><path d="M -13 -7 Q 0 -27 13 -7" class="la" style="stroke-width:1.6;stroke-dasharray:4 3"/><path d="M -23 -7 L 23 -7 Q 15 0 8 0 L -8 0 Q -15 0 -23 -7 Z" class="la" style="stroke-width:1.6;stroke-dasharray:4 3"/></g>`;
}
// the 27th plate is 0.49 of a plate: draw its left half solid over the ghost
const hx = PX + PP * Math.floor(hiP), frac = hiP - Math.floor(hiP);
out += `<clipPath id="p405-half"><rect x="${f(hx - 21)}" y="${PY - 26}" width="${f(41 * frac)}" height="28"/></clipPath><g clip-path="url(#p405-half)">${dish(hx, PY, { k: 0.86 })}</g>`;
// the pass, with plates piled in front of it
const XP = 470, CY = 440;
const pile = (x, n) => { let s = ''; for (let i = 0; i < n; i++) s += `<path d="M ${x - 34} ${CY - 10 - 9 * i} L ${x + 34} ${CY - 10 - 9 * i} Q ${x + 22} ${CY - 9 * i} ${x + 12} ${CY - 9 * i} L ${x - 12} ${CY - 9 * i} Q ${x - 22} ${CY - 9 * i} ${x - 34} ${CY - 10 - 9 * i} Z" class="b" style="stroke-width:1"/>`; return s + dish(x, CY - 9 * n + 0, { k: 1.5 }).replace('class="b"', 'class="b"'); };
const body = `
  <!-- the rail -->
  <line x1="46" y1="${RY}" x2="914" y2="${RY}" class="l" style="stroke-width:2.4"/>
  ${tickets}
  <line x1="${mark}" y1="${RY - 16}" x2="${mark}" y2="${RY + 74}" class="sight" style="stroke:var(--ink)"/>
  <text x="${TX}" y="${RY + 80}" class="sm">Work finished where AI is used little: 20 tickets on the rail.</text>
  <text x="${mark + 12}" y="${RY + 80}" class="it">Where it is used heavily:</text>
  <text x="${mark + 12}" y="${RY + 108}" class="big">66.2% more</text>
  <!-- the pass -->
  ${counter(CY)}
  ${passFrame(XP, CY)}
  ${pile(104, 5)}${pile(186, 8)}${pile(268, 6)}
  ${dish(XP - 34, CY)}
  <text x="60" y="270" class="it">Waiting at the pass.</text>
  <text x="60" y="288" class="sm">Changes sat in review more</text>
  <text x="60" y="304" class="sm">than five times as long.</text>
  <!-- one going out, one coming back -->
  ${dish(650, CY)}
  <g transform="translate(800 ${CY}) scale(-1 1)">${dish(0, 0, { bad: true })}</g>
  <path d="M 838 ${CY - 44} q -22 -14 -46 -4" class="la" style="stroke-width:1.2"/><path d="M 800 ${CY - 55} l -9 7 l 11 3" class="la" style="stroke-width:1.2"/>
  <text x="650" y="282" class="ita">Coming back from the table:</text>
  <text x="650" y="312" class="biga">57.9% more incidents</text>
  <text x="650" y="332" class="ita">a month</text>
  <!-- the door -->
  ${counter(PY, 46, 914)}
  ${out}
  <text x="60" y="${PY - 40}" class="it">Out the door: deployments a week, on the same scale of 20.</text>
  <text x="906" y="${PY - 40}" text-anchor="end" class="biga">11.7% fewer</text>`;
const svg = plate({
  n: 405, roman: 'V', section: 5, sectionName: 'THE PASS',
  title: 'Hurry Up and Wait',
  caption: 'Teams using AI heavily finished 66.2% more work, deployed 11.7% less often, and had 57.9% more incidents a month.',
  desc: 'Three rows read from top to bottom. At the top, a ticket rail drawn to scale: twenty tickets stand for the work finished on teams that use AI little, and the rail runs on to thirty-three for teams that use it heavily, 66.2 percent more. In the middle, the pass: plates are piled up in front of a gate that lets one through at a time, with a note that changes sat in review more than five times as long, and one plate drawn in rust is coming back from the table, for 57.9 percent more incidents a month. At the bottom, plates going out the door on the same scale of twenty: seventeen and two thirds are solid and the rest are dashed outlines in rust, 11.7 percent fewer deployments a week. Vendor telemetry comparing teams, not a randomized trial.',
  body,
});
write(process.argv[2], svg);
