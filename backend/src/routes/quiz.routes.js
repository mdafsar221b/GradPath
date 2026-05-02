const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');
const QuizAttempt = require('../models/quizAttempt.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const Resource = require('../models/resource.model');
const { protect } = require('../middleware/auth.middleware');
const { generateJson } = require('../services/gemini.service');

const sanitizeMcqQuestions = (questions) => (Array.isArray(questions) ? questions : [])
  .filter(question => question?.prompt && Array.isArray(question.options) && question.options.length >= 2)
  .slice(0, 12)
  .map(question => {
    const options = question.options.slice(0, 5);
    const answerIndex = Number.isInteger(question.answerIndex)
      ? Math.min(Math.max(question.answerIndex, 0), options.length - 1)
      : 0;

    return {
      prompt: question.prompt,
      questionType: 'mcq',
      options,
      answerIndex,
      explanation: question.explanation || '',
      answerGuide: question.answerGuide || question.explanation || '',
      marks: Number(question.marks) || 0,
      topic: question.topic || '',
      difficulty: ['easy', 'medium', 'hard'].includes(question.difficulty) ? question.difficulty : 'medium',
    };
  });

const sanitizeWrittenQuestions = (questions) => (Array.isArray(questions) ? questions : [])
  .filter(question => question?.prompt && question?.answerGuide)
  .slice(0, 10)
  .map(question => {
    const requestedMarks = Number(question.marks);
    const normalizedMarks = [3, 7, 14].includes(requestedMarks)
      ? requestedMarks
      : question.questionType === 'long'
        ? 14
        : question.questionType === 'medium'
          ? 7
          : 3;

    const questionType = normalizedMarks === 14
      ? 'long'
      : normalizedMarks === 7
        ? 'medium'
        : 'short';

    return {
      prompt: question.prompt,
      questionType,
      options: [],
      explanation: question.explanation || '',
      answerGuide: question.answerGuide || '',
      marks: normalizedMarks,
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

    const resourceTitles = resources.map(resource => resource.title).join(', ');
    const topicList = (unit?.topics || []).join(', ');
    const limitedCount = Math.min(Number(count) || 8, 12);

    const isPyqMode = mode === 'pyq';

    const prompt = isPyqMode
      ? `
Generate a BCA written PYQ practice set as JSON only.
Subject: ${subject.code} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber}: ${unit.title}` : 'Full subject PYQ practice'}
Topics: ${topicList}
Resource titles: ${resourceTitles}

The real paper style is written, not MCQ. Follow this pattern:
- 3 mark short-answer questions
- 7 mark descriptive theory questions
- 14 mark long-answer / explain / prove / derive / draw-and-explain questions
- notes-style questions
- no objective MCQs
- use only these mark values: 3, 7, 14
- mix the paper with all three mark bands wherever possible

Return this JSON shape:
{
  "title": "string",
  "questions": [
    {
      "prompt": "written exam question",
      "questionType": "short|medium|long",
      "answerGuide": "concise model answer or marking outline",
      "explanation": "what the student should focus on",
      "marks": 3,
      "topic": "topic name",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Generate ${Math.min(limitedCount, 8)} questions with a mix of 3 mark, 7 mark, and 14 mark answers.
Keep them aligned with Indian BCA university written-question papers where the full paper is 70 marks.
`
      : `
Generate a BCA ${mode} practice quiz as JSON only.
Subject: ${subject.code} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber}: ${unit.title}` : 'Mixed subject quiz'}
Topics: ${topicList}
Resource titles: ${resourceTitles}

Return this JSON shape:
{
  "title": "string",
  "questions": [
    {
      "prompt": "question text",
      "questionType": "mcq",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0,
      "explanation": "short exam-focused explanation",
      "answerGuide": "why the correct option is correct",
      "marks": 1,
      "topic": "topic name",
      "difficulty": "easy|medium|hard"
    }
  ]
}
Generate ${limitedCount} questions. Keep questions BCA syllabus relevant.
`;

    const fallback = isPyqMode
      ? { title: `${subject.code} Written PYQ Practice`, questions: [] }
      : { title: `${subject.code} Practice Quiz`, questions: [] };

    const payload = await generateJson(prompt, fallback);
    const questions = isPyqMode
      ? sanitizeWrittenQuestions(payload.questions)
      : sanitizeMcqQuestions(payload.questions);

    if (questions.length === 0) {
      return res.status(502).json({ message: 'AI did not return usable quiz questions' });
    }

    const quiz = await Quiz.create({
      createdBy: req.user._id,
      subjectId,
      unitId,
      title: payload.title || (isPyqMode ? `${subject.code} Written PYQ Practice` : `${subject.code} Practice Quiz`),
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

    const objectiveQuestions = quiz.questions.filter((question) => question.questionType === 'mcq');
    if (objectiveQuestions.length === 0) {
      return res.status(400).json({ message: 'Written practice sets do not use objective submission scoring.' });
    }

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    let score = 0;
    const topics = {};

    objectiveQuestions.forEach((question, index) => {
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
      total: objectiveQuestions.length,
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
