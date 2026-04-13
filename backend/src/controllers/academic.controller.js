const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');

const getSubjectsBySemester = async (req, res) => {
  try {
    const semester = parseInt(req.params.semester);
    const subjects = await Subject.find({ semester });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
};

const getUnitsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const units = await Unit.find({ subjectId }).sort({ unitNumber: 1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching units', error: error.message });
  }
};

module.exports = {
  getSubjectsBySemester,
  getUnitsBySubject,
};
