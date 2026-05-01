'use client';

import { useEffect, useState } from 'react';
import { academicApi } from '../api/academic-api';
import { useProgressStore } from '@/features/progress/model/progress.store';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';

interface Subject {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

export const SubjectList = ({ semester }: { semester: number }) => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  const token = useAuthStore(state => state.token);
  const { progressList, fetchProgress } = useProgressStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await academicApi.getSubjects(semester);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
    if (token) fetchProgress(token);
  }, [semester, token, fetchProgress]);

  if (loading) return <div className="p-4 text-center">Loading subjects...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subjects.map((subject) => {
        const progressData = progressList.find(p => p.subjectId === subject._id);
        const completedCount = progressData?.completedUnits.length || 0;
        const progressPercentage = (completedCount / 5) * 100;
        
        return (
          <Link 
            key={subject._id} 
            href={`/dashboard/subject/${subject._id}`}
            className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-blue-100 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BookOpen className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{subject.code || 'BCA'}</span>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{subject.name}</h3>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Syllabus Covered</span>
                  <span className={`font-bold ${progressPercentage === 100 ? 'text-green-500' : 'text-blue-600'}`}>
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <span>{completedCount} Units Done</span>
                  <span>{5 - completedCount} Pending</span>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/resources?category=notes&subjectId=${subject._id}`);
                  }}
                  className="flex-1 py-2 bg-gray-50 text-[10px] font-black uppercase text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Notes
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/resources?category=pyq&subjectId=${subject._id}`);
                  }}
                  className="flex-1 py-2 bg-gray-50 text-[10px] font-black uppercase text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  PYQs
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
