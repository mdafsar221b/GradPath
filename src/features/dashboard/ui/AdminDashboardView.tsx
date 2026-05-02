'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Clock3,
  ExternalLink,
  FileText,
  FolderOpen,
  Layers,
  LayoutDashboard,
  Plus,
  Video,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '@/features/resource/api/resource.api';
import { ResourceStats } from '@/features/resource/model/resource.types';
import { Card, CardContent } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';
import { AdminWorkspaceShell } from './AdminWorkspaceShell';

type AdminSection = 'overview' | 'library' | 'recent' | 'actions';

export const AdminDashboardView = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const data = await resourceApi.getResourceStats(token);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const primaryItems = useMemo(
    () => [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/resources', label: 'Resources', icon: FolderOpen },
    ],
    []
  );

  const sectionItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'library', label: 'Library', icon: BarChart3 },
      { id: 'recent', label: 'Recent', icon: Clock3 },
      { id: 'actions', label: 'Actions', icon: Plus },
    ],
    []
  );

  const statCards = [
    {
      title: 'Total resources',
      value: stats?.totalResources || 0,
      icon: Layers,
      tone: 'bg-blue-50 text-blue-700',
      detail: 'All uploaded material',
    },
    {
      title: 'Notes',
      value: stats?.notesCount || 0,
      icon: BookOpen,
      tone: 'bg-emerald-50 text-emerald-700',
      detail: 'Unit-based notes',
    },
    {
      title: 'PYQs',
      value: stats?.pyqsCount || 0,
      icon: FileText,
      tone: 'bg-amber-50 text-amber-700',
      detail: 'Previous year papers',
    },
    {
      title: 'Missing subjects',
      value: stats?.pendingSubjectsCount || 0,
      icon: AlertCircle,
      tone: 'bg-rose-50 text-rose-700',
      detail: 'Need more content',
    },
  ];

  if (loading) {
    return <Loader fullPage text="Loading admin dashboard..." />;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border border-slate-200 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${card.tone}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Resource status</h2>
              <p className="mt-1 text-sm text-slate-500">Use the sidebar to switch between dashboard sections.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/resources')}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Open resources
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLibrary = () => {
    const typeCards = (stats?.byType || []).map((item) => {
      const config = {
        pdf: { label: 'PDF', icon: FileText, tone: 'bg-orange-50 text-orange-700' },
        youtube: { label: 'YouTube', icon: Video, tone: 'bg-red-50 text-red-700' },
        link: { label: 'Link', icon: ExternalLink, tone: 'bg-sky-50 text-sky-700' },
      } as const;

      const current = config[item._id as keyof typeof config] || config.link;
      return {
        ...current,
        count: item.count,
      };
    });

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {typeCards.map((item) => (
          <Card key={item.label} className="border border-slate-200 shadow-none">
            <CardContent className="p-6">
              <div className={`inline-flex rounded-2xl p-3 ${item.tone}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRecent = () => (
    <Card className="border border-slate-200 shadow-none">
      <CardContent className="p-0">
        {(stats?.recentResources || []).length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats?.recentResources?.map((resource) => (
              <div key={resource._id} className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{resource.title}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {resource.category} • {resource.type}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  {resource.qualityStatus || 'published'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-sm font-medium text-slate-500">No resources published yet.</div>
        )}
      </CardContent>
    </Card>
  );

  const renderActions = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[
        {
          title: 'Upload resource',
          text: 'Add new notes, PYQs, links, or PDFs.',
          action: () => router.push('/admin/resources'),
        },
        {
          title: 'Manage resources',
          text: 'Review, edit, or remove existing entries.',
          action: () => router.push('/admin/resources'),
        },
      ].map((item) => (
        <Card key={item.title} className="border border-slate-200 shadow-none">
          <CardContent className="p-6">
            <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            <button
              type="button"
              onClick={item.action}
              className="mt-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Open
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <AdminWorkspaceShell
      title="Admin Dashboard"
      description="Use the left sidebar to open one admin section at a time."
      primaryItems={primaryItems}
      activePrimary="Dashboard"
      sections={sectionItems}
      activeSection={activeSection}
      onSectionChange={(sectionId) => setActiveSection(sectionId as AdminSection)}
    >
      {activeSection === 'overview' ? renderOverview() : null}
      {activeSection === 'library' ? renderLibrary() : null}
      {activeSection === 'recent' ? renderRecent() : null}
      {activeSection === 'actions' ? renderActions() : null}
    </AdminWorkspaceShell>
  );
};
