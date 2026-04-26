'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = auth.getCurrentSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div data-testid="splash-screen" className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl animate-bounce mb-6 flex items-center justify-center shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Habit Tracker</h1>
      <p className="text-slate-400 text-sm mt-2 animate-pulse">Initializing your goals...</p>
    </div>
  );
}
