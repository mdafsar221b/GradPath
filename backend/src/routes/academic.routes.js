const express = require('express');
const router = express.Router();
const {
  getSubjectsBySemester,
  getUnitsBySubject,
} = require('../controllers/academic.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/subjects/:semester', protect, getSubjectsBySemester);
router.get('/units/:subjectId', protect, getUnitsBySubject);

module.exports = router;
