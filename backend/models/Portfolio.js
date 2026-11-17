const mongoose = require('mongoose');

const TEMPLATE_IDS = ['minimal', 'modern', 'creative', 'corporate'];

const portfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only'],
    },
    selectedTemplate: { type: String, enum: TEMPLATE_IDS, default: 'minimal' },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
module.exports.TEMPLATE_IDS = TEMPLATE_IDS;
