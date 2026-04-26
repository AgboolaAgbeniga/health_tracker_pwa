import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

const habit: Habit = { id: '1', userId: 'u1', name: 'Read', description: '', frequency: 'daily', createdAt: '', completions: [] };

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    expect(toggleHabitCompletion(habit, '2023-10-10').completions).toContain('2023-10-10');
  });
  it('removes a completion date when the date already exists', () => {
    const h = { ...habit, completions: ['2023-10-10'] };
    expect(toggleHabitCompletion(h, '2023-10-10').completions).not.toContain('2023-10-10');
  });
  it('does not mutate the original habit object', () => {
    const updated = toggleHabitCompletion(habit, '2023-10-10');
    expect(habit.completions.length).toBe(0);
    expect(updated).not.toBe(habit);
  });
  it('does not return duplicate completion dates', () => {
    const h = { ...habit, completions: ['2023-10-10', '2023-10-10'] };
    const updated = toggleHabitCompletion(h, '2023-10-11');
    expect(updated.completions.filter(c => c === '2023-10-10').length).toBe(1);
  });
});
