// Generates WONDER-405-flow.svg. Usage: node WONDER-405-flow.gen.mjs <out.svg>
// Manner: a flow map after Charles Minard. Width is the number. Work runs left to right as a river,
// pools at the pass, leaves as a narrower stream, and comes back along the bottom in rust to rejoin the source.
// Scale: 1.1 units of width = 1 percent of the same flow on teams that use AI little (the dashed lines, 110 units apart).
// Source 7, Faros 2026, high AI adoption against low: epics completed +66.2%, deployments a week -11.7%,
// incidents a month +57.9%, incidents per change +242.7%, time in review more than five times as long.
// The three bands are three different measures. Each is drawn against its own baseline, so widths compare
// within a band and not between bands. The pool at the pass is not to scale.
import { plate, write, f } from './frame.mjs';
const S = 1.1, BASE = 100 * S / 2;                    // half-width of every baseline
const IN = (100 + 66.2) * S / 2;                      // 91.4
const OUT = (100 - 11.7) * S / 2;                     // 48.6
const BACK = (100 + 57.9) * S / 2;                    // 86.8
const CY = 222, WEIR = 478, TABLE = 852, POOL = 120;
const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const hwIn = (x) => IN + (POOL - IN) * smooth((x - 320) / 110);
let seed = 405;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${f(x)} ${f(y)}`).join(' ');
// ---- the river: stations to the pass, then on to the table ----
const K = 27;
let river = '';
for (let k = 0; k < K; k++) {
  const fr = -0.5 + (k + 0.5) / K, ph = rnd() * 6.28, amp = 0.8 + rnd() * 0.9;
  const offWeir = fr * 2 * POOL, passes = Math.abs(offWeir) < OUT - 2;
  const pts = [];
  for (let x = 60; x <= (passes ? TABLE : WEIR - 3); x += 4) {
    const off = x < WEIR ? fr * 2 * hwIn(x) : offWeir;
    pts.push([x, CY + off + amp * Math.sin(x / 21 + ph)]);
  }
  river += `<path d="${line(pts)}" class="st"/>`;
}
const top = [], bot = [];
for (let x = 60; x <= WEIR; x += 4) { top.push([x, CY - hwIn(x)]); bot.push([x, CY + hwIn(x)]); }
const bank = `<path d="${line(top)}" class="l"/><path d="${line(bot)}" class="l"/>` +
  `<path d="M ${WEIR + 12} ${CY - OUT} H ${TABLE}" class="l"/><path d="M ${WEIR + 12} ${CY + OUT} H ${TABLE}" class="l"/>`;
// ---- the return: from the table, back along the bottom, up into the source ----
const RY = 470;
const cl = [];
for (let x = TABLE; x >= 364; x -= 4) cl.push([x, RY]);
const P = [[360, RY], [232, RY], [150, RY - 30], [150, CY + IN]];
for (let i = 1; i <= 44; i++) {
  const t = i / 44, u = 1 - t;
  cl.push([u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
    u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]);
}
const normal = (i) => { const a = cl[Math.max(0, i - 1)], b = cl[Math.min(cl.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1; return [-dy / n, dx / n]; };
const offset = (off, wob = 0, ph = 0) => cl.map((p, i) => { const [nx, ny] = normal(i); const o = off + wob * Math.sin(i / 5 + ph); return [p[0] + nx * o, p[1] + ny * o]; });
let back = '';
const KB = 25;
for (let k = 0; k < KB; k++) { const fr = -0.5 + (k + 0.5) / KB; back += `<path d="${line(offset(fr * 2 * BACK, 0.8 + rnd() * 0.9, rnd() * 6.28))}" class="sta"/>`; }
const backBank = `<path d="${line(offset(BACK))}" class="la" style="stroke-width:1.4"/><path d="${line(offset(-BACK))}" class="la" style="stroke-width:1.4"/>`;
// ---- baselines: the same flows on teams that use AI little ----
const gpaths = [`M 60 ${CY - BASE} H 318 M 60 ${CY + BASE} H 318`, `M ${WEIR + 14} ${CY - BASE} H ${TABLE} M ${WEIR + 14} ${CY + BASE} H ${TABLE}`, line(offset(BASE).slice(0, 118)), line(offset(-BASE).slice(0, 118))];
const ghost = gpaths.map((d) => `<path d="${d}" class="ghu"/><path d="${d}" class="gh"/>`).join('');
// ---- direction marks ----
const chev = (x, y, dir, cls) => `<path d="M ${x - 5 * dir} ${y - 6} L ${x + 5 * dir} ${y} L ${x - 5 * dir} ${y + 6}" class="${cls}" style="stroke-width:2"/>`;
const marks = [150, 290, 620, 760].map((x) => chev(x, CY, 1, 'l')).join('') + [760, 620, 480].map((x) => chev(x, RY, -1, 'la')).join('');
const body = `
  ${river}${bank}
  ${back}${backBank}
  ${ghost}
  ${marks}
  <!-- the pass: a weir with one opening -->
  <rect x="${WEIR}" y="${CY - POOL - 16}" width="12" height="${f(POOL + 16 - OUT)}" class="hb"/>
  <rect x="${WEIR}" y="${f(CY + OUT)}" width="12" height="${f(POOL + 16 - OUT)}" class="hb"/>
  <!-- the table -->
  <rect x="${TABLE}" y="${CY - 70}" width="12" height="${f(RY + BACK + 6 - CY + 70)}" class="hb"/>
  <text x="${WEIR + 6}" y="${CY - POOL - 26}" text-anchor="middle" class="sc">THE PASS</text>
  <text x="${TABLE + 6}" y="${CY - 80}" text-anchor="middle" class="sc">THE TABLE</text>
  <!-- labels -->
  <text x="60" y="84" class="sc">WORK FINISHED</text>
  <text x="60" y="114" class="num">66.2% more epics</text>
  <text x="262" y="78" class="it">Held at the pass:</text>
  <text x="262" y="94" class="sm">over five times as long in review</text>
  <text x="${WEIR + 30}" y="118" class="sc">SHIPPED</text>
  <text x="${WEIR + 30}" y="148" class="num">11.7% fewer deployments</text>
  <text x="${TABLE - 14}" y="${CY + 92}" text-anchor="end" class="sc" style="fill:var(--accent)">SENT BACK</text>
  <text x="${TABLE - 14}" y="${CY + 124}" text-anchor="end" class="numa">57.9% more incidents a month</text>
  <text x="290" y="${CY + 148}" class="ita">Each returns as new work.</text>
  <text x="480" y="584" text-anchor="middle" class="sm">Width is the number. Each band is drawn against the same flow on teams that use AI little (dashed). Vendor telemetry, 4,000 teams, compared, not assigned.</text>`;
write(process.argv[2], plate({
  n: 405, roman: 'V', section: 5, sectionName: 'THE PASS', title: 'Hurry Up and Wait',
  caption: 'Teams using AI heavily finished 66.2% more work, deployed 11.7% less often, and had 57.9% more incidents a month.',
  desc: 'A flow map in which width is the number. A broad river of finished work runs from the left, 66.2 percent wider than the dashed lines that mark the same flow on teams that use AI little. It swells into a pool against a weir labelled the pass, where changes sat in review more than five times as long. Through the one opening in the weir a narrower stream runs on to the table: deployments, 11.7 percent narrower than their dashed baseline. From the table a broad rust band runs back along the bottom, 57.9 percent wider than its baseline: incidents a month. At the left it bends up and rejoins the river at its source, as new work. Vendor telemetry from 22,000 developers on 4,000 teams, compared and not randomized.',
  style: `.st { fill: none; stroke: var(--ink); stroke-width: 0.75; opacity: 0.78; } .sta { fill: none; stroke: var(--accent); stroke-width: 0.85; opacity: 0.9; } .ghu { fill: none; stroke: var(--paper); stroke-width: 6; } .gh { fill: none; stroke: var(--ink); stroke-width: 1.3; stroke-dasharray: 8 6; } .num { font-size: 25px; } .numa { font-size: 25px; fill: var(--accent); }`,
  body,
}));
