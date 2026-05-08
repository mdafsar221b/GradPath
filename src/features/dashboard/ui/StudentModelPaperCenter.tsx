'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, FileText, Loader2 } from 'lucide-react';
import { academicApi } from '@/features/academic/api/academic-api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { pyqApi } from '@/features/pyq/api/pyq.api';
import { ModelPaperResponse, PyqSubjectSummary } from '@/features/pyq/model/pyq.types';
import { ExamPaperPreview } from '@/features/pyq/ui/ExamPaperPreview';

import { Button } from '@/shared/ui/Button';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

export const StudentModelPaperCenter = () => {
  const user = useAuthStore((state) => state.user);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [summary, setSummary] = useState<PyqSubjectSummary | null>(null);
  const [modelPaper, setModelPaper] = useState<ModelPaperResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPaper, setLoadingPaper] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.semester) return;

    academicApi.getSubjects(user.semester)
      .then((data) => setSubjects(data))
      .catch((fetchError) => {
        console.error('Failed to fetch subjects for model papers', fetchError);
      });
  }, [user?.semester]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject._id === subjectId),
    [subjectId, subjects]
  );

  const loadSummary = async () => {
    if (!subjectId) return;
    setLoadingSummary(true);
    setError('');
    try {
      const data = await pyqApi.getSubjectSummary(subjectId);
      setSummary(data);
    } catch (summaryError) {
      console.error('Failed to load model paper summary', summaryError);
      setError('Important topic analysis could not be loaded for this subject yet.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const generatePaper = async () => {
    if (!subjectId) return;
    setLoadingPaper(true);
    setError('');
    try {
      const data = await pyqApi.generateModelPaper(subjectId);
      setModelPaper(data);
      if (!summary) {
        const summaryData = await pyqApi.getSubjectSummary(subjectId);
        setSummary(summaryData);
      }
    } catch (paperError) {
      console.error('Failed to generate dashboard model paper', paperError);
      setError('Model paper generation failed. Make sure this subject has enough curated PYQ questions.');
    } finally {

      setLoadingPaper(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
              PYQ Analysis Lab
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Load a subject to identify high-weightage topics and generate a predictive exam paper.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto shrink-0">
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setSummary(null);
                setModelPaper(null);
                setError('');
              }}
              className="h-12 w-full sm:w-[240px] rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.code ? `${subject.code} - ` : ''}{subject.name}
                </option>
              ))}
            </select>
            <Button
              onClick={loadSummary}
              disabled={!subjectId || loadingSummary}
              variant="outline"
              className="h-12 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {loadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />}
              Load Analysis
            </Button>
            <Button
              onClick={generatePaper}
              disabled={!subjectId || loadingPaper}
              className="h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
            >
              {loadingPaper ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate Paper
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      {!summary && !modelPaper && !loadingSummary && !loadingPaper ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <FileText className="h-8 w-8 text-blue-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900">No subject selected</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Select a subject from the dropdown above to load pattern analysis or generate a predictive model paper.
          </p>
        </div>
      ) : null}

      {modelPaper ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Generated Paper</p>
              <h3 className="mt-1 text-2xl font-black text-slate-900">
                {selectedSubject?.code ? `${selectedSubject.code} model paper` : modelPaper.quiz.title}
              </h3>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Generated paper first, evidence below.
            </p>
          </div>
          <ExamPaperPreview
            paper={modelPaper.paper}
            footerLabel={`Generated for ${selectedSubject?.code || selectedSubject?.name || modelPaper.quiz.title}`}
          />
        </div>
      ) : null}

      {summary ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-gray-900">Topic Weightage <span className="text-sm font-medium text-gray-400 font-normal ml-2">Top 6</span></h3>
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {summary.importantTopics.slice(0, 6).map((topic) => (
                <div key={topic.topic} className="flex items-start justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{topic.topic}</p>
                    {topic.unitTitle ? <p className="mt-1 text-[10px] font-black uppercase text-gray-500">{topic.unitTitle}</p> : null}
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-lg bg-gray-50 px-2.5 py-1 text-[11px] font-black text-gray-700 border border-gray-200">
                    {Math.round(topic.score)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-black text-gray-900">Paper Profile</h3>
            <div className="space-y-6 border-t border-gray-100 pt-4">
              <div>
                <p className="mb-1 text-xs font-bold text-gray-500">Total Questions Scanned</p>
                <p className="text-2xl font-black text-gray-900">{summary.totalQuestions}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">Marks Layout</p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.marksDistribution.map((item) => (
                    <span key={item._id} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-bold text-gray-700">
                      {item._id} marks <span className="text-gray-400 ml-1">×{item.count}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-gray-500">Format Types</p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.questionTypeDistribution.map((item) => (
                    <span key={item._id} className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-bold uppercase text-gray-700">
                      {item._id} <span className="text-gray-400 ml-1">×{item.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
