'use client';

import { UtilitiesHub } from '@/features/utilities/ui/UtilitiesHub';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function UtilitiesPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your utilities hub..." />;
  }

  return (
    <StudentAppShell>
      <UtilitiesHub />
    </StudentAppShell>
  );
}
