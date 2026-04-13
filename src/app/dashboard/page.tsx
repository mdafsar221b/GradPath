'use client';

import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-gray-600">Semester: {user.semester}</p>
          </div>
          <Button variant="outline" onClick={() => { logout(); router.push('/login'); }}>
            Logout
          </Button>
        </header>

        <main className="grid gap-6">
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Progress</h2>
            <p className="text-gray-500 italic">No academic logic yet. Stay tuned for Phase 2!</p>
          </section>
        </main>
      </div>
    </div>
  );
}
