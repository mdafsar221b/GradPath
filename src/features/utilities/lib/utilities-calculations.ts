import { ResultSemester } from '../model/utilities.types';

export const COURSE_TOTAL_MARKS = 3000;
export const SEMESTER_TOTAL_MARKS = 500;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const recomputeSemester = (semester: ResultSemester): ResultSemester => {
  const theorySubjects = semester.theorySubjects.map((subject) => {
    const writtenMarks = subject.writtenMarks ?? null;
    const internalMarks = subject.internalMarks ?? null;
    const totalMarks = (writtenMarks || 0) + (internalMarks || 0);

    return {
      ...subject,
      totalMarks,
    };
  });

  const semesterTotal = theorySubjects.reduce((sum, subject) => sum + subject.totalMarks, 0) + (semester.practicalMarks || 0);
  const isComplete = theorySubjects.every((subject) => subject.writtenMarks !== null && subject.internalMarks !== null)
    && semester.practicalMarks !== null;

  return {
    ...semester,
    theorySubjects,
    semesterTotal,
    isComplete,
  };
};

export const recomputeProfileSemesters = (semesters: ResultSemester[]) => semesters.map(recomputeSemester);

export const summarizeResults = (semesters: ResultSemester[]) => {
  const completedSemesters = semesters.filter((semester) => semester.isComplete);
  const obtainedMarks = completedSemesters.reduce((sum, semester) => sum + semester.semesterTotal, 0);
  const completedSemesterCount = completedSemesters.length;
  const evaluatedMarks = completedSemesterCount * SEMESTER_TOTAL_MARKS;
  const remainingMarks = COURSE_TOTAL_MARKS - evaluatedMarks;

  return {
    obtainedMarks,
    completedSemesterCount,
    evaluatedMarks,
    remainingMarks,
    currentPercentage: evaluatedMarks > 0 ? Number(((obtainedMarks / evaluatedMarks) * 100).toFixed(2)) : 0,
  };
};

const allocateByWeights = (target: number, weights: number[]) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let allocated = 0;

  const base = weights.map((weight, index) => {
    const raw = totalWeight > 0 ? Math.floor((target * weight) / totalWeight) : 0;
    allocated += raw;
    return {
      index,
      value: raw,
      remainder: totalWeight > 0 ? ((target * weight) / totalWeight) - raw : 0,
      max: weight,
    };
  });

  let remaining = target - allocated;

  base
    .sort((first, second) => second.remainder - first.remainder)
    .forEach((item) => {
      if (remaining > 0 && item.value < item.max) {
        item.value += 1;
        remaining -= 1;
      }
    });

  return base.sort((first, second) => first.index - second.index).map((item) => clamp(item.value, 0, item.max));
};

const splitTheoryTarget = (subjectTarget: number) => {
  const written = clamp(Math.round((subjectTarget * 70) / 100), 0, 70);
  const internal = clamp(subjectTarget - written, 0, 30);
  const adjustedWritten = clamp(subjectTarget - internal, 0, 70);

  return {
    totalTarget: subjectTarget,
    internalTarget: internal,
    writtenTarget: adjustedWritten,
  };
};

export interface PlannerSubjectTarget {
  code: string;
  name: string;
  minimumTotalTarget: number;
  safeTotalTarget: number;
  writtenTarget: number;
  internalTarget: number;
}

export interface PlannerPracticalTarget {
  minimumTarget: number;
  safeTarget: number;
  max: number;
}

export interface PlannerResult {
  targetPercentage: number;
  targetMarks: number;
  obtainedMarks: number;
  remainingMarks: number;
  currentPercentage: number;
  minimumMarksNeeded: number;
  achievable: boolean;
  alreadySecured: boolean;
  nextSemesterNumber: null | number;
  nextSemesterMinimum: number;
  nextSemesterSafeRange: { min: number; max: number };
  remainingSemesterCount: number;
  subjectTargets: PlannerSubjectTarget[];
  practicalTarget: null | PlannerPracticalTarget;
  predictedNextSemesterTotal: null | number;
  projectedFinalPercentage: null | number;
}

export const buildPlanner = (
  semesters: ResultSemester[],
  targetPercentage: number,
  currentSemester: null | number
): PlannerResult => {
  const normalizedSemesters = recomputeProfileSemesters(semesters);
  const summary = summarizeResults(normalizedSemesters);
  const remainingSemesterCount = 6 - summary.completedSemesterCount;
  const targetMarks = Math.ceil((clamp(targetPercentage, 0, 100) / 100) * COURSE_TOTAL_MARKS);
  const minimumMarksNeeded = Math.max(0, targetMarks - summary.obtainedMarks);
  const achievable = minimumMarksNeeded <= summary.remainingMarks;
  const alreadySecured = minimumMarksNeeded === 0;

  const lastCompletedSemester = normalizedSemesters
    .filter((semester) => semester.isComplete)
    .reduce((max, semester) => Math.max(max, semester.semesterNumber), 0);

  const nextSemesterNumber = remainingSemesterCount > 0
    ? clamp(Math.max(currentSemester || 1, lastCompletedSemester + 1), 1, 6)
    : null;

  const nextSemester = nextSemesterNumber
    ? normalizedSemesters.find((semester) => semester.semesterNumber === nextSemesterNumber) || null
    : null;

  const nextSemesterMinimum = achievable && !alreadySecured && remainingSemesterCount > 0
    ? clamp(Math.ceil(minimumMarksNeeded / remainingSemesterCount), 0, SEMESTER_TOTAL_MARKS)
    : 0;

  const safeBase = nextSemesterMinimum > 0 ? Math.max(15, Math.ceil(nextSemesterMinimum * 0.05)) : 0;
  const nextSemesterSafeRange = {
    min: nextSemesterMinimum > 0 ? clamp(nextSemesterMinimum + safeBase, 0, SEMESTER_TOTAL_MARKS) : 0,
    max: nextSemesterMinimum > 0 ? clamp(nextSemesterMinimum + safeBase + 25, 0, SEMESTER_TOTAL_MARKS) : 0,
  };

  const componentWeights = nextSemester
    ? [...nextSemester.theorySubjects.map(() => 100), nextSemester.practicalMax]
    : [];

  const minimumDistribution = nextSemester ? allocateByWeights(nextSemesterMinimum, componentWeights) : [];
  const safeDistribution = nextSemester ? allocateByWeights(nextSemesterSafeRange.min, componentWeights) : [];

  const subjectTargets = nextSemester
    ? nextSemester.theorySubjects.map((subject, index) => {
      const minimum = splitTheoryTarget(minimumDistribution[index] || 0);
      const safe = splitTheoryTarget(safeDistribution[index] || 0);
      return {
        code: subject.code,
        name: subject.name,
        minimumTotalTarget: minimum.totalTarget,
        safeTotalTarget: safe.totalTarget,
        writtenTarget: minimum.writtenTarget,
        internalTarget: minimum.internalTarget,
      };
    })
    : [];

  const practicalTarget = nextSemester
    ? {
      minimumTarget: minimumDistribution[minimumDistribution.length - 1] || 0,
      safeTarget: safeDistribution[safeDistribution.length - 1] || 0,
      max: nextSemester.practicalMax,
    }
    : null;

  const predictedNextSemesterTotal = summary.completedSemesterCount > 0
    ? Math.round(summary.obtainedMarks / summary.completedSemesterCount)
    : null;

  const projectedFinalPercentage = predictedNextSemesterTotal !== null
    ? Number(((
      summary.obtainedMarks + (predictedNextSemesterTotal * remainingSemesterCount)
    ) / COURSE_TOTAL_MARKS * 100).toFixed(2))
    : null;

  return {
    targetPercentage: clamp(targetPercentage, 0, 100),
    targetMarks,
    obtainedMarks: summary.obtainedMarks,
    remainingMarks: summary.remainingMarks,
    currentPercentage: summary.currentPercentage,
    minimumMarksNeeded,
    achievable,
    alreadySecured,
    nextSemesterNumber,
    nextSemesterMinimum,
    nextSemesterSafeRange,
    remainingSemesterCount,
    subjectTargets,
    practicalTarget,
    predictedNextSemesterTotal,
    projectedFinalPercentage,
  };
};

export const buildSemestersLabel = (semester: ResultSemester) =>
  `Semester ${semester.semesterNumber} - ${semester.semesterTotal}/${SEMESTER_TOTAL_MARKS}`;

export const getCgpaValueFromPercentage = (percentage: number, multiplier: number, offset: number) => {
  if (multiplier === 0) return 0;
  return Number(((percentage - offset) / multiplier).toFixed(2));
};

export const getPercentageFromCgpa = (cgpa: number, multiplier: number, offset: number) =>
  Number(((cgpa * multiplier) + offset).toFixed(2));
