import quests from '../data/quests.data';
import { buildFactory } from './factoryModel';

const model = buildFactory(quests);
const lane = (item: string) => model.lanes.find((l) => l.item === item);

test('one machine per quest, left to right by start date', () => {
  expect(model.machines).toHaveLength(quests.length);
  const starts = model.machines.map(
    (m) => quests.find((q) => q.id === m.questId)!.startDate.getTime(),
  );
  expect(starts).toEqual([...starts].sort((a, b) => a - b));
  const xs = model.machines.map((m) => m.x);
  expect(xs).toEqual([...xs].sort((a, b) => a - b));
});

test('career and education sit above the bus, side work below', () => {
  model.machines.forEach((m) => {
    const q = quests.find((x) => x.id === m.questId)!;
    const above = q.type === 'career' || q.type === 'education';
    expect(m.row).toBe(above ? 'main' : 'side');
  });
  const busTop = Math.min(...model.lanes.map((l) => l.y));
  const busBottom = Math.max(...model.lanes.map((l) => l.y));
  model.machines.forEach((m) => {
    if (m.row === 'main') expect(m.y + m.h).toBeLessThan(busTop);
    else expect(m.y).toBeGreaterThan(busBottom);
  });
});

test('Lendr feeds the hedge fund consult on two belts', () => {
  ['Performance Optimization', 'Technical Strategy'].forEach((item) => {
    expect(lane(item)?.stops.map((s) => s.questId)).toEqual([4, 11]);
  });
});

test('tag families merge into one belt and keep the original tag', () => {
  const arch = lane('Architecture')!;
  expect(arch.stops.map((s) => s.questId)).toEqual([2, 8, 1]);
  expect(arch.stops.find((s) => s.questId === 1)?.tag).toBe('Platform Architecture');
  expect(lane('Platform Architecture')).toBeUndefined();
});

test('tags held by one quest get no belt', () => {
  expect(lane('Biotech')).toBeUndefined();
  model.lanes
    .filter((l) => l.kind === 'skill')
    .forEach((l) => expect(l.stops.length).toBeGreaterThanOrEqual(2));
});

test('every route stays inside the floor', () => {
  model.routes.forEach((r) => {
    const nums = r.d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    nums.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(Math.max(model.width, model.height));
    });
  });
});

test('totals match the quest data', () => {
  const products = quests.reduce((n, q) => n + q.accomplishments.length, 0);
  expect(model.totals.products).toBe(products);
});
