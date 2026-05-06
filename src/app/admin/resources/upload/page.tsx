'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/ui/Loader';

export default function AdminUploadResourceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/resources?tab=upload');
  }, [router]);

  return <Loader fullPage text="Opening resources..." />;
}
