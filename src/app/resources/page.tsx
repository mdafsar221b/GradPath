'use client';

import { ResourceLibrary } from '@/features/resource/ui/ResourceLibrary';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function ResourcesPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Curating your library..." />;
  }

  return (
    <StudentAppShell>
      <ResourceLibrary />
    </StudentAppShell>
  );
}
