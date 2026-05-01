const express = require('express');
const router = express.Router();
const TopicProgress = require('../models/topicProgress.model');
const Unit = require('../models/unit.model');
const { protect } = require('../middleware/auth.middleware');

router.get('/subject/:subjectId', protect, async (req, res) => {
  try {
    const records = await TopicProgress.find({
      userId: req.user._id,
      subjectId: req.params.subjectId,
    }).sort({ updatedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const { subjectId, unitId, topic, confidence } = req.body;
    if (!subjectId || !unitId || !topic) {
      return res.status(400).json({ message: 'subjectId, unitId, and topic are required' });
    }

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });

    const safeConfidence = Math.min(Math.max(Number(confidence) || 0, 0), 100);
    const status = safeConfidence >= 85
      ? 'mastered'
      : safeConfidence >= 55
        ? 'revising'
        : safeConfidence > 0
          ? 'learning'
          : 'new';

    const record = await TopicProgress.findOneAndUpdate(
      { userId: req.user._id, unitId, topic },
      {
        userId: req.user._id,
        subjectId,
        unitId,
        topic,
        confidence: safeConfidence,
        status,
        lastPracticedAt: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
