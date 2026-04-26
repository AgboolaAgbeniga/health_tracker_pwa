import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../../src/lib/streaks';

describe('calculateStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateStreak([], '2023-10-10')).toBe(0);
  });
  
  it('returns 0 when neither today nor yesterday is completed', () => {
    expect(calculateStreak(['2023-10-08'], '2023-10-10')).toBe(0);
  });

  it('returns 1 when only today is completed', () => {
    expect(calculateStreak(['2023-10-10'], '2023-10-10')).toBe(1);
  });

  it('continues streak if yesterday was completed but today is not yet', () => {
    expect(calculateStreak(['2023-10-09'], '2023-10-10')).toBe(1);
  });

  it('returns the correct streak for consecutive completed days including today', () => {
    expect(calculateStreak(['2023-10-10', '2023-10-09', '2023-10-08'], '2023-10-10')).toBe(3);
  });

  it('breaks the streak when a day is missing', () => {
    expect(calculateStreak(['2023-10-10', '2023-10-08'], '2023-10-10')).toBe(1);
  });
});
