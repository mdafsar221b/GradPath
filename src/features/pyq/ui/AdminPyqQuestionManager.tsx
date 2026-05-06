'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText, Loader2, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { Resource } from '@/features/resource/model/resource.types';
import { pyqApi } from '../api/pyq.api';
import { PyqPaperLayout, PyqQuestion } from '../model/pyq.types';
import { ExamPaperPreview } from './ExamPaperPreview';

interface AdminPyqQuestionManagerProps {
  resource: Resource;
  onClose: () => void;
}

const emptyForm = {
  year: '',
  examSession: '',
  prompt: '',
  marks: '3',
  questionType: 'short' as PyqQuestion['questionType'],
  answerOutline: '',
  notes: '',
};

export const AdminPyqQuestionManager = ({
  resource,
  onClose,
}: AdminPyqQuestionManagerProps) => {
  const [questions, setQuestions] = useState<PyqQuestion[]>([]);
  const [paper, setPaper] = useState<PyqPaperLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [rawText, setRawText] = useState('');

  const resourceYear = resource.year || '';
  const resourceSession = resource.examSession || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [questionData, paperData] = await Promise.all([
          pyqApi.listQuestions(resource._id),
          pyqApi.getResourcePaper(resource._id),
        ]);
        setQuestions(questionData);
        setPaper(paperData.paper);
        setRawText(paperData.paper?.rawText || '');
      } catch (error) {
        console.error('Failed to load PYQ curation data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resource._id]);

  const resetForm = useCallback(() => {
    setForm({
      ...emptyForm,
      year: resourceYear,
      examSession: resourceSession,
    });
    setEditingId(null);
  }, [resourceSession, resourceYear]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => {
      const numberDiff = (a.questionNumber || 0) - (b.questionNumber || 0);
      if (numberDiff !== 0) return numberDiff;
      return (a.subpartLabel || '').localeCompare(b.subpartLabel || '');
    }),
    [questions]
  );

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        year: form.year.trim(),
        examSession: form.examSession.trim(),
        prompt: form.prompt.trim(),
        marks: Number(form.marks),
        questionType: form.questionType,
        answerOutline: form.answerOutline.trim(),
        notes: form.notes.trim(),
      };

      if (editingId) {
        const updated = await pyqApi.updateQuestion(editingId, payload);
        setQuestions((prev) => prev.map((question) => (question._id === editingId ? updated : question)));
      } else {
        const created = await pyqApi.createQuestion(resource._id, payload);
        setQuestions((prev) => [...prev, created]);
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save PYQ question', error);
    } finally {
      setSaving(false);
    }
  };

  const parsePaper = async () => {
    if (!rawText.trim()) return;
    setParsing(true);
    try {
      const response = await pyqApi.parseResourcePaper(resource._id, {
        rawText,
        year: form.year.trim() || resourceYear,
        examSession: form.examSession.trim() || resourceSession,
      });
      setQuestions(response.questions);
      setPaper(response.paper);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to parse PYQ paper', error);
    } finally {
      setParsing(false);
    }
  };

  const startEdit = (question: PyqQuestion) => {
    setEditingId(question._id);
    setForm({
      year: question.year || resourceYear,
      examSession: question.examSession || resourceSession,
      prompt: question.prompt,
      marks: String(question.marks),
      questionType: question.questionType,
      answerOutline: question.answerOutline || '',
      notes: question.notes || '',
    });
  };

  const removeQuestion = async (id: string) => {
    if (!confirm('Delete this curated PYQ question?')) return;
    try {
      await pyqApi.deleteQuestion(id);
      setQuestions((prev) => prev.filter((question) => question._id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error('Failed to delete PYQ question', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Curate PYQ Questions</h2>
            <p className="mt-1 text-sm text-slate-500">{resource.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {paper ? (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-700" />
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Structured Paper Preview</h3>
                        <p className="text-sm font-medium text-slate-500">Use this preview to verify the parsed exam format before students generate model papers from it.</p>
                      </div>
                    </div>
                    <ExamPaperPreview paper={paper} footerLabel="Admin preview" className="p-3 md:p-5" />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-500">
                    No structured paper preview yet. Paste the extracted full paper text on the right and auto-parse it.
                  </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h3 className="text-lg font-black text-slate-900">Curated Question Entries</h3>
                    <p className="mt-1 text-sm text-slate-500">These are the saved, syllabus-mapped question entries used for analysis and generation.</p>
                  </div>

                  <div className="space-y-4 p-5">
                    {sortedQuestions.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm font-medium text-slate-500">
                        No curated questions yet. Parse a raw paper or add the first question manually.
                      </div>
                    ) : (
                      sortedQuestions.map((question) => (
                        <div key={question._id} className="rounded-2xl border border-slate-200 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900">
                                Q{question.questionNumber || '?'}{question.subpartLabel ? `(${question.subpartLabel})` : ''}. {question.prompt}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                <span className="rounded-lg bg-slate-100 px-2 py-1 uppercase">{question.section || 'section-a'}</span>
                                <span className="rounded-lg bg-slate-100 px-2 py-1 uppercase">{question.paperStyle || 'single'}</span>
                                <span className="rounded-lg bg-blue-50 px-2 py-1 text-blue-700">{question.marks} marks</span>
                                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">{question.topic}</span>
                                <span className={`rounded-lg px-2 py-1 uppercase ${
                                  question.classificationConfidence === 'high'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : question.classificationConfidence === 'medium'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {question.classificationConfidence || 'low'} confidence
                                </span>
                              </div>
                              {question.classificationReason ? (
                                <p className="mt-2 text-xs font-medium text-slate-500">{question.classificationReason}</p>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(question)}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeQuestion(question._id)}
                                className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="min-h-0 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="rounded-3xl border border-violet-200 bg-violet-50 p-5">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-violet-700" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Auto-Parse Full Paper</h3>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Paste the raw extracted paper text. The backend will detect Question 1, Section A, Section B, subparts, and syllabus alignment automatically.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    value={form.year}
                    onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="Year"
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    value={form.examSession}
                    onChange={(e) => setForm((prev) => ({ ...prev, examSession: e.target.value }))}
                    placeholder="Session (e.g. Winter, Mid Sem)"
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the extracted full question paper text here"
                  className="mt-4 min-h-[250px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={parsePaper}
                  disabled={parsing || !rawText.trim()}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Auto Parse and Save Paper
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{editingId ? 'Edit Question' : 'Add Question Manually'}</h3>
                    <p className="mt-1 text-sm text-slate-500">Use manual entry only when a single question needs correction or the auto-parse is incomplete.</p>
                  </div>
                  {editingId ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      New
                    </button>
                  ) : null}
                </div>

                <form onSubmit={saveQuestion} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      value={form.marks}
                      onChange={(e) => setForm((prev) => ({ ...prev, marks: e.target.value }))}
                      placeholder="Marks"
                      className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                      required
                    />
                    <select
                      value={form.questionType}
                      onChange={(e) => setForm((prev) => ({ ...prev, questionType: e.target.value as PyqQuestion['questionType'] }))}
                      className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>

                  <textarea
                    value={form.prompt}
                    onChange={(e) => setForm((prev) => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Paste the exact PYQ question text"
                    className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                    required
                  />

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
                    The system will automatically map this question to the closest unit and topic from the subject syllabus after you save it.
                  </div>

                  <textarea
                    value={form.answerOutline}
                    onChange={(e) => setForm((prev) => ({ ...prev, answerOutline: e.target.value }))}
                    placeholder="Optional answer outline or marking hints"
                    className="min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                  />

                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes for admin curation"
                    className="min-h-[90px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-500"
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {editingId ? 'Save question' : 'Add question'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
