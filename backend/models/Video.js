const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the video.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a video URL.'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Video || mongoose.model('Video', VideoSchema);