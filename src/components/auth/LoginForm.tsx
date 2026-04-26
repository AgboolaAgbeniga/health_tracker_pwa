"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../types/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: user.id, email: user.email }));
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 p-6 w-full max-w-sm mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      <label>
        Email
        <input type="email" data-testid="auth-login-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full border p-2" />
      </label>
      <label>
        Password
        <input type="password" data-testid="auth-login-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full border p-2" />
      </label>
      <button type="submit" data-testid="auth-login-submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}
