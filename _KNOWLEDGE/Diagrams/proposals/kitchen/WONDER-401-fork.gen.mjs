// Generates WONDER-401-fork.svg. Usage: node WONDER-401-fork.gen.mjs <out.svg>
// Manner: a flow map. One stream of consulting work forks at the frontier of what the AI does well.
// The upper channel takes on three tributaries. The lower channel loses a strand.
// Scale: 1.5 units of width = 1 point (percent for the tributaries, percentage points for the lost strand).
// The width of the stream before the tool is not a measurement. It is the same on both channels.
// Source 1, Dell'Acqua et al., 758 consultants: +12.2% tasks finished, +25.1% faster, quality more than 40% higher
// inside the frontier; 19 percentage points less likely to be right outside it.
import { plate, write, f } from './frame.mjs';
import { rng, line, straight, bezier, ribbon, chev, FLOW_STYLE } from './flow.mjs';
const rnd = rng(4011);
const U = 1.5, B = 46;                               // each channel's width before the tool
const T = [12.2 * U, 25.1 * U, 40 * U];              // 18.3, 37.65, 60
const LOSS = 19 * U;                                 // 28.5
const TOOL = 400;                                    // where the tool is handed over
const MID = 366, UB = 330, LT = 402;                 // trunk centre; upper channel's bottom edge; lower channel's top edge
const J = [486, 610, 748];                           // where each tributary finishes its turn
const XR = 884, TOPY = 130, G = 12;                  // right edge; where tributaries enter; inner radius of each turn
const P = B / 7;                                     // pitch between streamlines
// trunk and fork
const trunk = ribbon({ cl: straight(60, MID, 190, MID), hw: B, rnd });
const up0 = ribbon({ cl: bezier([[190, MID - B / 2], [250, MID - B / 2], [250, UB - B / 2], [310, UB - B / 2]], 30), hw: B / 2, rnd });
const lo0 = ribbon({ cl: bezier([[190, MID + B / 2], [250, MID + B / 2], [250, LT + B / 2], [310, LT + B / 2]], 30), hw: B / 2, rnd });
// a wobbling run to the right at height y
const run = (x0, y, x1) => { const ph = rnd() * 6.28, amp = 0.7 + rnd() * 0.9; let d = ''; for (let x = x0 + 4; x <= x1; x += 4) d += ` L ${f(x)} ${f(y + amp * Math.sin(x / 21 + ph) * Math.min(1, (x - x0) / 30))}`; return d; };
// the upper channel: every streamline keeps its own height from where it enters to the right edge
let up = '', bank = '', labels = '';
for (let j = 0; j < 7; j++) up += `<path d="M 310 ${f(UB - (j + 0.5) * P)}${run(310, UB - (j + 0.5) * P, XR)}" class="st"/>`;
let w = B, topBank = `M 310 ${UB - B}`;
T.forEach((t, k) => {
  const nw = w + t, cy = UB - nw - G, cx = J[k];
  for (let j = Math.ceil(w / P - 0.5); (j + 0.5) * P < nw; j++) {
    const y = UB - (j + 0.5) * P, r = y - cy;
    up += `<path d="M ${f(cx - r)} ${TOPY} V ${f(cy)} A ${f(r)} ${f(r)} 0 0 0 ${cx} ${f(y)}${run(cx, y, XR)}" class="st"/>`;
  }
  const ro = t + G;                                  // the outer bank's radius
  topBank += ` H ${f(cx - ro)}`;
  bank += `<path d="M ${f(cx - ro)} ${TOPY} V ${f(cy)} A ${f(ro)} ${f(ro)} 0 0 0 ${cx} ${f(UB - w)}" class="l"/>`;
  topBank += ` M ${cx - G} ${TOPY} V ${f(cy)} A ${G} ${G} 0 0 0 ${cx} ${f(UB - nw)}`;
  labels += [`<text x="${f(cx - ro)}" y="100" class="num">+12.2%</text><text x="${f(cx - ro)}" y="119" class="sm">tasks finished</text>`,
    `<text x="${f(cx - ro)}" y="100" class="num">+25.1%</text><text x="${f(cx - ro)}" y="119" class="sm">faster</text>`,
    `<text x="${f(cx - ro)}" y="106" class="huge">+40%</text><text x="${f(cx - ro + 104)}" y="92" class="sm">and more,</text><text x="${f(cx - ro + 104)}" y="108" class="sm">in quality</text>`][k];
  w = nw;
});
topBank += ` H ${XR}`;
bank += `<path d="${topBank}" class="l"/><path d="M 310 ${UB} H ${XR}" class="l"/>`;
// the lower channel: the top strands run on, the rest peel away in rust
const rem = B - LOSS;                                // 17.5
let lo = '';
for (let j = 0; j < 7; j++) {
  const y = LT + (j + 0.5) * P;
  if (y < LT + rem) lo += `<path d="M 310 ${f(y)}${run(310, y, XR)}" class="st"/>`;
  else lo += `<path d="M 310 ${f(y)}${run(310, y, 560)}" class="st"/>`;
}
lo += `<path d="M 310 ${LT} H ${XR}" class="l"/><path d="M 310 ${LT + B} H 560" class="l"/><path d="M 560 ${f(LT + rem)} H ${XR}" class="l"/>`;
const lost = ribbon({ cl: bezier([[560, LT + rem + LOSS / 2], [640, LT + rem + LOSS / 2], [650, 524], [730, 532]], 34), hw: LOSS / 2, rnd, cls: 'sta', bankCls: 'la', pitch: 6 });
let spill = '';
for (let i = 0; i < 9; i++) { const y = 532 - LOSS / 2 + (i + 0.5) * LOSS / 9; spill += `<path d="M 730 ${f(y)} q ${f(12 + rnd() * 30)} ${f((rnd() - 0.5) * 8)} ${f(30 + rnd() * 70)} ${f((rnd() - 0.3) * 16)}" class="sta"/>`; }
// the frontier, a jagged ridge between the two channels
let ridge = `M 318 ${MID}`;
for (let x = 318, k = 0; x < XR; k++) { x += 12 + (k * 37 % 19); ridge += ` L ${Math.min(x, XR)} ${MID + (k % 2 ? 9 : -8) + (k * 5 % 4)}`; }
const body = `
  ${trunk}${up0}${lo0}${up}${bank}${lo}${lost}${spill}
  <path d="${ridge}" class="l" style="stroke-width:2"/>
  <line x1="${TOOL}" y1="${UB - B - 34}" x2="${TOOL}" y2="${LT + B + 56}" class="sight" style="stroke:var(--ink)"/>
  ${chev(120, MID, 1)}${chev(828, UB - 80, 1)}
  <text x="60" y="${MID - B - 30}" class="sc">CONSULTING WORK</text>
  <text x="60" y="${MID - B - 12}" class="sm">758 consultants, assigned by chance</text>
  <text x="${TOOL - 8}" y="${LT + B + 50}" text-anchor="end" class="sm">without AI</text>
  <text x="${TOOL + 8}" y="${LT + B + 50}" class="sm">with it</text>
  <text x="${TOOL - 8}" y="${UB - B - 12}" text-anchor="end" class="it">tasks the AI does well</text>
  <text x="${TOOL + 8}" y="${LT + B + 24}" class="it">a task just past its reach</text>
  ${labels}
  <text x="${XR}" y="${LT + B + 26}" text-anchor="end" class="hugea">−19 points</text>
  <text x="${XR}" y="${LT + B + 48}" text-anchor="end" class="ita">of right answers, lost</text>
  <text x="60" y="548" class="sm">The jagged line between the channels is the frontier</text>
  <text x="60" y="564" class="sm">of what the AI does well.</text>
  <text x="480" y="590" text-anchor="middle" class="sm">Width is the number: each tributary and the lost strand are drawn to one scale. The stream before the tool is not measured.</text>`;
write(process.argv[2], plate({
  n: 401, roman: 'I', section: 1, sectionName: 'DOES IT MAKE YOU BETTER?', title: 'A Double-Edged Knife',
  caption: 'One tool, one study: the work gains three streams on one side of a jagged frontier and loses one on the other.',
  desc: 'A flow map. A stream of consulting work enters from the left and forks into two channels of equal width, divided by a jagged ridge, the frontier of what the AI does well. Past a dashed line where the tool is handed over, the upper channel, tasks the AI does well, takes on three tributaries from above, each drawn to scale: 12.2 percent more tasks finished, 25.1 percent faster, and quality up 40 percent and more. It leaves the plate more than three times as wide as it entered. The lower channel, a task just past the reach of the AI, sheds a rust strand that curls away and runs out: 19 percentage points of right answers, lost. It leaves the plate narrower than it entered. From a preregistered field experiment of 758 consultants.',
  style: FLOW_STYLE,
  body,
}));
