import { Habit } from './types/habit';
import { storage } from './storage';
import { STORAGE_KEYS } from './constants';
import { auth } from './auth';

export const habits = {
  getAllForCurrentUser: (): Habit[] => {
    const session = auth.getCurrentSession();
    if (!session) return [];
    
    const allHabits = storage.get<Habit[]>(STORAGE_KEYS.HABITS) || [];
    return allHabits.filter(h => h.userId === session.userId);
  },

  create: (data: Pick<Habit, 'name' | 'frequency'>): Habit | null => {
    const session = auth.getCurrentSession();
    if (!session) return null;

    const allHabits = storage.get<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      userId: session.userId,
      name: data.name,
      description: '',
      frequency: data.frequency,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    storage.set(STORAGE_KEYS.HABITS, [...allHabits, newHabit]);
    return newHabit;
  },

  toggleCompletion: (habitId: string, date: string): Habit | null => {
    const allHabits = storage.get<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const habitIndex = allHabits.findIndex(h => h.id === habitId);
    
    if (habitIndex === -1) return null;

    const habit = allHabits[habitIndex];
    const completions = new Set(habit.completions);
    
    if (completions.has(date)) {
      completions.delete(date);
    } else {
      completions.add(date);
    }

    const updatedHabit = { ...habit, completions: Array.from(completions) };
    allHabits[habitIndex] = updatedHabit;
    
    storage.set(STORAGE_KEYS.HABITS, allHabits);
    return updatedHabit;
  }
};
