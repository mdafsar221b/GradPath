const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment.model');
const { protect } = require('../middleware/auth.middleware');

// @desc    Get all user assignments
// @route   GET /api/assignments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id })
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { subjectId, unitId, title, dueDate } = req.body;

    const assignment = await Assignment.create({
      userId: req.user._id,
      subjectId,
      unitId,
      title,
      dueDate,
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update assignment status
// @route   PATCH /api/assignments/:id
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify ownership
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    assignment.status = req.body.status || assignment.status;
    const updatedAssignment = await assignment.save();
    
    // Repopulate for frontend
    const finalAssignment = await Assignment.findById(updatedAssignment._id)
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title');

    res.json(finalAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify ownership
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await assignment.deleteOne();
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
