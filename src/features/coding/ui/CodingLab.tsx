'use client';

import { useCallback, useEffect, useState } from 'react';
import { Code2, Loader2, Wand2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { codingApi, CodingChallenge, CodingReview } from '../api/coding.api';

export const CodingLab = () => {
  const { token } = useAuthStore();
  const [track, setTrack] = useState('');
  const [challenges, setChallenges] = useState<CodingChallenge[]>([]);
  const [selected, setSelected] = useState<CodingChallenge | null>(null);
  const [code, setCode] = useState('');
  const [review, setReview] = useState<CodingReview | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    const data = await codingApi.challenges({ track: track || undefined }, token);
    setChallenges(data);
    const first = data[0] || null;
    setSelected(first);
    setCode(first?.starterCode || '');
    setReview(null);
  }, [token, track]);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const submit = async () => {
    if (!token || !selected) return;
    setLoading(true);
    try {
      const data = await codingApi.review({ challengeId: selected._id || selected.title, code, language: selected.language }, token);
      setReview(data.review);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-gray-900 mb-3">
            <Code2 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">BCA Coding Lab</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Coding Lab</h1>
          <p className="text-gray-500 font-medium mt-2">Practice C, C++, Java, SQL, DSA, and Web Development with Gemini-powered review.</p>
        </div>
        <select value={track} onChange={e => setTrack(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-4 text-sm font-bold w-full lg:w-72">
          <option value="">All Tracks</option>
          <option value="c-programming">C Programming</option>
          <option value="cpp-oop">C++ OOP</option>
          <option value="java">Java</option>
          <option value="dsa">DSA</option>
          <option value="dbms-sql">DBMS SQL</option>
          <option value="web-development">Web Development</option>
        </select>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="space-y-3">
          {challenges.map(challenge => (
            <button
              key={challenge._id || challenge.title}
              onClick={() => {
                setSelected(challenge);
                setCode(challenge.starterCode);
                setReview(null);
              }}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${selected?.title === challenge.title ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-blue-100'}`}
            >
              <p className="font-black text-gray-900 text-sm">{challenge.title}</p>
              <p className="text-[10px] font-black uppercase text-gray-400 mt-1">{challenge.language} - {challenge.difficulty}</p>
            </button>
          ))}
        </aside>

        <section className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {selected ? (
            <>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-black text-gray-900">{selected.title}</h2>
                <p className="text-gray-500 font-medium mt-2">{selected.prompt}</p>
                <p className="text-xs font-bold text-gray-400 mt-3">Expected: {selected.expectedOutput}</p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2">
                <div className="p-6 border-r border-gray-100">
                  <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-[460px] bg-gray-950 text-gray-100 rounded-2xl p-5 font-mono text-sm outline-none resize-none" />
                  <button onClick={submit} disabled={loading || !code.trim()} className="mt-4 h-12 px-5 rounded-xl bg-gray-900 text-white font-black flex items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    Review Solution
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  {review ? (
                    <>
                      <div className="p-5 rounded-2xl bg-gray-50">
                        <p className="text-xs font-black uppercase text-gray-400">Verdict</p>
                        <h3 className="text-3xl font-black text-gray-900 capitalize">{review.verdict} - {review.score}%</h3>
                      </div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{review.feedback}</p>
                      {review.fixes && review.fixes.length > 0 && (
                        <ul className="space-y-2">
                          {review.fixes.map(fix => <li key={fix} className="text-sm text-gray-600 bg-red-50 rounded-xl p-3">{fix}</li>)}
                        </ul>
                      )}
                      {review.improvedCode && <pre className="bg-gray-950 text-gray-100 rounded-2xl p-4 text-xs overflow-auto">{review.improvedCode}</pre>}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-gray-400 font-bold">
                      Submit your solution to get AI review, corrections, and improved code.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-20 text-center text-gray-400 font-bold">No coding challenges available.</div>
          )}
        </section>
      </div>
    </main>
  );
};
