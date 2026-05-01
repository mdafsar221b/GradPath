const express = require('express');
const router = express.Router();
const CodingChallenge = require('../models/codingChallenge.model');
const CodingSubmission = require('../models/codingSubmission.model');
const { protect } = require('../middleware/auth.middleware');
const { generateJson } = require('../services/gemini.service');

const fallbackChallenges = [
  {
    title: 'Reverse a Number',
    language: 'c',
    track: 'c-programming',
    subjectCode: 'BCA104',
    unitNumber: 2,
    difficulty: 'easy',
    prompt: 'Write a C program to reverse an integer using a loop.',
    starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // write logic here\n    return 0;\n}',
    expectedOutput: 'Input: 1234\nOutput: 4321',
    hints: ['Use modulo 10 to get the last digit.', 'Use n / 10 to remove the last digit.'],
  },
  {
    title: 'SQL Department Count',
    language: 'sql',
    track: 'dbms-sql',
    subjectCode: 'BCA401',
    unitNumber: 4,
    difficulty: 'medium',
    prompt: 'Write an SQL query to count employees in each department from an employees table.',
    starterCode: 'SELECT department_id, COUNT(*) AS total_employees\nFROM employees\n-- add grouping here',
    expectedOutput: 'One row per department with employee count.',
    hints: ['Use GROUP BY department_id.', 'COUNT(*) counts rows in each group.'],
  },
  {
    title: 'Java Class for Student',
    language: 'java',
    track: 'java',
    subjectCode: 'BCA501',
    unitNumber: 2,
    difficulty: 'medium',
    prompt: 'Create a Java Student class with name, roll number, constructor, and display method.',
    starterCode: 'class Student {\n    // fields\n    // constructor\n    // display method\n}\n\nclass Main {\n    public static void main(String[] args) {\n    }\n}',
    expectedOutput: 'Print student details using a display method.',
    hints: ['Use instance variables.', 'Use this.name inside constructor.'],
  },
];

router.get('/challenges', protect, async (req, res) => {
  try {
    const query = {};
    if (req.query.track) query.track = req.query.track;
    if (req.query.language) query.language = req.query.language;

    let challenges = await CodingChallenge.find(query).sort({ difficulty: 1, createdAt: -1 }).limit(50);
    if (challenges.length === 0) {
      challenges = fallbackChallenges.filter(challenge => (
        (!query.track || challenge.track === query.track) &&
        (!query.language || challenge.language === query.language)
      ));
    }
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/review', protect, async (req, res) => {
  try {
    const { challengeId, code, language } = req.body;
    if (!challengeId || !code) return res.status(400).json({ message: 'challengeId and code are required' });

    let challenge = null;
    if (/^[0-9a-fA-F]{24}$/.test(challengeId)) {
      challenge = await CodingChallenge.findById(challengeId);
    }
    if (!challenge) {
      const fallback = fallbackChallenges.find(item => item.title === challengeId);
      if (fallback) {
        challenge = await CodingChallenge.create(fallback);
      }
    }
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const prompt = `
You are a strict but helpful BCA programming lab evaluator.
Review this ${language || challenge.language} solution.

Challenge: ${challenge.title}
Problem: ${challenge.prompt}
Expected output/behavior: ${challenge.expectedOutput}

Student code:
${code}

Return JSON only:
{
  "verdict": "accepted|partial|needs-work",
  "score": 0,
  "feedback": "specific feedback",
  "strengths": ["..."],
  "fixes": ["..."],
  "improvedCode": "optional improved code"
}
`;

    const review = await generateJson(prompt, {
      verdict: 'needs-work',
      score: 0,
      feedback: 'Unable to review code.',
      strengths: [],
      fixes: [],
      improvedCode: '',
    });

    const submission = await CodingSubmission.create({
      userId: req.user._id,
      challengeId: challenge._id,
      language: language || challenge.language,
      code,
      verdict: ['accepted', 'partial', 'needs-work'].includes(review.verdict) ? review.verdict : 'needs-work',
      score: Math.min(Math.max(Number(review.score) || 0, 0), 100),
      feedback: review.feedback || '',
    });

    res.status(201).json({ submission, review, challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/submissions/me', protect, async (req, res) => {
  try {
    const submissions = await CodingSubmission.find({ userId: req.user._id })
      .populate('challengeId', 'title language track difficulty')
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
