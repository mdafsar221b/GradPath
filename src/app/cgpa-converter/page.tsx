'use client';

import { CgpaConverter } from '@/features/utilities/ui/CgpaConverter';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function CgpaConverterPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your tool..." />;
  }

  return (
    <StudentAppShell>
      <CgpaConverter />
    </StudentAppShell>
  );
}
