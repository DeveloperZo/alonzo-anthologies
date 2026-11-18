// src/data/tailoring/index.ts
// Loads the overlay named by REACT_APP_TAILORING and applies it to the shared resume data.
// No variable set (the live site, tests, local dev) means no overlay and the data is unchanged.
import type { Quest } from '../quests.data';
import type { Tailoring } from './types';

export type { Tailoring } from './types';

interface Competency {
  title: string;
  body: string;
}

interface Profile {
  professionalSummary: string;
  coreCompetencies: Competency[];
  targetRole?: string;
}

const activeId = (process.env.REACT_APP_TAILORING || '').trim();

// Overlay files are discovered with webpack's require.context, so adding a company only adds a
// file. Jest has no require.context, so tests always run against the untailored data.
function loadOverlays(): Record<string, Tailoring> {
  // webpack only resolves require.context when it is called literally, so it stays inline here.
  // Under Jest it does not exist, the call throws, and no overlays load.
  let req: any;
  try {
    // @ts-ignore: require.context is injected by webpack and has no type in this project
    req = require.context('./', false, /^\.\/(?!index|types)[a-z0-9-]+\.ts$/);
  } catch {
    return {};
  }
  const found: Record<string, Tailoring> = {};
  req.keys().forEach((path: string) => {
    const overlay: Tailoring = req(path).default;
    found[overlay.id] = overlay;
  });
  return found;
}

function resolveActive(): Tailoring | null {
  if (!activeId) return null;
  const overlay = loadOverlays()[activeId];
  if (!overlay) {
    throw new Error(`REACT_APP_TAILORING="${activeId}" but no overlay with that id exists in src/data/tailoring/.`);
  }
  return overlay;
}

export const activeTailoring: Tailoring | null = resolveActive();

/** Applies an overlay to quests. Throws on any reference to a quest or key that does not exist. */
export function tailorQuests(quests: Quest[], overlay: Tailoring | null): Quest[] {
  if (!overlay?.quests) return quests;
  const problems: string[] = [];
  const byId = new Map(quests.map((q) => [q.id, q]));
  Object.keys(overlay.quests).forEach((id) => {
    if (!byId.has(Number(id))) problems.push(`quest ${id} does not exist`);
  });

  const result = quests.map((quest) => {
    const patch = overlay.quests![quest.id];
    if (!patch) return quest;
    const keys = new Set(quest.accomplishments.map((a) => a.key));
    const label = `quest ${quest.id} (${quest.company ?? quest.workTitle})`;
    (patch.order ?? []).forEach((k) => keys.has(k) || problems.push(`${label}: order lists unknown key "${k}"`));
    Object.keys(patch.accomplishments ?? {}).forEach((k) => keys.has(k) || problems.push(`${label}: patch for unknown key "${k}"`));

    let accomplishments = quest.accomplishments.map((a) => ({ ...a, ...(patch.accomplishments?.[a.key] ?? {}) }));
    if (patch.order?.length) {
      const rank = new Map(patch.order.map((k, i) => [k, i]));
      accomplishments = accomplishments
        .map((a, i) => ({ a, i }))
        .sort((x, y) => (rank.get(x.a.key) ?? patch.order!.length + x.i) - (rank.get(y.a.key) ?? patch.order!.length + y.i))
        .map(({ a }) => a);
    }
    return {
      ...quest,
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
      ...(patch.tags !== undefined ? { tags: patch.tags } : {}),
      accomplishments,
    };
  });

  if (problems.length) {
    throw new Error(`Tailoring overlay "${overlay.id}" does not match the resume data:\n- ${problems.join('\n- ')}`);
  }
  return result;
}

/** Applies an overlay to the profile. Throws on a competency title that does not exist. */
export function tailorProfile(profile: Profile, overlay: Tailoring | null): Profile {
  const patch = overlay?.profile;
  if (!patch) return profile;
  const titles = new Set(profile.coreCompetencies.map((c) => c.title));
  const unknown = Object.keys(patch.competencies ?? {}).filter((t) => !titles.has(t));
  if (unknown.length) {
    throw new Error(`Tailoring overlay "${overlay!.id}" names unknown competencies: ${unknown.join(', ')}`);
  }
  return {
    professionalSummary: patch.professionalSummary ?? profile.professionalSummary,
    coreCompetencies: profile.coreCompetencies.map((c) => ({ ...c, body: patch.competencies?.[c.title] ?? c.body })),
    targetRole: patch.targetRole ?? profile.targetRole,
  };
}

export const applyQuestTailoring = (quests: Quest[]): Quest[] => tailorQuests(quests, activeTailoring);
export const applyProfileTailoring = (profile: Profile): Profile => tailorProfile(profile, activeTailoring);
