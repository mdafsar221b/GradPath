'use client';

import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { dashboardApi, DashboardData } from '@/features/dashboard/api/dashboard.api';
import { Loader } from '@/shared/ui/Loader';

import { StudentDashboardView } from '@/features/dashboard/ui/StudentDashboardView';
import { AdminDashboardView } from '@/features/dashboard/ui/AdminDashboardView';

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
      if (!token || user?.role !== 'student') {
        if (user?.role === 'admin') setLoading(false);
        return;
      }
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
  }, [token, user?.role]);

  const calculateOverallProgress = () => {
    if (!dashboardData || dashboardData.subjectProgress.length === 0) return 0;
    const totalUnits = dashboardData.subjectProgress.length * 5;
    const completedUnits = dashboardData.subjectProgress.reduce((acc, curr) => acc + curr.completedUnits, 0);
    return Math.round((completedUnits / totalUnits) * 100);
  };

  const overallProgress = calculateOverallProgress();

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
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{user.role}</p>
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

      {user.role === 'admin' ? (
        <AdminDashboardView />
      ) : (
        <StudentDashboardView 
          dashboardData={dashboardData} 
          overallProgress={overallProgress} 
        />
      )}
    </div>
  );
}
