'use client';

import { useState } from 'react';
import { PyqPaperLayout, PyqPaperQuestion } from '../model/pyq.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface ExamPaperPreviewProps {
  paper: PyqPaperLayout;
  footerLabel?: string;
  className?: string;
}

const normalizeHeaderText = (value = '') => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const currentYear = new Date().getFullYear();
const nextYearShort = (currentYear + 1).toString().slice(2);
const cleanYear = `${currentYear}-${nextYearShort}`;

const compactExamTitle = (value = '') => {
  return value
    .replace(/,\s*\d{4}[-–]\d{2}\s*[-–]\s*\d{4}/, `, ${cleanYear}`)
    .replace(/\d{4}[-–]\d{2}\s*[-–]\s*\d{4}/, cleanYear)
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const renderQuestion = (question: PyqPaperQuestion) => {
  if (question.parts.length > 0) {
    return (
      <div className="space-y-1">
        {question.prompt ? <p className="whitespace-pre-wrap text-[13px] leading-5 text-slate-900">{question.prompt}</p> : null}
        {question.choiceRule && question.style !== 'compulsory' ? (
          <p className="text-[12px] font-semibold italic text-slate-700">{question.choiceRule}</p>
        ) : null}
        <div className="space-y-1 pl-3 text-[13px] leading-5 text-slate-900">
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
    <p className="whitespace-pre-wrap text-[13px] leading-5 text-slate-900">
      {question.prompt}
    </p>
  );
};

export const ExamPaperPreview = ({
  paper,
  footerLabel = '',
  className = '',
}: ExamPaperPreviewProps) => {
  const [page, setPage] = useState(1);
  const totalPages = 2;

  const examTitle = compactExamTitle(paper.examTitle);
  const normalizedExamTitle = normalizeHeaderText(examTitle);
  const normalizedSemesterLabel = normalizeHeaderText(paper.semesterLabel || '');
  const showSemesterLabel = Boolean(
    paper.semesterLabel
    && !normalizedSemesterLabel.includes('examination')
    && normalizedSemesterLabel !== normalizedExamTitle
  );

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm md:p-6 flex justify-center">
        <div className="w-full max-w-2xl min-h-[800px] bg-white px-6 py-8 text-black shadow-md ring-1 ring-slate-900/5 md:px-10 md:py-10">
          
          {page === 1 ? (
            <>
              {/* Header */}
              <div className="space-y-1.5 text-center">
                {paper.paperCode ? <p className="text-xs font-bold tracking-tight text-slate-900">{paper.paperCode}</p> : null}
                <p className="mx-auto max-w-lg text-base font-black uppercase text-slate-900 md:text-lg">
                  {examTitle}
                </p>
                {showSemesterLabel ? <p className="text-xs font-bold text-slate-700">({paper.semesterLabel})</p> : null}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-bold text-slate-800">
                  {paper.paperLabel ? <span>{paper.paperLabel}</span> : null}
                  {paper.subjectCode ? <span>{paper.subjectCode}</span> : null}
                </div>
                <h2 className="mx-auto max-w-lg text-sm font-black uppercase text-slate-950 md:text-base">
                  {paper.subjectTitle}
                </h2>
              </div>

              {/* Rules Header */}
              <div className="mt-4 border-b border-slate-900 pb-1.5">
                <div className="flex items-center justify-between gap-4 text-[11px] font-medium text-slate-900 md:text-xs">
                  <span>Time: {paper.timeAllowed}</span>
                  <span>[Maximum Marks: {paper.maximumMarks}]</span>
                </div>
              </div>

              <div className="mt-3 text-[12px] leading-5 text-slate-900 md:text-[13px]">
                <p className="font-bold italic">Note:</p>
                <div className="mt-1 space-y-0.5 pl-4 md:pl-6">
                  {paper.instructions.map((instruction, index) => (
                    <p key={`${instruction}-${index}`}>
                      ({['i', 'ii', 'iii', 'iv', 'v', 'vi'][index] || index + 1}) {instruction}
                    </p>
                  ))}
                </div>
              </div>

              {/* Compulsory Question */}
              <div className="mt-5">
                <div className="flex items-start gap-2">
                  <p className="text-base font-black text-slate-900 md:text-lg">{paper.questionOne.number}.</p>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-slate-900">{paper.questionOne.prompt || 'Answer any four parts of the following:'}</p>
                    <div className="mt-2 space-y-1 pl-4 text-[13px] leading-5 text-slate-900">
                      {paper.questionOne.parts.map((part) => (
                        <p key={part.label} className="whitespace-pre-wrap">
                          {part.label}) {part.prompt}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section A */}
              <div className="mt-6 text-center">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 md:text-base">{paper.sectionA.title || 'SECTION-A'}</h3>
                {paper.sectionA.answerRule ? <p className="mt-0.5 text-[11px] font-medium text-slate-600 md:text-xs">{paper.sectionA.answerRule}</p> : null}
              </div>

              <div className="mt-3 space-y-4">
                {paper.sectionA.questions.map((question) => (
                  <div key={`a-${question.number}`} className="flex items-start gap-2">
                    <p className="min-w-[1.5rem] text-base font-black text-slate-900 md:text-lg">{question.number}.</p>
                    <div className="flex-1">{renderQuestion(question)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Page 2 Mini Header */}
              <div className="mb-4 border-b border-slate-200 pb-2 flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                 <span>{paper.subjectCode} - {paper.subjectTitle}</span>
                 <span>Page 2</span>
              </div>

              {/* Section B */}
              <div className="mt-2 text-center">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 md:text-base">{paper.sectionB.title || 'SECTION-B'}</h3>
                {paper.sectionB.answerRule ? <p className="mt-0.5 text-[11px] font-medium text-slate-600 md:text-xs">{paper.sectionB.answerRule}</p> : null}
              </div>

              <div className="mt-3 space-y-4">
                {paper.sectionB.questions.map((question) => (
                  <div key={`b-${question.number}`} className="flex items-start gap-2">
                    <p className="min-w-[1.5rem] text-base font-black text-slate-900 md:text-lg">{question.number}.</p>
                    <div className="flex-1">{renderQuestion(question)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex items-end justify-between text-[10px] font-medium text-slate-400">
            <p>Generated by PYQ Analysis Lab</p>
            <p>{footerLabel || `Page ${page} of ${totalPages}`}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => setPage(1)}
          disabled={page === 1}
          variant="outline"
          className="h-10 rounded-xl px-4 text-xs font-semibold"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous Page
        </Button>
        <span className="text-xs font-bold text-slate-500">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(2)}
          disabled={page === totalPages}
          variant="outline"
          className="h-10 rounded-xl px-4 text-xs font-semibold bg-white"
        >
          Next Page <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
