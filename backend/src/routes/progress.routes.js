const express = require('express');
const router = express.Router();
const Progress = require('../models/progress.model');
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

// @desc    Get progress for a subject
// @route   GET /api/progress/:subjectId
// @access  Private
router.get('/:subjectId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      userId: req.user._id, 
      subjectId: req.params.subjectId 
    });
    
    if (!progress) {
      return res.json({ completedUnits: [], progressPercentage: 0 });
    }

    const progressPercentage = (progress.completedUnits.length / 5) * 100;
    res.json({ 
      completedUnits: progress.completedUnits, 
      progressPercentage 
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
