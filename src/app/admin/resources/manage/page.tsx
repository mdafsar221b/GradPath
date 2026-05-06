'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/ui/Loader';

export default function AdminManageResourceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/resources?tab=library');
  }, [router]);

  return <Loader fullPage text="Opening resources..." />;
}
