'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppTopNav } from '@/shared/ui/AppTopNav';
import { PracticeCenter } from '@/features/quiz/ui/PracticeCenter';

export default function PracticePage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppTopNav />
      <PracticeCenter />
    </div>
  );
}
