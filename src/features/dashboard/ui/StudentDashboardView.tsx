'use client';

import { useState } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SubjectList } from '@/features/academic/ui/SubjectList';
import { BookOpen, CheckSquare, ChevronRight, Code2, FileQuestion, Layers3, Sparkles } from 'lucide-react';
import { DashboardData } from '@/features/dashboard/api/dashboard.api';
import { StatsOverview } from '@/features/dashboard/ui/StatsOverview';
import { UpcomingDeadlines } from '@/features/dashboard/ui/UpcomingDeadlines';
import { Card, CardContent } from '@/shared/ui/Card';
import { StudyCommandCenter } from '@/features/study/ui/StudyCommandCenter';
import { StudentDashboardSection, StudentDashboardSidebar } from '@/features/dashboard/ui/StudentDashboardSidebar';

interface StudentDashboardViewProps {
  dashboardData: DashboardData | null;
  overallProgress: number;
}

export const StudentDashboardView = ({ dashboardData, overallProgress }: StudentDashboardViewProps) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<StudentDashboardSection>('overview');

  if (!user) return null;

  const focusSubject = dashboardData?.subjectProgress[0];

  const tools = [
    {
      title: 'AI Tutor',
      description: 'Concept explanations, answers, and guided help.',
      icon: Sparkles,
      onClick: () => router.push('/ai-tutor'),
    },
    {
      title: 'Practice Center',
      description: 'Generate quizzes for revision and exam prep.',
      icon: BookOpen,
      onClick: () => router.push('/practice'),
    },
    {
      title: 'Flashcards',
      description: 'Revise memory-based concepts faster.',
      icon: Layers3,
      onClick: () => router.push('/flashcards'),
    },
    {
      title: 'Coding Lab',
      description: 'Work on coding questions with AI review.',
      icon: Code2,
      onClick: () => router.push('/coding-lab'),
    },
    {
      title: 'PYQ Library',
      description: 'Practice with previous-year exam patterns.',
      icon: FileQuestion,
      onClick: () => router.push('/resources?category=pyq'),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8">
        <StudentDashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="min-w-0 space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-lg shadow-blue-100/50 md:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_58%)] md:block" />
          <div className="relative z-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  Academic Year 2026
                </span>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  {activeSection === 'planner' ? 'Study Plan' : activeSection === 'progress' ? 'Progress' : activeSection === 'deadlines' ? 'Deadlines' : activeSection === 'tools' ? 'Tools' : 'Overview'}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium text-gray-600 md:text-lg">
                Use the sidebar to switch between sections.
              </p>
            </div>

            <Button
              onClick={() => router.push('/assignments')}
              className="h-14 rounded-2xl px-8 shadow-xl shadow-blue-100 group flex gap-3"
            >
              <CheckSquare className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Assignments
            </Button>
          </div>
        </section>

        {activeSection === 'overview' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Workload Summary</h2>
                  {dashboardData && <StatsOverview stats={dashboardData.stats} />}
                </div>

                <Card className="border-none shadow-sm">
                  <CardContent className="p-7">
                    <h3 className="text-2xl font-black text-gray-900">Semester Progress</h3>
                    <p className="mt-2 text-sm font-medium text-gray-500">
                      You have completed {overallProgress}% of your Semester {user.semester} journey so far.
                    </p>
                    <div className="mt-6 h-4 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button onClick={() => setActiveSection('planner')} variant="secondary" className="rounded-2xl">
                        Study Plan
                      </Button>
                      <Button onClick={() => setActiveSection('progress')} variant="outline" className="rounded-2xl">
                        Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <aside className="space-y-8">
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Next on your list
                  </h2>
                  {dashboardData && <UpcomingDeadlines assignments={dashboardData.upcomingDeadlines} />}
                </div>
              </aside>
            </div>
          </section>
        )}

        {activeSection === 'planner' && (
          <section className="space-y-8">
            <StudyCommandCenter />
          </section>
        )}

        {activeSection === 'progress' && (
          <section className="space-y-8">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Academic Progress</h2>
                <p className="mt-2 text-sm text-gray-500">Open a subject to see units and resources.</p>
              </div>
              <button
                onClick={() => router.push('/resources')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Open Library
              </button>
            </div>
            <SubjectList semester={user.semester || 1} />
          </section>
        )}

        {activeSection === 'deadlines' && (
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <h2 className="px-1 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Upcoming Deadlines</h2>
              {dashboardData && <UpcomingDeadlines assignments={dashboardData.upcomingDeadlines} />}
            </div>

            <Card className="group relative overflow-hidden border-none bg-gray-900">
              <div className="absolute -mt-16 -mr-16 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl top-0 right-0" />
              <CardContent className="relative z-10 p-8">
                <h3 className="mb-3 text-xl font-black leading-tight text-white">
                  Master your <br /> Semester {user.semester} exams
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-400">
                  Based on your current progress, spend focused time on {focusSubject?.name || 'your weakest subject'} today.
                </p>
                <button
                  onClick={() => router.push('/dashboard/subject/' + (focusSubject?._id || ''))}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-gray-900 transition-all hover:bg-blue-50"
                >
                  Start Learning
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'tools' && (
          <section className="space-y-6">
            <div className="px-1">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Tools</h2>
              <p className="mt-2 text-sm text-gray-500">Open the tool you need.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.title}
                    onClick={tool.onClick}
                    className="rounded-[1.8rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-gray-900">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{tool.description}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        </div>
    </main>
  );
};
