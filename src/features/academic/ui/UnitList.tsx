'use client';

import { useEffect, useState } from 'react';
import { academicApi } from '../api/academic-api';
import { ResourceList } from '@/features/resource/ui/ResourceList';
import { useProgressStore } from '@/features/progress/model/progress.store';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { CheckCircle2, Circle } from 'lucide-react';
import { TopicConfidencePanel } from '@/features/topic/ui/TopicConfidencePanel';

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
  
  const token = useAuthStore(state => state.token);
  const { progressList, toggleUnit, fetchProgress } = useProgressStore();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const data = await academicApi.getUnits(subjectId);
        setUnits(data);
      } catch (error) {
        console.error('Failed to fetch units', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
    if (token) fetchProgress(token);
  }, [subjectId, token, fetchProgress]);

  const subjectProgress = progressList.find(p => p.subjectId === subjectId);
  const completedUnits = subjectProgress?.completedUnits || [];

  if (loading) return <div className="p-4 text-center">Loading units...</div>;

  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const isCompleted = completedUnits.includes(unit.unitNumber);
        
        return (
          <div 
            key={unit._id} 
            className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
              isCompleted ? 'border-green-100' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (token) toggleUnit(subjectId, unit.unitNumber, token);
                }}
                className={`p-5 pr-2 transition-colors ${
                  isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={() => setExpandedUnit(expandedUnit === unit._id ? null : unit._id)}
                className="flex-1 flex items-center p-5 pl-0 text-left hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 font-bold shrink-0 text-xs ${
                  isCompleted ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                }`}>
                  {unit.unitNumber}
                </div>
                <p className={`font-semibold shrink-0 text-sm md:text-base ${
                  isCompleted ? 'text-green-900' : 'text-gray-900'
                }`}>{unit.title}</p>
              </button>
            </div>
            
            {expandedUnit === unit._id && (
              <div className={`px-5 pb-5 pt-0 border-t ${isCompleted ? 'border-green-50 bg-green-50/20' : 'border-gray-50 bg-gray-50/30'}`}>
                {unit.topics && unit.topics.length > 0 && (
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {unit.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 mt-1.5 shrink-0 ${
                          isCompleted ? 'bg-green-400' : 'bg-blue-400'
                        }`}></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}
                <TopicConfidencePanel subjectId={subjectId} unitId={unit._id} topics={unit.topics || []} />
                <ResourceList subjectId={subjectId} unitId={unit._id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
