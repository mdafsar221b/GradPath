'use client';

import { useState } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SubjectList } from '@/features/academic/ui/SubjectList';
import {
  BookOpen,
  CheckSquare,
  FileText,
  FolderOpen,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DashboardData } from '@/features/dashboard/api/dashboard.api';
import { StatsOverview } from '@/features/dashboard/ui/StatsOverview';
import { UpcomingDeadlines } from '@/features/dashboard/ui/UpcomingDeadlines';
import { Card, CardContent } from '@/shared/ui/Card';
import {
  StudentDashboardSection,
  StudentDashboardSidebar,
} from '@/features/dashboard/ui/StudentDashboardSidebar';

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
  const [activeSection, setActiveSection] =
    useState<StudentDashboardSection>('overview');

  if (!user) return null;

  const quickActions = [
    {
      title: 'Practice',
      description: 'Topic study, quizzes, PYQs, and flashcards in one place.',
      icon: BookOpen,
      onClick: () => router.push('/practice'),
    },
    {
      title: 'Model Paper',
      description: 'Generate exam-style papers from curated PYQ patterns.',
      icon: FileText,
      onClick: () => router.push('/model-paper'),
    },
    {
      title: 'Assignments',
      description: 'See pending work, due dates, and submission targets.',
      icon: CheckSquare,
      onClick: () => router.push('/assignments'),
    },
    {
      title: 'Library',
      description: 'Open subjects, notes, PYQs, and revision resources.',
      icon: FolderOpen,
      onClick: () => router.push('/resources'),
    },
  ];

  const overviewBadge =
    activeSection === 'progress' ? 'Progress' : 'Overview';

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <StudentDashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="min-w-0 space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-lg shadow-blue-100/50 md:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_58%)] md:block" />
          <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  Semester {user.semester || '-'}
                </span>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  {overviewBadge}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-5xl">
                {activeSection === 'progress'
                  ? 'Track every subject clearly.'
                  : `Welcome back, ${user.name.split(' ')[0]}.`}
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium text-gray-600 md:text-lg">
                {activeSection === 'progress'
                  ? 'Move subject by subject, check what is complete, and open the exact unit or resource you need next.'
                  : 'Keep assignments, revision, and exam practice moving from one clean home.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push('/practice')}
                className="h-14 rounded-2xl px-7 shadow-xl shadow-blue-100"
              >
                Practice
              </Button>
              <Button
                onClick={() => router.push('/assignments')}
                variant="outline"
                className="h-14 rounded-2xl px-7"
              >
                Assignments
              </Button>
            </div>
          </div>
        </section>

        {activeSection === 'overview' ? (
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Semester Snapshot
              </h2>
              {dashboardData ? <StatsOverview stats={dashboardData.stats} /> : null}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                <Card className="border-none shadow-sm">
                  <CardContent className="p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
                          <TrendingUp className="h-3.5 w-3.5" />
                          Semester Progress
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">
                          {overallProgress}% completed
                        </h3>
                        <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                          Track your overall semester momentum, then move straight into practice or subject-level progress when you need depth.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                          Current Focus
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                          Sem {user.semester || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        onClick={() => setActiveSection('progress')}
                        variant="secondary"
                        className="rounded-2xl"
                      >
                        Open Progress
                      </Button>
                      <Button
                        onClick={() => router.push('/model-paper')}
                        variant="outline"
                        className="rounded-2xl"
                      >
                        Model Paper
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    Quick Access
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <button
                          key={action.title}
                          type="button"
                          onClick={action.onClick}
                          className="rounded-[1.8rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="mt-4 text-lg font-black text-gray-900">
                            {action.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            {action.description}
                          </p>
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
        ) : null}

        {activeSection === 'progress' ? (
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-black text-gray-900">
                    Subject Progress
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Open a subject to see its units, study material, and next academic gaps without jumping across multiple pages.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => router.push('/resources')}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    Open Library
                  </Button>
                  <Button
                    onClick={() => router.push('/practice')}
                    className="rounded-2xl"
                  >
                    Practice
                  </Button>
                </div>
              </div>
            </div>

            <SubjectList semester={user.semester || 1} />
          </section>
        ) : null}
      </div>
    </main>
  );
};
