'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppTopNav } from '@/shared/ui/AppTopNav';
import { FlashcardWorkspace } from '@/features/flashcard/ui/FlashcardWorkspace';

export default function FlashcardsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppTopNav />
      <FlashcardWorkspace />
    </div>
  );
}
