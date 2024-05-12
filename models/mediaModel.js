const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  paths: [
    {
      size: {
        type: String,
        required: true,
        enum: ['large', 'medium', 'small', 'extrasmall'],
      },
      width: {
        type: Number,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
  featuredImage: {
    type: String,
    required: true,
  },
  alternateText: String,
  caption: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
