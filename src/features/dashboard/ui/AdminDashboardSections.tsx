'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  FileText,
  Layers,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { resourceApi } from '@/features/resource/api/resource.api';
import { ResourceStats } from '@/features/resource/model/resource.types';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { Card, CardContent } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';
import { adminApi } from '@/features/admin/api/admin.api';
import { AdminUserStats } from '@/features/admin/model/admin.types';

export const useAdminResourceStats = () => {
  const token = useAuthStore((state) => state.token);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const data = await resourceApi.getResourceStats(token);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin resource stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return { stats, loading };
};

export const useAdminUserStats = () => {
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin user stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export const AdminOverviewSection = () => {
  const { stats: resourceStats, loading: resourcesLoading } = useAdminResourceStats();
  const { stats: userStats, loading: usersLoading } = useAdminUserStats();

  const statCards = useMemo(
    () => [
      {
        title: 'Total resources',
        value: resourceStats?.totalResources || 0,
        icon: Layers,
        tone: 'bg-blue-50 text-blue-700',
        detail: 'All uploaded material',
      },
      {
        title: 'Notes',
        value: resourceStats?.notesCount || 0,
        icon: BookOpen,
        tone: 'bg-emerald-50 text-emerald-700',
        detail: 'Unit-based notes',
      },
      {
        title: 'PYQs',
        value: resourceStats?.pyqsCount || 0,
        icon: FileText,
        tone: 'bg-amber-50 text-amber-700',
        detail: 'Previous year paper uploads',
      },
      {
        title: 'Missing subjects',
        value: resourceStats?.pendingSubjectsCount || 0,
        icon: AlertCircle,
        tone: 'bg-rose-50 text-rose-700',
        detail: 'Subjects still missing library coverage',
      },
      {
        title: 'Total users',
        value: userStats?.totalUsers || 0,
        icon: Users,
        tone: 'bg-violet-50 text-violet-700',
        detail: 'All accounts in GradPath',
      },
      {
        title: 'Admins',
        value: userStats?.totalAdmins || 0,
        icon: ShieldCheck,
        tone: 'bg-slate-100 text-slate-700',
        detail: 'Operators with admin access',
      },
    ],
    [resourceStats, userStats]
  );

  if (resourcesLoading || usersLoading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border border-slate-200 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Latest uploaded resources</h2>
                <p className="mt-1 text-sm text-slate-500">Recent notes and PYQ intake with quality status visibility.</p>
              </div>
              <Link
                href="/admin/resources?tab=review"
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open review
              </Link>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {(resourceStats?.recentResources || []).length > 0 ? (
                resourceStats?.recentResources?.map((resource) => (
                  <div key={resource._id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{resource.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {resource.category} | {resource.type}
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold capitalize text-slate-600">
                      {resource.qualityStatus || 'published'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-sm font-medium text-slate-500">No recent resources yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">User distribution</h2>
                  <p className="mt-1 text-sm text-slate-500">Students by semester, plus direct access to the directory.</p>
                </div>
                <Link
                  href="/admin/users"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Open users
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(userStats?.bySemester || []).map((item) => (
                  <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Semester {item._id}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{item.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-6">
              <h2 className="text-lg font-black text-slate-900">Curation workflow</h2>
              <p className="mt-1 text-sm text-slate-500">Manage uploads and resolve quality-state bottlenecks before data reaches students.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/admin/resources?tab=upload"
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Upload new resource
                </Link>
                <Link
                  href="/admin/resources?tab=library"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Open library
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
