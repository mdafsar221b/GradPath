const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/users', protect, admin, async (req, res) => {
  try {
    const {
      search = '',
      role = '',
      semester = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const normalizedRole = role.toString().trim().toLowerCase();
    const normalizedSearch = search.toString().trim();
    const hasSemester = semester !== undefined && semester !== null && semester !== '';
    const semesterNumber = hasSemester ? Number(semester) : null;

    if (hasSemester && normalizedRole === 'admin') {
      return res.json({ total: 0, users: [] });
    }

    const query = {};

    if (normalizedSearch) {
      query.$or = [
        { name: { $regex: normalizedSearch, $options: 'i' } },
        { email: { $regex: normalizedSearch, $options: 'i' } },
      ];
    }

    if (hasSemester) {
      query.role = 'student';
      query.semester = semesterNumber;
    } else if (normalizedRole === 'student' || normalizedRole === 'admin') {
      query.role = normalizedRole;
    }

    const allowedSorts = ['name', 'email', 'role', 'semester', 'createdAt'];
    const finalSortBy = allowedSorts.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('name email role semester createdAt')
      .sort({ [finalSortBy]: finalSortOrder, _id: 1 });

    res.json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users/stats', protect, admin, async (_req, res) => {
  try {
    const [totalUsers, totalStudents, totalAdmins, bySemester] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$semester', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalAdmins,
      bySemester,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
