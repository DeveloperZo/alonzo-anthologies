// src/utils/questDates.ts
// One place to read quest dates. Dates in quests.data.tsx are mostly written as
// 'YYYY-MM-DD' strings, which JavaScript reads as midnight UTC. Reading them
// with local getters shows the previous month in US time zones, so every view
// reads the UTC calendar month, the same way the printed resume always has.

// Ongoing quests carry a far-future end date (2038).
export const ONGOING_FROM_YEAR = 2030;

export const isOngoing = (end: Date): boolean => end.getUTCFullYear() >= ONGOING_FROM_YEAR;

export const formatMonthYear = (date: Date, month: 'long' | 'short' = 'long'): string =>
  date.toLocaleDateString('en-US', { month, year: 'numeric', timeZone: 'UTC' });

// Whole calendar months from start to end (or to today for ongoing quests).
export const monthsBetween = (start: Date, end: Date, now: Date = new Date()): number => {
  const until = isOngoing(end) ? now : end;
  const months =
    (until.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (until.getUTCMonth() - start.getUTCMonth());
  return Math.max(0, months);
};

// "4 years, 2 months" style.
export const formatDurationLong = (months: number): string => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (rest > 0) parts.push(`${rest} month${rest > 1 ? 's' : ''}`);
  return parts.length ? parts.join(', ') : 'Less than a month';
};

// "4y 2m" style.
export const formatDurationShort = (months: number): string => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}m`;
  return rest === 0 ? `${years}y` : `${years}y ${rest}m`;
};
