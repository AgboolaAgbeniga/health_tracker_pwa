"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { validateHabitName } from '@/lib/validators';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    if (!s) {
      router.push('/login');
    } else {
      setSession(s);
      const allHabits: Habit[] = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
      setHabits(allHabits.filter(h => h.userId === s.userId));
    }
  }, [router]);

  const saveHabits = (newHabits: Habit[]) => {
    const allHabits: Habit[] = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const otherHabits = allHabits.filter(h => h.userId !== session?.userId);
    localStorage.setItem('habit-tracker-habits', JSON.stringify([...otherHabits, ...newHabits]));
    setHabits(newHabits);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateHabitName(name);
    if (!v.valid) return alert(v.error);
    
    if (editId) {
      const updated = habits.map(h => h.id === editId ? { ...h, name: v.value, description } : h);
      saveHabits(updated);
      setEditId(null);
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        userId: session!.userId,
        name: v.value,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      saveHabits([...habits, newHabit]);
    }
    setName(''); setDescription('');
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      saveHabits(habits.filter(h => h.id !== id));
      // Triggers explicit confirmation hook mapped by e2e
      document.dispatchEvent(new Event('confirm-delete'));
    }
  };

  const handleToggle = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = toggleHabitCompletion(habit, today);
    saveHabits(habits.map(h => h.id === habit.id ? updated : h));
  };

  const logout = () => {
    localStorage.removeItem('habit-tracker-session');
    router.push('/login');
  };

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="p-4 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button data-testid="auth-logout-button" onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <form data-testid="habit-form" onSubmit={handleSave} className="flex flex-col gap-2 mb-8 border p-4">
        <label className="flex flex-col">Name
          <input data-testid="habit-name-input" value={name} onChange={e => setName(e.target.value)} required className="border p-2"/>
        </label>
        <label className="flex flex-col">Description
          <input data-testid="habit-description-input" value={description} onChange={e => setDescription(e.target.value)} className="border p-2"/>
        </label>
        <label className="flex flex-col">Frequency
          <select data-testid="habit-frequency-select" disabled className="border p-2 bg-gray-100"><option>daily</option></select>
        </label>
        <button type="submit" data-testid="habit-save-button" className="bg-blue-600 text-white p-2 mt-2">Save</button>
      </form>

      {habits.length === 0 ? (
        <p data-testid="empty-state">No habits yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {habits.map(h => {
            const slug = getHabitSlug(h.name);
            const today = new Date().toISOString().split('T')[0];
            const streak = calculateCurrentStreak(h.completions, today);
            return (
              <div key={h.id} data-testid={`habit-card-${slug}`} className="border p-4 flex justify-between">
                <div>
                  <h3 className="font-bold">{h.name}</h3>
                  <p data-testid={`habit-streak-${slug}`}>Streak: {streak}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button data-testid={`habit-complete-${slug}`} onClick={() => handleToggle(h)} className="bg-green-500 text-white px-2 py-1">Toggle Today</button>
                  <button data-testid={`habit-edit-${slug}`} onClick={() => { setEditId(h.id); setName(h.name); setDescription(h.description); }} className="bg-gray-300 px-2 py-1">Edit</button>
                  <button data-testid={`habit-delete-${slug}`} onClick={() => handleDelete(h.id)} className="bg-red-500 text-white px-2 py-1 confirm-delete-button">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
