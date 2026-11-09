// Every overlay in this folder must still match the shared resume data. A change on main that
// renames or removes an accomplishment key an overlay uses fails here, not in a package build.
import fs from 'fs';
import path from 'path';
import { baseQuests } from '../quests.data';
import { coreCompetencies, professionalSummary } from '../profile.data';
import { activeTailoring, tailorProfile, tailorQuests } from './index';
import type { Tailoring } from './types';

const overlayFiles = fs
  .readdirSync(__dirname)
  .filter((f) => /^[a-z0-9-]+\.ts$/.test(f) && f !== 'index.ts' && f !== 'types.ts');

const loadOverlay = (file: string): Tailoring => require(path.join(__dirname, file)).default;

describe('resume data keys', () => {
  it('gives every accomplishment a key that is unique within its quest', () => {
    baseQuests.forEach((quest) => {
      const keys = quest.accomplishments.map((a) => a.key);
      keys.forEach((k) => expect(k).toMatch(/^[a-z0-9-]+$/));
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});

describe('without REACT_APP_TAILORING', () => {
  it('applies no overlay, so the live site is untailored', () => {
    expect(activeTailoring).toBeNull();
  });
});

describe.each(overlayFiles)('overlay %s', (file) => {
  const overlay = loadOverlay(file);

  it('has an id that matches its file name', () => {
    expect(overlay.id).toBe(file.replace(/\.ts$/, ''));
  });

  it('applies to the quests without unknown references', () => {
    expect(() => tailorQuests(baseQuests, overlay)).not.toThrow();
  });

  it('keeps every accomplishment, only reordered or reworded', () => {
    const tailored = tailorQuests(baseQuests, overlay);
    tailored.forEach((quest, i) => {
      const before = baseQuests[i].accomplishments.map((a) => a.key).sort();
      expect(quest.accomplishments.map((a) => a.key).sort()).toEqual(before);
    });
  });

  it('puts listed keys first, in the listed order', () => {
    const tailored = tailorQuests(baseQuests, overlay);
    Object.entries(overlay.quests ?? {}).forEach(([id, patch]) => {
      if (!patch.order) return;
      const quest = tailored.find((q) => q.id === Number(id))!;
      expect(quest.accomplishments.slice(0, patch.order.length).map((a) => a.key)).toEqual(patch.order);
    });
  });

  it('applies to the profile without unknown competencies', () => {
    expect(() => tailorProfile({ professionalSummary, coreCompetencies }, overlay)).not.toThrow();
  });
});

describe('validation', () => {
  it('rejects an overlay that names a missing key', () => {
    const bad: Tailoring = { id: 'bad', company: 'x', role: 'y', quests: { 1: { order: ['no-such-key'] } } };
    expect(() => tailorQuests(baseQuests, bad)).toThrow(/unknown key "no-such-key"/);
  });

  it('rejects an overlay that names a missing quest', () => {
    const bad: Tailoring = { id: 'bad', company: 'x', role: 'y', quests: { 999: { description: 'z' } } };
    expect(() => tailorQuests(baseQuests, bad)).toThrow(/quest 999 does not exist/);
  });
});
