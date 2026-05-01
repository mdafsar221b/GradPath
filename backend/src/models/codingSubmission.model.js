const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingChallenge',
      required: true,
    },
    language: String,
    code: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      enum: ['needs-work', 'partial', 'accepted'],
      default: 'needs-work',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
