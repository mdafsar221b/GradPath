'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { Loader } from '@/shared/ui/Loader';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [hasHydrated, router, user]);

  if (!hasHydrated || !user || user.role !== 'admin') {
    return <Loader fullPage text="Opening admin workspace..." />;
  }

  return children;
}
