const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment.model');
const Progress = require('../models/progress.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const { protect } = require('../middleware/auth.middleware');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const semester = req.user.semester;

    // 1. Assignments
    const assignments = await Assignment.find({ userId })
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title');
    
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const completedAssignments = totalAssignments - pendingAssignments;
    
    // Sort and filter upcoming deadlines
    const upcomingDeadlines = assignments
      .filter(a => a.status === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);

    // 2. Progress and Subjects
    const subjects = await Subject.find({ semester });
    const progressRecords = await Progress.find({ userId });
    const units = await Unit.find({ subjectId: { $in: subjects.map((subject) => subject._id) } })
      .select('subjectId')
      .lean();
    const unitCountBySubject = units.reduce((map, unit) => {
      const key = unit.subjectId.toString();
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map());

    const subjectProgress = subjects.map(subject => {
      const record = progressRecords.find(p => p.subjectId.toString() === subject._id.toString());
      const completedCount = record ? record.completedUnits.length : 0;
      const totalUnits = unitCountBySubject.get(subject._id.toString()) || 0;
      return {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        completedUnits: completedCount,
        totalUnits,
        progressPercentage: totalUnits ? Math.round((completedCount / totalUnits) * 100) : 0,
      };
    });

    res.json({
      stats: {
        totalAssignments,
        pendingAssignments,
        completedAssignments
      },
      upcomingDeadlines,
      subjectProgress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

module.exports = router;
