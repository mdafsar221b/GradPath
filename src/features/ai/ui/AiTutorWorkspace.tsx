'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { academicApi } from '@/features/academic/api/academic-api';
import { aiApi, AiMessage } from '../api/ai.api';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

interface UnitOption {
  _id: string;
  unitNumber: number;
  title: string;
}

export const AiTutorWorkspace = () => {
  const { token, user } = useAuthStore();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [question, setQuestion] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.semester) return;
    academicApi.getSubjects(user.semester).then(setSubjects).catch(console.error);
  }, [user?.semester]);

  useEffect(() => {
    if (!subjectId) {
      setUnits([]);
      setUnitId('');
      return;
    }
    academicApi.getUnits(subjectId).then(setUnits).catch(console.error);
  }, [subjectId]);

  const placeholder = useMemo(() => {
    const selected = subjects.find(subject => subject._id === subjectId);
    return selected ? `Ask about ${selected.code || 'BCA'} concepts, code, PYQs, or exam answers...` : 'Ask any BCA question...';
  }, [subjectId, subjects]);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !question.trim()) return;
    const currentQuestion = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: currentQuestion }]);
    setLoading(true);
    try {
      const response = await aiApi.ask({ question: currentQuestion, subjectId, unitId, conversationId }, token);
      setConversationId(response.conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I could not reach the AI tutor. Check the Gemini API key and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Gemini Powered</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">BCA AI Tutor</h1>
          <p className="text-gray-500 font-medium mt-2">Ask for explanations, exam answers, code walkthroughs, viva prep, and unit summaries.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-[520px]">
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="h-12 bg-white border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none">
            <option value="">Any Subject</option>
            {subjects.map(subject => <option key={subject._id} value={subject._id}>{subject.code} - {subject.name}</option>)}
          </select>
          <select value={unitId} onChange={e => setUnitId(e.target.value)} disabled={!subjectId} className="h-12 bg-white border border-gray-100 rounded-xl px-4 text-sm font-bold outline-none disabled:opacity-50">
            <option value="">Any Unit</option>
            {units.map(unit => <option key={unit._id} value={unit._id}>Unit {unit.unitNumber}: {unit.title}</option>)}
          </select>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="h-[58vh] overflow-y-auto p-6 space-y-5 bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Start with a hard topic</h2>
              <p className="text-sm text-gray-500 font-medium mt-2 max-w-md">Try: “Explain normalization with examples” or “Give me a 10-mark answer for process synchronization.”</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl rounded-3xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-100'
                }`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
          {loading && <div className="text-sm text-gray-400 font-bold flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Thinking through the syllabus...</div>}
        </div>
        <form onSubmit={ask} className="p-4 border-t border-gray-100 flex gap-3">
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder={placeholder} className="flex-1 h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-medium outline-none focus:border-blue-500" />
          <button disabled={loading || !question.trim()} className="h-12 px-5 rounded-2xl bg-blue-600 text-white font-black disabled:opacity-50 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Ask
          </button>
        </form>
      </section>
    </main>
  );
};
