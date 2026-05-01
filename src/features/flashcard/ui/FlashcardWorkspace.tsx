'use client';

import { useCallback, useEffect, useState } from 'react';
import { Brain, Loader2, Sparkles } from 'lucide-react';
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

  const fetchCards = useCallback(async () => {
    if (!token) return;
    const data = await flashcardApi.list({ subjectId: subjectId || undefined, unitId: unitId || undefined, due: false }, token);
    setCards(data);
    setActive(0);
    setFlipped(false);
  }, [subjectId, token, unitId]);

  useEffect(() => {
    if (user?.semester) academicApi.getSubjects(user.semester).then(setSubjects).catch(console.error);
  }, [user?.semester]);

  useEffect(() => {
    if (!subjectId) {
      setUnits([]);
      fetchCards().catch(console.error);
      return;
    }
    academicApi.getUnits(subjectId).then(setUnits).catch(console.error);
    fetchCards().catch(console.error);
  }, [fetchCards, subjectId]);

  useEffect(() => {
    fetchCards().catch(console.error);
  }, [fetchCards, unitId]);

  const generate = async () => {
    if (!token || !subjectId) return;
    setLoading(true);
    try {
      const created = await flashcardApi.generate({ subjectId, unitId: unitId || undefined, count: 10 }, token);
      setCards(created);
      setActive(0);
      setFlipped(false);
    } finally {
      setLoading(false);
    }
  };

  const review = async (rating: 'again' | 'good' | 'easy') => {
    if (!token || !cards[active]) return;
    await flashcardApi.review(cards[active]._id, rating, token);
    setActive(prev => Math.min(prev + 1, cards.length - 1));
    setFlipped(false);
  };

  const card = cards[active];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-600 mb-3">
            <Brain className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Spaced Revision</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Flashcards</h1>
          <p className="text-gray-500 font-medium mt-2">Generate and review BCA memory cards for definitions, formulas, syntax, and viva answers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-[620px]">
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">All Subjects</option>
            {subjects.map(subject => <option key={subject._id} value={subject._id}>{subject.code} - {subject.name}</option>)}
          </select>
          <select value={unitId} onChange={e => setUnitId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-3 text-sm font-bold">
            <option value="">All Units</option>
            {units.map(unit => <option key={unit._id} value={unit._id}>Unit {unit.unitNumber}</option>)}
          </select>
          <button onClick={generate} disabled={loading || !subjectId} className="h-12 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>
      </section>

      {card ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between text-sm font-black text-gray-400 uppercase tracking-widest px-1">
            <span>Card {active + 1} of {cards.length}</span>
            <span>{card.topic || 'General'}</span>
          </div>
          <button onClick={() => setFlipped(!flipped)} className="w-full min-h-[360px] bg-white border border-gray-100 rounded-[2rem] shadow-sm p-10 text-center flex items-center justify-center">
            <p className="text-2xl font-black text-gray-900 leading-relaxed whitespace-pre-wrap">{flipped ? card.back : card.front}</p>
          </button>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => review('again')} className="h-12 rounded-xl bg-red-50 text-red-600 font-black">Again</button>
            <button onClick={() => review('good')} className="h-12 rounded-xl bg-blue-50 text-blue-600 font-black">Good</button>
            <button onClick={() => review('easy')} className="h-12 rounded-xl bg-green-50 text-green-600 font-black">Easy</button>
          </div>
        </section>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <p className="text-gray-400 font-bold">No flashcards yet. Pick a subject and generate a revision deck.</p>
        </div>
      )}
    </main>
  );
};
