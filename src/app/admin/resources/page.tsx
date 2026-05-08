'use client';

import { AdminResourcesWorkspace } from '@/features/admin/ui/AdminResourcesWorkspace';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminResourcesPage() {
  return (
    <AdminWorkspaceShell
      title="Academic Data Workflow"
      description="Upload notes and PYQs, curate question entries, and review publication quality from one workspace."
    >
      <AdminResourcesWorkspace />
    </AdminWorkspaceShell>
  );
}
