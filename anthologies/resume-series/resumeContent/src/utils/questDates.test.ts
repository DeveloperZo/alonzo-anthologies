import quests from '../data/quests.data';
import {
  formatDurationLong,
  formatDurationShort,
  formatMonthYear,
  isOngoing,
  monthsBetween,
} from './questDates';

const lendr = quests.find((q) => q.id === 4)!;

// Run with TZ=America/Chicago to prove the month does not slip back.
test('Lendr reads October 2018 to February 2020 in any time zone', () => {
  expect(formatMonthYear(lendr.startDate)).toBe('October 2018');
  expect(formatMonthYear(lendr.endDate)).toBe('February 2020');
  expect(formatMonthYear(lendr.startDate, 'short')).toBe('Oct 2018');
});

test('tenure counts whole calendar months', () => {
  expect(monthsBetween(lendr.startDate, lendr.endDate)).toBe(16);
  expect(formatDurationLong(16)).toBe('1 year, 4 months');
  expect(formatDurationShort(16)).toBe('1y 4m');
  expect(formatDurationShort(50)).toBe('4y 2m');
  expect(formatDurationShort(4)).toBe('4m');
});

test('ongoing quests run to today', () => {
  const progyny = quests.find((q) => q.id === 1)!;
  expect(isOngoing(progyny.endDate)).toBe(true);
  expect(isOngoing(lendr.endDate)).toBe(false);
  const now = new Date(Date.UTC(2026, 10, 15));
  expect(monthsBetween(progyny.startDate, progyny.endDate, now)).toBe(18);
});
