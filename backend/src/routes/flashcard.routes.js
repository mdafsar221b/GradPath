const express = require('express');
const router = express.Router();
const Flashcard = require('../models/flashcard.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const { protect } = require('../middleware/auth.middleware');
const { generateJson } = require('../services/gemini.service');

router.post('/generate', protect, async (req, res) => {
  try {
    const { subjectId, unitId, count = 8 } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'subjectId is required' });

    const [subject, unit] = await Promise.all([
      Subject.findById(subjectId),
      unitId ? Unit.findById(unitId) : null,
    ]);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const prompt = `
Create BCA revision flashcards as JSON only.
Subject: ${subject.code} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber}: ${unit.title}` : 'Full subject'}
Topics: ${(unit?.topics || []).join(', ')}

Return:
{
  "cards": [
    { "front": "question/term", "back": "answer", "topic": "topic", "difficulty": 1 }
  ]
}
Generate ${Math.min(Number(count) || 8, 16)} concise flashcards. Difficulty is 1 easy to 5 hard.
`;

    const payload = await generateJson(prompt, { cards: [] });
    const cards = (payload.cards || [])
      .filter(card => card.front && card.back)
      .slice(0, 16)
      .map(card => ({
        userId: req.user._id,
        subjectId,
        unitId,
        front: card.front,
        back: card.back,
        topic: card.topic || '',
        difficulty: Math.min(Math.max(Number(card.difficulty) || 3, 1), 5),
      }));

    if (cards.length === 0) {
      return res.status(502).json({ message: 'AI did not return usable flashcards' });
    }

    const created = await Flashcard.insertMany(cards);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.subjectId) query.subjectId = req.query.subjectId;
    if (req.query.unitId) query.unitId = req.query.unitId;
    if (req.query.due === 'true') query.dueAt = { $lte: new Date() };

    const cards = await Flashcard.find(query)
      .populate('subjectId', 'name code semester')
      .populate('unitId', 'unitNumber title')
      .sort({ dueAt: 1, createdAt: -1 })
      .limit(100);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/review', protect, async (req, res) => {
  try {
    const card = await Flashcard.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) return res.status(404).json({ message: 'Flashcard not found' });

    const rating = req.body.rating;
    const multiplier = rating === 'easy' ? 2.5 : rating === 'good' ? 1.8 : 1;
    card.intervalDays = Math.max(1, Math.round(card.intervalDays * multiplier));
    if (rating === 'again') card.intervalDays = 1;
    card.lastReviewedAt = new Date();
    card.dueAt = new Date(Date.now() + card.intervalDays * 24 * 60 * 60 * 1000);
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Flashcard.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Flashcard removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
