'use client';

import { AdminUsersDirectory } from '@/features/admin/ui/AdminUsersDirectory';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminUsersPage() {
  return (
    <AdminWorkspaceShell
      title="Users"
      description="Read-only directory of admins and students with semester-aware filtering."
    >
      <AdminUsersDirectory />
    </AdminWorkspaceShell>
  );
}
