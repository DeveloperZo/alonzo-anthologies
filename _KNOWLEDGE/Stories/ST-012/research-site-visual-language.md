# Research: site visual language for the ST-012 career profile

Scope: how the "What's Being Built" heading on the Quartz site is styled, what other visual signatures belong to Zo, and how to reproduce the heading on a self-contained page.

## 1. The heading treatment

### Short answer

There is no image, SVG pattern, mask, or `background-clip: text` anywhere in the site styles (searched `site/quartz/styles`, `site/quartz/components`, `quartz.config.ts`, `quartz.layout.ts`). The engraved, stippled, chalky look comes entirely from the typeface: **Fredericka the Great** (Google Font, single weight 400). Its glyphs are drawn as Victorian engraved letters with hatched, hand-sketched inner strokes and open counters, so a flat solid `color` already reads as a textured fill. The blue is the dark-mode `--secondary` theme color on the dark-mode page background.

### Font source

Loaded from Google Fonts by a hand-added link in the Head component, `site/quartz/components/Head.tsx` lines 48 to 49:

```tsx
{/* Fredericka the Great: display headings only, weight 400 (no bold variant exists) */}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap" />
```

It is not part of the Quartz theme typography. The theme fonts in `site/quartz.config.ts` are:

```ts
fontOrigin: "googleFonts",
typography: {
  header: { name: "Cormorant Garamond", weights: [400, 600] },
  body: { name: "Spectral", weights: [400, 700], includeItalic: true },
  code: "IBM Plex Mono",
},
```

Cormorant Garamond is only the fallback for h1 and h2, and the real face for h3 to h6.

### Selectors and rules

`site/quartz/styles/custom.scss`, "Heading typography" block:

```scss
h1, h2 {
  font-family: "Fredericka the Great", var(--headerFont), serif;
  font-weight: 400;
  color: var(--secondary);
  letter-spacing: 0.01em;
}

h3, h4, h5, h6 {
  color: var(--secondary);
  font-weight: 600;
}
```

The "I: What's Being Built" heading is the page title, rendered by `site/quartz/components/ArticleTitle.tsx` as `<h1 class="article-title">` (margin `2rem 0 0 0`). Sizes come from `site/quartz/styles/base.scss`: `h1 { font-size: 1.75rem }`, `h2 { font-size: 1.4rem }`. So every h1 and h2 on the site (page titles, section headings, and the sidebar site title, which is an `h2.page-title`) gets this treatment.

### Exact colors

From `site/quartz.config.ts`:

| Role | Light mode | Dark mode |
|---|---|---|
| Heading color (`--secondary`) | `#1C1C2E` (ink navy) | `#7b97aa` (dusty steel blue) |
| Page background (`--light`) | `#F7F6F3` (warm off-white) | `#161618` (near-black) |
| Body text (`--darkgray`) | `#6B6B85` | `#d4d4d4` |
| Links (`--tertiary`) | `#3A5498` | `#84a59d` (sage) |
| Borders (`--lightgray`) | `#E4E2DC` | `#393639` |
| Text highlight | `#fff23688` | `#b3aa0288` |

The look Zo described (textured blue on near-black) is the **dark mode** pairing: `#7b97aa` Fredericka the Great on `#161618`. In light mode the same heading is navy ink on cream, which reads more like an engraved book plate.

## 2. Other visual signatures

### Zo's identity (custom, deliberate)

- **Fredericka the Great display headings.** The single most distinctive choice. Engraved, Victorian, slightly hand-made.
- **Literary serif stack.** Spectral body, Cormorant Garamond for minor headings, IBM Plex Mono for code. Chosen in config; Quartz ships Schibsted Grotesk and Source Sans Pro by default.
- **Muted, desaturated palette with a dark slate-blue accent.** Dark mode secondary `#7b97aa` and sage `#84a59d` replace Quartz's default blues. Light mode uses ink navy `#1C1C2E` on warm paper `#F7F6F3`.
- **Editorial label system** (`custom.scss`). The "Part I of VIII" kicker is restyled to 0.68rem, weight 700, `letter-spacing: 0.1em`, uppercase, muted. The lead-in italic gets a 3px left rule in the border color. Table headers use the same tiny tracked uppercase (0.7rem, `letter-spacing: 0.07em`). Tracked small caps labels are a recurring motif.
- **Pill and card system.** 999px pill links (`.series-top-links`), tier pills with tinted fills (`.tier-pill`), 10 to 12px rounded cards with a soft `0 2px 8px` shadow, stat cards with heavy 900-weight numerals.
- **Site tokens** (`custom.scss`): `--z-red #C94B2E`, `--z-green #2A7A5F`, `--z-blue #3A5498`, `--z-amber #C9880A`, `--z-gray #9B9BA8`, `--z-muted #6B6B85`, `--z-border #E4E2DC`, each with a pale tint.
- **Diagram palette: earthy, paper and ink.** Shared across `career-as-system-v1.svg`, the ai-governance diagrams, and `_KNOWLEDGE/Diagrams/DIA-10x`:
  - Paper `#F2EEE3`, background `#FAFAF8`, cloud `#FFFDF8`, ink text `#2A2A35`, muted `#6B6873`, `#9D9A95`, hairline `#E2DFD6`.
  - Rust `#A85B49`, deep rust `#823F30`, sage `#5A8270`, ochre `#A28438`, slate blue `#4F627F`, flow khaki `#B8AD95` and `#8E846F`, broken-loop red `#B83A2A`.
  - Dark variants: bg `#1B1D23`, paper `#1E2128`, text `#E8E5DC`, rust `#D29183`, sage `#92BAA6`, blue `#94A6C4`, ochre `#D6B574`.
- **Diagram typography.** System sans for labels, Georgia italic (`.serif` class) for concept names and stock labels, small tracked uppercase titles (`letter-spacing` 0.04em to 0.15em), for example "CAREER · COMPOUNDING LEVERAGE" with a middle dot separator.
- **Stock-and-flow motifs.** Hand-drawn lumpy cloud paths with an offset shadow copy at 0.65 opacity, thick khaki pipes (stroke-width 14), black T-fitting valves (stroke-width 12.5), plain-rectangle stocks with a 1.75 ink stroke, small hollow port circles (r 3.5), curved Bezier info links at 1.7 stroke.
- **Line language.** Solid 1.5 to 2 strokes for main structure, `6,4` dashes for secondary or legacy paths, fine `2,3` dotted at 0.7 opacity for balancing or weak loops, hash marks across a link to show a broken loop. Mostly rounded joins.
- **Captions inside the artwork.** DIA-NNN label and caption rendered as SVG text at the bottom, preceded by a hairline rule.
- **Archetype footer.** A hairline then a tracked uppercase archetype name ("SUCCESS TO THE SUCCESSFUL") and one plain sentence.

### Quartz defaults (not identity)

- The overall three-column layout, Explorer sidebar, breadcrumbs, search, graph view, backlinks, table of contents.
- Callout component structure (only the colors of `key`, `critique`, `tip` are custom).
- Heading anchor link icons (only shrunk to 14px and 0.35 opacity).
- Popover previews, the dark mode toggle, code block styling (`github-light` and `github-dark` Shiki themes).
- The fade-out `mask-image` on the explorer list in `base.scss`.

## 3. Reproducing the heading on a standalone page

No image asset is needed, because the texture is in the font. One Google Fonts link does it:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&family=Spectral:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap">

<style>
  :root {
    --sleeve-bg: #161618;     /* site dark --light */
    --sleeve-ink: #7b97aa;    /* site dark --secondary */
    --sleeve-text: #d4d4d4;   /* site dark --darkgray */
    --sleeve-sage: #84a59d;   /* site dark --tertiary */
  }
  body { background: var(--sleeve-bg); color: var(--sleeve-text);
         font-family: "Spectral", Georgia, serif; }
  .display {
    font-family: "Fredericka the Great", "Cormorant Garamond", Georgia, serif;
    font-weight: 400;          /* only weight that exists; never bold it */
    color: var(--sleeve-ink);
    letter-spacing: 0.01em;
    line-height: 1.05;
  }
</style>
```

Notes for the album sleeve:

- **Scale up.** The site uses 1.75rem. The hatching only becomes the dominant "engraving" texture at large sizes, so use something like `clamp(3rem, 12vw, 8rem)` for the sleeve title.
- **Do not fake bold.** Fredericka has one weight. `font-weight: 700` makes the browser synthesize a smeared bold that destroys the hatching. Add `font-synthesis: none` to be safe.
- **Optional extra grain, still self-contained.** For a more lofi, printed feel, add an inline SVG `feTurbulence` noise as a `data:` URI background on the sleeve (not on the text), at low opacity. That keeps the font texture readable and needs no uploaded asset. If a real paper or riso grain image is preferred, it would have to be created and uploaded; no such asset exists in the repo today.
- **Optional second ink.** If a duotone sleeve is wanted, pair the steel blue with rust `#D29183` or ochre `#D6B574` from the dark diagram palette, which keeps it inside Zo's existing colors.
- **Light variant** (cream sleeve): `#1C1C2E` Fredericka on `#F7F6F3` or diagram paper `#F2EEE3`.

## Source files

- `C:\Repos\alonzo-anthologies\site\quartz\styles\custom.scss`
- `C:\Repos\alonzo-anthologies\site\quartz\components\Head.tsx`
- `C:\Repos\alonzo-anthologies\site\quartz\components\ArticleTitle.tsx`
- `C:\Repos\alonzo-anthologies\site\quartz\styles\base.scss`
- `C:\Repos\alonzo-anthologies\site\quartz.config.ts`
- `C:\Repos\alonzo-anthologies\career-as-system-v1.svg`
- `C:\Repos\alonzo-anthologies\site\content\ai-governance\part-1\diagrams\` (DIA-001 to DIA-006B)
- `C:\Repos\alonzo-anthologies\_KNOWLEDGE\Diagrams\DIA-101-SystemOverview.svg` and siblings
