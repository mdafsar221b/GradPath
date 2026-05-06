'use client';

import { AdminResourcesWorkspace } from '@/features/admin/ui/AdminResourcesWorkspace';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminResourcesPage() {
  return (
    <AdminWorkspaceShell
      title="Resources"
      description="Single resource workspace for uploading, managing, filtering, and reviewing the library."
    >
      <AdminResourcesWorkspace />
    </AdminWorkspaceShell>
  );
}
