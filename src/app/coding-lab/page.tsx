'use client';

import { CodingLab } from '@/features/coding/ui/CodingLab';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function CodingLabPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Opening the coding lab..." />;
  }

  return (
    <StudentAppShell>
      <CodingLab />
    </StudentAppShell>
  );
}
