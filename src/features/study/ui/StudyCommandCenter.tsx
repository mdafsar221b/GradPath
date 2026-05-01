'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Brain,
  CalendarClock,
  FileQuestion,
  Flame,
  TimerReset,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { studyApi, StudyPlan } from '../api/study.api';
import { Card, CardContent } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';

const readinessLabel = {
  strong: 'Strong',
  building: 'Building',
  'needs-pyqs': 'Needs PYQs',
};

export const StudyCommandCenter = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token) return;
      try {
        const data = await studyApi.getStudyPlan(token);
        setPlan(data);
      } catch (error) {
        console.error('Failed to build study plan', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [token]);

  if (loading) {
    return <Loader text="Building your BCA study plan..." />;
  }

  if (!plan) return null;

  const totalMinutes = plan.dailyPlan.reduce((sum, item) => sum + item.effortMinutes, 0);
  const weakestPyq = plan.pyqInsights[0];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Today&apos;s BCA Command Center</h2>
          <p className="text-sm text-gray-500 mt-1">Prioritized from your deadlines, syllabus progress, and resource coverage.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">
          <TimerReset className="w-4 h-4" />
          {totalMinutes} min plan
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 bg-gray-900 text-white flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-blue-200 text-xs font-black uppercase tracking-widest mb-3">
                  <Flame className="w-4 h-4" />
                  Focus Subject
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {plan.focusSubject?.code || 'BCA'}: {plan.focusSubject?.name || 'Build your foundation'}
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  {plan.focusSubject?.nextUnit
                    ? `Next: Unit ${plan.focusSubject.nextUnit.unitNumber} - ${plan.focusSubject.nextUnit.title}`
                    : 'You are caught up on tracked units.'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-black">{plan.focusSubject?.progressPercentage || 0}%</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">covered</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {plan.dailyPlan.length === 0 ? (
                <div className="p-6 text-sm font-bold text-gray-400">
                  No urgent study items found. Add assignments or start tracking units to generate a richer plan.
                </div>
              ) : (
                plan.dailyPlan.map((item, index) => (
                  <button
                    key={`${item.title}-${index}`}
                    onClick={() => item.subjectId && router.push(`/dashboard/subject/${item.subjectId}`)}
                    className="w-full p-5 text-left hover:bg-blue-50/30 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        item.type === 'assignment'
                          ? 'bg-red-50 text-red-500'
                          : item.type === 'pyq-gap'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.type === 'assignment' ? <CalendarClock className="w-5 h-5" /> : item.type === 'pyq-gap' ? <FileQuestion className="w-5 h-5" /> : <BookOpenCheck className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate">{item.title}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1 line-clamp-2">{item.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-black text-gray-400">{item.effortMinutes}m</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">PYQ Readiness</h3>
                  <p className="text-xs text-gray-400 font-bold">Exam coverage by subject</p>
                </div>
              </div>

              {weakestPyq ? (
                <div className="space-y-3">
                  {plan.pyqInsights.slice(0, 4).map((item) => (
                    <div key={item.subjectId} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-700 truncate">{item.code}: {item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.pyqCount} PYQs</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                        item.readiness === 'strong'
                          ? 'bg-green-50 text-green-600'
                          : item.readiness === 'building'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-red-50 text-red-500'
                      }`}>
                        {readinessLabel[item.readiness]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-medium">Upload PYQs to unlock exam-readiness analytics.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Revision Queue</h3>
                  <p className="text-xs text-gray-400 font-bold">Subjects worth revisiting</p>
                </div>
              </div>
              <div className="space-y-3">
                {plan.revisionQueue.length === 0 ? (
                  <p className="text-sm text-gray-400 font-medium">Start completing units and this will become your revision list.</p>
                ) : (
                  plan.revisionQueue.map((subject) => (
                    <button
                      key={subject._id}
                      onClick={() => router.push(`/dashboard/subject/${subject._id}`)}
                      className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-gray-50 hover:bg-violet-50 transition-all"
                    >
                      <span className="text-xs font-black text-gray-700 truncate">{subject.code}: {subject.name}</span>
                      <span className="text-xs font-black text-violet-600">{subject.progressPercentage}%</span>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
