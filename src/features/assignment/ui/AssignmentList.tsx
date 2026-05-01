'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useAssignmentStore } from '../model/assignment.store';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

export const AssignmentList = () => {
  const { token } = useAuthStore();
  const { 
    assignments, 
    loading, 
    fetchAssignments, 
    toggleStatus, 
    removeAssignment 
  } = useAssignmentStore();

  useEffect(() => {
    if (token) {
      fetchAssignments(token);
    }
  }, [token, fetchAssignments]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading assignments...</div>;

  if (assignments.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400">No assignments tracked yet. Start by adding one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => {
        const dueDate = new Date(a.dueDate);
        const isOverdue = isPast(dueDate) && !isToday(dueDate) && a.status === 'pending';
        
        return (
          <div 
            key={a._id}
            className={`flex items-center p-4 bg-white border rounded-2xl transition-all shadow-sm ${
              a.status === 'completed' ? 'border-gray-100 opacity-60' : 'border-gray-100'
            }`}
          >
            <button 
              onClick={() => token && toggleStatus(a._id, a.status, token)}
              className={`mr-4 transition-colors ${
                a.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
              }`}
            >
              {a.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">
                  {a.subjectId.code}
                </span>
                <span className="text-[10px] font-medium text-gray-400">
                  Unit {a.unitId.unitNumber}
                </span>
              </div>
              <h4 className={`font-semibold truncate ${
                a.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
              }`}>
                {a.title}
              </h4>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-right hidden sm:block">
                <div className={`flex items-center gap-1 text-xs font-bold ${
                  isOverdue ? 'text-red-500' : 'text-gray-400'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {format(dueDate, 'dd MMM yyyy')}
                </div>
                {isOverdue && <p className="text-[10px] text-red-400 font-bold uppercase mt-0.5">Overdue</p>}
              </div>

              <button 
                onClick={() => token && window.confirm('Delete?') && removeAssignment(a._id, token)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
