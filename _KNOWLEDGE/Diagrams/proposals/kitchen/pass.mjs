// The pass, in side elevation: a counter, a frame with heat lamps, and a drop gate where plates are checked.
// Shared by DIA-404 (two kitchens) and DIA-408 (the loose kitchen, repaired).
import { f } from './frame.mjs';
export const counter = (yC, x0 = 50, x1 = 910) =>
  `<rect x="${x0}" y="${yC}" width="${x1 - x0}" height="10" class="h"/><line x1="${x0}" y1="${yC}" x2="${x1}" y2="${yC}" class="l"/><line x1="${x0}" y1="${yC + 10}" x2="${x1}" y2="${yC + 10}" class="thin"/>`;
// a plate of food from the side, 69 units wide at k = 1.5. bad: the dish is wrong (rust). tick: it was checked.
export const dish = (x, yC, { bad = false, tick = false, k = 1.5 } = {}) =>
  `<g transform="translate(${f(x)} ${yC}) scale(${k})">` +
  `<path d="M -13 -7 Q 0 -27 13 -7 Z" class="${bad ? 'fa' : 'h'}"/>` +
  `<path d="M -13 -7 Q 0 -27 13 -7" class="${bad ? 'la' : 'l'}" style="stroke-width:1"/>` +
  `<path d="M -23 -7 L 23 -7 Q 15 0 8 0 L -8 0 Q -15 0 -23 -7 Z" class="${bad ? 'ba' : 'b'}" style="stroke-width:1"/>` +
  (tick ? `<path d="M -6 -38 l 4 5 l 8 -12" class="l" style="stroke-width:1.1"/>` : '') + `</g>`;
// the frame of the pass at xP. open: the gate is propped up and plates run under it.
export const GATE = 46;                        // the gate hangs this far right of the frame's centre
export const passFrame = (xP, yC, { open = false } = {}) => {
  const top = yC - 170, gx = xP + GATE, gy = open ? yC - 122 : yC - 44;
  let s = '';
  s += `<rect x="${xP - 100}" y="${top}" width="12" height="170" class="hb"/><rect x="${xP + 88}" y="${top}" width="12" height="170" class="hb"/>`;
  s += `<rect x="${xP - 112}" y="${top - 16}" width="224" height="16" class="b"/>`;
  for (const lx of [xP - 58, xP - 8]) {
    s += `<line x1="${lx}" y1="${top}" x2="${lx}" y2="${top + 24}" class="l"/><path d="M ${lx - 7} ${top + 24} L ${lx + 7} ${top + 24} L ${lx + 20} ${top + 48} L ${lx - 20} ${top + 48} Z" class="hb"/>`;
  }
  s += `<line x1="${gx - 5}" y1="${top}" x2="${gx - 5}" y2="${gy}" class="thin"/><line x1="${gx + 5}" y1="${top}" x2="${gx + 5}" y2="${gy}" class="thin"/>`;
  s += `<rect x="${gx - 12}" y="${gy}" width="24" height="${open ? 16 : 44}" class="hb"/>`;
  if (open) s += `<path d="M ${gx + 12} ${gy + 8} L ${xP + 88} ${gy + 30}" class="l" style="stroke-width:2.4"/>`;   // the prop
  return s;
};
// a tasting spoon resting in a plate at x
export const spoon = (x, yC, cls = 'l') =>
  `<path d="M ${x + 6} ${yC - 26} L ${x - 20} ${yC - 78}" class="${cls}" style="stroke-width:2.4"/><ellipse cx="${x + 9}" cy="${yC - 21}" rx="6" ry="9" transform="rotate(-27 ${x + 9} ${yC - 21})" class="${cls === 'la' ? 'ba' : 'b'}"/>`;
