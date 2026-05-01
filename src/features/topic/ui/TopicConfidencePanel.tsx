'use client';

import { useEffect, useState } from 'react';
import { topicApi, TopicProgress } from '../api/topic.api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

interface TopicConfidencePanelProps {
  subjectId: string;
  unitId: string;
  topics: string[];
}

export const TopicConfidencePanel = ({ subjectId, unitId, topics }: TopicConfidencePanelProps) => {
  const token = useAuthStore(state => state.token);
  const [records, setRecords] = useState<TopicProgress[]>([]);

  useEffect(() => {
    if (!token) return;
    topicApi.bySubject(subjectId, token).then(setRecords).catch(console.error);
  }, [subjectId, token]);

  const confidenceFor = (topic: string) => records.find(record => record.unitId === unitId && record.topic === topic)?.confidence || 0;

  const update = async (topic: string, confidence: number) => {
    if (!token) return;
    const record = await topicApi.update({ subjectId, unitId, topic, confidence }, token);
    setRecords(prev => prev.find(item => item._id === record._id)
      ? prev.map(item => item._id === record._id ? record : item)
      : [...prev, record]);
  };

  if (topics.length === 0) return null;

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Topic Confidence</h4>
      <div className="space-y-3">
        {topics.map(topic => {
          const confidence = confidenceFor(topic);
          return (
            <div key={topic} className="grid grid-cols-1 md:grid-cols-[1fr_180px_44px] gap-3 items-center">
              <span className="text-sm font-medium text-gray-600">{topic}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={confidence}
                onChange={e => update(topic, Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-xs font-black text-blue-600 text-right">{confidence}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
