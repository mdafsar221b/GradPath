const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const Resource = require('../models/resource.model');
const { protect } = require('../middleware/auth.middleware');
const { generateJson } = require('../services/gemini.service');

const sanitizeQuestions = (questions) => (Array.isArray(questions) ? questions : [])
  .filter(question => question?.prompt && Array.isArray(question.options) && question.options.length >= 2)
  .slice(0, 12)
  .map(question => {
    const options = question.options.slice(0, 5);
    const answerIndex = Number.isInteger(question.answerIndex)
      ? Math.min(Math.max(question.answerIndex, 0), options.length - 1)
      : 0;

    return {
      prompt: question.prompt,
      options,
      answerIndex,
      explanation: question.explanation || '',
      topic: question.topic || '',
      difficulty: ['easy', 'medium', 'hard'].includes(question.difficulty) ? question.difficulty : 'medium',
    };
  });

router.post('/generate', protect, async (req, res) => {
  try {
    const { subjectId, unitId, mode = 'unit', count = 8 } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'subjectId is required' });

    const [subject, unit, resources] = await Promise.all([
      Subject.findById(subjectId),
      unitId ? Unit.findById(unitId) : null,
      Resource.find({ subjectId, ...(unitId ? { unitId } : {}) }).limit(10),
    ]);

    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const prompt = `
Generate a BCA ${mode} practice quiz as JSON only.
Subject: ${subject.code} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber}: ${unit.title}` : 'Mixed subject quiz'}
Topics: ${(unit?.topics || []).join(', ')}
Resource titles: ${resources.map(resource => resource.title).join(', ')}

Return this JSON shape:
{
  "title": "string",
  "questions": [
    {
      "prompt": "question text",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "short exam-focused explanation",
      "topic": "topic name",
      "difficulty": "easy|medium|hard"
    }
  ]
}
Generate ${Math.min(Number(count) || 8, 12)} questions. Keep questions BCA syllabus relevant.
`;

    const payload = await generateJson(prompt, { title: `${subject.code} Practice Quiz`, questions: [] });
    const questions = sanitizeQuestions(payload.questions);

    if (questions.length === 0) {
      return res.status(502).json({ message: 'AI did not return usable quiz questions' });
    }

    const quiz = await Quiz.create({
      createdBy: req.user._id,
      subjectId,
      unitId,
      title: payload.title || `${subject.code} Practice Quiz`,
      mode,
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.query.subjectId) query.subjectId = req.query.subjectId;
    if (req.query.unitId) query.unitId = req.query.unitId;

    const quizzes = await Quiz.find(query)
      .populate('subjectId', 'name code semester')
      .populate('unitId', 'unitNumber title')
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/attempt', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    let score = 0;
    const topics = {};

    quiz.questions.forEach((question, index) => {
      const correct = answers[index] === question.answerIndex;
      if (correct) score += 1;
      const topic = question.topic || 'General';
      topics[topic] = topics[topic] || { topic, correct: 0, total: 0 };
      topics[topic].total += 1;
      if (correct) topics[topic].correct += 1;
    });

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      answers,
      score,
      total: quiz.questions.length,
      topicBreakdown: Object.values(topics),
    });

    res.status(201).json({ attempt, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/attempts/me', protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate({
        path: 'quizId',
        select: 'title subjectId unitId',
        populate: [{ path: 'subjectId', select: 'name code' }, { path: 'unitId', select: 'unitNumber title' }],
      })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
