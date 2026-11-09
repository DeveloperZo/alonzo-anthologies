import quests from '../data/quests.data';
import { buildFactory, neighbours, questLinks } from './factoryModel';

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

test('each recipe lists every tag the quest is made of, one colour per item', () => {
  model.machines.forEach((m) => {
    const q = quests.find((x) => x.id === m.questId)!;
    expect(m.recipe.map((r) => r.tag)).toEqual(q.tags ?? []);
  });
  const colorByItem = new Map<string, string>();
  model.machines.flatMap((m) => m.recipe).forEach((r) => {
    expect(colorByItem.get(r.item) ?? r.color).toBe(r.color);
    colorByItem.set(r.item, r.color);
  });
  expect(new Set(colorByItem.values()).size).toBe(colorByItem.size);
  model.lanes
    .filter((l) => l.kind === 'skill')
    .forEach((l) => expect(colorByItem.get(l.item)).toBe(l.color));
});

test('totals match the quest data', () => {
  const products = quests.reduce((n, q) => n + q.accomplishments.length, 0);
  expect(model.totals.products).toBe(products);
});

describe('questLinks', () => {
  const links = (id: number) => questLinks(model, id);

  test('the first holder of an item has nothing before it', () => {
    const arch = links(2).find((l) => l.item === 'Architecture')!;
    expect(arch.from).toEqual([]);
    expect(arch.to.map((s) => s.questId)).toEqual([8, 1]);
  });

  test('a later holder sees where the item came from and still keeps its own tag', () => {
    const arch = links(8).find((l) => l.item === 'Architecture')!;
    expect(arch.tag).toBe('Software Architecture');
    expect(arch.from.map((s) => s.questId)).toEqual([2]);
    expect(arch.to.map((s) => s.questId)).toEqual([1]);
    const lead = links(12).find((l) => l.item === 'Leadership')!;
    expect(lead.tag).toBe('Technical Leadership');
  });

  test('quests that share nothing get links with empty from and to', () => {
    [5, 10].forEach((id) => {
      expect(links(id).length).toBeGreaterThan(0);
      links(id).forEach((l) => {
        expect(l.shared).toBe(false);
        expect(l.from).toEqual([]);
        expect(l.to).toEqual([]);
      });
    });
  });

  test('a quest never links to itself', () => {
    model.machines.forEach((m) =>
      links(m.questId).forEach((l) =>
        [...l.from, ...l.to].forEach((s) => expect(s.questId).not.toBe(m.questId)),
      ),
    );
  });

  test('neighbours follow the floor and stop at the ends', () => {
    const first = model.machines[0].questId;
    const last = model.machines[model.machines.length - 1].questId;
    expect(neighbours(model, first).prev).toBeUndefined();
    expect(neighbours(model, last).next).toBeUndefined();
    expect(neighbours(model, 4).next?.questId).toBe(model.machines[model.machines.findIndex((m) => m.questId === 4) + 1].questId);
  });
});

test('building the factory does not reorder the shared quests array', () => {
  const before = quests.map((q) => q.id);
  buildFactory(quests);
  expect(quests.map((q) => q.id)).toEqual(before);
});
