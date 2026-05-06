'use client';

import { StudentModelPaperCenter } from '@/features/dashboard/ui/StudentModelPaperCenter';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';
import { Loader } from '@/shared/ui/Loader';

export default function ModelPaperPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your model paper workspace..." />;
  }

  return (
    <StudentAppShell>
      <StudentModelPaperCenter />
    </StudentAppShell>
  );
}
