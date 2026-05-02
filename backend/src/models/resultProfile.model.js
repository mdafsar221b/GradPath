const mongoose = require('mongoose');

const resultTheorySubjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: false,
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    writtenMarks: {
      type: Number,
      min: 0,
      max: 70,
      default: null,
    },
    internalMarks: {
      type: Number,
      min: 0,
      max: 30,
      default: null,
    },
    totalMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { _id: false }
);

const resultSemesterSchema = new mongoose.Schema(
  {
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    theorySubjects: {
      type: [resultTheorySubjectSchema],
      default: [],
    },
    practicalMarks: {
      type: Number,
      min: 0,
      max: 300,
      default: null,
    },
    practicalMax: {
      type: Number,
      required: true,
      default: 100,
    },
    semesterTotal: {
      type: Number,
      min: 0,
      max: 500,
      default: 0,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const resultProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    semesters: {
      type: [resultSemesterSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResultProfile', resultProfileSchema);
