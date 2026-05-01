const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment.model');
const Progress = require('../models/progress.model');
const Resource = require('../models/resource.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const { protect } = require('../middleware/auth.middleware');

const daysUntil = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

router.get('/plan', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const semester = req.user.semester;

    const [subjects, progressRecords, assignments, resources] = await Promise.all([
      Subject.find({ semester }).sort({ code: 1 }),
      Progress.find({ userId }),
      Assignment.find({ userId, status: 'pending' })
        .populate('subjectId', 'name code')
        .populate('unitId', 'unitNumber title')
        .sort({ dueDate: 1 }),
      Resource.find({}).populate('subjectId', 'name code semester').populate('unitId', 'unitNumber title'),
    ]);

    const subjectIds = subjects.map(subject => subject._id);
    const units = await Unit.find({ subjectId: { $in: subjectIds } }).sort({ unitNumber: 1 });

    const subjectSummaries = subjects.map(subject => {
      const subjectId = subject._id.toString();
      const subjectUnits = units.filter(unit => unit.subjectId.toString() === subjectId);
      const progress = progressRecords.find(record => record.subjectId.toString() === subjectId);
      const completedUnits = progress?.completedUnits || [];
      const subjectAssignments = assignments.filter(item => item.subjectId?._id?.toString() === subjectId);
      const subjectResources = resources.filter(item => item.subjectId?._id?.toString() === subjectId);
      const notesCount = subjectResources.filter(item => item.category === 'notes').length;
      const pyqCount = subjectResources.filter(item => item.category === 'pyq').length;
      const incompleteUnits = subjectUnits
        .filter(unit => !completedUnits.includes(unit.unitNumber))
        .map(unit => ({
          _id: unit._id,
          unitNumber: unit.unitNumber,
          title: unit.title,
          topics: unit.topics.slice(0, 6),
        }));

      const nearestDue = subjectAssignments[0]?.dueDate || null;
      const deadlinePressure = nearestDue ? Math.max(0, 8 - daysUntil(nearestDue)) : 0;
      const progressPercentage = subjectUnits.length
        ? Math.round((completedUnits.length / subjectUnits.length) * 100)
        : 0;
      const resourceGap = Math.max(0, subjectUnits.length - notesCount) + (pyqCount === 0 ? 2 : 0);
      const priorityScore = (100 - progressPercentage) + (deadlinePressure * 10) + (resourceGap * 4);

      return {
        _id: subject._id,
        code: subject.code,
        name: subject.name,
        semester: subject.semester,
        completedUnits: completedUnits.length,
        totalUnits: subjectUnits.length,
        progressPercentage,
        pendingAssignments: subjectAssignments.length,
        notesCount,
        pyqCount,
        resourceGap,
        priorityScore,
        nextUnit: incompleteUnits[0] || null,
        incompleteUnits,
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    const urgentAssignments = assignments
      .slice(0, 5)
      .map(item => ({
        _id: item._id,
        title: item.title,
        dueDate: item.dueDate,
        daysLeft: daysUntil(item.dueDate),
        subject: item.subjectId,
        unit: item.unitId,
      }));

    const dailyPlan = [];
    if (urgentAssignments[0]) {
      dailyPlan.push({
        type: 'assignment',
        title: `Finish: ${urgentAssignments[0].title}`,
        detail: `${urgentAssignments[0].subject?.code || 'BCA'} is due in ${urgentAssignments[0].daysLeft} day(s).`,
        effortMinutes: 45,
        subjectId: urgentAssignments[0].subject?._id,
      });
    }

    subjectSummaries.slice(0, 3).forEach(subject => {
      if (!subject.nextUnit) return;
      dailyPlan.push({
        type: subject.pyqCount === 0 ? 'pyq-gap' : 'study',
        title: `Study ${subject.code}: Unit ${subject.nextUnit.unitNumber}`,
        detail: subject.nextUnit.title,
        effortMinutes: subject.pyqCount === 0 ? 30 : 50,
        subjectId: subject._id,
        unitId: subject.nextUnit._id,
      });
    });

    const pyqInsights = subjectSummaries
      .map(subject => ({
        subjectId: subject._id,
        code: subject.code,
        name: subject.name,
        pyqCount: subject.pyqCount,
        readiness: subject.pyqCount >= 5 ? 'strong' : subject.pyqCount >= 2 ? 'building' : 'needs-pyqs',
      }))
      .sort((a, b) => a.pyqCount - b.pyqCount);

    res.json({
      semester,
      generatedAt: new Date(),
      focusSubject: subjectSummaries[0] || null,
      dailyPlan: dailyPlan.slice(0, 4),
      urgentAssignments,
      subjectSummaries,
      pyqInsights,
      revisionQueue: subjectSummaries
        .filter(subject => subject.progressPercentage > 0 && subject.progressPercentage < 100)
        .slice(0, 4),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
