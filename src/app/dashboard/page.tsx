'use client';

import axios from 'axios';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dashboardApi, DashboardData } from '@/features/dashboard/api/dashboard.api';
import { Loader } from '@/shared/ui/Loader';

import { StudentDashboardView } from '@/features/dashboard/ui/StudentDashboardView';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';

export default function DashboardPage() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [router, user?.role]);

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
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          router.replace('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [logout, router, token, user?.role]);

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

  if (user.role === 'admin') {
    return <Loader fullPage text="Opening admin dashboard..." />;
  }

  return (
    <StudentAppShell>
      <StudentDashboardView
        dashboardData={dashboardData}
        overallProgress={overallProgress}
      />
    </StudentAppShell>
  );
}
