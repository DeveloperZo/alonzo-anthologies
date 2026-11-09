// src/utils/factoryModel.ts
// Turns the quest list into a factory floor: one machine per quest, a main bus
// of belts, an ore field feeding it and a silo and lab draining it. Pure layout
// math, no React, so it can be tested on its own (factoryModel.test.ts).
import { Quest } from '../data/quests.data';
import { itemFamilies, machineNames } from '../data/factory.data';

export type LaneKind = 'ore' | 'skill' | 'products' | 'science';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FactoryMachine extends Box {
  questId: number;
  name: string;
  retroTitle: string;
  role: string;
  row: 'main' | 'side';
  startYear: number;
  endLabel: string;
  products: number;
  science: number;
  // Every tag on the quest: what this entry is made of. `shared` marks the
  // ingredients that also ride a belt to or from another quest.
  recipe: { tag: string; item: string; shared: boolean; color: string }[];
}

export interface LaneStop {
  questId: number;
  name: string;
  year: number;
  tag: string;
}

export interface FactoryLane {
  id: string;
  kind: LaneKind;
  item: string;
  color: string;
  y: number;
  x1: number;
  x2: number;
  // Skill lanes only: where the item first appears and every quest that reuses it.
  stops: LaneStop[];
}

export interface FactoryTap {
  laneId: string;
  x: number;
  y1: number;
  y2: number;
  // True where the tap feeds the lane, false where it takes from it.
  output: boolean;
}

export interface FactoryRoute {
  id: string;
  laneId: string;
  kind: LaneKind;
  d: string;
  itemCount: number;
}

export interface FactoryModel {
  width: number;
  height: number;
  machines: FactoryMachine[];
  lanes: FactoryLane[];
  taps: FactoryTap[];
  routes: FactoryRoute[];
  ore: Box;
  silo: Box;
  lab: Box;
  totals: { products: number; science: number };
}

const COL_W = 170;
const MACHINE_W = 120;
const MACHINE_H = 90;
const FIRST_X = 210;
const TOP_Y = 50;
const BUS_GAP = 55;
const LANE_GAP = 20;
const ONGOING_YEAR = 2030;

const SKILL_COLORS = [
  '#4fc3f7', '#ff8a65', '#aed581', '#ba68c8', '#ffd54f',
  '#4db6ac', '#f06292', '#90a4ae', '#dce775', '#7986cb',
];
const ORE_COLOR = '#c8915a';
const PRODUCT_COLOR = '#e0e0e0';
const SCIENCE_COLOR = '#ef5350';

export const itemFor = (tag: string): string => itemFamilies[tag] ?? tag;

const machineRow = (q: Quest): 'main' | 'side' =>
  q.type === 'career' || q.type === 'education' ? 'main' : 'side';

const clampCount = (n: number) => Math.max(1, Math.min(4, Math.ceil(n / 2)));

export function buildFactory(quests: Quest[]): FactoryModel {
  const ordered = [...quests].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime() || a.id - b.id,
  );

  // Items shared by two or more quests become skill lanes. The producer is the
  // earliest quest carrying the item.
  const holders = new Map<string, Quest[]>();
  ordered.forEach((q) => {
    const seen = new Set<string>();
    (q.tags ?? []).forEach((tag) => {
      const item = itemFor(tag);
      if (seen.has(item)) return;
      seen.add(item);
      holders.set(item, [...(holders.get(item) ?? []), q]);
    });
  });
  const sharedItems = Array.from(holders.entries())
    .filter(([, qs]) => qs.length >= 2)
    .sort(
      ([ia, qa], [ib, qb]) =>
        ordered.indexOf(qa[0]) - ordered.indexOf(qb[0]) || ia.localeCompare(ib),
    );

  // One colour per item. Shared items take the bright belt palette; items held
  // by a single quest get a muted colour of their own, so every recipe chip on
  // the floor is distinct and a machine's mix of ingredients is visible at a glance.
  const itemColors = new Map<string, string>();
  sharedItems.forEach(([item], k) => itemColors.set(item, SKILL_COLORS[k % SKILL_COLORS.length]));
  let soloIndex = 0;
  holders.forEach((qs, item) => {
    if (itemColors.has(item)) return;
    const hue = Math.round((soloIndex * 137.5) % 360);
    soloIndex += 1;
    itemColors.set(item, `hsl(${hue}, 30%, 52%)`);
  });

  const laneCount = sharedItems.length + 3;
  const busY = TOP_Y + MACHINE_H + BUS_GAP;
  const laneY = (i: number) => busY + i * LANE_GAP;
  const sideY = laneY(laneCount - 1) + BUS_GAP;

  const machines: FactoryMachine[] = ordered.map((q, i) => {
    const row = machineRow(q);
    const ongoing = q.endDate.getFullYear() > ONGOING_YEAR;
    const tags = q.tags ?? [];
    return {
      questId: q.id,
      name: machineNames[q.id] ?? q.company ?? q.workTitle,
      retroTitle: q.titles.retro,
      role: q.workTitle,
      row,
      x: FIRST_X + i * COL_W,
      y: row === 'main' ? TOP_Y : sideY,
      w: MACHINE_W,
      h: MACHINE_H,
      startYear: q.startDate.getFullYear(),
      endLabel: ongoing ? 'now' : String(q.endDate.getFullYear()),
      products: q.accomplishments.length,
      science: q.accomplishments.reduce((n, a) => n + a.learnings.length, 0),
      recipe: tags.map((tag) => {
        const item = itemFor(tag);
        return {
          tag,
          item,
          shared: (holders.get(item)?.length ?? 0) >= 2,
          color: itemColors.get(item)!,
        };
      }),
    };
  });
  const byQuest = new Map(machines.map((m) => [m.questId, m]));

  const lastRight = machines[machines.length - 1].x + MACHINE_W;
  const ore: Box = { x: 30, y: laneY(0) - 45, w: 140, h: 90 };
  const silo: Box = { x: lastRight + 70, y: TOP_Y, w: 130, h: MACHINE_H };
  const lab: Box = { x: lastRight + 70, y: sideY, w: 130, h: MACHINE_H };

  // Each lane gets its own x offset inside every machine, so taps never overlap.
  const spread = Math.min(9, (MACHINE_W - 20) / Math.max(1, laneCount - 1));
  const tapX = (box: Box, laneIndex: number) =>
    box.x + box.w / 2 + (laneIndex - (laneCount - 1) / 2) * spread;
  const port = (m: FactoryMachine) => (m.row === 'main' ? m.y + m.h : m.y);

  const lanes: FactoryLane[] = [];
  const taps: FactoryTap[] = [];
  const routes: FactoryRoute[] = [];

  // Lane 0: raw ore into every machine.
  const oreY = laneY(0);
  lanes.push({
    id: 'ore', kind: 'ore', item: 'Hard problems', color: ORE_COLOR,
    y: oreY, x1: ore.x + ore.w,
    x2: Math.max(...machines.map((m) => tapX(m, 0))), stops: [],
  });
  machines.forEach((m) => {
    const x = tapX(m, 0);
    taps.push({ laneId: 'ore', x, y1: port(m), y2: oreY, output: false });
    routes.push({
      id: `ore-${m.questId}`, laneId: 'ore', kind: 'ore', itemCount: 2,
      d: `M ${ore.x + ore.w} ${oreY} H ${x} V ${port(m)}`,
    });
  });

  // Skill lanes.
  sharedItems.forEach(([item, qs], k) => {
    const laneIndex = k + 1;
    const id = `skill-${k}`;
    const y = laneY(laneIndex);
    const members = qs.map((q) => byQuest.get(q.id)!);
    const xs = members.map((m) => tapX(m, laneIndex));
    lanes.push({
      id, kind: 'skill', item, color: itemColors.get(item)!,
      y, x1: Math.min(...xs), x2: Math.max(...xs),
      stops: qs.map((q) => ({
        questId: q.id,
        name: byQuest.get(q.id)!.name,
        year: q.startDate.getFullYear(),
        tag: (q.tags ?? []).find((t) => itemFor(t) === item) ?? item,
      })),
    });
    const [producer, ...consumers] = members;
    taps.push({ laneId: id, x: xs[0], y1: port(producer), y2: y, output: true });
    consumers.forEach((c, j) => {
      const cx = xs[j + 1];
      taps.push({ laneId: id, x: cx, y1: port(c), y2: y, output: false });
      routes.push({
        id: `${id}-${c.questId}`, laneId: id, kind: 'skill', itemCount: 2,
        d: `M ${xs[0]} ${port(producer)} V ${y} H ${cx} V ${port(c)}`,
      });
    });
  });

  // Outputs: accomplishments to the silo, learnings to the lab.
  const sinks: [LaneKind, string, string, Box, number][] = [
    ['products', 'Accomplishments', PRODUCT_COLOR, silo, laneCount - 2],
    ['science', 'Learnings', SCIENCE_COLOR, lab, laneCount - 1],
  ];
  sinks.forEach(([kind, item, color, box, laneIndex]) => {
    const y = laneY(laneIndex);
    const sinkX = box.x + box.w / 2;
    const sinkPort = box === silo ? box.y + box.h : box.y;
    const makers = machines.filter((m) => (kind === 'products' ? m.products : m.science) > 0);
    lanes.push({
      id: kind, kind, item, color, y,
      x1: Math.min(...makers.map((m) => tapX(m, laneIndex))), x2: sinkX, stops: [],
    });
    taps.push({ laneId: kind, x: sinkX, y1: sinkPort, y2: y, output: false });
    makers.forEach((m) => {
      const x = tapX(m, laneIndex);
      taps.push({ laneId: kind, x, y1: port(m), y2: y, output: true });
      routes.push({
        id: `${kind}-${m.questId}`, laneId: kind, kind,
        itemCount: clampCount(kind === 'products' ? m.products : m.science),
        d: `M ${x} ${port(m)} V ${y} H ${sinkX} V ${sinkPort}`,
      });
    });
  });

  return {
    width: silo.x + silo.w + 40,
    height: sideY + MACHINE_H + 40,
    machines, lanes, taps, routes, ore, silo, lab,
    totals: {
      products: machines.reduce((n, m) => n + m.products, 0),
      science: machines.reduce((n, m) => n + m.science, 0),
    },
  };
}

// ---------- per-quest views for the detail page ----------

export interface IngredientLink {
  tag: string;
  item: string;
  color: string;
  shared: boolean;
  // Quests that carried this item before this one, oldest first.
  from: LaneStop[];
  // Quests that carried it after this one, oldest first.
  to: LaneStop[];
}

// What a quest is made of, and where each shared ingredient came from and went.
// A quest never appears in its own from or to list.
export function questLinks(model: FactoryModel, questId: number): IngredientLink[] {
  const machine = model.machines.find((m) => m.questId === questId);
  if (!machine) return [];
  return machine.recipe.map((r) => {
    const lane = model.lanes.find((l) => l.kind === 'skill' && l.item === r.item);
    const stops = lane?.stops ?? [];
    const self = stops.findIndex((s) => s.questId === questId);
    return {
      ...r,
      from: self < 0 ? [] : stops.slice(0, self),
      to: self < 0 ? [] : stops.slice(self + 1),
    };
  });
}

// The machines either side of a quest on the floor (date order).
export function neighbours(model: FactoryModel, questId: number) {
  const i = model.machines.findIndex((m) => m.questId === questId);
  return {
    prev: i > 0 ? model.machines[i - 1] : undefined,
    next: i >= 0 && i < model.machines.length - 1 ? model.machines[i + 1] : undefined,
  };
}
