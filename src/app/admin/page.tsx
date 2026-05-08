'use client';

import { AdminOverviewSection } from '@/features/dashboard/ui/AdminDashboardSections';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminPage() {
  return (
    <AdminWorkspaceShell
      title="Overview"
      description="Operational view of library coverage, PYQ intake, and current academic data health."
    >
      <AdminOverviewSection />
    </AdminWorkspaceShell>
  );
}
