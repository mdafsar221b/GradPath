const express = require('express');
const router = express.Router();
const Resource = require('../models/resource.model');
const { protect, admin } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Admin
router.post('/', protect, admin, upload.single('file'), async (req, res) => {
  try {
    const { subjectId, unitId, type, title, url } = req.body;
    
    let finalUrl = url;
    if (type === 'pdf' && req.file) {
      finalUrl = req.file.path; // Cloudinary URL
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'URL or File is required' });
    }

    const resource = await Resource.create({
      subjectId,
      unitId,
      type,
      title,
      url: finalUrl,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Resource Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get resources by subject and unit
// @route   GET /api/resources
// @access  Protected (Student/Admin)
router.get('/', protect, async (req, res) => {
  try {
    const { subjectId, unitId } = req.query;
    
    if (!subjectId || !unitId) {
      return res.status(400).json({ message: 'SubjectId and UnitId are required' });
    }

    const resources = await Resource.find({ subjectId, unitId }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
