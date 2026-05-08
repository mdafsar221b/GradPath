'use client';

import { NumberConverter } from '@/features/utilities/ui/NumberConverter';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function NumberConverterPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Preparing your tool..." />;
  }

  return (
    <StudentAppShell>
      <NumberConverter />
    </StudentAppShell>
  );
}
