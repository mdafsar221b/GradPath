'use client';

import { FlashcardWorkspace } from '@/features/flashcard/ui/FlashcardWorkspace';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function FlashcardsPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Loading your revision workspace..." />;
  }

  return (
    <StudentAppShell>
      <FlashcardWorkspace />
    </StudentAppShell>
  );
}
