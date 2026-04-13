import { AssignmentForm } from '@/features/assignment/ui/AssignmentForm';
import { AssignmentList } from '@/features/assignment/ui/AssignmentList';
import { LayoutDashboard, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Assignment Tracker</h1>
              <p className="mt-1 text-gray-500">Stay on top of your semester workload</p>
            </div>
          </div>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <AssignmentForm />
        
        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Assignments</h2>
        </div>
        
        <AssignmentList />
      </div>
    </div>
  );
}
