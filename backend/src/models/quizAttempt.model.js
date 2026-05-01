const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: [{ type: Number }],
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    topicBreakdown: [
      {
        topic: String,
        correct: Number,
        total: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
