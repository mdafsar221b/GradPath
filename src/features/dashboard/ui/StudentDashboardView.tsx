'use client';

import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SubjectList } from '@/features/academic/ui/SubjectList';
import { CheckSquare, ChevronRight, Sparkles } from 'lucide-react';
import { DashboardData } from '@/features/dashboard/api/dashboard.api';
import { StatsOverview } from '@/features/dashboard/ui/StatsOverview';
import { UpcomingDeadlines } from '@/features/dashboard/ui/UpcomingDeadlines';
import { Card, CardContent } from '@/shared/ui/Card';
import { StudyCommandCenter } from '@/features/study/ui/StudyCommandCenter';

interface StudentDashboardViewProps {
  dashboardData: DashboardData | null;
  overallProgress: number;
}

export const StudentDashboardView = ({ dashboardData, overallProgress }: StudentDashboardViewProps) => {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Academic Year 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="mt-2 text-gray-500 font-medium text-lg">
            You&apos;ve completed <span className="text-gray-900 font-bold">{overallProgress}%</span> of your Semester {user.semester} goals. Keep it up.
          </p>
        </div>

        <Button
          onClick={() => router.push('/assignments')}
          className="rounded-2xl h-14 px-8 flex gap-3 shadow-xl shadow-blue-100 group"
        >
          <CheckSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          My Assignment Tracker
        </Button>
      </section>

      <StudyCommandCenter />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Workload Summary</h2>
            {dashboardData && <StatsOverview stats={dashboardData.stats} />}
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Academic Progress</h2>
              <button
                onClick={() => router.push('/resources')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Open Library
              </button>
            </div>
            <SubjectList semester={user.semester || 1} />
          </section>
        </div>

        <aside className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Next on your list
            </h2>
            {dashboardData && <UpcomingDeadlines assignments={dashboardData.upcomingDeadlines} />}
          </div>

          <Card className="bg-gray-900 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <CardContent className="relative z-10 p-8">
              <h3 className="text-white font-black text-xl mb-3 leading-tight">Master your <br /> Semester {user.semester} exams</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Based on your current progress, spend focused time on {dashboardData?.subjectProgress[0]?.name || 'your weakest subject'} today.
              </p>
              <button
                onClick={() => router.push('/dashboard/subject/' + (dashboardData?.subjectProgress[0]?._id || ''))}
                className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group/btn"
              >
                Start Learning
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/ai-tutor')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                AI Tutor
              </button>
              <button
                onClick={() => router.push('/practice')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                Practice
              </button>
              <button
                onClick={() => router.push('/flashcards')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                Flashcards
              </button>
              <button
                onClick={() => router.push('/coding-lab')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                Coding Lab
              </button>
              <button
                onClick={() => router.push('/resources?category=pyq')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                PYQ Library
              </button>
              <button
                onClick={() => router.push('/resources?category=notes')}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center"
              >
                Notes
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
