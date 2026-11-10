// Generates PLATE-204-stopping-distance.svg. Run: node PLATE-204-stopping-distance.gen.mjs
// A stopping-distance plate in the manner of a railway rule book: a tank engine at rest
// beyond a semaphore signal at danger, and a ruler under the track in two lengths.
// Lengths are judged, not measured: no figure on the plate is drawn to a number.
import fs from 'node:fs';

const f = (n) => (Math.round(n * 10) / 10).toString();
// ---- layout, plate units ----
const RY = 384;            // rail top
const X_SEE = 70;          // where the danger shows
const X_BRAKE = 250;       // where the brakes go on
const X_SIG = 500;         // the signal post
const X_REST = 905;        // front buffer beam of the engine at rest
const S = 1.15;            // engine scale: local units to plate units
const L_FRONT = 303;       // local x of the front buffer beam
const X0 = X_REST - S * L_FRONT; // engine origin (rear buffer beam), so the front lands on X_REST
const RUL = 458, RUH = 24; // ruler band top and height
// ---- track ----
// sleepers: x = 36 + 22 i, end on, under the rail
const sleepers = Array.from({ length: 41 }, (_, i) => `<rect x="${36 + 22 * i}" y="${RY + 5}" width="12" height="6"/>`).join('');
// ---- engine, local coordinates: x from rear beam, y negative upward from the rail ----
const WR = 36;                     // wheel radius
const WX = [66, 148, 230];         // wheel centres: x = 66 + 82 i
const PIN_A = 145 * Math.PI / 180; // crank pin angle, clockwise from the right, y down
const PIN_R = 15;
const pin = { dx: PIN_R * Math.cos(PIN_A), dy: PIN_R * Math.sin(PIN_A) };
const wheel = (cx) => {
  const cy = -WR;
  // 12 spokes: angle = 15 + 30 i degrees, from the hub (r 8) to the rim (r 30)
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (15 + 30 * i) * Math.PI / 180;
    return `<line x1="${f(cx + 8 * Math.cos(a))}" y1="${f(cy + 8 * Math.sin(a))}" x2="${f(cx + 30 * Math.cos(a))}" y2="${f(cy + 30 * Math.sin(a))}"/>`;
  }).join('');
  // balance weight: a segment of the rim opposite the pin, 38 degrees either side
  const a1 = PIN_A + Math.PI - 0.66, a2 = PIN_A + Math.PI + 0.66;
  const bw = `M ${f(cx + 30 * Math.cos(a1))} ${f(cy + 30 * Math.sin(a1))} A 30 30 0 0 1 ${f(cx + 30 * Math.cos(a2))} ${f(cy + 30 * Math.sin(a2))} Z`;
  return `<circle cx="${cx}" cy="${cy}" r="${WR}" class="b" style="stroke-width:1.8"/><circle cx="${cx}" cy="${cy}" r="30" class="l"/><g class="l" style="stroke-width:1.7">${spokes}</g><path d="${bw}" class="ink"/><circle cx="${cx}" cy="${cy}" r="8" class="b"/><circle cx="${cx}" cy="${cy}" r="2.6" class="ink"/>`;
};
const rodY = -WR + pin.dy;
const rodX1 = WX[0] + pin.dx, rodX2 = WX[2] + pin.dx;
const pins = WX.map((x) => `<circle cx="${f(x + pin.dx)}" cy="${f(rodY)}" r="5.2" class="b"/><circle cx="${f(x + pin.dx)}" cy="${f(rodY)}" r="1.8" class="ink"/>`).join('');
// rivets: tank top and bottom rows, x = 103 + 12 i; bunker and cab foot row, x = 9 + 12 i
const tankRivets = Array.from({ length: 12 }, (_, i) => `<circle cx="${103 + 12 * i}" cy="-133" r="1.3"/><circle cx="${103 + 12 * i}" cy="-97" r="1.3"/>`).join('');
const footRivets = Array.from({ length: 8 }, (_, i) => `<circle cx="${9 + 12 * i}" cy="-97" r="1.3"/>`).join('');
// frame rivets: x = 14 + 20 i, behind the wheels
const frameRivets = Array.from({ length: 15 }, (_, i) => `<circle cx="${14 + 20 * i}" cy="-67" r="1.2"/>`).join('');
const engine = `<g transform="translate(${f(X0)} ${RY}) scale(${S})">
    <!-- frames and buffer beams -->
    <rect x="6" y="-73" width="291" height="47" class="hb"/>
    <g class="ink">${frameRivets}</g>
    <path d="M 10 -73 V -30 M 24 -73 V -30 M 6 -30 H 28 M 8 -51 H 26" class="l" style="stroke-width:2.2"/>
    <path d="M 291 -26 V -9 Q 291 -3 297 -3" class="l" style="stroke-width:2.4"/>
    <rect x="-2" y="-73" width="8" height="28" class="b"/><rect x="297" y="-73" width="8" height="28" class="b"/>
    <rect x="-10" y="-63" width="8" height="8" class="b"/><rect x="-14" y="-70" width="4" height="22" class="ink"/>
    <rect x="305" y="-63" width="8" height="8" class="b"/><rect x="313" y="-70" width="4" height="22" class="ink"/>
    <!-- boiler, seen above the side tank: top at -160 -->
    <rect x="96" y="-160" width="146" height="40" class="b"/>
    <line x1="96" y1="-153" x2="240" y2="-153" class="thin" style="opacity:0.6"/>
    <g class="l"><line x1="140" y1="-160" x2="140" y2="-138"/><line x1="144" y1="-160" x2="144" y2="-138"/><line x1="196" y1="-160" x2="196" y2="-138"/><line x1="200" y1="-160" x2="200" y2="-138"/></g>
    <!-- dome, safety valves, tank filler -->
    <path d="M 152 -160 Q 156 -162 156 -168 L 156 -174 Q 156 -188 170 -188 Q 184 -188 184 -174 L 184 -168 Q 184 -162 188 -160 Z" class="b"/>
    <path d="M 176 -187 Q 184 -185 184 -174 L 184 -168 Q 184 -162 188 -160 L 176 -160 Z" class="h"/>
    <path d="M 152 -160 Q 156 -162 156 -168 L 156 -174 Q 156 -188 170 -188 Q 184 -188 184 -174 L 184 -168 Q 184 -162 188 -160" class="l"/>
    <rect x="110" y="-172" width="5" height="12" class="b"/><rect x="119" y="-172" width="5" height="12" class="b"/><rect x="107" y="-163" width="20" height="3" class="ink"/>
    <rect x="212" y="-144" width="14" height="6" class="b"/>
    <!-- smokebox and chimney -->
    <path d="M 290 -161 Q 301 -122 290 -83 Z" class="b"/>
    <rect x="240" y="-165" width="50" height="86" class="hb"/>
    <line x1="246" y1="-165" x2="246" y2="-79" class="l"/><line x1="284" y1="-165" x2="284" y2="-79" class="l"/>
    <path d="M 251 -165 Q 258 -168 258 -178 L 258 -197 L 276 -197 L 276 -178 Q 276 -168 283 -165 Z" class="b"/>
    <path d="M 269 -197 L 276 -197 L 276 -178 Q 276 -168 283 -165 L 269 -165 Z" class="h"/>
    <path d="M 251 -165 Q 258 -168 258 -178 L 258 -197 M 276 -197 L 276 -178 Q 276 -168 283 -165" class="l"/>
    <rect x="254" y="-204" width="26" height="7" class="b"/><rect x="268" y="-204" width="12" height="7" class="h"/><rect x="254" y="-204" width="26" height="7" class="l"/>
    <!-- side tank, cab and bunker, standing on the running plate at -79 -->
    <rect x="2" y="-138" width="28" height="59" class="b"/>
    <path d="M 4 -138 l 4 -7 l 6 3 l 5 -6 l 6 5 l 3 5 Z" class="ink"/>
    <rect x="30" y="-172" width="66" height="93" class="b"/>
    <rect x="96" y="-138" width="142" height="59" class="b"/>
    <rect x="2" y="-93" width="236" height="14" class="h"/>
    <path d="M 46 -106 L 46 -150 Q 46 -160 56 -160 L 72 -160 Q 82 -160 82 -150 L 82 -106 Z" class="hb"/>
    <path d="M 46 -106 L 46 -150 Q 46 -160 56 -160 L 72 -160 Q 82 -160 82 -150 L 82 -106 Z" class="hx"/>
    <rect x="2" y="-138" width="28" height="59" class="l"/><rect x="30" y="-172" width="66" height="93" class="l"/><rect x="96" y="-138" width="142" height="59" class="l"/>
    <line x1="0" y1="-140" x2="32" y2="-140" class="l" style="stroke-width:2.2"/>
    <line x1="38" y1="-110" x2="38" y2="-150" class="l"/><line x1="90" y1="-110" x2="90" y2="-150" class="l"/>
    <g class="ink">${tankRivets}${footRivets}</g>
    <path d="M 23 -172 L 23 -176 Q 63 -191 103 -176 L 103 -172 Z" class="hb"/>
    <line x1="100" y1="-148" x2="238" y2="-148" class="l"/>
    <!-- lamp on the front of the running plate, handrail knobs at x = 110 + 40 i -->
    <rect x="291" y="-93" width="11" height="14" class="b"/><rect x="294" y="-97" width="5" height="4" class="ink"/><circle cx="298" cy="-86" r="3" class="hb"/>
    <g class="ink"><circle cx="110" cy="-148" r="2"/><circle cx="150" cy="-148" r="2"/><circle cx="190" cy="-148" r="2"/><circle cx="230" cy="-148" r="2"/></g>
    <!-- running plate -->
    <rect x="-2" y="-79" width="307" height="6" class="b"/>
    <!-- wheels: three coupled, radius ${WR}, centres x = 66 + 82 i -->
    ${WX.map(wheel).join('\n    ')}
    <!-- coupling rod through the three crank pins -->
    <line x1="${f(rodX1)}" y1="${f(rodY)}" x2="${f(rodX2)}" y2="${f(rodY)}" style="stroke:var(--ink);stroke-width:8.4;stroke-linecap:round"/>
    <line x1="${f(rodX1)}" y1="${f(rodY)}" x2="${f(rodX2)}" y2="${f(rodY)}" style="stroke:var(--paper);stroke-width:5.6;stroke-linecap:round"/>
    ${pins}
  </g>`;
// ---- signal: post at X_SIG, arm pivot at ARM_Y, arm out to the left at danger ----
const ARM_Y = 122, ARM_L = 80;
// ladder: foot (X_SIG - 40, RY), head (X_SIG - 5, 162); rungs at t = 0.06 + 0.08 i along it
const LF = { x: X_SIG - 40, y: RY }, LH = { x: X_SIG - 5, y: 162 };
const rungs = Array.from({ length: 12 }, (_, i) => {
  const t = 0.06 + 0.08 * i;
  const x = LF.x + (LH.x - LF.x) * t, y = LF.y + (LH.y - LF.y) * t;
  return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + 9)}" y2="${f(y + 1.4)}"/>`;
}).join('');
const signal = `<g>
    <g class="thin">${rungs}</g>
    <line x1="${LF.x}" y1="${LF.y}" x2="${LH.x}" y2="${LH.y}" class="l"/><line x1="${LF.x + 9}" y1="${LF.y}" x2="${LH.x + 9}" y2="${LH.y + 1.4}" class="l"/>
    <path d="M ${X_SIG - 7} ${RY} L ${X_SIG - 4} 98 L ${X_SIG + 4} 98 L ${X_SIG + 7} ${RY} Z" class="b"/>
    <path d="M ${X_SIG + 1} ${RY} L ${X_SIG + 0.5} 98 L ${X_SIG + 4} 98 L ${X_SIG + 7} ${RY} Z" class="h"/>
    <path d="M ${X_SIG - 7} ${RY} L ${X_SIG - 4} 98 L ${X_SIG + 4} 98 L ${X_SIG + 7} ${RY}" class="l"/>
    <rect x="${X_SIG - 6}" y="93" width="12" height="5" class="b"/>
    <path d="M ${X_SIG - 3} 93 L ${X_SIG} 76 L ${X_SIG + 3} 93 Z" class="ink"/>
    <!-- balance lever and weight, with the rod up to the arm -->
    <line x1="${X_SIG + 9}" y1="346" x2="${X_SIG + 9}" y2="${ARM_Y + 22}" class="thin"/>
    <line x1="${X_SIG - 2}" y1="344" x2="${X_SIG + 22}" y2="349" class="l" style="stroke-width:2.4"/>
    <circle cx="${X_SIG + 24}" cy="350" r="6.5" class="ink"/>
    <!-- spectacle plate and lamp -->
    <path d="M ${X_SIG + 4} ${ARM_Y - 13} H ${X_SIG + 20} Q ${X_SIG + 30} ${ARM_Y - 13} ${X_SIG + 30} ${ARM_Y - 3} V ${ARM_Y + 14} Q ${X_SIG + 30} ${ARM_Y + 24} ${X_SIG + 20} ${ARM_Y + 24} H ${X_SIG + 4} Z" class="b"/>
    <circle cx="${X_SIG + 17}" cy="${ARM_Y - 3}" r="6" class="hb"/><circle cx="${X_SIG + 17}" cy="${ARM_Y + 13}" r="6" class="b"/>
    <!-- the arm at danger: horizontal, ${ARM_L} long -->
    <rect x="${X_SIG - ARM_L}" y="${ARM_Y - 10}" width="${ARM_L + 4}" height="20" class="accb"/>
    <rect x="${X_SIG - ARM_L + 14}" y="${ARM_Y - 10}" width="10" height="20" class="paper"/>
    <rect x="${X_SIG - ARM_L}" y="${ARM_Y - 10}" width="${ARM_L + 4}" height="20" class="al"/>
    <circle cx="${X_SIG}" cy="${ARM_Y}" r="3.2" class="b"/>
  </g>`;
// sight line: from the driver's eye where the danger shows (cab height, ${f(S * 140)} above the rail) to the arm
const EYE_Y = RY - S * 140;
const drop = (x) => `<line x1="${x}" y1="${RY + 22}" x2="${x}" y2="${RUL - 10}"/>`;
const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p204-t p204-d">
  <title id="p204-t">DIA-204 · Stopping distance</title>
  <desc id="p204-d">An engraved plate of a steam tank engine seen from the side on a straight track. It has come to rest beyond a semaphore signal whose arm stands at danger. Under the track a ruler is marked off in two lengths. The first, from where the danger shows to where the brakes go on, stands for the delay before harm is documented. The second, the braking length, stands for liability, audits and insurance. It runs on past the signal, and the part beyond the signal is drawn in rust. The engine stands for capability, investment and compute.</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .h { fill: url(#p204-h); stroke: none; }
      .hb { fill: url(#p204-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hx { fill: url(#p204-x); stroke: none; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .ink { fill: var(--ink); }
      .ab { fill: var(--paper); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
      .accb { fill: var(--accent); stroke: var(--accent); stroke-width: 1.5; stroke-linejoin: round; }
      .al { fill: none; stroke: var(--accent); stroke-width: 1.5; stroke-linecap: round; }
      .la { fill: none; stroke: var(--accent); stroke-width: 0.8; stroke-linecap: round; }
      .sight { fill: none; stroke: var(--soft); stroke-width: 0.8; stroke-dasharray: 5 4; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 14.5px; font-style: italic; }
      .ita { font-size: 14.5px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12.5px; font-style: italic; fill: var(--soft); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
    </style>
    <pattern id="p204-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    <pattern id="p204-x" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE IV</text>
  <text x="918" y="50" text-anchor="end" class="sc">PART II · DELAYS, BRAKES, AND ENGINE SPEED</text>
  <!-- sight line from where the danger shows (x = ${X_SEE}) to the signal arm -->
  <line x1="${X_SEE}" y1="${f(EYE_Y)}" x2="${X_SIG - ARM_L - 6}" y2="${ARM_Y}" class="sight"/>
  <line x1="${X_SEE}" y1="${f(EYE_Y)}" x2="${X_SEE}" y2="${RY - 4}" class="sight"/>
  <circle cx="${X_SEE}" cy="${f(EYE_Y)}" r="2.6" class="ink"/>
  <!-- direction of running: an arrow above the rail, from x = X_SEE + 30 to X_BRAKE - 30 -->
  <line x1="${X_SEE + 30}" y1="${RY - 30}" x2="${X_BRAKE - 30}" y2="${RY - 30}" class="l"/>
  <path d="M ${X_BRAKE - 30} ${RY - 30} l -13 -5 l 3 5 l -3 5 Z" class="ink"/>
  <text x="${(X_SEE + X_BRAKE) / 2}" y="${RY - 40}" text-anchor="middle" class="sm">direction of running</text>
  <!-- the signal, standing behind the track at x = ${X_SIG} -->
  ${signal}
  <!-- the engine at rest: front buffer beam at x = ${X_REST}, origin = ${X_REST} - ${S} * ${L_FRONT} = ${f(X0)} -->
  ${engine}
  <!-- track: rail top at y = ${RY}, sleepers at x = 36 + 22 i, ballast below -->
  <rect x="30" y="${RY}" width="900" height="5" class="ink"/>
  <g class="b" style="stroke-width:1">${sleepers}</g>
  <line x1="30" y1="${RY + 11}" x2="930" y2="${RY + 11}" class="l"/>
  <rect x="30" y="${RY + 11}" width="900" height="7" class="h"/>
  <!-- drop lines from the track to the ruler -->
  <g class="sight">${[X_SEE, X_BRAKE, X_SIG, X_REST].map(drop).join('')}</g>
  <text x="${X_SEE + 8}" y="${RUL - 16}" class="sm">danger in sight</text>
  <text x="${X_BRAKE + 8}" y="${RUL - 16}" class="sm">brakes go on</text>
  <text x="${X_SIG + 8}" y="${RUL - 16}" class="sm">the signal</text>
  <!-- the ruler: delay ${X_SEE} to ${X_BRAKE}, braking ${X_BRAKE} to ${X_REST}, of which ${X_SIG} to ${X_REST} is the overrun -->
  <rect x="${X_SEE}" y="${RUL}" width="${X_BRAKE - X_SEE}" height="${RUH}" class="hb"/>
  <rect x="${X_SIG}" y="${RUL}" width="${X_REST - X_SIG}" height="${RUH}" class="accb"/>
  <rect x="${X_BRAKE}" y="${RUL}" width="${X_REST - X_BRAKE}" height="${RUH}" class="l"/>
  <g class="l" style="stroke-width:2.2">${[X_SEE, X_BRAKE, X_REST].map((x) => `<line x1="${x}" y1="${RUL - 6}" x2="${x}" y2="${RUL + RUH + 6}"/>`).join('')}</g>
  <!-- notes -->
  <text x="${X_SEE + 4}" y="${RUL + RUH + 26}" class="it">the delay: harm is</text>
  <text x="${X_SEE + 4}" y="${RUL + RUH + 45}" class="it">documented months to</text>
  <text x="${X_SEE + 4}" y="${RUL + RUH + 64}" class="it">years after release</text>
  <text x="${X_BRAKE + 8}" y="${RUL + RUH + 26}" class="it">the brakes: liability,</text>
  <text x="${X_BRAKE + 8}" y="${RUL + RUH + 45}" class="it">audits, insurance</text>
  <text x="${X_SIG + 8}" y="${RUL + RUH + 26}" class="ita">where it stops: past the signal</text>
  <text x="${X_REST}" y="96" text-anchor="end" class="it">the engine: capability, investment,</text>
  <text x="${X_REST}" y="115" text-anchor="end" class="it">compute, and round again</text>
  <path d="M 800 124 q -10 34 2 ${f(RY - S * 160 - 6 - 124)}" class="thin"/>
  <text x="480" y="600" text-anchor="middle" class="sm">Lengths are judged, not measured.</text>
  <text x="480" y="645" text-anchor="middle" class="title">Stopping Distance</text>
  <line x1="300" y1="662" x2="660" y2="662" class="thin"/>
  <text x="480" y="683" text-anchor="middle" class="cap">DIA-204 · A late warning, weak brakes and high speed: the train stops beyond the signal.</text>
</svg>
`;
fs.writeFileSync(new URL('./PLATE-204-stopping-distance.svg', import.meta.url), svg.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n');
console.log(`engine origin ${f(X0)}, delay ${X_BRAKE - X_SEE}, braking ${X_REST - X_BRAKE}, track left ${X_SIG - X_SEE}, overrun ${X_REST - X_SIG}`);
