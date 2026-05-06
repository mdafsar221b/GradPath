const mongoose = require('mongoose');

const pyqQuestionSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    examSession: {
      type: String,
      default: '',
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    questionType: {
      type: String,
      enum: ['short', 'medium', 'long'],
      required: true,
      default: 'short',
    },
    topic: {
      type: String,
      default: 'General',
      trim: true,
    },
    mappingSource: {
      type: String,
      enum: ['ai', 'fallback'],
      default: 'ai',
    },
    classificationConfidence: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    classificationReason: {
      type: String,
      default: '',
      trim: true,
    },
    answerOutline: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    section: {
      type: String,
      enum: ['question1', 'section-a', 'section-b'],
      default: 'section-a',
      index: true,
    },
    questionNumber: {
      type: Number,
      default: 0,
    },
    subpartLabel: {
      type: String,
      default: '',
      trim: true,
    },
    paperStyle: {
      type: String,
      enum: ['single', 'split', 'short-notes', 'compulsory'],
      default: 'single',
    },
    choiceRule: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

pyqQuestionSchema.index({ subjectId: 1, topic: 1 });
pyqQuestionSchema.index({ subjectId: 1, year: 1 });

module.exports = mongoose.model('PyqQuestion', pyqQuestionSchema);
