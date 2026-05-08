const express = require('express');
const router = express.Router();
const Progress = require('../models/progress.model');
const Unit = require('../models/unit.model');
const { protect } = require('../middleware/auth.middleware');

// @desc    Toggle unit completion
// @route   POST /api/progress/toggle
// @access  Private
router.post('/toggle', protect, async (req, res) => {
  try {
    const { subjectId, unitNumber } = req.body;

    if (!subjectId || !unitNumber) {
      return res.status(400).json({ message: 'SubjectId and unitNumber are required' });
    }

    let progress = await Progress.findOne({ userId: req.user._id, subjectId });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        subjectId,
        completedUnits: [unitNumber],
      });
    } else {
      const index = progress.completedUnits.indexOf(unitNumber);
      if (index > -1) {
        // Remove if exists
        progress.completedUnits.splice(index, 1);
      } else {
        // Add if not exists
        progress.completedUnits.push(unitNumber);
      }
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Set unit completion explicitly
// @route   PUT /api/progress/unit
// @access  Private
router.put('/unit', protect, async (req, res) => {
  try {
    const { subjectId, unitNumber, completed } = req.body;

    if (!subjectId || !unitNumber || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'subjectId, unitNumber, and completed are required' });
    }

    let progress = await Progress.findOne({ userId: req.user._id, subjectId });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        subjectId,
        completedUnits: completed ? [unitNumber] : [],
      });
      return res.json(progress);
    }

    const hasUnit = progress.completedUnits.includes(unitNumber);

    if (completed && !hasUnit) {
      progress.completedUnits.push(unitNumber);
    }

    if (!completed && hasUnit) {
      progress.completedUnits = progress.completedUnits.filter((item) => item !== unitNumber);
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get progress for a subject
// @route   GET /api/progress/:subjectId
// @access  Private
router.get('/:subjectId', protect, async (req, res) => {
  try {
    const totalUnits = await Unit.countDocuments({ subjectId: req.params.subjectId });
    const progress = await Progress.findOne({ 
      userId: req.user._id, 
      subjectId: req.params.subjectId 
    });
    
    if (!progress) {
      return res.json({ completedUnits: [], progressPercentage: 0, totalUnits });
    }

    const progressPercentage = totalUnits
      ? Math.round((progress.completedUnits.length / totalUnits) * 100)
      : 0;
    res.json({ 
      completedUnits: progress.completedUnits, 
      progressPercentage,
      totalUnits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all progress for user (for dashboard)
// @route   GET /api/progress
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const allProgress = await Progress.find({ userId: req.user._id });
    res.json(allProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
