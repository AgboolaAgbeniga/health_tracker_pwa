'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import HabitList from '@/app/components/habits/HabitList';
import HabitForm from '@/app/components/habits/HabitForm';
import { Session } from '@/lib/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const currentSession = auth.getCurrentSession();
    if (!currentSession) {
      router.push('/login');
    } else {
      setSession(currentSession);
    }
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (!session) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Habit Tracker</h1>
          <p className="text-slate-500">Welcome back, {session.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Your Habits</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Add Habit
          </button>
        </div>

        <HabitList />
      </div>

      {showForm && (
        <HabitForm onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}
