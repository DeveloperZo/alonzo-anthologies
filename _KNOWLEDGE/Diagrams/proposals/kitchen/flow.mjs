// Flow drawing shared by the WONDER plates: ribbons of hand-wobbled streamlines whose width is a number.
// The manner is Charles Minard's flow maps, drawn as engraved water.
import { f } from './frame.mjs';
export const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${f(x)} ${f(y)}`).join(' ');
// centerlines, sampled about every 4 units
export const straight = (x0, y0, x1, y1) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 4)); const p = []; for (let i = 0; i <= n; i++) p.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); return p; };
export const bezier = (P, n = 48) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; p.push([u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]); } return p; };
export const join = (...parts) => parts.reduce((a, b) => a.concat(a.length ? b.slice(1) : b), []);
export const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const normal = (cl, i) => { const a = cl[Math.max(0, i - 1)], b = cl[Math.min(cl.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1; return [-dy / n, dx / n]; };
// a curve offset from the centerline by off(i) units along the normal
export const offsetLine = (cl, off) => cl.map((p, i) => { const [nx, ny] = normal(cl, i); const o = typeof off === 'function' ? off(i) : off; return [p[0] + nx * o, p[1] + ny * o]; });
// a ribbon: streamlines between two banks. hw is the half-width, a number or a function of the sample index.
// shift moves the whole ribbon off the centerline (a number or function), for ribbons that grow on one side.
export function ribbon({ cl, hw, rnd, cls = 'st', bankCls = 'l', pitch = 7, bank = true, shift = 0, wobble = 1 }) {
  const H = (i) => typeof hw === 'function' ? hw(i) : hw, S = (i) => typeof shift === 'function' ? shift(i) : shift;
  let maxw = 0; for (let i = 0; i < cl.length; i++) maxw = Math.max(maxw, H(i));
  const K = Math.max(2, Math.round(2 * maxw / pitch));
  let s = '';
  for (let k = 0; k < K; k++) {
    const fr = -0.5 + (k + 0.5) / K, ph = rnd() * 6.28, amp = wobble * (0.7 + rnd() * 0.9);
    s += `<path d="${line(offsetLine(cl, (i) => S(i) + fr * 2 * H(i) + amp * Math.sin(i / 5.2 + ph)))}" class="${cls}"/>`;
  }
  if (bank) s += `<path d="${line(offsetLine(cl, (i) => S(i) + H(i)))}" class="${bankCls}"/><path d="${line(offsetLine(cl, (i) => S(i) - H(i)))}" class="${bankCls}"/>`;
  return s;
}
// a dashed baseline, cut clear of the streamlines by a paper channel
export const ghost = (pts) => { const d = line(pts); return `<path d="${d}" class="ghu"/><path d="${d}" class="gh"/>`; };
export const chev = (x, y, dir, cls = 'l') => `<path d="M ${x - 5 * dir} ${y - 6} L ${x + 5 * dir} ${y} L ${x - 5 * dir} ${y + 6}" class="${cls}" style="stroke-width:2;fill:none"/>`;
export const FLOW_STYLE = `.st { fill: none; stroke: var(--ink); stroke-width: 0.75; opacity: 0.78; } .sta { fill: none; stroke: var(--accent); stroke-width: 0.85; opacity: 0.9; } .sts { fill: none; stroke: var(--soft); stroke-width: 0.7; opacity: 0.7; stroke-dasharray: 5 4; } .ghu { fill: none; stroke: var(--paper); stroke-width: 6; } .gh { fill: none; stroke: var(--ink); stroke-width: 1.3; stroke-dasharray: 8 6; } .num { font-size: 25px; } .numa { font-size: 25px; fill: var(--accent); } .huge { font-size: 40px; } .hugea { font-size: 40px; fill: var(--accent); }`;
