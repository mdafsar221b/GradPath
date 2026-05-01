'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppTopNav } from '@/shared/ui/AppTopNav';
import { CodingLab } from '@/features/coding/ui/CodingLab';

export default function CodingLabPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppTopNav />
      <CodingLab />
    </div>
  );
}
