const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const Resource = require('../models/resource.model');
const PyqQuestion = require('../models/pyqQuestion.model');
const TopicProgress = require('../models/topicProgress.model');
const { generateJson, generateText } = require('../services/gemini.service');

const normalizeTopic = (value = '') => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const matchesTopic = (sourceTopic = '', targetTopic = '') => {
  const normalizedSource = normalizeTopic(sourceTopic);
  const normalizedTarget = normalizeTopic(targetTopic);

  if (!normalizedSource || !normalizedTarget) {
    return false;
  }

  return normalizedSource === normalizedTarget
    || normalizedSource.includes(normalizedTarget)
    || normalizedTarget.includes(normalizedSource);
};

const buildTopicGuideFallback = ({ topic, pyqQuestions }) => ({
  overview: `${topic} is an important exam topic. Start from the basic definition, then explain the working or structure, and finally connect it to one practical example or comparison point.`,
  importantPoints: [
    `Define ${topic} clearly in the first lines.`,
    'Cover the core concept step by step in exam order.',
    'Add one example, diagram, or use case if relevant.',
  ],
  relatedQuestions: [
    `Explain ${topic} in detail with suitable examples.`,
    `Write a short note on ${topic}.`,
    `Differentiate ${topic} from a related concept with proper points.`,
  ],
  pyqSignals: pyqQuestions.slice(0, 3).map((question) => question.prompt),
});

const buildTopicGuidePrompt = ({ subject, unit, topic, pyqQuestions }) => `
You are helping a BCA student practice one syllabus topic.
Return JSON only.

Subject: ${subject.code || ''} - ${subject.name}
Unit: Unit ${unit.unitNumber} - ${unit.title}
Topic: ${topic}
Related unit topics: ${(unit.topics || []).join(', ')}

Past PYQ signals for this topic:
${pyqQuestions.length ? pyqQuestions.map((question) => `- ${question.prompt} (${question.marks} marks, ${question.year || 'year not set'})`).join('\n') : 'No direct curated PYQ question is available for this exact topic.'}

Return this JSON shape:
{
  "overview": "markdown-style explanation for understanding this topic from exam POV",
  "importantPoints": ["point"],
  "relatedQuestions": ["question"],
  "pyqSignals": ["brief pattern or signal"]
}

Rules:
- Keep overview clear, exam-ready, and easy to revise
- Important points should be concise
- Generate 3 related questions only
- Do not return JSON fences
`;

const buildExamAnswerPrompt = ({ subject, unit, question }) => `
You are writing an exam-ready answer for a BCA student.
Write in markdown-style plain text with strong formatting, headings, and point-wise structure.

Subject: ${subject.code || ''} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber} - ${unit.title}` : 'Not specified'}
Question: ${question.prompt}
Topic: ${question.topic || 'General'}
Marks: ${question.marks}
Question type: ${question.questionType}

Additional guidance:
- For 3 marks: concise and direct
- For 7 marks: well-structured medium answer
- For 14 marks: long, detailed, exam-focused answer that could fill multiple exam pages
- Use headings, numbered points, and examples
- If a diagram or table would help, describe it clearly in text
- Do not mention that you are an AI
`;

const buildExamAnswerFallback = (question) => {
  const topic = question.topic || 'the concept';
  if (question.marks >= 14) {
    return `## Introduction
${topic} should be introduced clearly with a direct definition and context.

## Main Explanation
1. Explain the concept step by step.
2. Cover the structure, working, or classification depending on the question.
3. Add one suitable example, application, or comparison.

## Exam Focus
- Use headings and point-wise presentation.
- Add a diagram or table if it improves the answer.
- Close with a short conclusion tied to the question asked.`;
  }

  if (question.marks >= 7) {
    return `## Answer Structure
1. Define ${topic}.
2. Explain the main points in sequence.
3. Add one concise example or practical note.

## Exam Focus
Keep the answer point-wise and directly aligned to the question.`;
  }

  return `## Short Answer
Define ${topic} directly and mention the most important exam point in one or two supporting lines.`;
};

const getTopicMatchedQuestions = async ({ subjectId, unitId, topic }) => {
  const questions = await PyqQuestion.find({ subjectId, unitId })
    .sort({ year: -1, questionNumber: 1, subpartLabel: 1, createdAt: -1 })
    .lean();

  return questions.filter((question) => matchesTopic(question.topic, topic) || matchesTopic(question.prompt, topic));
};

router.get('/subjects/:subjectId/topic-map', protect, async (req, res) => {
  try {
    const [subject, units, progressRecords, pyqQuestions] = await Promise.all([
      Subject.findById(req.params.subjectId).select('name code semester'),
      Unit.find({ subjectId: req.params.subjectId }).sort({ unitNumber: 1 }).lean(),
      TopicProgress.find({
        userId: req.user._id,
        subjectId: req.params.subjectId,
      }).lean(),
      PyqQuestion.find({ subjectId: req.params.subjectId })
        .select('unitId topic prompt marks year')
        .lean(),
    ]);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const progressMap = new Map(
      progressRecords.map((record) => [`${String(record.unitId)}::${normalizeTopic(record.topic)}`, record])
    );

    const unitsPayload = units.map((unit) => {
      const topics = (unit.topics || []).map((topicName) => {
        const key = `${String(unit._id)}::${normalizeTopic(topicName)}`;
        const progress = progressMap.get(key);
        const relatedPyqs = pyqQuestions.filter((question) => (
          String(question.unitId) === String(unit._id)
          && (matchesTopic(question.topic, topicName) || matchesTopic(question.prompt, topicName))
        ));

        return {
          name: topicName,
          status: progress?.status || 'new',
          confidence: progress?.confidence || 0,
          covered: progress?.status === 'mastered',
          pyqCount: relatedPyqs.length,
          samplePyqPrompt: relatedPyqs[0]?.prompt || '',
        };
      });

      const coveredTopics = topics.filter((topic) => topic.covered).length;
      return {
        _id: unit._id,
        unitNumber: unit.unitNumber,
        title: unit.title,
        topics,
        coveredTopics,
        totalTopics: topics.length,
      };
    });

    const totalTopics = unitsPayload.reduce((sum, unit) => sum + unit.totalTopics, 0);
    const coveredTopics = unitsPayload.reduce((sum, unit) => sum + unit.coveredTopics, 0);

    res.json({
      subject,
      units: unitsPayload,
      totalTopics,
      coveredTopics,
      progressPercentage: totalTopics ? Math.round((coveredTopics / totalTopics) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/topics/guide', protect, async (req, res) => {
  try {
    const { subjectId, unitId, topic } = req.body;
    if (!subjectId || !unitId || !topic) {
      return res.status(400).json({ message: 'subjectId, unitId, and topic are required' });
    }

    const [subject, unit, pyqQuestions] = await Promise.all([
      Subject.findById(subjectId).select('name code'),
      Unit.findById(unitId).lean(),
      getTopicMatchedQuestions({ subjectId, unitId, topic }),
    ]);

    if (!subject || !unit) {
      return res.status(404).json({ message: 'Subject or unit not found' });
    }

    const fallback = buildTopicGuideFallback({ topic, pyqQuestions });
    let guide = fallback;
    try {
      guide = await generateJson(
        buildTopicGuidePrompt({ subject, unit, topic, pyqQuestions }),
        fallback
      );
    } catch (error) {
      console.error('Topic guide generation failed:', error);
    }

    res.json({
      topic,
      unit: {
        _id: unit._id,
        unitNumber: unit.unitNumber,
        title: unit.title,
      },
      overview: guide.overview || fallback.overview,
      importantPoints: Array.isArray(guide.importantPoints) && guide.importantPoints.length
        ? guide.importantPoints
        : fallback.importantPoints,
      relatedQuestions: Array.isArray(guide.relatedQuestions) && guide.relatedQuestions.length
        ? guide.relatedQuestions
        : fallback.relatedQuestions,
      pyqSignals: Array.isArray(guide.pyqSignals) && guide.pyqSignals.length
        ? guide.pyqSignals
        : fallback.pyqSignals,
      pyqQuestions: pyqQuestions.slice(0, 6).map((question) => ({
        _id: question._id,
        prompt: question.prompt,
        marks: question.marks,
        year: question.year,
        section: question.section,
        questionNumber: question.questionNumber,
        subpartLabel: question.subpartLabel,
        topic: question.topic,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/topics/progress', protect, async (req, res) => {
  try {
    const { subjectId, unitId, topic, covered } = req.body;
    if (!subjectId || !unitId || !topic || typeof covered !== 'boolean') {
      return res.status(400).json({ message: 'subjectId, unitId, topic, and covered are required' });
    }

    const safeConfidence = covered ? 100 : 0;
    const status = covered ? 'mastered' : 'new';

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
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/subjects/:subjectId/pyq-papers', protect, async (req, res) => {
  try {
    const resources = await Resource.find({
      subjectId: req.params.subjectId,
      category: 'pyq',
    })
      .select('title year examSession createdAt')
      .sort({ year: -1, createdAt: -1 })
      .lean();

    const counts = await PyqQuestion.aggregate([
      { $match: { resourceId: { $in: resources.map((resource) => resource._id) } } },
      { $group: { _id: '$resourceId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));

    res.json(resources.map((resource) => ({
      _id: resource._id,
      title: resource.title,
      year: resource.year || '',
      examSession: resource.examSession || '',
      questionCount: countMap.get(String(resource._id)) || 0,
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/resources/:resourceId/pyq-questions', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId).select('title year examSession subjectId category');
    if (!resource || resource.category !== 'pyq') {
      return res.status(404).json({ message: 'PYQ paper not found' });
    }

    const query = { resourceId: resource._id };
    const marks = Number(req.query.marks);
    if (Number.isFinite(marks) && marks > 0) {
      query.marks = marks;
    }

    const questions = await PyqQuestion.find(query)
      .populate('unitId', 'unitNumber title')
      .sort({ questionNumber: 1, subpartLabel: 1, createdAt: 1 });

    res.json({
      paper: {
        _id: resource._id,
        title: resource.title,
        year: resource.year || '',
        examSession: resource.examSession || '',
      },
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/questions/:questionId/exam-answer', protect, async (req, res) => {
  try {
    const question = await PyqQuestion.findById(req.params.questionId)
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title');

    if (!question) {
      return res.status(404).json({ message: 'PYQ question not found' });
    }

    let answer = buildExamAnswerFallback(question);
    try {
      answer = await generateText(
        buildExamAnswerPrompt({
          subject: question.subjectId,
          unit: question.unitId,
          question,
        }),
        { temperature: 0.3, maxOutputTokens: question.marks >= 14 ? 2600 : 1600 }
      );
    } catch (error) {
      console.error('Exam answer generation failed:', error);
    }

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
