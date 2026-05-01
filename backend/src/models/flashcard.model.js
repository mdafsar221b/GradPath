const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
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
    topic: {
      type: String,
      default: '',
      index: true,
    },
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    intervalDays: {
      type: Number,
      min: 1,
      default: 1,
    },
    dueAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastReviewedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);
