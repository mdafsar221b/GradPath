'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, Loader2, PlayCircle, RotateCcw, Sparkles } from 'lucide-react';
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
  const [writtenNotes, setWrittenNotes] = useState<string[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.semester) academicApi.getSubjects(user.semester).then(setSubjects).catch(console.error);
  }, [user?.semester]);

  useEffect(() => {
    if (!subjectId) {
      setUnits([]);
      setUnitId('');
      return;
    }
    academicApi.getUnits(subjectId).then(setUnits).catch(console.error);
  }, [subjectId]);

  const isWrittenMode = useMemo(
    () => mode === 'pyq' || quiz?.questions.some((question) => question.questionType !== 'mcq'),
    [mode, quiz]
  );
  const modeDescriptions = {
    unit: 'Quick objective questions from the selected unit or subject.',
    pyq: 'Written university-style practice with 3, 7, and 14 mark questions.',
    mixed: 'Objective revision across multiple topics for fast recap.',
    viva: 'Oral-style quick questions for interview and viva prep.',
  } as const;

  const generate = async () => {
    if (!token || !subjectId) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const data = await quizApi.generate({ subjectId, unitId: unitId || undefined, mode, count: 8 }, token);
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
      setWrittenNotes(Array(data.questions.length).fill(''));
      setRevealedAnswers([]);
    } catch (generateError) {
      console.error('Failed to generate quiz', generateError);
      setError('Quiz generation failed. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!token || !quiz || isWrittenMode) return;
    setError('');
    try {
      const data = await quizApi.attempt(quiz._id, answers, token);
      setResult({ score: data.attempt.score, total: data.attempt.total });
    } catch (submitError) {
      console.error('Failed to submit quiz', submitError);
      setError('Your quiz could not be submitted. Please try again.');
    }
  };

  const toggleReveal = (index: number) => {
    setRevealedAnswers((prev) => (
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    ));
  };

  const questionTypeLabel = (questionType: string, marks?: number) => {
    if (questionType === 'short') return `${marks || 3} mark short`;
    if (questionType === 'medium') return `${marks || 7} mark answer`;
    if (questionType === 'long') return `${marks || 14} mark long`;
    return 'mcq';
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Practice Center</h1>
          <p className="mt-2 text-gray-500 font-medium">
            Objective quizzes for quick testing, and written PYQ practice for short and long answers.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-4 lg:w-[760px]">
          <select value={subjectId} onChange={e => { setSubjectId(e.target.value); setUnitId(''); }} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">Subject</option>
            {subjects.map(subject => <option key={subject._id} value={subject._id}>{subject.code} - {subject.name}</option>)}
          </select>
          <select value={unitId} onChange={e => setUnitId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">All Units</option>
            {units.map(unit => <option key={unit._id} value={unit._id}>Unit {unit.unitNumber}</option>)}
          </select>
          <select value={mode} onChange={e => setMode(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="unit">Unit</option>
            <option value="pyq">PYQ Written</option>
            <option value="mixed">Mixed</option>
            <option value="viva">Viva</option>
          </select>
          <button onClick={generate} disabled={loading || !subjectId} className="h-12 bg-blue-600 text-white rounded-xl font-black flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Current mode</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{modeDescriptions[mode as keyof typeof modeDescriptions]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === 'pyq' ? (
            <>
              <span className="rounded-full bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">3 marks</span>
              <span className="rounded-full bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">7 marks</span>
              <span className="rounded-full bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">14 marks</span>
            </>
          ) : (
            <>
              <span className="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">Objective</span>
              <span className="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">Instant scoring</span>
            </>
          )}
        </div>
      </div>

      {mode === 'pyq' ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          PYQ mode now follows written university-paper style: 3 mark, 7 mark, and 14 mark questions with answer guides.
        </div>
      ) : null}

      {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}

      {quiz ? (
        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">{quiz.title}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase mt-1">
                {quiz.mode} {isWrittenMode ? 'written practice' : 'objective practice'}
              </p>
            </div>
            {result ? <div className="px-4 py-3 rounded-2xl bg-green-50 text-green-600 font-black">{result.score}/{result.total}</div> : null}
          </div>

          <div className="space-y-5">
            {quiz.questions.map((question, qIndex) => {
              const isWritten = question.questionType !== 'mcq';
              const isRevealed = revealedAnswers.includes(qIndex);

              return (
                <div key={question._id || qIndex} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-gray-900">{qIndex + 1}. {question.prompt}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white text-gray-400">{question.difficulty}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                          isWritten ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {isWritten ? questionTypeLabel(question.questionType, question.marks) : 'mcq'}
                        </span>
                        {question.marks ? (
                          <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-violet-50 text-violet-700">
                            {question.marks} marks
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {isWritten ? (
                    <div className="space-y-4">
                      <textarea
                        value={writtenNotes[qIndex] || ''}
                        onChange={(e) => setWrittenNotes((prev) => prev.map((item, index) => index === qIndex ? e.target.value : item))}
                        placeholder="Write your answer here..."
                        className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => toggleReveal(qIndex)}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          {isRevealed ? 'Hide answer guide' : 'Show answer guide'}
                        </button>
                      </div>
                      {isRevealed ? (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Answer Guide</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-emerald-950">
                            {question.answerGuide || question.explanation || 'No answer guide available yet.'}
                          </p>
                          {question.explanation ? (
                            <p className="mt-3 text-sm font-medium text-emerald-800">{question.explanation}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : (
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
                  )}

                  {!isWritten && result ? <p className="text-sm text-gray-500 font-medium">{question.answerGuide || question.explanation}</p> : null}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            {isWrittenMode ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                <Sparkles className="h-4 w-4" />
                Written PYQ mode is self-practice based. Write first, then reveal the answer guide.
              </div>
            ) : (
              <button onClick={submit} disabled={answers.includes(-1) || !!result} className="px-5 py-3 bg-gray-900 text-white rounded-xl font-black disabled:opacity-50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Submit Quiz
              </button>
            )}

            <button onClick={() => { setQuiz(null); setResult(null); setRevealedAnswers([]); }} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-black flex items-center gap-2">
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
