// Grouped bars on one scale, in the manner of DIA-405: small-cap group heads over a hairline,
// one row per figure, every bar drawn to its number from one zero line, rust for the row the plate turns on.
import { f } from './frame.mjs';
// groups: [{ head, rows: [{ label, v, text, accent, open, note, plain }] }]
//   v: the number the bar is drawn to (negative runs left). text: the printed value.
//   open: the true value is larger than the bar ("more than"). note: rust italic beside the row.
//   plain: a row with no bar, for a finding reported without a size (text is printed in its place).
// U: units per 1 of v. X0: the zero line. Returns { svg, y }.
export function bars({ groups, U, X0, y0 = 112, H = 36, gap = 16, zero = '' }) {
  let y = y0, out = '';
  for (const g of groups) {
    out += `<text x="60" y="${y + 4}" class="sc">${g.head}</text><line x1="60" y1="${y + 12}" x2="900" y2="${y + 12}" class="thin" style="opacity:0.5"/>`;
    y += 26;
    const ya = y - 6;
    for (const r of g.rows) {
      const cy = y + H / 2 + 6;
      if (r.plain) {
        out += `<text x="${X0 - 16}" y="${cy}" text-anchor="end" class="rl">${r.label}</text><text x="${X0 + 14}" y="${cy}" class="${r.accent ? 'ita' : 'it'}" style="font-size:17px">${r.text}</text>`;
      } else {
        const w = Math.abs(r.v) * U, neg = r.v < 0;
        out += `<text x="${f(X0 - (neg ? w + 16 : 16))}" y="${cy}" text-anchor="end" class="rl">${r.label}</text>`;
        out += `<rect x="${f(neg ? X0 - w : X0)}" y="${y}" width="${f(w)}" height="${H}" class="${r.accent ? 'fa' : 'hb'}"/>`;
        let tx = neg ? X0 + 14 : X0 + w + 12;
        if (r.open) { out += `<path d="M ${f(X0 + w + 7)} ${y + 6} l 9 ${H / 2 - 6} l -9 ${H / 2 - 6} M ${f(X0 + w + 18)} ${y + 6} l 9 ${H / 2 - 6} l -9 ${H / 2 - 6}" class="l"/>`; tx += 28; }
        out += `<text x="${f(tx)}" y="${y + H / 2 + 10}" class="${r.accent ? 'numa' : 'num'}">${r.text}</text>`;
        if (r.note) out += `<text x="900" y="${cy}" text-anchor="end" class="ita">${r.note}</text>`;
      }
      y += H + gap;
    }
    out += `<line x1="${X0}" y1="${ya}" x2="${X0}" y2="${y - gap + 6}" class="l"/>`;
    y += 18;
  }
  const bot = y - 18 - gap + 6;
  const svg = out + (zero ? `<text x="${X0}" y="${bot + 20}" text-anchor="middle" class="sm">${zero}</text>` : '');
  return { svg, y: bot };
}
export const STYLE = `.rl { font-size: 16px; } .num { font-size: 26px; } .numa { font-size: 30px; fill: var(--accent); }`;
export const foot = (t) => `<text x="480" y="584" text-anchor="middle" class="sm">${t}</text>`;
