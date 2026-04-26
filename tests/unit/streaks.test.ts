import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../src/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2023-10-10')).toBe(0);
  });
  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2023-10-09'], '2023-10-10')).toBe(0);
  });
  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak(['2023-10-10', '2023-10-09'], '2023-10-10')).toBe(2);
  });
  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak(['2023-10-10', '2023-10-10'], '2023-10-10')).toBe(1);
  });
  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2023-10-10', '2023-10-08'], '2023-10-10')).toBe(1);
  });
});
