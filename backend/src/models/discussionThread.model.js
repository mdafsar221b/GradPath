const mongoose = require('mongoose');

const discussionThreadSchema = new mongoose.Schema(
  {
    contextType: {
      type: String,
      enum: ['global', 'subject', 'unit', 'pyq-resource', 'model-paper-subject'],
      required: true,
    },
    contextKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      default: null,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DiscussionThread', discussionThreadSchema);
