'use client';

import { PyqPaperLayout, PyqPaperQuestion } from '../model/pyq.types';

interface ExamPaperPreviewProps {
  paper: PyqPaperLayout;
  footerLabel?: string;
  className?: string;
}

const normalizeHeaderText = (value = '') => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const compactExamTitle = (value = '') => value
  .replace(/\s+-\s+(\d{4})\s+-\s+\1\b/g, ' - $1')
  .replace(/\s{2,}/g, ' ')
  .trim();

const renderQuestion = (question: PyqPaperQuestion) => {
  if (question.parts.length > 0) {
    return (
      <div className="space-y-2">
        {question.prompt ? <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-900">{question.prompt}</p> : null}
        {question.choiceRule && question.style !== 'compulsory' ? (
          <p className="text-[14px] font-semibold italic text-slate-700">{question.choiceRule}</p>
        ) : null}
        <div className="space-y-1.5 pl-4 text-[15px] leading-7 text-slate-900">
          {question.parts.map((part) => (
            <p key={`${question.number}-${part.label}`} className="whitespace-pre-wrap">
              {part.label}) {part.prompt}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-900">
      {question.prompt}
    </p>
  );
};

export const ExamPaperPreview = ({
  paper,
  footerLabel = 'Page 1 of 1',
  className = '',
}: ExamPaperPreviewProps) => {
  const examTitle = compactExamTitle(paper.examTitle);
  const normalizedExamTitle = normalizeHeaderText(examTitle);
  const normalizedSemesterLabel = normalizeHeaderText(paper.semesterLabel || '');
  const showSemesterLabel = Boolean(
    paper.semesterLabel
    && !normalizedSemesterLabel.includes('examination')
    && normalizedSemesterLabel !== normalizedExamTitle
  );

  return (
    <div className={`rounded-[2rem] border border-slate-200 bg-slate-100 p-3 shadow-sm md:p-5 ${className}`.trim()}>
      <div className="mx-auto max-w-4xl bg-white px-6 py-6 text-black shadow-[0_12px_45px_rgba(15,23,42,0.08)] md:px-10 md:py-7">
        <div className="space-y-3 text-center">
          {paper.paperCode ? <p className="text-sm font-black tracking-tight text-slate-900 md:text-base">{paper.paperCode}</p> : null}
          <p className="mx-auto max-w-5xl text-xl font-black leading-tight text-slate-900 md:text-[24px]">
            {examTitle}
          </p>
          {showSemesterLabel ? <p className="text-sm font-bold text-slate-700 md:text-base">({paper.semesterLabel})</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-bold text-slate-800 md:text-base">
            {paper.paperLabel ? <span>{paper.paperLabel}</span> : null}
            {paper.subjectCode ? <span>{paper.subjectCode}</span> : null}
          </div>
          <h2 className="mx-auto max-w-4xl text-xl font-black uppercase leading-tight text-slate-950 md:text-[24px]">
            {paper.subjectTitle}
          </h2>
        </div>

        <div className="mt-5 border-b border-slate-900 pb-1.5">
          <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-900">
            <span>Time: {paper.timeAllowed}</span>
            <span>[Maximum Marks: {paper.maximumMarks}]</span>
          </div>
        </div>

        <div className="mt-4 text-[15px] leading-7 text-slate-900 md:text-base">
          <p className="font-bold italic">Note:</p>
          <div className="mt-1.5 space-y-1 pl-5 md:pl-8">
            {paper.instructions.map((instruction, index) => (
              <p key={`${instruction}-${index}`}>
                ({['i', 'ii', 'iii', 'iv', 'v', 'vi'][index] || index + 1}) {instruction}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-start gap-3">
            <p className="text-2xl font-black text-slate-900 md:text-3xl">{paper.questionOne.number}.</p>
            <div className="flex-1">
              <p className="text-lg font-medium text-slate-900 md:text-xl">{paper.questionOne.prompt || 'Answer any four parts of the following:'}</p>
              <div className="mt-2.5 space-y-1.5 pl-5 text-[15px] leading-7 text-slate-900 md:pl-8">
                {paper.questionOne.parts.map((part) => (
                  <p key={part.label} className="whitespace-pre-wrap">
                    {part.label}) {part.prompt}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-black uppercase tracking-[0.03em] text-slate-900 md:text-[24px]">{paper.sectionA.title || 'SECTION-A'}</h3>
          {paper.sectionA.answerRule ? <p className="mt-1 text-xs font-medium text-slate-600 md:text-sm">{paper.sectionA.answerRule}</p> : null}
        </div>

        <div className="mt-5 space-y-5">
          {paper.sectionA.questions.map((question) => (
            <div key={`a-${question.number}`} className="flex items-start gap-3">
              <p className="min-w-[2.25rem] text-xl font-black text-slate-900 md:text-2xl">{question.number}.</p>
              <div className="flex-1">{renderQuestion(question)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-xl font-black uppercase tracking-[0.03em] text-slate-900 md:text-[24px]">{paper.sectionB.title || 'SECTION-B'}</h3>
          {paper.sectionB.answerRule ? <p className="mt-1 text-xs font-medium text-slate-600 md:text-sm">{paper.sectionB.answerRule}</p> : null}
        </div>

        <div className="mt-5 space-y-5">
          {paper.sectionB.questions.map((question) => (
            <div key={`b-${question.number}`} className="flex items-start gap-3">
              <p className="min-w-[2.25rem] text-xl font-black text-slate-900 md:text-2xl">{question.number}.</p>
              <div className="flex-1">{renderQuestion(question)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-end justify-between text-xs font-medium text-slate-700 md:text-sm">
          <div>
            <p>Structured from curated PYQ patterns</p>
          </div>
          <div className="text-right">
            <p>{footerLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
