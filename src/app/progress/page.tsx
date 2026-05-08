'use client';

import { StudentProgressView } from '@/features/dashboard/ui/StudentProgressView';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function ProgressPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your progress tracker..." />;
  }

  return (
    <StudentAppShell>
      <StudentProgressView />
    </StudentAppShell>
  );
}
