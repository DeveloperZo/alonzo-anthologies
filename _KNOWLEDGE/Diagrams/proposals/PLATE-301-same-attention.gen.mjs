// DIA-301 · The same attention, spent three ways.
// A plain chart, not an engraved plate: the essay is short and the plates
// drawn for it were rejected as ornament. Run:
//   node _KNOWLEDGE/Diagrams/proposals/PLATE-301-same-attention.gen.mjs
// It writes the working file beside this script and the published copy.
// There is no script title, so embed-title-font.mjs is not needed.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, 'PLATE-301-same-attention.svg');
const PUB = join(here, '..', '..', '..', 'site', 'content', 'where-the-work-goes', 'diagrams', 'DIA-301-same-attention.svg');

// One bar is one change. Height is the attention it gets.
// Counts are illustrative, not measured: 6 changes before, 48 now.
const W = 12;            // bar width
const PITCH = 16;        // x = X0 + PITCH * i
const X0 = 66;
const BEFORE = 6, NOW = 48;
const H_BEFORE = 120;                          // attention per change, before
const AREA = BEFORE * W * H_BEFORE;            // the budget: 8640 square units, held equal in all rows
const H_THIN = AREA / (NOW * W);               // 15: the same budget over 48 changes
const DEEP = [5, 13, 19, 27, 36, 44];          // the few that get real attention in row 3
const H_STAMP = 3;
const H_DEEP = (AREA - (NOW - DEEP.length) * W * H_STAMP) / (DEEP.length * W); // 99

const BASE = [200, 290, 470];                  // baselines of the three rows
const bar = (i, base, h, cls) => `<rect class="${cls}" x="${X0 + PITCH * i}" y="${base - h}" width="${W}" height="${h}"/>`;
const row = (n, base, h, cls) => Array.from({ length: n }, (_, i) => bar(i, base, typeof h === 'function' ? h(i) : h, typeof cls === 'function' ? cls(i) : cls)).join('');
const rule = (y) => `<line class="p301-rule" x1="${X0}" y1="${y + 0.5}" x2="${X0 + PITCH * NOW - (PITCH - W)}" y2="${y + 0.5}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 572" role="img" aria-labelledby="p301-t p301-d">
<title id="p301-t">DIA-301 · The same attention, spent three ways</title>
<desc id="p301-d">Three rows of bars. Each bar is one change and its height is the attention it gets; the total bar area is equal in all three rows. First row: six changes, each read deeply. Second row: forty-eight changes under the same review ritual, each given a sliver. Third row, labelled one path of many: forty-two changes get a stamp and six get nearly the old depth. Counts are illustrative.</desc>
<style>
:root{--p301-paper:#F2EEE3;--p301-ink:#2A2A35;--p301-soft:#6B6873;--p301-accent:#A85B49}
@media (prefers-color-scheme: dark){:root{--p301-paper:#1E2128;--p301-ink:#E8E5DC;--p301-soft:#B8B5AD;--p301-accent:#D29183}}
.p301-bg{fill:var(--p301-paper)}
.p301-deep{fill:var(--p301-accent)}
.p301-thin{fill:var(--p301-soft)}
.p301-rule{stroke:var(--p301-soft);stroke-width:0.7}
.p301-h{font-family:Spectral,Georgia,serif;font-size:19px;fill:var(--p301-ink)}
.p301-s{font-family:Spectral,Georgia,serif;font-size:15px;font-style:italic;fill:var(--p301-soft)}
.p301-c{font-family:Spectral,Georgia,serif;font-size:15px;fill:var(--p301-soft)}
</style>
<rect class="p301-bg" width="900" height="572"/>
<text class="p301-h" x="${X0}" y="52">Before: few changes, each one read.</text>
${row(BEFORE, BASE[0], H_BEFORE, 'p301-deep')}
${rule(BASE[0])}
<text class="p301-h" x="${X0}" y="250">Now, the same ritual: every change reviewed, none of them read.</text>
${row(NOW, BASE[1], H_THIN, 'p301-thin')}
${rule(BASE[1])}
<text class="p301-h" x="${X0}" y="336">One path, of many: stamp most, go deep on the few that can hurt.</text>
${row(NOW, BASE[2], (i) => (DEEP.includes(i) ? H_DEEP : H_STAMP), (i) => (DEEP.includes(i) ? 'p301-deep' : 'p301-thin'))}
${rule(BASE[2])}
<text class="p301-s" x="${X0}" y="500">Each bar is one change. Height is the attention it gets. The total area is the same in every row. Counts are illustrative.</text>
<line class="p301-rule" x1="${X0}" y1="520.5" x2="834" y2="520.5"/>
<text class="p301-c" x="${X0}" y="546">DIA-301 · The same attention, spent three ways. The third is one possible path, not the only one.</text>
</svg>
`;
writeFileSync(OUT, svg);
mkdirSync(dirname(PUB), { recursive: true });
writeFileSync(PUB, svg);
console.log('wrote', OUT, 'and', PUB, { AREA, H_THIN, H_DEEP });
