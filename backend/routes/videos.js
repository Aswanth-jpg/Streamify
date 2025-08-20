const express = require('express');
const Video = require('../models/Video');
const router = express.Router();

// GET /api/videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 }).populate('author', 'email fullname');
    return res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/videos
router.post('/', async (req, res) => {
  try {
    const { title, description, videoUrl, author } = req.body;
    if (!title || !description || !videoUrl || !author) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newVideo = new Video({
      title,
      description,
      videoUrl,
      author,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video added successfully.', video: newVideo });
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/videos/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    return res.status(200).json({ message: 'Video deleted successfully.' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;