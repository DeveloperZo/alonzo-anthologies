// Publishes a plate: copies it to its DIA path with the title font embedded.
//
//   node embed-title-font.mjs <plate.svg> <published DIA path.svg>
//
// An SVG loaded through ![](...) cannot fetch web fonts, so the Great Vibes
// title would fall back to Georgia. This swaps the plate's
// @import line for an @font-face holding only the glyphs the title uses
// (about 13 to 30 KB). Needs network access to Google Fonts.
import fs from 'node:fs';

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error('usage: node embed-title-font.mjs <plate.svg> <published.svg>');
  process.exit(1);
}

let svg = fs.readFileSync(from, 'utf8');
const title = svg.match(/class="title">([^<]+)</)?.[1];
if (!title) throw new Error('no <text class="title"> in ' + from);
const importLine = /@import url\([^)]*\);/;
if (!importLine.test(svg)) throw new Error('no @import line in ' + from);

const glyphs = [...new Set(title)].sort().join('');
// Google only serves woff2 to a browser user agent.
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const css = await (await fetch(
  'https://fonts.googleapis.com/css2?family=Great+Vibes&text=' + encodeURIComponent(glyphs),
  { headers: { 'User-Agent': ua } },
)).text();
const url = css.match(/url\((https:[^)]+)\)/)?.[1];
if (!url) throw new Error('no font url in the Google Fonts response');
const font = Buffer.from(await (await fetch(url)).arrayBuffer());
if (font.subarray(0, 4).toString() !== 'wOF2') throw new Error('font is not woff2');

svg = svg.replace(
  importLine,
  `@font-face { font-family: "Great Vibes"; font-weight: 400; src: url(data:font/woff2;base64,${font.toString('base64')}) format("woff2"); }`,
);
// Quartz ends an inline HTML block at the first blank line.
if (/\n\s*\n/.test(svg)) throw new Error('blank line inside ' + from);

fs.writeFileSync(to, svg);
console.log(`${to}: "${title}", ${Math.round(font.length / 1024)} KB font, ${Math.round(svg.length / 1024)} KB total`);
