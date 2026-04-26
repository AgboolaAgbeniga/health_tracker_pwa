'use client';

import { Habit } from '@/lib/types/habit';
import { habits } from '@/lib/habits';
import { calculateStreak } from '@/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateStreak(habit.completions);

  const toggleToday = () => {
    const updated = habits.toggleCompletion(habit.id, today);
    if (updated) onUpdate();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {habit.name}
        </h3>
        <div className="flex gap-4 mt-1">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-indigo-600">{streak}</span> day streak
          </p>
          <p className="text-sm text-slate-400 capitalize">{habit.frequency}</p>
        </div>
      </div>

      <button
        onClick={toggleToday}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isCompletedToday 
            ? 'bg-green-500 text-white scale-110' 
            : 'bg-slate-50 text-slate-300 hover:bg-slate-100 border-2 border-dashed border-slate-200'
        }`}
      >
        {isCompletedToday ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </div>
  );
}
