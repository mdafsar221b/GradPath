const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    unitNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    topics: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Unit', unitSchema);
