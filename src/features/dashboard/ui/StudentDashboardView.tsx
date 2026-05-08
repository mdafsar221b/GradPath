'use client';

import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import {
  BookOpen,
  CheckSquare,
  FileText,
  FolderOpen,
  MessageSquareText,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DashboardData } from '@/features/dashboard/api/dashboard.api';
import { StatsOverview } from '@/features/dashboard/ui/StatsOverview';
import { UpcomingDeadlines } from '@/features/dashboard/ui/UpcomingDeadlines';
import { Card, CardContent } from '@/shared/ui/Card';

interface StudentDashboardViewProps {
  dashboardData: DashboardData | null;
  overallProgress: number;
}

export const StudentDashboardView = ({
  dashboardData,
  overallProgress,
}: StudentDashboardViewProps) => {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const quickActions = [
    {
      title: 'Library',
      description: 'Access syllabus notes, PYQs, and revision materials.',
      icon: FolderOpen,
      onClick: () => router.push('/resources'),
    },
    {
      title: 'Practice',
      description: 'Topic-wise PYQs and exam-focused practice.',
      icon: BookOpen,
      onClick: () => router.push('/practice'),
    },
    {
      title: 'PYQ Analysis',
      description: 'Topic analysis and exam-style papers.',
      icon: FileText,
      onClick: () => router.push('/model-paper'),
    },
    {
      title: 'Discussion Group',
      description: 'Community room for peer help and doubts.',
      icon: MessageSquareText,
      onClick: () => router.push('/discussions'),
    },
    {
      title: 'Assignments',
      description: 'Track your academic deadlines seamlessly.',
      icon: CheckSquare,
      onClick: () => router.push('/assignments'),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <div className="min-w-0 space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-md shadow-blue-100/40 md:p-6">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_58%)] md:block" />
          <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  Semester {user.semester || '-'}
                </span>
                <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  Overview
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
                Welcome back, {user.name.split(' ')[0]}.
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-gray-600">
                Start from coverage, move into library and practice, then finish with PYQ analysis and model papers.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => router.push('/resources')}
                className="h-10 rounded-xl px-5 text-sm shadow-md shadow-blue-100"
              >
                Open Library
              </Button>
              <Button
                onClick={() => router.push('/model-paper')}
                variant="outline"
                className="h-10 rounded-xl px-5 text-sm"
              >
                PYQ Analysis
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Semester Snapshot
            </h2>
            {dashboardData ? <StatsOverview stats={dashboardData.stats} /> : null}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
                          <TrendingUp className="h-3 w-3" />
                          Semester Progress
                        </div>
                        <span className="text-sm font-black text-gray-900">{overallProgress}% completed</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
                          style={{ width: `${overallProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={() => router.push('/progress')}
                        variant="secondary"
                        className="h-9 rounded-xl px-4 text-xs font-bold"
                      >
                        View Subjects
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  Core Flow
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.title}
                        type="button"
                        onClick={action.onClick}
                        className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-100 hover:shadow-md hover:shadow-blue-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {action.title}
                          </h3>
                          <p className="text-[10px] font-medium text-gray-500 truncate">
                            {action.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <h2 className="flex items-center gap-2 px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Assignment Radar
              </h2>
              {dashboardData ? (
                <UpcomingDeadlines assignments={dashboardData.upcomingDeadlines} />
              ) : null}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
};
