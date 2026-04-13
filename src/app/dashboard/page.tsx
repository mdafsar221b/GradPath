'use client';

import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { SubjectList } from '@/features/academic/ui/SubjectList';
import { CheckSquare, LogOut, LayoutDashboard, ChevronRight, Sparkles } from 'lucide-react';
import { dashboardApi, DashboardData } from '@/features/dashboard/api/dashboard.api';
import { StatsOverview } from '@/features/dashboard/ui/StatsOverview';
import { UpcomingDeadlines } from '@/features/dashboard/ui/UpcomingDeadlines';
import { Loader } from '@/shared/ui/Loader';
import { Card, CardContent } from '@/shared/ui/Card';

export default function DashboardPage() {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;
      try {
        const data = await dashboardApi.getDashboardSummary(token);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (!user || loading) {
    return <Loader fullPage text="Preparing your personalized dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/dashboard')}>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">G</div>
              <span className="text-xl font-black text-gray-900 tracking-tight">GradPath</span>
            </div>
            
            <div className="flex items-center gap-6">
              {user.role === 'admin' && (
                <button 
                  onClick={() => router.push('/admin/resources')}
                  className="hidden md:block text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-4"
                >
                  Admin Portal
                </button>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Student</p>
                </div>
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Academic Year 2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="mt-2 text-gray-500 font-medium text-lg">
              You've completed <span className="text-gray-900 font-bold">42%</span> of your Semester {user.semester} goals. Keep it up!
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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Stats */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Workload Summary</h2>
              {dashboardData && <StatsOverview stats={dashboardData.stats} />}
            </div>
            
            {/* Subjects */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Academic Progress</h2>
                <button className="text-xs font-bold text-blue-600 hover:underline">View Full Syllabus</button>
              </div>
              <SubjectList semester={user.semester || 1} />
            </section>
          </div>

          <aside className="space-y-10">
            {/* Deadlines */}
            <div className="space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Next on your list
              </h2>
              {dashboardData && <UpcomingDeadlines assignments={dashboardData.upcomingDeadlines} />}
            </div>
            
            {/* Motivational Card */}
            <Card className="bg-gray-900 border-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <CardContent className="relative z-10 p-8">
                <h3 className="text-white font-black text-xl mb-3 leading-tight">Master your <br/> Semester {user.semester} Exams 🎯</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Based on your current progress, we suggest spending 2 hours on {dashboardData?.subjectProgress[0]?.name || 'your subjects'} today.
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
            
            {/* Quick Links */}
            <div className="space-y-3">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center">
                  PYQ Library
                </button>
                <button className="p-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:border-blue-100 hover:text-blue-600 transition-all text-center">
                  Study Group
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
