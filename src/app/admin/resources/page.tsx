'use client';

import { useState } from 'react';
import { FolderOpen, LayoutDashboard, List, UploadCloud } from 'lucide-react';
import { AdminResourceList } from '@/features/resource/ui/AdminResourceList';
import { AdminResourceUpload } from '@/features/resource/ui/AdminResourceUpload';
import { AdminWorkspaceShell } from '@/features/dashboard/ui/AdminWorkspaceShell';

type ResourceSection = 'upload' | 'manage';

export default function AdminResourcesPage() {
  const [activeSection, setActiveSection] = useState<ResourceSection>('upload');

  return (
    <AdminWorkspaceShell
      title="Resources"
      description="Choose a resource section from the sidebar."
      primaryItems={[
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/resources', label: 'Resources', icon: FolderOpen },
      ]}
      activePrimary="Resources"
      sections={[
        { id: 'upload', label: 'Upload', icon: UploadCloud },
        { id: 'manage', label: 'Manage', icon: List },
      ]}
      activeSection={activeSection}
      onSectionChange={(sectionId) => setActiveSection(sectionId as ResourceSection)}
    >
      {activeSection === 'upload' ? <AdminResourceUpload /> : null}
      {activeSection === 'manage' ? <AdminResourceList /> : null}
    </AdminWorkspaceShell>
  );
}
