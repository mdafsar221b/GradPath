'use client';

import { PracticeCenter } from '@/features/quiz/ui/PracticeCenter';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function PracticePage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your practice center..." />;
  }

  return (
    <StudentAppShell>
      <PracticeCenter />
    </StudentAppShell>
  );
}
