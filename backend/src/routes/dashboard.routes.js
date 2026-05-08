const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment.model');
const Progress = require('../models/progress.model');
const Subject = require('../models/subject.model');
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

    const subjectProgress = subjects.map(subject => {
      const record = progressRecords.find(p => p.subjectId.toString() === subject._id.toString());
      const completedCount = record ? record.completedUnits.length : 0;
      return {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        completedUnits: completedCount,
        progressPercentage: (completedCount / 5) * 100
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
