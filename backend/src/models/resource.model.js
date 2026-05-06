const mongoose = require('mongoose');

const pyqPaperPartSchema = new mongoose.Schema(
  {
    label: { type: String, default: '', trim: true },
    prompt: { type: String, default: '', trim: true },
    marks: { type: Number, default: 0 },
    questionType: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'short',
    },
    topic: { type: String, default: '', trim: true },
    answerGuide: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const pyqPaperQuestionSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    prompt: { type: String, default: '', trim: true },
    marks: { type: Number, default: 0 },
    questionType: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'long',
    },
    style: {
      type: String,
      enum: ['single', 'split', 'short-notes', 'compulsory'],
      default: 'single',
    },
    choiceRule: { type: String, default: '', trim: true },
    topic: { type: String, default: '', trim: true },
    answerGuide: { type: String, default: '', trim: true },
    parts: {
      type: [pyqPaperPartSchema],
      default: [],
    },
  },
  { _id: false }
);

const pyqPaperSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    answerRule: { type: String, default: '', trim: true },
    questions: {
      type: [pyqPaperQuestionSchema],
      default: [],
    },
  },
  { _id: false }
);

const pyqPaperSchema = new mongoose.Schema(
  {
    rawText: { type: String, default: '', trim: true },
    paperCode: { type: String, default: '', trim: true },
    examTitle: { type: String, default: '', trim: true },
    semesterLabel: { type: String, default: '', trim: true },
    paperLabel: { type: String, default: '', trim: true },
    subjectCode: { type: String, default: '', trim: true },
    subjectTitle: { type: String, default: '', trim: true },
    timeAllowed: { type: String, default: 'Three Hours', trim: true },
    maximumMarks: { type: Number, default: 70 },
    instructions: {
      type: [String],
      default: [],
    },
    questionOne: {
      type: pyqPaperQuestionSchema,
      default: null,
    },
    sectionA: {
      type: pyqPaperSectionSchema,
      default: () => ({ title: 'SECTION-A', answerRule: '', questions: [] }),
    },
    sectionB: {
      type: pyqPaperSectionSchema,
      default: () => ({ title: 'SECTION-B', answerRule: '', questions: [] }),
    },
    parseStatus: {
      type: String,
      enum: ['empty', 'parsed'],
      default: 'empty',
    },
    parsedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['notes', 'pyq'],
      required: true,
      default: 'notes',
    },
    type: {
      type: String,
      enum: ['pdf', 'youtube', 'link'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'exam'],
      default: 'intermediate',
    },
    year: {
      type: String,
      default: '',
    },
    examSession: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
    estimatedMinutes: {
      type: Number,
      min: 1,
      max: 600,
      default: 30,
    },
    qualityStatus: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'published',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    pyqPaper: {
      type: pyqPaperSchema,
      default: () => ({ parseStatus: 'empty' }),
    },
  },
  {
    timestamps: true,
  }
);

// Validation to ensure unitId is present for notes
resourceSchema.pre('save', function() {
  if (this.category === 'notes' && !this.unitId) {
    throw new Error('Unit ID is required for notes category');
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
