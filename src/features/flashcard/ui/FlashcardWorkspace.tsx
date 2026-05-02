'use client';

import { useCallback, useEffect, useState } from 'react';
import { Brain, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { academicApi } from '@/features/academic/api/academic-api';
import { flashcardApi, Flashcard } from '../api/flashcard.api';

interface SubjectOption { _id: string; name: string; code?: string; semester: number; }
interface UnitOption { _id: string; unitNumber: number; title: string; }

export const FlashcardWorkspace = () => {
  const { token, user } = useAuthStore();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCards = useCallback(async () => {
    if (!token) return;
    setInitialLoading(true);
    setError('');
    try {
      const data = await flashcardApi.list({ subjectId: subjectId || undefined, unitId: unitId || undefined, due: false }, token);
      setCards(data);
      setActive(0);
      setFlipped(false);
    } catch (fetchError) {
      console.error('Failed to load flashcards', fetchError);
      setError('Flashcards could not be loaded right now.');
      setCards([]);
    } finally {
      setInitialLoading(false);
    }
  }, [subjectId, token, unitId]);

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

  useEffect(() => {
    fetchCards().catch(console.error);
  }, [fetchCards]);

  const generate = async () => {
    if (!token || !subjectId) return;
    setLoading(true);
    setError('');
    try {
      const created = await flashcardApi.generate({ subjectId, unitId: unitId || undefined, count: 10 }, token);
      setCards(created);
      setActive(0);
      setFlipped(false);
    } catch (generateError) {
      console.error('Failed to generate flashcards', generateError);
      setError('Flashcard generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const review = async (rating: 'again' | 'good' | 'easy') => {
    if (!token || !cards[active]) return;
    setError('');
    try {
      await flashcardApi.review(cards[active]._id, rating, token);
      setActive((prev) => Math.min(prev + 1, cards.length - 1));
      setFlipped(false);
    } catch (reviewError) {
      console.error('Failed to review flashcard', reviewError);
      setError('The review action could not be saved. Please try again.');
    }
  };

  const card = cards[active];
  const progress = cards.length > 0 ? Math.round(((active + 1) / cards.length) * 100) : 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50 p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-violet-600">
              <Brain className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[0.24em]">Spaced Revision</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Flashcards</h1>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Compact revision cards with real flip motion for definitions, formulas, syntax, and viva answers.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3 xl:w-[640px]">
            <select
              value={subjectId}
              onChange={(e) => { setSubjectId(e.target.value); setUnitId(''); }}
              className="h-12 rounded-2xl border border-white/70 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-violet-400"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>

            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="h-12 rounded-2xl border border-white/70 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-violet-400"
            >
              <option value="">All Units</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  Unit {unit.unitNumber}
                </option>
              ))}
            </select>

            <button
              onClick={generate}
              disabled={loading || !subjectId}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {initialLoading ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
          <p className="text-sm font-bold text-slate-400">Loading your flashcard deck...</p>
        </div>
      ) : card ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Card {active + 1} of {cards.length}
                </p>
                <h2 className="mt-2 text-lg font-black uppercase tracking-[0.16em] text-slate-700">
                  {card.topic || 'General Revision'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFlipped((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Flip card
              </button>
            </div>

            <div className="[perspective:1400px]">
              <button
                type="button"
                onClick={() => setFlipped((prev) => !prev)}
                className="block w-full rounded-[2rem] text-left focus:outline-none"
              >
                <div
                  className={`relative min-h-[360px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                    flipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 rounded-[2rem] border border-violet-100 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] [backface-visibility:hidden] md:p-8">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-600">
                          Front
                        </span>
                        <span className="text-xs font-semibold text-slate-400">Tap or click to flip</span>
                      </div>
                      <div className="flex flex-1 items-center justify-center py-10">
                        <p className="max-w-3xl text-center text-2xl font-black leading-relaxed text-slate-900 md:text-3xl">
                          {card.front}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-[2rem] border border-violet-200 bg-gradient-to-br from-slate-900 via-violet-950 to-violet-800 p-6 text-white shadow-[0_18px_45px_rgba(76,29,149,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-8">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-100">
                          Back
                        </span>
                        <span className="text-xs font-semibold text-violet-200">Answer</span>
                      </div>
                      <div className="flex flex-1 items-center justify-center py-10">
                        <p className="max-w-3xl whitespace-pre-wrap text-center text-lg font-semibold leading-8 text-violet-50 md:text-xl">
                          {card.back}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => review('again')}
                className="h-12 rounded-2xl border border-red-100 bg-red-50 text-sm font-black text-red-600 transition-colors hover:bg-red-100"
              >
                Again
              </button>
              <button
                onClick={() => review('good')}
                className="h-12 rounded-2xl border border-blue-100 bg-blue-50 text-sm font-black text-blue-600 transition-colors hover:bg-blue-100"
              >
                Good
              </button>
              <button
                onClick={() => review('easy')}
                className="h-12 rounded-2xl border border-emerald-100 bg-emerald-50 text-sm font-black text-emerald-600 transition-colors hover:bg-emerald-100"
              >
                Easy
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Progress</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{progress}%</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">
                {cards.length - active - 1} card{cards.length - active - 1 === 1 ? '' : 's'} left in this deck.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Current Card</p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Topic</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{card.topic || 'General Revision'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Difficulty</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{card.difficulty}/5</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Next Review</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {card.dueAt ? new Date(card.dueAt).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-violet-100 bg-violet-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-500">Tip</p>
              <p className="mt-3 text-sm font-medium leading-6 text-violet-900">
                Read the front first, flip only after answering in your head, then rate honestly so the next review timing stays useful.
              </p>
            </div>
          </aside>
        </section>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
          <p className="text-sm font-bold text-slate-400">No flashcards yet. Pick a subject and generate a revision deck.</p>
        </div>
      )}
    </main>
  );
};
