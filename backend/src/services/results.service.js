const Subject = require('../models/subject.model');

const COURSE_TOTAL_MARKS = 3000;
const SEMESTER_TOTAL_MARKS = 500;
const SEMESTER_PRACTICAL_MAX = {
  1: 100,
  2: 100,
  3: 100,
  4: 100,
  5: 100,
  6: 300,
};
const SEMESTER_THEORY_COUNT = {
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 2,
};

const clampMark = (value, max) => {
  if (value === '' || value === undefined || value === null) return null;
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    throw new Error('Marks must be numeric');
  }
  if (numericValue < 0 || numericValue > max) {
    throw new Error(`Marks must be between 0 and ${max}`);
  }
  return numericValue;
};

const createPlaceholderSubject = (semesterNumber, index) => ({
  code: `SEM${semesterNumber}-SUB${index + 1}`,
  name: `Subject ${index + 1}`,
});

const buildSemesterBlueprint = (semesterNumber, subjectsBySemester, existingSemester) => {
  const expectedTheoryCount = SEMESTER_THEORY_COUNT[semesterNumber];
  const semesterSubjects = (subjectsBySemester[semesterNumber] || []).slice(0, expectedTheoryCount);
  const practicalMax = SEMESTER_PRACTICAL_MAX[semesterNumber];

  const theorySubjects = Array.from({ length: expectedTheoryCount }, (_, index) => {
    const catalogSubject = semesterSubjects[index];
    const existingSubject = existingSemester?.theorySubjects?.[index];
    const fallback = createPlaceholderSubject(semesterNumber, index);

    return {
      subjectId: catalogSubject?._id || existingSubject?.subjectId || undefined,
      code: catalogSubject?.code || existingSubject?.code || fallback.code,
      name: catalogSubject?.name || existingSubject?.name || fallback.name,
      writtenMarks: existingSubject?.writtenMarks ?? null,
      internalMarks: existingSubject?.internalMarks ?? null,
      totalMarks: existingSubject?.totalMarks ?? 0,
    };
  });

  return {
    semesterNumber,
    theorySubjects,
    practicalMarks: existingSemester?.practicalMarks ?? null,
    practicalMax,
    semesterTotal: existingSemester?.semesterTotal ?? 0,
    isComplete: existingSemester?.isComplete ?? false,
  };
};

const buildProfileSkeleton = async (existingSemesters = []) => {
  const subjects = await Subject.find().sort({ semester: 1, code: 1, name: 1 });
  const subjectsBySemester = subjects.reduce((accumulator, subject) => {
    const key = subject.semester;
    accumulator[key] = accumulator[key] || [];
    accumulator[key].push(subject);
    return accumulator;
  }, {});

  return Array.from({ length: 6 }, (_, index) => {
    const semesterNumber = index + 1;
    const existingSemester = existingSemesters.find((item) => item.semesterNumber === semesterNumber);
    return buildSemesterBlueprint(semesterNumber, subjectsBySemester, existingSemester);
  });
};

const normalizeSemester = (semester) => {
  const practicalMax = SEMESTER_PRACTICAL_MAX[semester.semesterNumber];

  const theorySubjects = semester.theorySubjects.map((subject) => {
    const writtenMarks = clampMark(subject.writtenMarks, 70);
    const internalMarks = clampMark(subject.internalMarks, 30);

    return {
      ...subject,
      writtenMarks,
      internalMarks,
      totalMarks: (writtenMarks || 0) + (internalMarks || 0),
    };
  });

  const practicalMarks = clampMark(semester.practicalMarks, practicalMax);
  const semesterTotal = theorySubjects.reduce((sum, subject) => sum + subject.totalMarks, 0) + (practicalMarks || 0);
  const isComplete = theorySubjects.every((subject) => subject.writtenMarks !== null && subject.internalMarks !== null)
    && practicalMarks !== null;

  return {
    ...semester,
    theorySubjects,
    practicalMarks,
    practicalMax,
    semesterTotal,
    isComplete,
  };
};

const normalizeProfileSemesters = (semesters) => semesters.map(normalizeSemester);

const buildResultsSummary = (semesters) => {
  const completedSemesters = semesters.filter((semester) => semester.isComplete);
  const obtainedMarks = completedSemesters.reduce((sum, semester) => sum + semester.semesterTotal, 0);
  const completedSemesterCount = completedSemesters.length;
  const evaluatedMarks = completedSemesterCount * SEMESTER_TOTAL_MARKS;
  const remainingSemesterCount = 6 - completedSemesterCount;
  const remainingMarks = remainingSemesterCount * SEMESTER_TOTAL_MARKS;

  return {
    courseTotalMarks: COURSE_TOTAL_MARKS,
    semesterTotalMarks: SEMESTER_TOTAL_MARKS,
    obtainedMarks,
    evaluatedMarks,
    remainingMarks,
    completedSemesterCount,
    currentPercentage: completedSemesterCount > 0
      ? Number(((obtainedMarks / evaluatedMarks) * 100).toFixed(2))
      : 0,
  };
};

module.exports = {
  COURSE_TOTAL_MARKS,
  SEMESTER_TOTAL_MARKS,
  SEMESTER_PRACTICAL_MAX,
  SEMESTER_THEORY_COUNT,
  buildProfileSkeleton,
  normalizeProfileSemesters,
  buildResultsSummary,
};
