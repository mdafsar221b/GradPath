export interface PracticeSubject {
  _id: string;
  name: string;
  code?: string;
  semester?: number;
}

export interface TopicPracticeTopic {
  name: string;
  status: 'new' | 'learning' | 'revising' | 'mastered';
  confidence: number;
  covered: boolean;
  pyqCount: number;
  samplePyqPrompt?: string;
}

export interface TopicPracticeUnit {
  _id: string;
  unitNumber: number;
  title: string;
  topics: TopicPracticeTopic[];
  coveredTopics: number;
  totalTopics: number;
}

export interface TopicPracticeMap {
  subject: PracticeSubject;
  units: TopicPracticeUnit[];
  totalTopics: number;
  coveredTopics: number;
  progressPercentage: number;
}

export interface TopicGuideQuestion {
  _id: string;
  prompt: string;
  marks: number;
  year?: string;
  section?: string;
  questionNumber?: number;
  subpartLabel?: string;
  topic?: string;
}

export interface TopicGuideResponse {
  topic: string;
  unit: {
    _id: string;
    unitNumber: number;
    title: string;
  };
  overview: string;
  importantPoints: string[];
  relatedQuestions: string[];
  pyqSignals: string[];
  pyqQuestions: TopicGuideQuestion[];
}

export interface PracticePyqPaper {
  _id: string;
  title: string;
  year: string;
  examSession?: string;
  questionCount: number;
}

export interface PracticePyqQuestion {
  _id: string;
  prompt: string;
  marks: number;
  year: string;
  examSession?: string;
  questionType: 'short' | 'medium' | 'long';
  topic: string;
  section?: 'question1' | 'section-a' | 'section-b';
  questionNumber?: number;
  subpartLabel?: string;
  paperStyle?: 'single' | 'split' | 'short-notes' | 'compulsory';
  choiceRule?: string;
  unitId?: {
    _id: string;
    unitNumber: number;
    title: string;
  } | string | null;
}

export interface PracticePyqPaperQuestions {
  paper: PracticePyqPaper;
  questions: PracticePyqQuestion[];
}
