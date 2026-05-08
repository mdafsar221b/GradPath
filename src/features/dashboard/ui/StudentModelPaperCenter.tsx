'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, FileText, Loader2, Sparkles } from 'lucide-react';
import { academicApi } from '@/features/academic/api/academic-api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { pyqApi } from '@/features/pyq/api/pyq.api';
import { ModelPaperResponse, PyqSubjectSummary } from '@/features/pyq/model/pyq.types';
import { ExamPaperPreview } from '@/features/pyq/ui/ExamPaperPreview';
import { Card, CardContent } from '@/shared/ui/Card';
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
      <Card className="border-none shadow-sm">
        <CardContent className="p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">PYQ Analysis Lab</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">Analyze historical PYQ patterns and generate a subject model paper</h2>
              <p className="mt-3 text-sm font-medium text-gray-500">
                Load a subject summary to inspect repeated topics and marks patterns, then generate a fresh paper from curated question history.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] xl:w-[720px]">
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setSummary(null);
                  setModelPaper(null);
                  setError('');
                }}
                className="h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code ? `${subject.code} - ` : ''}{subject.name}
                  </option>
                ))}
              </select>
              <Button onClick={loadSummary} disabled={!subjectId || loadingSummary} variant="outline" className="h-12 rounded-2xl">
                {loadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                Load Analysis
              </Button>
              <Button onClick={generatePaper} disabled={!subjectId || loadingPaper} className="h-12 rounded-2xl">
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
        </CardContent>
      </Card>

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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-none shadow-sm">
            <CardContent className="p-7">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <h3 className="text-xl font-black text-gray-900">Repeated and Important Topics</h3>
                </div>
              <div className="mt-5 space-y-4">
                {summary.importantTopics.slice(0, 6).map((topic) => (
                  <div key={topic.topic} className="rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-gray-900">{topic.topic}</p>
                        {topic.unitTitle ? <p className="mt-1 text-xs font-bold uppercase tracking-wider text-violet-600">{topic.unitTitle}</p> : null}
                        <p className="mt-2 text-sm text-gray-500">{topic.rationale}</p>
                      </div>
                      <div className="rounded-xl bg-violet-50 px-3 py-2 text-sm font-black text-violet-700">
                        {Math.round(topic.score)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-7">
              <h3 className="text-xl font-black text-gray-900">Paper Pattern Signals</h3>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Curated Questions</p>
                  <p className="mt-2 text-3xl font-black text-gray-900">{summary.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Marks Distribution</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {summary.marksDistribution.map((item) => (
                      <span key={item._id} className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700">
                        {item._id} marks: {item.count}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Question Types</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {summary.questionTypeDistribution.map((item) => (
                      <span key={item._id} className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold uppercase text-blue-700">
                        {item._id}: {item.count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
};
