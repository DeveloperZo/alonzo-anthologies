// Shared frame for the "Same Menu, Different Kitchen" plates (DIA-401 to DIA-408).
// Only the frame, palette, type and caption line are common. Each plate draws in its own manner.
// Usage from a generator: import { plate, f } from './frame.mjs'
import fs from 'node:fs';
export const f = (n) => (Math.round(n * 100) / 100).toString();
export const ARTICLE = 'SAME MENU, DIFFERENT KITCHEN';
export function plate({ n, roman, section, sectionName, title, caption, desc, body, style = '', defs = '', legend = '' }) {
  const p = `p${n}`;
  const svg = `<svg viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${p}-t ${p}-d">
  <title id="${p}-t">DIA-${n} · ${title}</title>
  <desc id="${p}-d">${desc}</desc>
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Spectral:ital,wght@0,400;0,600;1,400&amp;display=swap');
      :root { --paper: #F2EEE3; --ink: #2A2A35; --soft: #6B6873; --accent: #A85B49; }
      @media (prefers-color-scheme: dark) { :root { --paper: #1E2128; --ink: #E8E5DC; --soft: #B8B5AD; --accent: #D29183; } }
      text { font-family: Spectral, Georgia, "Times New Roman", serif; fill: var(--ink); }
      .paper { fill: var(--paper); }
      .l { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
      .thin { fill: none; stroke: var(--ink); stroke-width: 0.7; stroke-linecap: round; stroke-linejoin: round; }
      .b { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; stroke-linecap: round; }
      .bt { fill: var(--paper); stroke: var(--ink); stroke-width: 0.9; stroke-linejoin: round; }
      .ink { fill: var(--ink); stroke: none; }
      .h { fill: url(#${p}-h); stroke: none; }
      .hb { fill: url(#${p}-h); stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }
      .hl { stroke: var(--ink); stroke-width: 0.6; }
      .la { fill: none; stroke: var(--accent); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
      .ba { fill: var(--paper); stroke: var(--accent); stroke-width: 1.4; stroke-linejoin: round; }
      .fa { fill: var(--accent); stroke: none; }
      .sight { fill: none; stroke: var(--soft); stroke-width: 0.7; stroke-dasharray: 5 4; }
      .sc { font-size: 11px; letter-spacing: 0.16em; fill: var(--soft); }
      .it { font-size: 13.5px; font-style: italic; }
      .ita { font-size: 15px; font-style: italic; fill: var(--accent); }
      .sm { font-size: 12px; font-style: italic; fill: var(--soft); }
      .big { font-size: 24px; }
      .biga { font-size: 24px; fill: var(--accent); }
      .cap { font-size: 12.5px; fill: var(--soft); }
      .title { font-family: "Great Vibes", "Cormorant Garamond", Georgia, serif; font-size: 38px; word-spacing: 0.14em; }
      ${style}
    </style>
    <pattern id="${p}-h" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4.5" class="hl"/>
    </pattern>
    ${defs}
  </defs>
  <rect width="960" height="720" class="paper"/>
  <rect x="14" y="14" width="932" height="692" class="l" style="stroke-width:1.2"/>
  <rect x="20" y="20" width="920" height="680" class="thin"/>
  <text x="42" y="50" class="sc">PLATE ${roman}</text>
  <text x="918" y="50" text-anchor="end" class="sc">${ARTICLE} · SECTION ${section} · ${sectionName}</text>
  ${body}
  <text x="480" y="634" text-anchor="middle" class="title">${title}</text>
  ${legend}
  <line x1="300" y1="656" x2="660" y2="656" class="thin"/>
  <text x="480" y="679" text-anchor="middle" class="cap">DIA-${n} · ${caption}</text>
</svg>
`.split('\n').filter((l) => l.trim() !== '').join('\n') + '\n';
  return svg;
}
export function write(out, svg) {
  if (!out) { console.error('usage: node <generator> <out.svg>'); process.exit(1); }
  if (/\n\s*\n/.test(svg)) throw new Error('blank line');
  fs.writeFileSync(out, svg);
  console.log('ok', out, svg.length);
}
