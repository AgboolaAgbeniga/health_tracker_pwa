'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = auth.getCurrentSession();
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
