'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

export const useRequireAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [checked, setChecked] = useState(false);
  const hasToken = typeof window !== 'undefined' ? Boolean(window.localStorage.getItem('token')) : false;

  useEffect(() => {
    if (!hasToken) {
      router.replace('/login');
    }
    const timeout = window.setTimeout(() => setChecked(true), 0);
    return () => window.clearTimeout(timeout);
  }, [hasToken, router]);

  return {
    hydrated: checked,
    isAuthenticated: checked && hasToken,
    user,
    token,
  };
};
