const mongoose = require('mongoose');

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
      type: Number,
      min: 2000,
      max: 2100,
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
