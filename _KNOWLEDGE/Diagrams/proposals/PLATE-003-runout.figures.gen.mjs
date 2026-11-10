// Generates the two silhouettes for PLATE-003 and splices them between the figure markers.
import fs from 'node:fs';
const plate = 'C:/Repos/alonzo-anthologies/_KNOWLEDGE/Diagrams/proposals/PLATE-003-runout.svg';
const f = (n) => (Math.round(n * 10) / 10).toString();
// tapered capsule from a (radius ra) to b (radius rb)
function cap(a, b, ra, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  return `M ${f(a[0] + nx * ra)} ${f(a[1] + ny * ra)} L ${f(b[0] + nx * rb)} ${f(b[1] + ny * rb)} A ${f(rb)} ${f(rb)} 0 0 0 ${f(b[0] - nx * rb)} ${f(b[1] - ny * rb)} L ${f(a[0] - nx * ra)} ${f(a[1] - ny * ra)} A ${f(ra)} ${f(ra)} 0 0 0 ${f(a[0] + nx * ra)} ${f(a[1] + ny * ra)} Z`;
}
// chain of joints with radii
function chain(pts) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) out.push(cap(pts[i], pts[i + 1], pts[i][2], pts[i + 1][2]));
  return out.join(' ');
}
// head in profile facing left, hat on, drawn about its own centre then tilted
function head(c, tilt) {
  return `<g transform="translate(${f(c[0])} ${f(c[1])}) rotate(${tilt})"><path d="M 0 -4.9 C 2.9 -4.9 4.2 -2.6 4.1 0 C 4 2.4 2.9 4.2 0.6 4.9 C -0.8 5.6 -2.6 5.4 -3.2 4.2 L -3.5 2.6 L -5 1.5 L -3.9 -0.4 C -4.1 -3 -2.6 -4.9 0 -4.9 Z" class="fig"/><path d="M -4.6 -3.2 C -4.4 -7.6 -2 -8.6 0.6 -8.5 C 3.2 -8.4 4.9 -7 4.8 -3.4 Z" class="fig"/><path d="M -7.6 -2.2 Q -1 -4 7.2 -3.2" style="fill:none;stroke:var(--ink);stroke-width:1.7;stroke-linecap:round"/><path d="M -4.5 -4.6 Q 0 -5.6 4.7 -4.9" class="cut" style="stroke-width:0.6"/></g>`;
}
const L = [];
// ---------- the lead climber, facing the rock ----------
{
  const hip = [549, 224], sh = [541.5, 201];
  const d = [
    // rope trailing behind is drawn in the plate. far leg first: straight, toe on the lower hold
    chain([[549.5, 225, 4.3], [540.5, 241.5, 3.3], [538.8, 246.5, 2.9], [534.2, 257.2, 1.8]]),
    // near leg: knee high, toe on the upper hold
    chain([[548, 224.5, 4.4], [534, 216.5, 3.3], [533, 222.5, 2.9], [531.4, 234.4, 1.8]]),
    // torso and jacket skirt
    cap(sh, hip, 5.4, 4.7),
    // neck
    cap([541.4, 199], [541, 191.5], 2.1, 1.9), cap([541.2, 196.6], [541.5, 201], 2.5, 5.4),
    // far arm, reaching for the high hold
    chain([[540.4, 200, 2.7], [532, 191.6, 2.1], [526.6, 182.6, 1.5], [523.6, 180, 1.5]]),
    // near arm, bent, on the lower hold
    chain([[541.6, 202.5, 2.7], [534, 210, 2.1], [528.6, 205.6, 1.5], [525.6, 203.6, 1.5]]),
  ].join(' ');
  L.push('  <!-- the lead climber, just above frontier, facing the rock. about 76 units from hat to lower boot -->');
  L.push('  <g>');
  L.push(`    <path d="${d}" class="fig"/>`);
  L.push('    <path d="M 544.2 221 L 553.6 218.4 Q 556.6 225 556.8 231.6 L 545.6 233 Q 544 227 544.2 221 Z" class="fig"/>');
  // knapsack
  L.push('    <path d="M 546.8 202.6 C 550.4 200.8 554 203.4 555 207.6 C 556 212 555.4 215.4 552.8 216.4 L 549.2 215.4 Z" class="fig"/>');
  // boots: upper, lower
  L.push('    <path d="M 529.4 233 L 533.6 233.2 L 534 238.6 L 531.8 239 L 525.4 240.6 Q 523.4 239.6 525.2 237.6 L 529.4 235.6 Z M 532 256.2 L 536.4 256.6 L 536.6 262 L 534 262.4 L 525 264.2 Q 522.8 263.4 524.4 261.2 L 531.6 258.6 Z" class="fig"/>');
  L.push('    ' + head([541, 188.6], 22));
  // rope tied round the waist, knapsack strap
  L.push('    <path d="M 544.4 219.6 L 553.8 222.6" class="cut"/><path d="M 546.2 203.4 L 549.6 215.6" class="cut" style="stroke-width:0.6"/>');
  L.push('  </g>');
}
// ---------- the belayer, braced, rope in both hands ----------
{
  const hip = [700, 544], sh = [702.6, 523.6];
  const d = [
    // front leg, braced
    chain([[699, 545, 4.3], [692.6, 560.6, 3.3], [691.2, 565.5, 2.9], [688.2, 574.6, 1.9]]),
    // rear leg
    chain([[701.4, 545, 4.3], [704.2, 560.8, 3.3], [705.6, 565.5, 2.9], [709, 574.6, 1.9]]),
    cap(sh, hip, 5.5, 4.8),
    cap([702.4, 521.6], [701.9, 515.4], 2.2, 2), cap([702.2, 519.2], [702.6, 523.6], 2.6, 5.5),
    // leading arm, out toward the face
    chain([[701.2, 524.6, 2.7], [693.4, 533.4, 2.1], [685.4, 535.4, 1.5], [682.4, 535, 1.6]]),
    // braking arm, at the hip
    chain([[704, 525, 2.7], [710.4, 535.4, 2.1], [708.6, 544, 1.5], [707.6, 546.4, 1.6]]),
  ].join(' ');
  L.push('  <!-- the belayer, braced, the rope in both hands and round the waist. about 76 units tall -->');
  L.push('  <g>');
  L.push(`    <path d="${d}" class="fig"/>`);
  L.push('    <path d="M 695 540 L 705.4 540.6 Q 707.6 546 707.8 552.6 L 693.4 552.2 Q 693.6 546 695 540 Z" class="fig"/>');
  // boots: front, rear. sole on the ground line at 580
  L.push('    <path d="M 686 573 L 690.6 573 L 691.2 580 L 688.2 580 L 688.2 579 L 685.8 579 L 685.8 580 L 678.6 580 Q 677.8 577.4 681 576.8 L 685.4 575.6 Z M 706.8 573 L 711.4 573 L 712 580 L 709 580 L 709 579 L 706.6 579 L 706.6 580 L 699.4 580 Q 698.6 577.4 701.8 576.8 L 706.2 575.6 Z" class="fig"/>');
  L.push('    ' + head([701.7, 512.2], 26));
  L.push('    <path d="M 694.6 541.4 Q 700 544 705.6 544.6" class="cut"/>');
  L.push('  </g>');
}
const src = fs.readFileSync(plate, 'utf8');
const a = src.indexOf('  <!-- figures:start -->'), b = src.indexOf('  <!-- figures:end -->');
if (a < 0 || b < 0) throw new Error('markers missing');
const nl = src.includes('\r\n') ? '\r\n' : '\n';
fs.writeFileSync(plate, src.slice(0, a) + '  <!-- figures:start -->' + nl + L.join(nl) + nl + src.slice(b));
console.log('ok', L.length);
