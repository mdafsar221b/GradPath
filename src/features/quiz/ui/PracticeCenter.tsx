'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, PlayCircle, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { academicApi } from '@/features/academic/api/academic-api';
import { quizApi, Quiz } from '../api/quiz.api';

interface SubjectOption { _id: string; name: string; code?: string; semester: number; }
interface UnitOption { _id: string; unitNumber: number; title: string; }

export const PracticeCenter = () => {
  const { token, user } = useAuthStore();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [mode, setMode] = useState('unit');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.semester) academicApi.getSubjects(user.semester).then(setSubjects).catch(console.error);
  }, [user?.semester]);

  useEffect(() => {
    if (!subjectId) return;
    academicApi.getUnits(subjectId).then(setUnits).catch(console.error);
  }, [subjectId]);

  const generate = async () => {
    if (!token || !subjectId) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await quizApi.generate({ subjectId, unitId: unitId || undefined, mode, count: 8 }, token);
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!token || !quiz) return;
    const data = await quizApi.attempt(quiz._id, answers, token);
    setResult({ score: data.attempt.score, total: data.attempt.total });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Practice Center</h1>
          <p className="text-gray-500 font-medium mt-2">Generate AI quizzes for unit tests, PYQ prep, mixed revision, and viva practice.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full lg:w-[760px]">
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">Subject</option>
            {subjects.map(subject => <option key={subject._id} value={subject._id}>{subject.code} - {subject.name}</option>)}
          </select>
          <select value={unitId} onChange={e => setUnitId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">All Units</option>
            {units.map(unit => <option key={unit._id} value={unit._id}>Unit {unit.unitNumber}</option>)}
          </select>
          <select value={mode} onChange={e => setMode(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="unit">Unit</option>
            <option value="pyq">PYQ</option>
            <option value="mixed">Mixed</option>
            <option value="viva">Viva</option>
          </select>
          <button onClick={generate} disabled={loading || !subjectId} className="h-12 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </section>

      {quiz ? (
        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">{quiz.title}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase mt-1">{quiz.mode} practice</p>
            </div>
            {result && <div className="px-4 py-3 rounded-2xl bg-green-50 text-green-600 font-black">{result.score}/{result.total}</div>}
          </div>

          {quiz.questions.map((question, qIndex) => (
            <div key={question._id || qIndex} className="p-5 rounded-2xl bg-gray-50 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="font-black text-gray-900">{qIndex + 1}. {question.prompt}</p>
                <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white text-gray-400">{question.difficulty}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const isCorrect = result && question.answerIndex === oIndex;
                  return (
                    <button
                      key={`${question._id}-${oIndex}`}
                      onClick={() => setAnswers(prev => prev.map((value, index) => index === qIndex ? oIndex : value))}
                      className={`p-3 rounded-xl text-left text-sm font-bold border transition-all ${
                        isCorrect
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : isSelected
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-blue-100'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {result && <p className="text-sm text-gray-500 font-medium">{question.explanation}</p>}
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={submit} disabled={answers.includes(-1) || !!result} className="px-5 py-3 bg-gray-900 text-white rounded-xl font-black disabled:opacity-50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Submit Quiz
            </button>
            <button onClick={() => { setQuiz(null); setResult(null); }} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-black flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </section>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <p className="text-gray-400 font-bold">Choose a subject and generate your first practice set.</p>
        </div>
      )}
    </main>
  );
};
