'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/ui/Loader';

export default function AdminResourcesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/resources/library');
  }, [router]);

  return <Loader fullPage text="Opening library..." />;
}
