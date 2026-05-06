'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/ui/Loader';

export default function AdminRecentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return <Loader fullPage text="Opening overview..." />;
}
