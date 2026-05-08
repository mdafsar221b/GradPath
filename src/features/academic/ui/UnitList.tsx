'use client';

import { useEffect, useState } from 'react';
import { academicApi } from '../api/academic-api';
import { ResourceList } from '@/features/resource/ui/ResourceList';
import { useProgressStore } from '@/features/progress/model/progress.store';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { CheckCircle2, ChevronDown, Circle } from 'lucide-react';
import { TopicConfidencePanel } from '@/features/topic/ui/TopicConfidencePanel';
import { ContextDiscussionPanel } from '@/features/discussion/ui/ContextDiscussionPanel';

interface Unit {
  _id: string;
  unitNumber: number;
  title: string;
  topics?: string[];
}

export const UnitList = ({ subjectId }: { subjectId: string }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);
  const { progressList, setUnitCompletion, fetchProgress } = useProgressStore();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await academicApi.getUnits(subjectId);
        setUnits(data);
        setExpandedUnit((current) => current || data[0]?._id || null);
      } catch (error) {
        console.error('Failed to fetch units', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
    if (token) fetchProgress(token);
  }, [subjectId, token, fetchProgress]);

  const subjectProgress = progressList.find((p) => p.subjectId === subjectId);
  const completedUnits = subjectProgress?.completedUnits || [];

  if (loading) return <div className="p-4 text-center">Loading units...</div>;

  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const isCompleted = completedUnits.includes(unit.unitNumber);
        const topicCount = unit.topics?.length || 0;

        return (
          <div
            key={unit._id}
            className={`overflow-hidden rounded-[1.8rem] border bg-white shadow-sm transition-colors ${
              isCompleted ? 'border-emerald-200' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <button
                type="button"
                onClick={() => setExpandedUnit(expandedUnit === unit._id ? null : unit._id)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                    isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {unit.unitNumber}
                </div>
                <div className="min-w-0">
                  <p className={`text-lg font-black ${isCompleted ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {unit.title}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {topicCount} topic{topicCount === 1 ? '' : 's'} in this unit
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => token && setUnitCompletion(subjectId, unit.unitNumber, !isCompleted, token)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  {isCompleted ? 'Completed' : 'Mark complete'}
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedUnit(expandedUnit === unit._id ? null : unit._id)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"
                  aria-label={expandedUnit === unit._id ? 'Collapse unit' : 'Expand unit'}
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedUnit === unit._id ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>

            {expandedUnit === unit._id ? (
              <div className={`border-t px-5 pb-5 pt-4 ${isCompleted ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/40'}`}>
                <TopicConfidencePanel
                  subjectId={subjectId}
                  unitId={unit._id}
                  unitNumber={unit.unitNumber}
                  topics={unit.topics || []}
                  isUnitCompleted={isCompleted}
                  onUnitCompletionChange={(completed) => {
                    if (token) {
                      setUnitCompletion(subjectId, unit.unitNumber, completed, token);
                    }
                  }}
                />
                <ResourceList subjectId={subjectId} unitId={unit._id} />
                <div className="mt-4">
                  <ContextDiscussionPanel
                    contextType="unit"
                    unitId={unit._id}
                    title={`Unit ${unit.unitNumber} Discussion`}
                    description="Discuss this unit with classmates and seniors without leaving the subject workspace."
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
