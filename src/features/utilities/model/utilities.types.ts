export interface ResultTheorySubject {
  subjectId?: string;
  code: string;
  name: string;
  writtenMarks: null | number;
  internalMarks: null | number;
  totalMarks: number;
}

export interface ResultSemester {
  semesterNumber: number;
  theorySubjects: ResultTheorySubject[];
  practicalMarks: null | number;
  practicalMax: number;
  semesterTotal: number;
  isComplete: boolean;
}

export interface ResultSummary {
  courseTotalMarks: number;
  semesterTotalMarks: number;
  obtainedMarks: number;
  evaluatedMarks: number;
  remainingMarks: number;
  completedSemesterCount: number;
  currentPercentage: number;
}

export interface ResultProfileResponse {
  userId: string;
  semesters: ResultSemester[];
  summary: ResultSummary;
}
