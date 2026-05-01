const express = require('express');
const router = express.Router();
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const Resource = require('../models/resource.model');
const AiConversation = require('../models/aiConversation.model');
const { protect } = require('../middleware/auth.middleware');
const { generateText } = require('../services/gemini.service');

const buildContext = async ({ subjectId, unitId }) => {
  const [subject, unit, resources] = await Promise.all([
    subjectId ? Subject.findById(subjectId) : null,
    unitId ? Unit.findById(unitId) : null,
    Resource.find({
      ...(subjectId ? { subjectId } : {}),
      ...(unitId ? { unitId } : {}),
    }).limit(8),
  ]);

  return {
    subject,
    unit,
    resources,
  };
};

router.post('/ask', protect, async (req, res) => {
  try {
    const { question, conversationId } = req.body;
    const subjectId = req.body.subjectId || undefined;
    const unitId = req.body.unitId || undefined;
    if (!question || question.trim().length < 3) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const context = await buildContext({ subjectId, unitId });
    const resourceLines = context.resources.map(resource => (
      `- ${resource.title} (${resource.category}, ${resource.type}, tags: ${(resource.tags || []).join(', ')})`
    )).join('\n');

    const prompt = `
You are GradPath AI Tutor for Indian BCA students.
Answer in clear, exam-ready language. Use headings, short examples, and BCA syllabus framing.
If the question asks for code, include readable code and explain it.

Subject: ${context.subject?.code || 'General BCA'} - ${context.subject?.name || 'General'}
Unit: ${context.unit ? `Unit ${context.unit.unitNumber}: ${context.unit.title}` : 'Not specified'}
Topics: ${(context.unit?.topics || []).join(', ')}
Available resources:
${resourceLines || 'No uploaded resources for this exact scope.'}

Student question:
${question}
`;

    const answer = await generateText(prompt, { temperature: 0.25, maxOutputTokens: 2600 });
    let conversation = conversationId
      ? await AiConversation.findOne({ _id: conversationId, userId: req.user._id })
      : null;

    if (!conversation) {
      conversation = await AiConversation.create({
        userId: req.user._id,
        ...(subjectId ? { subjectId } : {}),
        ...(unitId ? { unitId } : {}),
        title: question.slice(0, 60),
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: question });
    conversation.messages.push({ role: 'assistant', content: answer });
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      answer,
      messages: conversation.messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await AiConversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('title subjectId unitId updatedAt messages');
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
