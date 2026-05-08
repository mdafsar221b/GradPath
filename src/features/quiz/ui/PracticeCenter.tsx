'use client';

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { academicApi } from '@/features/academic/api/academic-api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { practiceApi } from '@/features/practice/api/practice.api';
import { ContextDiscussionPanel } from '@/features/discussion/ui/ContextDiscussionPanel';
import {
  PracticePyqPaper,
  PracticePyqQuestion,
  TopicGuideResponse,
  TopicPracticeMap,
  TopicPracticeUnit,
} from '@/features/practice/model/practice.types';
import { Quiz, quizApi } from '@/features/quiz/api/quiz.api';

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

type PracticePath = 'topic' | 'pyq' | 'quiz' | null;

const getErrorMessage = (input: unknown, fallback: string) => {
  if (axios.isAxiosError(input)) {
    return input.response?.data?.message || fallback;
  }

  return fallback;
};

const renderInlineFormatting = (text: string): ReactNode[] =>
  text
    .split(/(\*\*.*?\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${part}-${index}`} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    });

const renderFormattedText = (text: string) => {
  const lines = text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    if (line.startsWith('### ')) {
      return (
        <h5 key={`${line}-${index}`} className="mt-4 text-base font-bold text-slate-900">
          {renderInlineFormatting(line.slice(4))}
        </h5>
      );
    }

    if (line.startsWith('## ')) {
      return (
        <h4 key={`${line}-${index}`} className="mt-5 text-lg font-bold text-slate-900">
          {renderInlineFormatting(line.slice(3))}
        </h4>
      );
    }

    if (line.startsWith('# ')) {
      return (
        <h3 key={`${line}-${index}`} className="mt-5 text-xl font-bold text-slate-900">
          {renderInlineFormatting(line.slice(2))}
        </h3>
      );
    }

    if (/^[-*]\s+/.test(line)) {
      return (
        <div key={`${line}-${index}`} className="flex items-start gap-3 pl-1">
          <span className="mt-[10px] text-slate-500">-</span>
          <p className="text-[15px] leading-8 text-slate-700">
            {renderInlineFormatting(line.replace(/^[-*]\s+/, ''))}
          </p>
        </div>
      );
    }

    if (/^\d+\.\s+/.test(line)) {
      const marker = line.match(/^\d+\./)?.[0] || '';
      const content = line.replace(/^\d+\.\s+/, '');

      return (
        <div key={`${line}-${index}`} className="flex items-start gap-3 pl-1">
          <span className="min-w-8 text-[15px] font-semibold text-slate-900">{marker}</span>
          <p className="text-[15px] leading-8 text-slate-700">
            {renderInlineFormatting(content)}
          </p>
        </div>
      );
    }

    return (
      <p key={`${line}-${index}`} className="text-[15px] leading-8 text-slate-700">
        {renderInlineFormatting(line)}
      </p>
    );
  });
};

const emptyState = (message: string) => (
  <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
    <p className="font-bold text-gray-400">{message}</p>
  </div>
);

export const PracticeCenter = () => {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [path, setPath] = useState<PracticePath>(null);
  const [error, setError] = useState('');

  const [topicSubjectId, setTopicSubjectId] = useState('');
  const [topicMap, setTopicMap] = useState<TopicPracticeMap | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicGuide, setTopicGuide] = useState<TopicGuideResponse | null>(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [guideLoading, setGuideLoading] = useState(false);
  const [topicSaving, setTopicSaving] = useState(false);

  const [pyqSubjectId, setPyqSubjectId] = useState('');
  const [pyqPapers, setPyqPapers] = useState<PracticePyqPaper[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState('');
  const [marksFilter, setMarksFilter] = useState('');
  const [pyqQuestions, setPyqQuestions] = useState<PracticePyqQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [pyqLoading, setPyqLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);

  const [quizSubjectId, setQuizSubjectId] = useState('');
  const [quizUnitId, setQuizUnitId] = useState('');
  const [quizUnits, setQuizUnits] = useState<UnitOption[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    if (user?.semester) {
      academicApi.getSubjects(user.semester).then(setSubjects).catch(console.error);
    }
  }, [user?.semester]);

  const resetPracticeChoice = () => {
    setPath(null);
    setError('');
  };

  const loadTopicMap = useCallback(
    async (
      subjectId: string,
      options?: { preserve?: boolean; currentUnitId?: string; currentTopic?: string }
    ) => {
      if (!subjectId) return;

      setTopicLoading(true);
      setError('');

      try {
        const data = await practiceApi.getTopicMap(subjectId);
        setTopicMap(data);

        if (options?.preserve && options.currentUnitId && options.currentTopic) {
          setSelectedUnitId(options.currentUnitId);
          setSelectedTopic(options.currentTopic);
          return;
        }

        const firstUnitWithTopic = data.units.find((unit) => unit.topics.length > 0);
        setSelectedUnitId(firstUnitWithTopic?._id || '');
        setSelectedTopic(firstUnitWithTopic?.topics[0]?.name || '');
      } catch (fetchError) {
        console.error('Failed to load topic map', fetchError);
        setTopicMap(null);
        setTopicGuide(null);
        setError(getErrorMessage(fetchError, 'Topic-wise practice could not be loaded right now.'));
      } finally {
        setTopicLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!topicSubjectId) {
      setTopicMap(null);
      setSelectedUnitId('');
      setSelectedTopic('');
      setTopicGuide(null);
      return;
    }

    loadTopicMap(topicSubjectId);
  }, [topicSubjectId, loadTopicMap]);

  const selectedUnit = useMemo<TopicPracticeUnit | null>(
    () => topicMap?.units.find((unit) => unit._id === selectedUnitId) || null,
    [topicMap, selectedUnitId]
  );

  const selectedTopicMeta = useMemo(
    () => selectedUnit?.topics.find((topic) => topic.name === selectedTopic) || null,
    [selectedUnit, selectedTopic]
  );

  const nextTopicTarget = useMemo(() => {
    if (!topicMap || !selectedUnit || !selectedTopic) {
      return null;
    }

    const currentUnitIndex = topicMap.units.findIndex((unit) => unit._id === selectedUnit._id);
    const currentTopicIndex = selectedUnit.topics.findIndex((topic) => topic.name === selectedTopic);

    if (currentUnitIndex < 0 || currentTopicIndex < 0) {
      return null;
    }

    if (currentTopicIndex + 1 < selectedUnit.topics.length) {
      return {
        unitId: selectedUnit._id,
        topicName: selectedUnit.topics[currentTopicIndex + 1].name,
      };
    }

    for (let unitIndex = currentUnitIndex + 1; unitIndex < topicMap.units.length; unitIndex += 1) {
      const nextUnit = topicMap.units[unitIndex];
      if (nextUnit.topics.length > 0) {
        return {
          unitId: nextUnit._id,
          topicName: nextUnit.topics[0].name,
        };
      }
    }

    return null;
  }, [topicMap, selectedUnit, selectedTopic]);

  const topicProgressLabel = useMemo(() => {
    if (!topicMap) {
      return 'Topic progress';
    }

    return `${topicMap.coveredTopics}/${topicMap.totalTopics} covered - ${topicMap.progressPercentage}%`;
  }, [topicMap]);

  useEffect(() => {
    const loadGuide = async () => {
      if (!topicSubjectId || !selectedUnitId || !selectedTopic) {
        setTopicGuide(null);
        return;
      }

      setGuideLoading(true);
      setError('');

      try {
        const data = await practiceApi.getTopicGuide({
          subjectId: topicSubjectId,
          unitId: selectedUnitId,
          topic: selectedTopic,
        });
        setTopicGuide(data);
      } catch (fetchError) {
        console.error('Failed to load topic guide', fetchError);
        setTopicGuide(null);
        setError(getErrorMessage(fetchError, 'Topic guidance could not be generated right now.'));
      } finally {
        setGuideLoading(false);
      }
    };

    loadGuide();
  }, [topicSubjectId, selectedUnitId, selectedTopic]);

  const toggleTopicCovered = async () => {
    if (!topicSubjectId || !selectedUnitId || !selectedTopic || !selectedTopicMeta) return;

    setTopicSaving(true);
    setError('');

    try {
      await practiceApi.setTopicCovered({
        subjectId: topicSubjectId,
        unitId: selectedUnitId,
        topic: selectedTopic,
        covered: !selectedTopicMeta.covered,
      });
      await loadTopicMap(topicSubjectId, {
        preserve: true,
        currentUnitId: selectedUnitId,
        currentTopic: selectedTopic,
      });
    } catch (saveError) {
      console.error('Failed to update topic coverage', saveError);
      setError(getErrorMessage(saveError, 'Topic progress could not be updated.'));
    } finally {
      setTopicSaving(false);
    }
  };

  const goToNextTopic = () => {
    if (!nextTopicTarget) return;
    setSelectedUnitId(nextTopicTarget.unitId);
    setSelectedTopic(nextTopicTarget.topicName);
  };

  useEffect(() => {
    const loadPapers = async () => {
      if (!pyqSubjectId) {
        setPyqPapers([]);
        setSelectedPaperId('');
        setPyqQuestions([]);
        setSelectedQuestionId('');
        setGeneratedAnswer('');
        return;
      }

      setPyqLoading(true);
      setError('');

      try {
        const papers = await practiceApi.getPyqPapers(pyqSubjectId);
        setPyqPapers(papers);
        setSelectedPaperId(papers[0]?._id || '');
      } catch (fetchError) {
        console.error('Failed to load PYQ papers', fetchError);
        setPyqPapers([]);
        setSelectedPaperId('');
        setError(getErrorMessage(fetchError, 'PYQ papers could not be loaded right now.'));
      } finally {
        setPyqLoading(false);
      }
    };

    loadPapers();
  }, [pyqSubjectId]);

  useEffect(() => {
    const loadPaperQuestions = async () => {
      if (!selectedPaperId) {
        setPyqQuestions([]);
        setSelectedQuestionId('');
        setGeneratedAnswer('');
        return;
      }

      setPyqLoading(true);
      setError('');

      try {
        const data = await practiceApi.getPyqPaperQuestions(
          selectedPaperId,
          marksFilter ? Number(marksFilter) : undefined
        );
        setPyqQuestions(data.questions);
        setSelectedQuestionId(data.questions[0]?._id || '');
        setGeneratedAnswer('');
      } catch (fetchError) {
        console.error('Failed to load PYQ questions', fetchError);
        setPyqQuestions([]);
        setSelectedQuestionId('');
        setGeneratedAnswer('');
        setError(getErrorMessage(fetchError, 'PYQ questions could not be loaded right now.'));
      } finally {
        setPyqLoading(false);
      }
    };

    loadPaperQuestions();
  }, [selectedPaperId, marksFilter]);

  const selectedQuestion = useMemo(
    () => pyqQuestions.find((question) => question._id === selectedQuestionId) || null,
    [pyqQuestions, selectedQuestionId]
  );

  const generateExamAnswer = async () => {
    if (!selectedQuestionId) return;

    setAnswerLoading(true);
    setError('');

    try {
      const response = await practiceApi.generateExamAnswer(selectedQuestionId);
      setGeneratedAnswer(response.answer);
    } catch (answerError) {
      console.error('Failed to generate exam answer', answerError);
      setGeneratedAnswer('');
      setError(getErrorMessage(answerError, 'The exam-style answer could not be generated right now.'));
    } finally {
      setAnswerLoading(false);
    }
  };

  useEffect(() => {
    if (!quizSubjectId) {
      setQuizUnits([]);
      setQuizUnitId('');
      setQuiz(null);
      setQuizAnswers([]);
      setQuizResult(null);
      return;
    }

    academicApi
      .getUnits(quizSubjectId)
      .then((units) => {
        setQuizUnits(units);
        setQuizUnitId('');
      })
      .catch(console.error);
  }, [quizSubjectId]);

  const generateQuiz = async () => {
    if (!token || !quizSubjectId) return;

    setQuizLoading(true);
    setError('');
    setQuizResult(null);

    try {
      const data = await quizApi.generate(
        {
          subjectId: quizSubjectId,
          unitId: quizUnitId || undefined,
          mode: 'unit',
          count: 8,
        },
        token
      );
      setQuiz(data);
      setQuizAnswers(Array(data.questions.length).fill(-1));
    } catch (generateError) {
      console.error('Failed to generate quiz', generateError);
      setQuiz(null);
      setQuizAnswers([]);
      setError(getErrorMessage(generateError, 'Quiz generation failed right now.'));
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!token || !quiz) return;

    setError('');

    try {
      const data = await quizApi.attempt(quiz._id, quizAnswers, token);
      setQuizResult({ score: data.attempt.score, total: data.attempt.total });
    } catch (submitError) {
      console.error('Failed to submit quiz', submitError);
      setError(getErrorMessage(submitError, 'Quiz submission failed right now.'));
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {path === null ? (
        <>
          <section className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Practice Workspace</h1>
            <p className="max-w-3xl font-medium text-gray-500">
              Choose how to work with curated subject data. Start from a topic, open a past paper, generate a quiz, or use flashcards as the final revision layer.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => setPath('topic')}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">Topic-wise Practice</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                Select a subject, unit, and topic. Study the concept, see matched PYQs, and move through the syllabus in order.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPath('pyq')}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">PYQ-wise Practice</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                Open curated paper questions, filter by marks, and read exam-style answers question by question.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPath('quiz')}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-violet-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">Quiz Practice</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                Generate a focused quiz from the selected subject and unit structure for fast revision.
              </p>
            </button>

            <button
              type="button"
              onClick={() => router.push('/flashcards')}
              className="rounded-[2rem] border border-gray-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-amber-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">Flashcards</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-gray-500">
                Use flashcards as the final revision step after topic study and PYQ practice.
              </p>
            </button>
          </section>
        </>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {path === 'topic' ? (
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Topic-wise Practice
              </p>
              <p className="text-sm font-medium text-slate-500">
                Pick a subject, unit, and topic. Then read the concept clearly, check matched PYQs, and move topic by topic through the syllabus.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <button
                type="button"
                onClick={resetPracticeChoice}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <select
                value={topicSubjectId}
                onChange={(event) => setTopicSubjectId(event.target.value)}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold xl:min-w-[280px]"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedUnitId}
                onChange={(event) => {
                  const nextUnit = topicMap?.units.find((unit) => unit._id === event.target.value);
                  setSelectedUnitId(event.target.value);
                  setSelectedTopic(nextUnit?.topics[0]?.name || '');
                }}
                disabled={!topicMap}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold disabled:opacity-50 xl:min-w-[240px]"
              >
                <option value="">Select unit</option>
                {topicMap?.units.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    Unit {unit.unitNumber} - {unit.title}
                  </option>
                ))}
              </select>
              <select
                value={selectedTopic}
                onChange={(event) => setSelectedTopic(event.target.value)}
                disabled={!selectedUnit}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold disabled:opacity-50 xl:min-w-[260px]"
              >
                <option value="">Select topic</option>
                {selectedUnit?.topics.map((topic) => (
                  <option key={topic.name} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
              <div className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-50 px-4 text-sm font-black text-blue-700 xl:ml-auto">
                {topicProgressLabel}
              </div>
            </div>
          </div>

          {topicLoading ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : topicMap ? (
            selectedUnit && selectedTopicMeta ? (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                        Unit {selectedUnit.unitNumber} Topic
                      </p>
                      <h2 className="mt-2 text-3xl font-black text-gray-900">{selectedTopic}</h2>
                      <p className="mt-2 text-sm font-medium text-gray-500">
                        {selectedUnit.title}
                        {selectedTopicMeta.pyqCount
                          ? ` - ${selectedTopicMeta.pyqCount} related PYQ question${selectedTopicMeta.pyqCount === 1 ? '' : 's'}`
                          : ' - No matched PYQ yet'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={toggleTopicCovered}
                        disabled={topicSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                      >
                        {topicSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {selectedTopicMeta.covered ? 'Mark as not covered' : 'Mark topic covered'}
                      </button>
                      <button
                        type="button"
                        onClick={goToNextTopic}
                        disabled={!nextTopicTarget}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-slate-700 disabled:opacity-50"
                      >
                        Next Topic
                      </button>
                    </div>
                  </div>
                </div>

                {guideLoading ? (
                  <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : topicGuide ? (
                  <>
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900">Concept Guide</h3>
                      <div className="mt-4 space-y-3">{renderFormattedText(topicGuide.overview)}</div>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-black text-gray-900">Important Points</h3>
                      <div className="mt-4 space-y-3">
                        {topicGuide.importantPoints.map((point) => (
                          <div key={point}>{renderFormattedText(`- ${point}`)}</div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-black text-gray-900">Practice Questions</h3>
                      <div className="mt-4 space-y-3">
                        {topicGuide.relatedQuestions.map((question) => (
                          <div key={question}>{renderFormattedText(`- ${question}`)}</div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-black text-gray-900">Asked in PYQ</h3>
                      {topicGuide.pyqQuestions.length ? (
                        <div className="mt-4 space-y-3">
                          {topicGuide.pyqQuestions.map((question) => (
                            <div key={question._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                              <div className="mb-2 flex flex-wrap gap-2">
                                {question.year ? (
                                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                                    {question.year}
                                  </span>
                                ) : null}
                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700">
                                  {question.marks} marks
                                </span>
                              </div>
                              <p className="text-sm font-semibold leading-7 text-slate-800">
                                {question.questionNumber ? `${question.questionNumber}. ` : ''}
                                {question.subpartLabel ? `${question.subpartLabel}) ` : ''}
                                {question.prompt}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          No curated PYQ question is mapped to this exact topic yet.
                        </p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              emptyState('Select subject, unit, and topic to start topic-wise practice.')
            )
          ) : (
            emptyState('Select a subject to open topic-wise practice.')
          )}
        </section>
      ) : null}

      {path === 'pyq' ? (
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                PYQ-wise Practice
              </p>
              <p className="text-sm font-medium text-slate-500">
                Open a real uploaded paper, filter by marks, and read one detailed exam-ready answer at a time.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <button
                type="button"
                onClick={resetPracticeChoice}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <select
                value={pyqSubjectId}
                onChange={(event) => setPyqSubjectId(event.target.value)}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold xl:min-w-[280px]"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedPaperId}
                onChange={(event) => setSelectedPaperId(event.target.value)}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold xl:min-w-[240px]"
              >
                <option value="">Select PYQ</option>
                {pyqPapers.map((paper) => (
                  <option key={paper._id} value={paper._id}>
                    {paper.year || 'Year'} {paper.examSession ? `- ${paper.examSession}` : ''}
                  </option>
                ))}
              </select>
              <select
                value={marksFilter}
                onChange={(event) => setMarksFilter(event.target.value)}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold xl:min-w-[180px]"
              >
                <option value="">All marks</option>
                <option value="3">3 marks</option>
                <option value="7">7 marks</option>
                <option value="14">14 marks</option>
              </select>
            </div>
          </div>

          {pyqLoading ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : selectedPaperId && pyqQuestions.length ? (
            <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Questions</p>
                <h3 className="mt-2 text-xl font-black text-gray-900">{pyqQuestions.length} loaded</h3>

                <div className="mt-5 space-y-3">
                  {pyqQuestions.map((question) => {
                    const active = question._id === selectedQuestionId;

                    return (
                      <button
                        key={question._id}
                        type="button"
                        onClick={() => {
                          setSelectedQuestionId(question._id);
                          setGeneratedAnswer('');
                        }}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                          active
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-gray-100 bg-slate-50 hover:border-emerald-100'
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700">
                            {question.marks} marks
                          </span>
                          {question.year ? (
                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                              {question.year}
                            </span>
                          ) : null}
                        </div>
                        <p className="line-clamp-3 text-sm font-semibold leading-6 text-slate-800">
                          {question.questionNumber ? `${question.questionNumber}. ` : ''}
                          {question.subpartLabel ? `${question.subpartLabel}) ` : ''}
                          {question.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="space-y-6">
                {selectedQuestion ? (
                  <>
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-violet-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700">
                          {selectedQuestion.marks} marks
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
                          {selectedQuestion.questionType}
                        </span>
                        {typeof selectedQuestion.unitId === 'object' && selectedQuestion.unitId ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                            Unit {selectedQuestion.unitId.unitNumber} - {selectedQuestion.unitId.title}
                          </span>
                        ) : null}
                        {selectedQuestion.topic ? (
                          <span className="rounded-full bg-blue-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                            {selectedQuestion.topic}
                          </span>
                        ) : null}
                      </div>

                      <h2 className="mt-4 whitespace-pre-wrap text-2xl font-black leading-10 text-gray-900">
                        {selectedQuestion.questionNumber ? `${selectedQuestion.questionNumber}. ` : ''}
                        {selectedQuestion.subpartLabel ? `${selectedQuestion.subpartLabel}) ` : ''}
                        {selectedQuestion.prompt}
                      </h2>

                      <button
                        type="button"
                        onClick={generateExamAnswer}
                        disabled={answerLoading}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                      >
                        {answerLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate Exam-style Answer
                      </button>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900">Exam-ready Answer</h3>
                      {generatedAnswer ? (
                        <div className="mt-4 space-y-3">{renderFormattedText(generatedAnswer)}</div>
                      ) : (
                        <p className="mt-4 text-sm font-medium text-slate-500">
                          Generate the answer to see a detailed exam-oriented response for this question.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  emptyState('Select a question from the left to continue.')
                )}

                {selectedPaperId ? (
                  <ContextDiscussionPanel
                    contextType="pyq-resource"
                    resourceId={selectedPaperId}
                    title="PYQ Paper Discussion"
                    description="Discuss this previous-year paper, ask doubts about repeated questions, and connect with seniors on exam patterns."
                  />
                ) : null}
              </div>
            </div>
          ) : (
            emptyState(
              selectedPaperId
                ? 'No curated questions matched the current marks filter.'
                : 'Select a subject and PYQ paper to start PYQ-wise practice.'
            )
          )}
        </section>
      ) : null}

      {path === 'quiz' ? (
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-1">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                Quiz Practice
              </p>
              <p className="text-sm font-medium text-slate-500">
                Choose a subject and optional unit, then generate a focused objective quiz for fast revision.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:flex-row">
              <button
                type="button"
                onClick={resetPracticeChoice}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <select
                value={quizSubjectId}
                onChange={(event) => setQuizSubjectId(event.target.value)}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold xl:min-w-[280px]"
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
              <select
                value={quizUnitId}
                onChange={(event) => setQuizUnitId(event.target.value)}
                disabled={!quizUnits.length}
                className="h-12 rounded-xl border border-gray-100 bg-white px-3 text-sm font-bold disabled:opacity-50 xl:min-w-[260px]"
              >
                <option value="">All units</option>
                {quizUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    Unit {unit.unitNumber} - {unit.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={generateQuiz}
                disabled={!quizSubjectId || quizLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-black text-white disabled:opacity-50"
              >
                {quizLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Quiz
              </button>
            </div>
          </div>

          {quiz ? (
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{quiz.title}</h3>
                    <p className="mt-2 text-sm font-medium text-gray-500">
                      Answer every question, then submit once for instant scoring.
                    </p>
                  </div>
                  {quizResult ? (
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-lg font-black text-emerald-700">
                      {quizResult.score}/{quizResult.total}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((question, questionIndex) => (
                  <div
                    key={question._id || questionIndex}
                    className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                        {question.difficulty}
                      </span>
                      {question.topic ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                          {question.topic}
                        </span>
                      ) : null}
                    </div>
                    <h4 className="text-lg font-black leading-8 text-gray-900">
                      {questionIndex + 1}. {question.prompt}
                    </h4>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = quizAnswers[questionIndex] === optionIndex;
                        const isCorrect = !!quizResult && question.answerIndex === optionIndex;

                        return (
                          <button
                            key={`${question._id}-${optionIndex}`}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((previous) =>
                                previous.map((value, index) =>
                                  index === questionIndex ? optionIndex : value
                                )
                              )
                            }
                            disabled={!!quizResult}
                            className={`rounded-xl border p-4 text-left text-sm font-semibold transition-colors ${
                              isCorrect
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : isSelected
                                  ? 'border-violet-200 bg-violet-50 text-violet-800'
                                  : 'border-gray-100 bg-slate-50 text-slate-700 hover:border-violet-100'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {quizResult ? (
                      <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                        {question.answerGuide || question.explanation}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={quizAnswers.includes(-1) || !!quizResult}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuiz(null);
                    setQuizAnswers([]);
                    setQuizResult(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
                >
                  Reset Quiz
                </button>
              </div>
            </div>
          ) : (
            emptyState('Select a subject and optional unit to generate a quiz.')
          )}
        </section>
      ) : null}
    </main>
  );
};
