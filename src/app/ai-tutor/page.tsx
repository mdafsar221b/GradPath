'use client';

import { AiTutorWorkspace } from '@/features/ai/ui/AiTutorWorkspace';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function AiTutorPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Opening your AI tutor..." />;
  }

  return (
    <StudentAppShell>
      <AiTutorWorkspace />
    </StudentAppShell>
  );
}
