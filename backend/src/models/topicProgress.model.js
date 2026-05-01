const mongoose = require('mongoose');

const topicProgressSchema = new mongoose.Schema(
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
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['new', 'learning', 'revising', 'mastered'],
      default: 'new',
    },
    lastPracticedAt: Date,
  },
  { timestamps: true }
);

topicProgressSchema.index({ userId: 1, unitId: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('TopicProgress', topicProgressSchema);
