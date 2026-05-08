'use client';

import { AdminResourceUpload } from '@/features/resource/ui/AdminResourceUpload';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

export default function AdminUploadResourcePage() {
  return (
    <AdminWorkspaceShell
      title="Upload Resource"
      description="Add new notes, PYQs, and other materials to the academic repository."
    >
      <AdminResourceUpload />
    </AdminWorkspaceShell>
  );
}
