'use client';

import { Assignment } from '@/features/assignment/model/assignment.types';
import { Calendar, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Badge } from '@/shared/ui/Badge';

export const UpcomingDeadlines = ({ assignments }: { assignments: Assignment[] }) => {
  if (assignments.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-7 h-7" />
        </div>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">All caught up!</p>
        <p className="text-gray-400 text-xs mt-1 font-medium">No deadlines on the horizon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => {
        const date = new Date(a.dueDate);
        const today = isToday(date);
        const tomorrow = isTomorrow(date);
        const past = isPast(date) && !today;

        let variant: 'default' | 'error' | 'warning' = 'default';
        if (today || past) variant = 'error';
        else if (tomorrow) variant = 'warning';

        return (
          <div 
            key={a._id}
            className="group relative flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
                variant === 'error' ? 'bg-red-50 text-red-500' : 
                variant === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 truncate group-hover:text-blue-600 transition-colors">{a.title}</p>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="info" className="scale-90 origin-left opacity-70">{a.subjectId.code}</Badge>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Unit {a.unitId.unitNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <Badge variant={variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'default'}>
                {today ? 'TODAY' : tomorrow ? 'TOMORROW' : format(date, 'MMM dd')}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};
