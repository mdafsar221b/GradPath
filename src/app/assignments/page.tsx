'use client';

import { AssignmentForm } from '@/features/assignment/ui/AssignmentForm';
import { AssignmentList } from '@/features/assignment/ui/AssignmentList';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';
import { CheckSquare } from 'lucide-react';

export default function AssignmentsPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Loading your assignments..." />;
  }

  return (
    <StudentAppShell>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-lg shadow-blue-100/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Assignment Tracker</h1>
              <p className="mt-1 text-gray-500">Stay on top of your semester workload with a cleaner planning flow.</p>
            </div>
          </div>
        </div>

        <AssignmentForm />

        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Assignments</h2>
        </div>

        <AssignmentList />
      </div>
    </StudentAppShell>
  );
}
