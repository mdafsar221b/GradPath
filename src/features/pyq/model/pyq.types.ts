import { Quiz } from '@/features/quiz/api/quiz.api';

export interface PyqPaperPart {
  label: string;
  prompt: string;
  marks: number;
  questionType: 'short' | 'medium' | 'long';
  topic?: string;
  answerGuide?: string;
}

export interface PyqPaperQuestion {
  number: number;
  prompt: string;
  marks: number;
  questionType: 'short' | 'medium' | 'long';
  style: 'single' | 'split' | 'short-notes' | 'compulsory';
  choiceRule?: string;
  topic?: string;
  answerGuide?: string;
  parts: PyqPaperPart[];
}

export interface PyqPaperSection {
  title: string;
  answerRule?: string;
  questions: PyqPaperQuestion[];
}

export interface PyqPaperLayout {
  rawText?: string;
  paperCode?: string;
  examTitle: string;
  semesterLabel?: string;
  paperLabel?: string;
  subjectCode?: string;
  subjectTitle: string;
  timeAllowed: string;
  maximumMarks: number;
  instructions: string[];
  questionOne: PyqPaperQuestion;
  sectionA: PyqPaperSection;
  sectionB: PyqPaperSection;
  parseStatus?: 'empty' | 'parsed';
  parsedAt?: string;
}

export interface PyqQuestion {
  _id: string;
  resourceId: string;
  subjectId: string;
  unitId?: {
    _id: string;
    unitNumber: number;
    title: string;
  } | string | null;
  year: string;
  examSession?: string;
  prompt: string;
  marks: number;
  questionType: 'short' | 'medium' | 'long';
  topic: string;
  mappingSource?: 'ai' | 'fallback';
  classificationConfidence?: 'low' | 'medium' | 'high';
  classificationReason?: string;
  answerOutline?: string;
  notes?: string;
  section?: 'question1' | 'section-a' | 'section-b';
  questionNumber?: number;
  subpartLabel?: string;
  paperStyle?: 'single' | 'split' | 'short-notes' | 'compulsory';
  choiceRule?: string;
  createdAt: string;
}

export interface PyqResourceStatus {
  resourceId: string;
  title: string;
  year: string;
  examSession?: string;
  subject: {
    _id: string;
    name: string;
    code?: string;
    semester?: number;
  };
  questionCount: number;
  hasStructuredPaper?: boolean;
}

export interface PyqResourcePaperResponse {
  resourceId: string;
  subjectId: {
    _id: string;
    name: string;
    code?: string;
    semester?: number;
  } | string;
  year: string;
  examSession?: string;
  paper: PyqPaperLayout | null;
}

export interface ParsePyqPaperResponse {
  paper: PyqPaperLayout;
  questions: PyqQuestion[];
}

export interface PyqImportantTopic {
  topic: string;
  count: number;
  marksWeight: number;
  recencyScore: number;
  score: number;
  rationale: string;
  sampleQuestions: string[];
  unitId?: string | null;
  unitTitle?: string;
}

export interface PyqSubjectSummary {
  subject: {
    _id: string;
    name: string;
    code?: string;
  };
  totalQuestions: number;
  marksDistribution: { _id: number; count: number }[];
  questionTypeDistribution: { _id: string; count: number }[];
  importantTopics: PyqImportantTopic[];
  unitHeatmap: {
    unitId: string;
    unitNumber: number;
    title: string;
    questionCount: number;
    topics: { topic: string; count: number; score: number }[];
  }[];
  recentPaperCoverage: {
    resourceId: string;
    title: string;
    year: string;
    examSession?: string;
    questionCount: number;
    hasStructuredPaper?: boolean;
  }[];
  hasEnoughData: boolean;
  templatePaper?: PyqPaperLayout;
}

export interface ModelPaperResponse {
  quiz: Quiz;
  paper: PyqPaperLayout;
  summary: {
    importantTopics: PyqImportantTopic[];
    marksDistribution: { _id: number; count: number }[];
    questionTypeDistribution: { _id: string; count: number }[];
  };
}

export interface PyqPracticeQuestion {
  question: PyqQuestion;
  subject: {
    _id: string;
    name: string;
    code?: string;
  };
  unit?: {
    _id: string;
    unitNumber: number;
    title: string;
  } | null;
  relatedQuestionCount: number;
}

export interface PyqAnswerReview {
  score: number;
  strengths: string[];
  missingPoints: string[];
  idealAnswer: string;
  verdict: string;
  improvementTips: string[];
}
