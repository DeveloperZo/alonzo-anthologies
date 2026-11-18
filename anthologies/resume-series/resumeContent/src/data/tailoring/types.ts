// src/data/tailoring/types.ts
// Shape of a company tailoring overlay: resumeContent/src/data/tailoring/<id>.ts
//
// An overlay changes what the resume says for one application without editing the shared
// data files. It only takes effect when the build sets REACT_APP_TAILORING=<id>, which the
// package command does. The live site never sets it, so overlays can live on main safely.

export interface AccomplishmentPatch {
  description?: string;
  learnings?: string[];
}

export interface QuestTailoring {
  description?: string;
  summary?: string;
  tags?: string[];
  /**
   * Accomplishment keys in the order to show them. Keys not listed keep their
   * original relative order after the listed ones.
   */
  order?: string[];
  /** Per-accomplishment wording changes, by key. */
  accomplishments?: Record<string, AccomplishmentPatch>;
}

export interface ProfileTailoring {
  /** Printed under the name on the resume. */
  targetRole?: string;
  professionalSummary?: string;
  /** Competency body text by competency title. */
  competencies?: Record<string, string>;
}

export interface Tailoring {
  /** Matches the file name and the REACT_APP_TAILORING value, e.g. "gtreasury". */
  id: string;
  company: string;
  role: string;
  profile?: ProfileTailoring;
  /** Changes by quest id. */
  quests?: Record<number, QuestTailoring>;
}
