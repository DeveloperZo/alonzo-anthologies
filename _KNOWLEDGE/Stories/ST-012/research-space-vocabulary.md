# Research: space visual vocabulary for ST-012

Purpose: give the album sleeve and the future "galaxy map path" a vocabulary that a Mass Effect or Factorio fan recognizes, without falling into generic sci-fi HUD (neon cyan on black, hexagon grids, Orbitron). Zo's own taste sets the frame: blue, a classic serif, an engraved or stippled texture.

Companion files in this folder: `album-sketch-v1.md`, `album-grill-v1.md`, `research-site-visual-language.md`.

## How confident this is

Web search confirmed some facts (cited at the end): the Mass Effect UI typefaces, the ME2 scan screen layout, Derek Watts's art references, the Space Age science packs and where each is made, how Factorio research costs work, the trigger technologies, and the plate contents of the Doppelmayr, Burritt and Asa Smith atlases. The rest is from game knowledge, mainly exact pack colors, tech-tree state colors and the layout of the system view. Before any of it is drawn, check those details against screenshots. Each such item is marked "(verify)".

---

## Section 1. Mass Effect

### 1.1 Galaxy map and cluster map

Layout and behavior:
- The map is a hologram in the Normandy's CIC (command center), and you zoom through four levels: galaxy, cluster, system, planet. The zoom ladder is the main thing a fan remembers. Clicking always takes you one step inward.
- The galaxy level shows the Milky Way as a soft spiral, with named clusters picked out on it. Selecting a cluster draws the route through the mass relays (Prima guide).
- The cluster level shows a few star systems as nodes, with the cluster's relay at a fixed spot. In ME2, a small Normandy model flies between systems, with fuel use shown as a gauge. In ME3, scanning sends out a pulse ring, and a Reaper alert meter fills as you scan.
- The system level shows a central star, planets on thin concentric orbit ellipses viewed at a tilt, and a name label beside each planet. Asteroid belts are dotted rings. (verify the tilt angle)
- ME2 added side-mission markers on the map, so players stopped having to hunt for locations in other menus (thatgamesux).

Labels and naming:
- Cluster names have a two-part, star-catalogue sound: "Artemis Tau", "Hades Gamma", "Attican Traverse", "Exodus Cluster", "Hourglass Nebula", "Serpent Nebula", "Kepler Verge", "Arcturus Stream". Named relays include "Charon Relay" and "Omega 4 Relay".
- Primary relays link clusters across long distances. Secondary relays work within a cluster. The two-tier network is a lore detail fans know.

Relay iconography:
- In the world, a mass relay is a long, two-pronged frame with two counter-rotating rings around a glowing core. On the map, it shrinks to a small glyph of a core with arcs or prongs around it. Fans read the silhouette, two opposed curved arms around a point, as "relay". (verify the exact glyph)

Palette:
- ME1 pairs amber and orange highlights with deep blue space. ME2 shifts toward white, orange and Cerberus gold. ME3 goes back to Alliance blue and white.
- Paragon blue and Renegade red belong to the dialogue system, not the map, but fans everywhere read blue and red as "the Paragon and Renegade choice".
- The N7 mark (an N, a 7, and a red-and-white stripe) is the most recognizable piece of graphic design in the series.
- Derek Watts, the art director, said the GUI drew on the glowing screens of *Final Fantasy: The Spirits Within*. The broader look borrowed from Syd Mead and Frank Lloyd Wright (Dark Horse interview).

Typography:
- ME1 used BioMass for headers and Tigensu for subheads and body text. ME2 and ME3 kept BioMass but replaced Tigensu with Myriad Pro (Nexus Mods font notes). The famous Mass Effect type is therefore wide, rounded tech caps over a plain humanist sans. It is not Orbitron.

### 1.2 Codex panels

- The Codex is split into Primary and Secondary entries, sorted by category (Aliens, Citadel and Galactic Government, Technology, Ships and Vehicles, and so on). ME1 read many entries aloud.
- Each entry is a title, a block of reference prose written like an encyclopedia, and sometimes a small image. The voice is deadpan and factual: "The krogan are a species of large reptilian bipeds..."
- The iconic part is the Primary/Secondary split and the encyclopedic voice, not the panel's chrome.

### 1.3 Planet info and the scan screen

- Planet info stat block (the single most quotable layout in the map). Each planet shows a short list of figures, roughly: Orbital Distance (AU), Orbital Period (years), Keplerian Ratio, Radius (km), Day Length (hours), Atmospheric Pressure (atm), Surface Temperature (C), Surface Gravity (g). Below it sits one paragraph of dry, often funny prose ("an asteroid with a minor fortune in palladium"). The deadpan pairing of numbers with prose is what fans remember. (verify field order per game)
- The ME2 scan screen shows a large rotating planet, a reticle you drag across it, and four mineral readouts (Palladium, Platinum, Iridium, Element Zero) as level bars on the right. A probe counter and a sound that rises in pitch near a deposit complete it. Firing a probe leaves a small pin on the surface. A heuristic review criticized the split attention between the planet and the right-hand readouts (Game Developer). Players also recall "Anomaly detected" and "Planet depleted".

### 1.4 Iconic versus generic

| Iconic (a fan recognizes it) | Generic (any sci-fi game) |
|---|---|
| The galaxy, cluster, system, planet zoom ladder | Zooming into a starfield |
| The relay silhouette, two arms around a core | A glowing portal ring |
| Primary and secondary relays | Lines between nodes |
| The planet stat block with deadpan prose | A data readout |
| Codex Primary and Secondary entries | A lore popup |
| Paragon blue and Renegade red as a pair | Blue UI |
| Two-word cluster names ("Hades Gamma") | "Sector 7G" |
| The N7 stripe | Chevrons |
| Mineral bars and "Planet depleted" | A resource meter |
| The Normandy model moving between systems | A ship cursor |

---

## Section 2. Factorio

### 2.1 The technology tree (2.0 and Space Age)

Card layout:
- Each technology is a square card holding a large rendered icon. A band along the bottom shows small science-pack icons and a cost such as "x300" with a clock time per unit. (verify the exact band layout in 2.0)
- Infinite technologies carry a small infinity mark in the top-right corner and a level label such as "4 - ∞" (Factorio wiki, Technologies).
- Trigger technologies (Space Age) show a condition instead of packs, for example "Craft 50 iron plate" or "Mine crude oil" (wiki). For a career map this is the most useful idea in the game: some unlocks come from doing something, not from paying points.

Prerequisites and selection:
- Select a tech and the view centers on it, with prerequisites drawn above and the techs it unlocks below. Plain right-angled connector lines join them, with no curves. (verify)
- The detail panel has a large icon, a description, a cost row, and "Unlocks" or "Effects" given as small recipe icons with text such as "+10% Mining productivity".
- State colors: researched, available and unavailable each get their own card background. Forum threads note that two of them (green and yellow) are hard to tell apart (forums). The usual reading is green for researched, yellow or orange for available, red for blocked. (verify)
- The research queue sits along the top and adds prerequisites automatically. Players asked for exactly that in FFF 238.

Cost model:
- Each tech needs a set of pack types, and its cost is N units of each one. For example, a tech that costs 300 units with 1 red, 1 green and 1 military needs 300 of each (wiki, Science pack).

### 2.2 Science pack colors

Base game, in canonical order (fans say "red science", not the pack's name):

| Pack | Color | Read as |
|---|---|---|
| Automation | red | basics |
| Logistic | green | moving things |
| Military | grey or black | defense |
| Chemical | blue | refining |
| Production | purple | scale |
| Utility | yellow | advanced tools |
| Space | white | the endgame |

Space Age (where each is made is confirmed by the wiki; the colors are from memory, verify):

| Pack | Made on | Color |
|---|---|---|
| Metallurgic | Vulcanus (foundry) | orange |
| Electromagnetic | Fulgora (EM plant) | magenta or pink |
| Agricultural | Gleba (biochamber) | yellow-green |
| Cryogenic | Aquilo (cryogenic plant) | pale blue or indigo |
| Promethium | space platform | very dark navy |

The order red, green, (grey), blue, purple, yellow, white works almost like a password. Seven small swatches in that order are enough for a fan to recognize it, and no flask drawing is needed.

### 2.3 Space Age planets and platforms

- Five planets: Nauvis, Vulcanus, Fulgora, Gleba, Aquilo. The order you visit them in is a strategic choice (FFF 373).
- The space map has planets as nodes joined by space connections: a route with distances, with asteroids along the way. It reads more like a transit map than a starfield. (verify)
- Space platforms run on schedules borrowed from trains: a list of stops, each with wait conditions ("until cargo full", "for 30 s"). A platform sits "in orbit of" one planet. (verify)
- The UI is beveled dark-grey panels with orange-yellow highlight buttons and a light sans text face. Factorio's own UI font is Titillium Web (verify), which is on Google Fonts.
- Planet icons are painted spheres with small "made here" pack icons next to them.

### 2.4 Iconic versus generic

| Iconic | Generic |
|---|---|
| Pack colors in canonical order | A rainbow legend |
| Tech card with pack icons, a xN count and a clock | A node in a graph |
| Trigger technologies ("Craft 50 iron plate") | Achievements |
| Infinite tech marked "N - ∞" | Level-up |
| Train-style platform schedule | A timeline |
| Blueprint strings that start "0e" | A QR code |
| "The factory must grow" | "Keep building" |
| Five planets, each with its own pack | Planet icons |

---

## Section 3. Astronomical plates, star charts, orreries

These are the sources that can carry the same information as the game screens without a HUD look.

| Source | What is distinctive | What it can carry |
|---|---|---|
| Doppelmayr / Homann, *Atlas Coelestis* (1742), about 30 plates | Several rival world-systems (Copernican, Tychonic, Ptolemaic) drawn side by side on one sheet, with the zodiac around the orbits and corner vignettes of eclipses and planet size comparisons (Bryars, Crouch) | A main chart plus inset "codex" vignettes in the corners. Several models on one plate means several readings of one career |
| Asa Smith, *Illustrated Astronomy* (1848 on) | Big white graphic blocks on black, repeated circles and ovals for orbits, plates titled "Solar System with Orrery" and "Forces & Ellipticals" (George Glazer, Philadelphia Print Shop) | Bold, flat orbit diagrams that suit SVG. The look runs close to mid-century modern |
| Burritt, *Atlas to Illustrate the Geography of the Heavens* (1835), 8 plates | Hand-colored constellation charts with a scale of magnitudes, written for the general public (CT Collections, Old World Auctions) | Star sizes as a legend. The magnitude key is a ready-made legend for tenure or impact |
| Bayer, *Uranometria* (1603) | Greek-letter star names (alpha Orionis) on copperplate figures | Naming roles inside each era: alpha for the lead role, beta for the next |
| Bode, *Uranographia* (1801) | Dotted constellation boundaries, very dense engraving | Eras as regions with dotted borders |
| Cellarius, *Harmonia Macrocosmica* (1660) | Baroque cartouches, hand color, orbits seen from an angle | A title cartouche in place of a HUD header |
| Orrery engravings (Ferguson style, encyclopedia plates) | Brass gears, arms and nested rings, labeled with "Fig. 1" | Orbits as mechanism: dependencies drawn as linkages |
| Anna Atkins cyanotypes (1840s) | White on Prussian blue, built into the process itself | The palette: blue that looks chemical, not electric |
| Nasmyth and Carpenter, *The Moon* (1874), plaster-model photos | Raking light, stippled surface | A stipple texture for planets in place of glow |

Common devices worth taking: plate numbers ("PLATE VII"), "Fig." callouts, a frame graticule with Roman-numeral hour ticks, a magnitude key, dotted region boundaries, an italic Latin title in a cartouche, and Greek-letter designations.

Iconic versus generic: a plate with a cartouche, a graticule border and a "Fig." callout is unmistakably an old atlas. A starfield of white dots is not.

---

## Section 4. The album: five space nods

The sleeve stays a calm blue lofi record. Each nod is small enough to miss and specific enough that a fan grins.

1. **Runout-groove etching.** Real records hide hand-scratched messages in the dead wax. Set a hairline circular line of small caps around the label edge: side A "THE FACTORY MUST GROW", side B "I SHOULD GO" (Shepard's famous dialogue exit). It is invisible as decoration and an in-joke once read. Use SVG `textPath` on a circle at about 6 px with 0.15em letter spacing.

2. **Blueprint string as the catalogue number.** Where a sleeve has a barcode and catalogue number, print a truncated Factorio blueprint string, for example `0eNqVk...` in small monospace under the catalogue line, with the catalogue number itself as "SR2-N7" (the Normandy SR-2 and the N7 rank). Factorio players know the "0e" prefix on sight. Mass Effect players catch SR2. Everyone else sees an ordinary catalogue block.

3. **Science-order registration strip.** Printers put a color registration bar in the sleeve trim. Make it seven small squares in canonical pack order (red, green, grey, blue, purple, yellow, white), muted to the sleeve's ink weight. It is not a legend and has no labels. If a key is wanted, reuse the same chips on the back as skill families (see Section 6).

4. **Planet stat block as the track notes.** Under each track (each role), set one line in the ME planet-info format: "Orbital Period 3.1 yr · Keplerian Ratio 0.8 · Surface Temp: warm". Follow it with one dry, codex-voice sentence. The format alone is the reference, and it reads as playful liner notes to everyone else. Mark the major roles "Codex: Primary" and the side projects "Codex: Secondary".

5. **Relay glyph as the label's spindle hole.** Draw the center label's spindle hole flanked by two opposed thin arcs, the relay silhouette, in engraved line. The record-label logo is then a relay you look through. Add a Normandy-sized dot on a faint orbit ring at the label edge as the "you are here" mark.

Rejected: a Paragon and Renegade blue-red split (too loud, and it brings in red), and science-pack flasks drawn as objects (too literal).

---

## Section 5. The galaxy map site: three directions

All three use SVG for the map and CSS for motion, with React state for selection. No canvas or game engine is needed. All three draw from the existing quest data (`resumeContent/src/data/quests.data.tsx`: `startDate`, `endDate`, `type`, `roles`, `tags`, `accomplishments[].learnings`).

Shared data changes for all three:
- Crew would need a new optional `crew?: string[]` field on `Quest`, because quests do not list mentors today. Mentorship currently shows up only as a tag and in prose.
- Skill families reuse `itemFamilies` from `data/factory.data.ts`, so the factory view and the map agree on which tags count as the same skill.
- The "Next research: ?" node is a fake quest added at render time, with no real dates.

### Direction A: "Orrery Plate" (Doppelmayr and Asa Smith)

**Layout.** One square engraved plate. The central body is Zo's core discipline, a stippled sun labeled in italic caps. Each career quest is a planet on its own elliptical orbit, nested outward by start date (first job innermost), all drawn at the same slight tilt as an ME system view. Side projects and education are moons of the role they overlapped. A frame border carries a year graticule (Roman-numeral ticks around the rim). A title cartouche sits top left, and four corner vignettes, Doppelmayr style, show selected details.

**Mapping.**
- Orbit radius = order of start date. Orbit eccentricity = tenure length (longer stays get rounder orbits).
- Planet size = number of accomplishments, stippled, never glowing.
- Relay jumps = a thin engraved arrow drawn between orbits at the year of the move, with a small relay glyph and the date in italic ("Relay, MMXIX").
- Crew = small named moons circling the planet of the role where that mentor mattered.
- Next research = an unfinished outer orbit, drawn dashed and fading out, with a hatched "?" planet labeled "Next research: ?".

**Interaction.** Clicking a planet zooms the SVG `viewBox` (CSS transition on a transform group) to a system view. A corner vignette then fills with a codex entry: the planet stat block (start and end as Orbital Period, role count as Moons) and the quest summary as deadpan prose. Escape or the cartouche zooms back out, which gives two of ME's zoom levels. Planets drift very slowly with CSS `animation` on `rotate`, and the drift stops under `prefers-reduced-motion`.

**Palette and fonts.**
- Cyanotype: paper `#1F3F6E` (Prussian blue), ink `#F2EEE3` (off-white), second ink `#8FB0D6` (pale blue) for orbits, and one warm accent `#C9A25A` (brass) only for the selected planet.
- Fonts: **IM Fell English** and **IM Fell English SC** for titles and labels (real 17th-century Fell types with a printed texture), **IM Fell DW Pica** italic for figure callouts, **EB Garamond** for codex prose.

**How it avoids HUD.** No glow filters, only stipple (an SVG `<pattern>` of dots) and hatching. Lines are fine-weight strokes with round caps, like an engraver's burin. Labels sit on leader lines with "Fig." numbers. The only animation is slow drift. Every frame of the ME map that it echoes is drawn as a print plate.

**Tech-tree reuse.** The zodiac band around the outermost orbit becomes the skill ring. Each skill family is a segment of the band, sized by how many quests use it. Hovering a segment draws tangent lines from it to every planet that uses that skill, so a shared skill is drawn as one band segment feeding several orbits. Prerequisites (skill X first used in quest N, then reused later) appear as a small arrow along the band in date order. Trigger-style unlocks ("Shipped a platform rewrite") are written on the band in italic in place of a cost.

### Direction B: "Cluster Atlas" (Burritt, Bode and Bayer)

**Layout.** A set of atlas plates (pages), each one an ME zoom level. Plate I is the galaxy: the whole career as one celestial chart with eras as constellation regions. Plate II and onward are cluster plates, one per era (for example "Consulting Verge" or "Platform Nebula", named in ME's two-word style). Each plate has a graticule frame: years run along the declination axis and the hours of a 24-hour clock mark the months.

**Mapping.**
- Eras (groups of roles that belong together) = constellations with dotted Bode-style boundaries.
- Roles = stars with Bayer letters inside their era (alpha = the lead role of the era).
- Star magnitude = tenure, with a Burritt-style "Scale of Magnitudes" key in the margin.
- Relays = dashed great-circle arcs between constellations, each labeled with the date of the move. A primary relay is a move to a new kind of work, a secondary relay a move within the same kind (the two-tier relay network). The relay glyph sits at each arc's departure point.
- Crew = small named stars just outside the star of the role, joined by a fine dotted line, as companion stars are drawn.
- Next research = an empty magnitude ring in uncharted space past the last boundary, labeled "Next research: ?" and "Terra incognita".

**Interaction.** Plates turn like pages (CSS 3D transform on the page, or a simple crossfade). Clicking a constellation opens its cluster plate. Clicking a star opens a codex column in the margin, split into "Primary" (the role) and "Secondary" (its accomplishments). Pan and zoom happen within a plate by changing the SVG `viewBox`. The map keeps a small "You are here" relay glyph on the current role.

**Palette and fonts.**
- Aged-paper atlas: paper `#EDE6D6`, ink `#1E3557` (dark Prussian blue), a hand-color wash `#9DB7D5` at about 35% opacity inside constellation boundaries, and a faded vermilion `#B5523B` used only for the Bayer letters and relay dates (the printer's red of old atlases).
- Fonts: **Libre Caslon Display** for plate titles, **Libre Caslon Text** for labels, **Cormorant SC** for constellation names, **Cormorant Garamond** italic for the codex.

**How it avoids HUD.** Light paper ground, ink lines and watercolor wash. The structure is a printed atlas, not a screen. Labels follow printing conventions (letter-spaced small caps along curves via `textPath`). No interface chrome: the controls are the plate number and the page edge.

**Tech-tree reuse.** Constellation figure lines are the skill dependency graph. Within each plate, stick-figure lines join roles that share a skill. Across plates, the same skill shows up as the same named asterism, so hovering "Architecture" lights its figure on every plate where it appears. The "Unlocks" list from Factorio becomes a small table in the margin of each plate: "Skills first charted here" and "Skills carried in".

### Direction C: "Platform Schedule" (Factorio Space Age crossed with a comparative-planets plate)

**Layout.** A horizontal route strip across the top: the five-planet Space Age route turned into a career line. Each role is a planet drawn at its comparative size along one baseline, in the style of the 19th-century "comparative size of the planets" charts. Space connections between planets carry distances, but the distances are years. Under the strip is a research tree: engraved tech cards, one column per era, with right-angled connector lines.

**Mapping.**
- Roles = planets in date order along the route. Planet size = scope. Side projects are small space platforms "in orbit of" the planet they overlapped.
- Relay jumps = space connections, each labeled with the move date and gap length ("2019 · 0.0 yr").
- The train-style schedule is the tooltip: each stop lists its wait conditions as achievements ("until platform shipped", "for 3.1 yr").
- Crew = names in the platform's "Crew" line on each stop, set like the hub inventory.
- Next research = the last tech card, in the available state, with an "?" icon and a "Next research: ?" title. Its cost band shows which skill families it would need, which turns the open question into a statement of what Zo wants to do next.

**Interaction.** The route strip scrolls horizontally, and selecting a planet scrolls the tree beneath it to that era. Clicking a tech card centers it, Factorio style: prerequisites above, techs it unlocks below, and a detail panel with "Unlocks" (learnings from `accomplishments[].learnings`) and a cost band. A search box finds a skill and highlights every card that uses it.

**Palette and fonts.**
- Engraved card stock: paper `#D9E2EC` (blue-grey), ink `#13294B` (navy), and card states as three ink fills instead of Factorio's green, yellow and red: researched `#2E5C8A` solid, available outline with a stipple fill, blocked a 30% wash.
- Science-pack colors appear only as small chips in the cost band, desaturated about 40%.
- Fonts: **Spectral** and **Spectral SC** for cards and labels, **Titillium Web** used once, at small size, for the cost band only (Factorio's UI face, as a hidden quote).

**How it avoids HUD.** It draws on transit maps and printed charts, not screens. The tech cards are engraved cartouches, not beveled panels. The pack colors are tiny chips, never glows. It is the only direction that uses a sans, and only in one place.

**Tech-tree reuse.** This direction is the tech tree. Skills are tech cards. A skill's prerequisite is the first quest that used it, and the quests that reused it are its dependents, which is the same "first appears, then reused" logic as the factory lanes in `utils/factoryModel.ts` (`FactoryLane.stops`, `recipe[].shared`). Pack colors stand for skill families: red for fundamentals, green for delivery and logistics, blue for architecture, purple for scale and operations, yellow for leadership, white for strategy. Trigger technologies cover skills earned by an event, not by tenure.

---

## Section 6. The skill-family mapping shared by the album and the site

To make the album and site read as one family, both use the same mapping of science colors to skill families:

| Pack | Skill family |
|---|---|
| Red (automation) | engineering fundamentals |
| Green (logistic) | delivery and process |
| Blue (chemical) | architecture |
| Purple (production) | scale and platforms |
| Yellow (utility) | leadership and mentorship |
| White (space) | strategy |
| Grey (military) | not used, or for security work |

The album's registration strip and the site's cost bands then share one key.

---

## Sources

- [Nexus Mods: ME Legendary Edition font notes (BioMass, Tigensu, Myriad Pro)](https://nexusmods.com/masseffectlegendaryedition/mods/1070)
- [Made Good Designs: What font does Mass Effect use?](https://madegooddesigns.com/mass-effect-font/)
- [Dark Horse: Interview with Derek Watts, art director of Mass Effect](https://www.darkhorse.com/newsfeed/interview-derek-watts-art-director-mass-effect/)
- [GameBanshee: Mass Effect's art inspired by the Final Fantasy movie](https://gamebanshee.com/kak38)
- [That Game SUX: ME2's galaxy map offers information when you need it](https://www.thatgamesux.com/mass-effect-2s-galaxy-map-offers-information-when-you-need-it)
- [Prima Games: Mass Effect eGuide, galaxy map routes](https://primagames.com/eguides/mass-effect-pc-eguide/walkthrough/chapter-2-finding-liara/objective-1-locate-the-planet-with-ruins)
- [Game Developer: A heuristic analysis of Mass Effect 2 (scan screen)](https://gamedeveloper.com/design/an-actual-heuristic-analysis-of-mass-effect-2)
- [GameBanshee: ME2 interview (planet scanning)](https://www.gamebanshee.com/k3ffc)
- [Factorio wiki: Science pack](https://wiki.factorio.com/Science_pack)
- [Factorio wiki: Technologies](https://wiki.factorio.com/Technologies)
- [Factorio: Friday Facts 373, Space Age](https://cf-www.factorio.com/blog/post/fff-373)
- [Factorio forums: Friday Facts 238, the GUI update part II](https://forums.factorio.com/59598)
- [Factorio forums: Tech tree background colors](https://forums.factorio.com/viewtopic.php?p=117071)
- [Bryars and Bryars: Doppelmayr, Copernicus' orbits](https://bryarsandbryars.co.uk/products/doppelmayr-copernicus-kepler-s-orbits-of-the-major-planets)
- [Crouch Rare Books: Doppelmayr, an encyclopedic atlas of everything astronomical](https://crouchrarebooks.com/browse/an-encyclopedic-atlas-of-everything-astronomical/)
- [Utrecht University: Doppelmayr's Atlas Coelestis](https://webspace.science.uu.nl/~gent0113/doppelmayr/doppelmayr_atlas_coelestis.htm)
- [George Glazer: Asa Smith, Illustrated Astronomy](https://www.georgeglazer.com/wpmain/?p=3382)
- [Philadelphia Print Shop: Asa Smith plates](https://philaprintshop.com/products/smith-asa-comets)
- [CT Collections: Burritt, Atlas designed to illustrate the geography of the heavens](https://ctcollections.org/index.php/Detail/objects/40642)
- [Old World Auctions: Burritt atlas lot](https://oldworldauctions.com/catalog/lot/154/39)
