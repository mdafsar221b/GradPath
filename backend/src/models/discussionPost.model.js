const mongoose = require('mongoose');

const discussionPostSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiscussionThread',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorSnapshot: {
      clientUserId: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
      role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
      },
      semester: {
        type: Number,
        default: null,
      },
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiscussionPost',
      default: null,
      index: true,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

discussionPostSchema.index({ threadId: 1, parentId: 1, createdAt: -1 });

module.exports = mongoose.model('DiscussionPost', discussionPostSchema);
