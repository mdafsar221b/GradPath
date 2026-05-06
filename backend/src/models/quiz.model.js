const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    questionType: {
      type: String,
      enum: ['mcq', 'short', 'medium', 'long'],
      default: 'mcq',
    },
    options: [{ type: String }],
    answerIndex: { type: Number, min: 0, max: 5 },
    explanation: { type: String, default: '' },
    answerGuide: { type: String, default: '' },
    marks: { type: Number, default: 0 },
    topic: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
    },
    title: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ['unit', 'pyq', 'mixed', 'viva', 'model-paper'],
      default: 'unit',
    },
    questions: [quizQuestionSchema],
    paperLayout: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
