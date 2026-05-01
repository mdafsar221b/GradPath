const express = require('express');
const router = express.Router();
const Resource = require('../models/resource.model');
const Subject = require('../models/subject.model');
const { protect, admin } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

// @desc    Get resource statistics
// @route   GET /api/resources/stats
// @access  Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const notesCount = await Resource.countDocuments({ category: 'notes' });
    const pyqsCount = await Resource.countDocuments({ category: 'pyq' });
    
    const byType = await Resource.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const byCategory = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byDifficulty = await Resource.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const allSubjects = await Subject.find();
    const subjectsWithResources = await Resource.distinct('subjectId');
    const pendingSubjectsCount = allSubjects.length - subjectsWithResources.length;
    const recentResources = await Resource.find()
      .populate('subjectId', 'name code semester')
      .populate('unitId', 'unitNumber title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalResources,
      notesCount,
      pyqsCount,
      byType,
      byCategory,
      byDifficulty,
      pendingSubjectsCount,
      recentResources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Admin
router.post('/', protect, admin, upload.single('file'), async (req, res) => {
  try {
    const {
      subjectId,
      unitId,
      type,
      title,
      url,
      category,
      description,
      difficulty,
      year,
      examSession,
      source,
      estimatedMinutes
    } = req.body;
    
    let finalUrl = url;
    if (type === 'pdf' && req.file) {
      finalUrl = req.file.path; // Cloudinary URL
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'URL or File is required' });
    }

    const resource = await Resource.create({
      subjectId,
      unitId: category === 'pyq' ? null : unitId,
      category: category || 'notes',
      type,
      title,
      url: finalUrl,
      description,
      difficulty,
      year: year ? Number(year) : undefined,
      examSession,
      source,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      tags: req.body.tags
        ? req.body.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
        : [],
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Resource Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get resources by filters
// @route   GET /api/resources
// @access  Protected (Student/Admin)
router.get('/', protect, async (req, res) => {
  try {
    const { subjectId, unitId, category, semester, type, difficulty, year, search, tag } = req.query;
    
    let query = {};
    if (subjectId) query.subjectId = subjectId;
    if (unitId) query.unitId = unitId;
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (year) query.year = Number(year);
    if (tag) query.tags = tag.toString().toLowerCase();
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // If semester is provided, we might need to filter subjects by semester first
    if (semester && !subjectId) {
      const subjectsInSemester = await Subject.find({ semester }).distinct('_id');
      query.subjectId = { $in: subjectsInSemester };
    }

    const resources = await Resource.find(query)
      .populate('subjectId', 'name code semester')
      .populate('unitId', 'unitNumber title')
      .sort({ createdAt: -1 });
      
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      title,
      url,
      type,
      category,
      description,
      difficulty,
      year,
      examSession,
      source,
      estimatedMinutes,
      tags,
      qualityStatus
    } = req.body;
    
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (title) resource.title = title;
    if (url) resource.url = url;
    if (type) resource.type = type;
    if (category) resource.category = category;
    if (description !== undefined) resource.description = description;
    if (difficulty) resource.difficulty = difficulty;
    if (year !== undefined) resource.year = year ? Number(year) : undefined;
    if (examSession !== undefined) resource.examSession = examSession;
    if (source !== undefined) resource.source = source;
    if (estimatedMinutes !== undefined) resource.estimatedMinutes = Number(estimatedMinutes);
    if (qualityStatus) resource.qualityStatus = qualityStatus;
    if (tags !== undefined) {
      resource.tags = Array.isArray(tags)
        ? tags.map(tag => tag.trim().toLowerCase()).filter(Boolean)
        : tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
    }

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
