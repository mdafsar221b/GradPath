const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: [{ type: String, required: true }],
    answerIndex: { type: Number, required: true, min: 0, max: 5 },
    explanation: { type: String, default: '' },
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
      enum: ['unit', 'pyq', 'mixed', 'viva'],
      default: 'unit',
    },
    questions: [quizQuestionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
