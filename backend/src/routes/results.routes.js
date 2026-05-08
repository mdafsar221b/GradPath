const express = require('express');
const router = express.Router();
const ResultProfile = require('../models/resultProfile.model');
const { protect } = require('../middleware/auth.middleware');
const {
  buildProfileSkeleton,
  normalizeProfileSemesters,
  buildResultsSummary,
} = require('../services/results.service');

router.get('/profile', protect, async (req, res) => {
  try {
    const existingProfile = await ResultProfile.findOne({ userId: req.user._id }).lean();
    const semesters = await buildProfileSkeleton(existingProfile?.semesters || []);
    const normalizedSemesters = normalizeProfileSemesters(semesters);
    const summary = buildResultsSummary(normalizedSemesters);

    res.json({
      userId: req.user._id,
      semesters: normalizedSemesters,
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const incomingSemesters = Array.isArray(req.body.semesters) ? req.body.semesters : [];
    const skeleton = await buildProfileSkeleton(incomingSemesters);

    const mergedSemesters = skeleton.map((semester) => {
      const incomingSemester = incomingSemesters.find((item) => item.semesterNumber === semester.semesterNumber);
      if (!incomingSemester) return semester;

      return {
        ...semester,
        practicalMarks: incomingSemester.practicalMarks,
        theorySubjects: semester.theorySubjects.map((subject, index) => {
          const incomingSubject = incomingSemester.theorySubjects?.[index];
          if (!incomingSubject) return subject;
          return {
            ...subject,
            writtenMarks: incomingSubject.writtenMarks,
            internalMarks: incomingSubject.internalMarks,
          };
        }),
      };
    });

    const normalizedSemesters = normalizeProfileSemesters(mergedSemesters);

    const profile = await ResultProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        semesters: normalizedSemesters,
      },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    ).lean();

    const summary = buildResultsSummary(profile.semesters);

    res.json({
      userId: req.user._id,
      semesters: profile.semesters,
      summary,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
