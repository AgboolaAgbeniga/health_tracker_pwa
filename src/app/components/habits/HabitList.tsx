'use client';

import { useEffect, useState } from 'react';
import { Habit } from '@/lib/types/habit';
import { habits } from '@/lib/habits';
import HabitCard from './HabitCard';

export default function HabitList() {
  const [userHabits, setUserHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = () => {
    const data = habits.getAllForCurrentUser();
    setUserHabits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading habits...</div>;

  if (userHabits.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-500">No habits yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {userHabits.map(habit => (
        <HabitCard key={habit.id} habit={habit} onUpdate={fetchHabits} />
      ))}
    </div>
  );
}
