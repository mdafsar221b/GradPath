'use client';

import { AdminLibraryWorkspace } from '@/features/admin/ui/AdminLibraryWorkspace';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminLibraryPage() {
  return (
    <AdminWorkspaceShell
      title="Curate Library"
      description="Manage semester resources before they feed student search, PYQ analysis, and model paper generation."
    >
      <AdminLibraryWorkspace />
    </AdminWorkspaceShell>
  );
}
