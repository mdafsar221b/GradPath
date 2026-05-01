const mongoose = require('mongoose');

const codingChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    language: {
      type: String,
      enum: ['c', 'cpp', 'java', 'sql', 'javascript', 'html-css-js'],
      required: true,
    },
    track: {
      type: String,
      enum: ['c-programming', 'cpp-oop', 'java', 'dsa', 'dbms-sql', 'web-development'],
      required: true,
    },
    subjectCode: String,
    unitNumber: Number,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    prompt: { type: String, required: true },
    starterCode: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    hints: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);
