"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../types/auth';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const users: User[] = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    if (users.find(u => u.email === email)) {
      setError('User already exists');
      return;
    }

    const newUser: User = { id: Date.now().toString(), email, password, createdAt: new Date().toISOString() };
    localStorage.setItem('habit-tracker-users', JSON.stringify([...users, newUser]));
    localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: newUser.id, email: newUser.email }));
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 p-6 w-full max-w-sm mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <label>
        Email
        <input type="email" data-testid="auth-signup-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full border p-2" />
      </label>
      <label>
        Password
        <input type="password" data-testid="auth-signup-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full border p-2" />
      </label>
      <button type="submit" data-testid="auth-signup-submit" className="bg-green-600 text-white p-2 rounded">Sign Up</button>
    </form>
  );
}
