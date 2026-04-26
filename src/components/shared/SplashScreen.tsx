"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = localStorage.getItem('habit-tracker-session');
      if (session && session !== 'null') {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div data-testid="splash-screen" className="flex items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
    </div>
  );
}
