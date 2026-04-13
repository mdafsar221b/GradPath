'use client';

import { CheckCircle2, Clock, ListChecks } from 'lucide-react';

interface StatsProps {
  stats: {
    totalAssignments: number;
    pendingAssignments: number;
    completedAssignments: number;
  };
}

export const StatsOverview = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <ListChecks className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tasks</p>
          <h4 className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
          <h4 className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</h4>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</p>
          <h4 className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</h4>
        </div>
      </div>
    </div>
  );
};
