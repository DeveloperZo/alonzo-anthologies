// src/data/factory.data.ts
// Settings for the play-mode career factory (components/Factory).
// The layout itself is computed from quests.data.tsx by utils/factoryModel.ts.

// Tag families. Quests tag the same skill under slightly different names, and
// a belt only appears when two quests share an item. Each key is a tag as it is
// written in quests.data.tsx; the value is the item it travels as on the bus.
// Keep this list short and obvious. The inspector still shows the original tag.
export const itemFamilies: Record<string, string> = {
  'Platform Architecture': 'Architecture',
  'Software Architecture': 'Architecture',
  'Technical Leadership': 'Leadership',
};

// Short machine names. The factory floor has no room for full titles, and the
// printed-resume rules apply here too: no client or product names for the
// independent engagements or the side projects.
export const machineNames: Record<number, string> = {
  1: 'Progyny',
  2: 'Inspire11',
  3: 'Productive Edge',
  4: 'Lendr',
  5: 'SWC',
  6: 'Manor',
  7: 'Boeing',
  8: 'Side projects',
  10: 'CSUF',
  11: 'Hedge fund consult',
  12: 'Biotech startup',
};

// Framing from career-as-system-v1.md: problems flow in from the left, are
// turned into reusable structure, and leave as shipped systems on the right.
export const factoryLabels = {
  title: 'The Leverage Works',
  ore: 'Hard problems',
  oreSub: 'new domains, mentors',
  products: 'Accomplishments',
  science: 'Learnings',
  silo: 'Rocket silo',
  siloSub: 'shipped systems',
  lab: 'Research lab',
  labSub: 'learnings',
};
