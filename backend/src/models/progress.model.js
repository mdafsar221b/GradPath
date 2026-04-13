const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
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
    completedUnits: {
      type: [Number], // e.g. [1, 2, 5]
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user has only one progress record per subject
progressSchema.index({ userId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
