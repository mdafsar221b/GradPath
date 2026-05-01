'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppTopNav } from '@/shared/ui/AppTopNav';
import { AiTutorWorkspace } from '@/features/ai/ui/AiTutorWorkspace';

export default function AiTutorPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppTopNav />
      <AiTutorWorkspace />
    </div>
  );
}
