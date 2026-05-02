'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { topicApi, TopicProgress } from '../api/topic.api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

interface TopicConfidencePanelProps {
  subjectId: string;
  unitId: string;
  unitNumber: number;
  topics: string[];
  isUnitCompleted: boolean;
  onUnitCompletionChange: (completed: boolean) => void;
}

export const TopicConfidencePanel = ({
  subjectId,
  unitId,
  unitNumber,
  topics,
  isUnitCompleted,
  onUnitCompletionChange,
}: TopicConfidencePanelProps) => {
  const token = useAuthStore((state) => state.token);
  const [records, setRecords] = useState<TopicProgress[]>([]);
  const [savingTopic, setSavingTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    topicApi.bySubject(subjectId, token).then(setRecords).catch(console.error);
  }, [subjectId, token]);

  const topicMap = useMemo(() => {
    const map = new Map<string, TopicProgress>();
    records
      .filter((record) => record.unitId === unitId)
      .forEach((record) => map.set(record.topic, record));
    return map;
  }, [records, unitId]);

  const completedCount = topics.filter((topic) => (topicMap.get(topic)?.confidence || 0) >= 100).length;

  const syncUnitCompletion = async (nextCompletedCount: number) => {
    const shouldBeCompleted = topics.length > 0 && nextCompletedCount === topics.length;
    if (shouldBeCompleted !== isUnitCompleted) {
      onUnitCompletionChange(shouldBeCompleted);
    }
  };

  const updateTopic = async (topic: string, completed: boolean) => {
    if (!token) return;
    setSavingTopic(topic);
    try {
      const record = await topicApi.update(
        {
          subjectId,
          unitId,
          topic,
          confidence: completed ? 100 : 0,
        },
        token
      );

      const nextRecords = records.find((item) => item._id === record._id)
        ? records.map((item) => (item._id === record._id ? record : item))
        : [...records, record];

      setRecords(nextRecords);

      const nextCompletedCount = topics.filter((item) => {
        if (item === topic) {
          return completed;
        }
        const current = nextRecords.find((entry) => entry.unitId === unitId && entry.topic === item);
        return (current?.confidence || 0) >= 100;
      }).length;

      await syncUnitCompletion(nextCompletedCount);
    } catch (error) {
      console.error('Failed to update topic progress', error);
    } finally {
      setSavingTopic(null);
    }
  };

  const markAll = async (completed: boolean) => {
    for (const topic of topics) {
      const currentCompleted = (topicMap.get(topic)?.confidence || 0) >= 100;
      if (currentCompleted !== completed) {
        // Sequential on purpose to keep UI/store state predictable.
        await updateTopic(topic, completed);
      }
    }
  };

  if (topics.length === 0) return null;

  return (
    <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Topic Progress</h4>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Click a topic once to mark it done. Unit {unitNumber} updates automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            {completedCount}/{topics.length} done
          </span>
          <button
            type="button"
            onClick={() => markAll(false)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {topics.map((topic) => {
          const isCompleted = (topicMap.get(topic)?.confidence || 0) >= 100;
          const isSaving = savingTopic === topic;

          return (
            <button
              key={topic}
              type="button"
              onClick={() => updateTopic(topic, !isCompleted)}
              disabled={isSaving}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
              } ${isSaving ? 'opacity-70' : ''}`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${isCompleted ? 'line-through decoration-emerald-300' : ''}`}>
                  {topic}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
