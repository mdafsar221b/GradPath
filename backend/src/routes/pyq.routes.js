const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const Resource = require('../models/resource.model');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');
const PyqQuestion = require('../models/pyqQuestion.model');
const Quiz = require('../models/quiz.model');
const { generateJson } = require('../services/gemini.service');

const DEFAULT_INSTRUCTIONS = [
  'Answer five questions in all.',
  'Question No. 1 is compulsory.',
  'Answer two questions from Section A and B each.',
  'All questions carry equal marks.',
];

const normalizeQuestionType = (marks) => {
  if (marks >= 10) return 'long';
  if (marks >= 5) return 'medium';
  return 'short';
};

const getCurrentYearLabel = () => String(new Date().getFullYear());

const withCurrentExamYear = (examTitle = '') => {
  const currentYear = getCurrentYearLabel();
  const cleaned = cleanInlineText(examTitle);

  if (!cleaned) {
    return `B.C.A. Examination - ${currentYear}`;
  }

  const replacedRange = cleaned.replace(/\b(19|20)\d{2}\s*-\s*\d{2}\b/g, currentYear);
  if (replacedRange !== cleaned) {
    return replacedRange;
  }

  const replacedSingle = cleaned.replace(/\b(19|20)\d{2}\b/g, currentYear);
  if (replacedSingle !== cleaned) {
    return replacedSingle;
  }

  return `${cleaned} - ${currentYear}`;
};

const toRoman = (value) => {
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  return numerals[value - 1] || String(value || 1);
};

const buildPyqTitle = ({ subject, year }) => [subject?.code, subject?.name].filter(Boolean).join(' - ')
  ? [[subject?.code, subject?.name].filter(Boolean).join(' - '), year, 'PYQ'].filter(Boolean).join(' | ')
  : [year, 'PYQ'].filter(Boolean).join(' | ');

const cleanInlineText = (value = '') => value
  .replace(/\r/g, '')
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .replace(/[ \t]+/g, ' ')
  .replace(/\u2003/g, ' ')
  .replace(/\s+\n/g, '\n')
  .trim();

const cleanBlockText = (value = '') => cleanInlineText(
  value
    .replace(/^#+\s*/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
);

const sanitizeLine = (line = '') => cleanInlineText(line.replace(/^#+\s*/, '').replace(/^[-*]\s+/, ''));

const splitQuestionBlocks = (text = '') => {
  const matches = [...text.matchAll(/(?:^|\n)\s*(?:##\s*)?(\d+)\.\s*/g)];
  if (!matches.length) return [];

  return matches.map((match, index) => {
    const marker = match[0];
    const numberOffset = marker.lastIndexOf(match[1]);
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    return {
      number: Number(match[1]),
      start: match.index + (numberOffset >= 0 ? numberOffset : 0),
      end,
      body: cleanBlockText(text.slice(start, end)),
    };
  });
};

const findSectionBoundary = (text = '', pattern) => {
  const match = text.match(pattern);
  return match ? match.index : -1;
};

const extractSubparts = (text = '', fallbackMarks = 7) => {
  const matches = [...text.matchAll(/\(([a-z])\)\s*([\s\S]*?)(?=(\n\s*\([a-z]\)\s*)|$)/gi)];

  if (matches.length === 0) {
    const cleaned = cleanBlockText(text);
    return cleaned
      ? [{
        label: 'a',
        prompt: cleaned,
        marks: fallbackMarks,
        questionType: normalizeQuestionType(fallbackMarks),
      }]
      : [];
  }

  return matches.map((match) => ({
    label: match[1].toLowerCase(),
    prompt: cleanBlockText(match[2]),
    marks: fallbackMarks,
    questionType: normalizeQuestionType(fallbackMarks),
  }));
};

const buildDefaultPaper = ({ subject, resource, rawText = '' }) => ({
  rawText,
  paperCode: '',
  examTitle: `B.C.A. Examination - ${resource.year || getCurrentYearLabel()}`,
  semesterLabel: subject?.semester ? `${subject.semester}${subject.semester === 1 ? 'st' : subject.semester === 2 ? 'nd' : subject.semester === 3 ? 'rd' : 'th'} Semester` : '',
  paperLabel: `Paper: ${toRoman(subject?.semester || 1)}`,
  subjectCode: subject?.code || '',
  subjectTitle: subject?.name || resource.title || 'Model Paper',
  timeAllowed: 'Three Hours',
  maximumMarks: 70,
  instructions: DEFAULT_INSTRUCTIONS,
  questionOne: {
    number: 1,
    prompt: 'Answer any four parts:',
    marks: 14,
    questionType: 'short',
    style: 'compulsory',
    choiceRule: 'Answer any four parts.',
    topic: '',
    answerGuide: '',
    parts: [],
  },
  sectionA: {
    title: 'SECTION-A',
    answerRule: 'Answer any two questions.',
    questions: [],
  },
  sectionB: {
    title: 'SECTION-B',
    answerRule: 'Answer any two questions.',
    questions: [],
  },
  parseStatus: 'parsed',
  parsedAt: new Date(),
});

const heuristicParsePaper = ({ rawText, subject, resource }) => {
  const paper = buildDefaultPaper({ subject, resource, rawText });
  const normalized = cleanBlockText(rawText);
  const blocks = splitQuestionBlocks(normalized);
  const sectionAStart = findSectionBoundary(normalized, /(?:^|\n)\s*#*\s*section\s*[-–]?\s*a\b/i);
  const sectionBStart = findSectionBoundary(normalized, /(?:^|\n)\s*#*\s*section\s*[-–]?\s*b\b/i);
  const preSectionLimit = sectionAStart >= 0 ? sectionAStart : normalized.length;
  const preSectionBlocks = blocks.filter((block) => block.start < preSectionLimit);
  const q1Block = preSectionBlocks.find((block) => (
    block.number === 1
    && (/\([a-z]\)/i.test(block.body) || /answer\s+any\s+\w+\s+parts?/i.test(block.body))
  )) || preSectionBlocks.find((block) => block.number === 1) || null;

  const headerText = q1Block ? normalized.slice(0, q1Block.start) : normalized;
  const headerLines = headerText.split('\n').map(sanitizeLine).filter(Boolean);
  paper.paperCode = headerLines.find((line) => /^\d+\/[ivxlcdm]+$/i.test(line)) || '';
  paper.examTitle = headerLines.find((line) => /examination/i.test(line)) || paper.examTitle;
  paper.semesterLabel = headerLines.find((line) => /semester/i.test(line)) || paper.semesterLabel;
  paper.paperLabel = headerLines.find((line) => /^paper\s*[:.-]/i.test(line)) || paper.paperLabel;
  paper.subjectCode = headerLines.find((line) => /^[A-Z]{2,6}[-\s]?\d{2,4}/.test(line)) || subject?.code || '';

  const subjectTitleIndex = headerLines.findIndex((line) => (
    line !== paper.paperCode
    && line !== paper.examTitle
    && line !== paper.semesterLabel
    && line !== paper.paperLabel
    && line !== paper.subjectCode
    && !/^time\s*:/i.test(line)
    && !/^maximum marks\s*:/i.test(line)
    && !/^note\s*:?/i.test(line)
  ));
  if (subjectTitleIndex >= 0) {
    paper.subjectTitle = headerLines[subjectTitleIndex];
  }

  const timeLine = headerLines.find((line) => /^time\s*:/i.test(line));
  const marksLine = headerLines.find((line) => /maximum marks/i.test(line));
  if (timeLine) {
    paper.timeAllowed = timeLine.replace(/^time\s*:\s*/i, '').replace(/[\]\[]/g, '').trim() || paper.timeAllowed;
  }
  if (marksLine) {
    const marksMatch = marksLine.match(/(\d+)/);
    paper.maximumMarks = marksMatch ? Number(marksMatch[1]) : paper.maximumMarks;
  }

  const noteStart = headerLines.findIndex((line) => /^note\s*:?/i.test(line));
  if (noteStart >= 0) {
    const noteLines = headerLines
      .slice(noteStart + 1)
      .map((line) => line.replace(/^\(?[ivx0-9]+\)?[.)]?\s*/i, '').trim())
      .filter(Boolean);
    if (noteLines.length) {
      paper.instructions = noteLines;
    }
  }

  if (q1Block) {
    paper.questionOne.prompt = /^answer/i.test(q1Block.body.split('\n')[0] || '')
      ? q1Block.body.split('\n')[0]
      : 'Answer any four parts:';
    paper.questionOne.choiceRule = paper.questionOne.prompt;
    paper.questionOne.parts = extractSubparts(q1Block.body, 3).map((part) => ({
      ...part,
      marks: 3,
      questionType: 'short',
    }));
  }

  const sectionAText = sectionAStart >= 0
    ? normalized.slice(sectionAStart, sectionBStart >= 0 ? sectionBStart : normalized.length)
    : '';
  const sectionBText = sectionBStart >= 0
    ? normalized.slice(sectionBStart)
    : '';

  const sectionABlocks = splitQuestionBlocks(sectionAText).filter((block) => block.number >= 2 && block.number <= 5);
  const sectionBBlocks = splitQuestionBlocks(sectionBText).filter((block) => block.number >= 6 && block.number <= 9);

  paper.sectionA.questions = sectionABlocks.map((block) => ({
    number: block.number,
    prompt: block.body,
    marks: 14,
    questionType: 'long',
    style: 'single',
    choiceRule: '',
    topic: '',
    answerGuide: '',
    parts: [],
  }));

  paper.sectionB.questions = sectionBBlocks.map((block) => {
    const lower = block.body.toLowerCase();
    const parts = extractSubparts(block.body, 7);
    const isShortNotes = /write notes on any/i.test(lower);

    return {
      number: block.number,
      prompt: isShortNotes ? 'Write notes on any two:' : '',
      marks: 14,
      questionType: 'long',
      style: isShortNotes ? 'short-notes' : parts.length > 1 ? 'split' : 'single',
      choiceRule: isShortNotes ? 'Write notes on any two.' : parts.length > 1 ? 'Attempt both parts.' : '',
      topic: '',
      answerGuide: '',
      parts: parts.length > 1 || isShortNotes ? parts : [],
    };
  });

  return paper;
};

const sanitizePaperPart = (part, fallbackLabel, fallbackMarks) => ({
  label: cleanInlineText(part?.label || fallbackLabel || ''),
  prompt: cleanBlockText(part?.prompt || ''),
  marks: Number(part?.marks) || fallbackMarks,
  questionType: ['short', 'medium', 'long'].includes(part?.questionType)
    ? part.questionType
    : normalizeQuestionType(Number(part?.marks) || fallbackMarks),
  topic: cleanInlineText(part?.topic || ''),
  answerGuide: cleanBlockText(part?.answerGuide || ''),
});

const sanitizePaperQuestion = (question, fallbackNumber, fallbackStyle) => {
  const marks = Number(question?.marks) || (fallbackStyle === 'compulsory' ? 14 : 14);
  const style = ['single', 'split', 'short-notes', 'compulsory'].includes(question?.style)
    ? question.style
    : fallbackStyle;

  return {
    number: Number(question?.number) || fallbackNumber,
    prompt: cleanBlockText(question?.prompt || ''),
    marks,
    questionType: ['short', 'medium', 'long'].includes(question?.questionType)
      ? question.questionType
      : normalizeQuestionType(marks),
    style,
    choiceRule: cleanInlineText(question?.choiceRule || ''),
    topic: cleanInlineText(question?.topic || ''),
    answerGuide: cleanBlockText(question?.answerGuide || ''),
    parts: Array.isArray(question?.parts)
      ? question.parts
        .map((part, index) => sanitizePaperPart(part, String.fromCharCode(97 + index), style === 'compulsory' ? 3 : 7))
        .filter((part) => part.prompt)
      : [],
  };
};

const sanitizePaperLayout = ({ rawText, parsed, subject, resource }) => {
  const fallback = heuristicParsePaper({ rawText, subject, resource });
  const questionOne = sanitizePaperQuestion(parsed?.questionOne || fallback.questionOne, 1, 'compulsory');
  const sectionAQuestions = (Array.isArray(parsed?.sectionA?.questions) ? parsed.sectionA.questions : fallback.sectionA.questions)
    .map((question, index) => sanitizePaperQuestion(question, index + 2, 'single'))
    .filter((question) => question.prompt || question.parts.length > 0)
    .slice(0, 4);
  const sectionBQuestions = (Array.isArray(parsed?.sectionB?.questions) ? parsed.sectionB.questions : fallback.sectionB.questions)
    .map((question, index) => sanitizePaperQuestion(question, index + 6, index === 3 ? 'short-notes' : 'split'))
    .filter((question) => question.prompt || question.parts.length > 0)
    .slice(0, 4);

  const paper = {
    ...fallback,
    paperCode: cleanInlineText(parsed?.paperCode || fallback.paperCode),
    examTitle: cleanInlineText(parsed?.examTitle || fallback.examTitle),
    semesterLabel: cleanInlineText(parsed?.semesterLabel || fallback.semesterLabel),
    paperLabel: cleanInlineText(parsed?.paperLabel || fallback.paperLabel),
    subjectCode: cleanInlineText(parsed?.subjectCode || fallback.subjectCode || subject?.code || ''),
    subjectTitle: cleanInlineText(parsed?.subjectTitle || fallback.subjectTitle || subject?.name || resource.title),
    timeAllowed: cleanInlineText(parsed?.timeAllowed || fallback.timeAllowed || 'Three Hours'),
    maximumMarks: Number(parsed?.maximumMarks) || fallback.maximumMarks || 70,
    instructions: Array.isArray(parsed?.instructions) && parsed.instructions.length
      ? parsed.instructions.map((line) => cleanInlineText(line)).filter(Boolean)
      : fallback.instructions,
    questionOne,
    sectionA: {
      title: cleanInlineText(parsed?.sectionA?.title || 'SECTION-A'),
      answerRule: cleanInlineText(parsed?.sectionA?.answerRule || 'Answer any two questions.'),
      questions: sectionAQuestions,
    },
    sectionB: {
      title: cleanInlineText(parsed?.sectionB?.title || 'SECTION-B'),
      answerRule: cleanInlineText(parsed?.sectionB?.answerRule || 'Answer any two questions.'),
      questions: sectionBQuestions,
    },
    rawText,
    parseStatus: 'parsed',
    parsedAt: new Date(),
  };

  if (!paper.questionOne.parts.length) {
    paper.questionOne.parts = fallback.questionOne.parts;
  }

  paper.examTitle = withCurrentExamYear(paper.examTitle);

  return paper;
};

const parsePaperWithAI = async ({ rawText, subject, resource }) => {
  const heuristic = heuristicParsePaper({ rawText, subject, resource });

  try {
    const parsed = await generateJson(
      `
Convert this BCA previous-year question paper into structured JSON only.
Preserve the paper format exactly: Question 1 compulsory short parts, Section A long questions, Section B split questions, and short notes when present.

Subject: ${subject.code || ''} - ${subject.name}
Raw paper text:
${rawText}

Return this JSON shape:
{
  "paperCode": "string",
  "examTitle": "string",
  "semesterLabel": "string",
  "paperLabel": "string",
  "subjectCode": "string",
  "subjectTitle": "string",
  "timeAllowed": "string",
  "maximumMarks": 70,
  "instructions": ["line 1"],
  "questionOne": {
    "number": 1,
    "prompt": "Answer any four parts:",
    "marks": 14,
    "questionType": "short",
    "style": "compulsory",
    "choiceRule": "Answer any four parts.",
    "parts": [
      {
        "label": "a",
        "prompt": "question text",
        "marks": 3,
        "questionType": "short",
        "topic": "",
        "answerGuide": ""
      }
    ]
  },
  "sectionA": {
    "title": "SECTION-A",
    "answerRule": "Answer any two questions.",
    "questions": [
      {
        "number": 2,
        "prompt": "question text",
        "marks": 14,
        "questionType": "long",
        "style": "single",
        "choiceRule": "",
        "topic": "",
        "answerGuide": "",
        "parts": []
      }
    ]
  },
  "sectionB": {
    "title": "SECTION-B",
    "answerRule": "Answer any two questions.",
    "questions": [
      {
        "number": 6,
        "prompt": "",
        "marks": 14,
        "questionType": "long",
        "style": "split|single|short-notes",
        "choiceRule": "Attempt both parts.",
        "topic": "",
        "answerGuide": "",
        "parts": [
          {
            "label": "a",
            "prompt": "sub question",
            "marks": 7,
            "questionType": "medium",
            "topic": "",
            "answerGuide": ""
          }
        ]
      }
    ]
  }
}

Rules:
- Return JSON only
- Keep exactly four questions in Section A and four in Section B when the paper contains them
- Use style "short-notes" for questions like "Write notes on any two"
- Preserve all subparts
- Keep prompts concise but faithful to the source
`,
      heuristic
    );

    return sanitizePaperLayout({ rawText, parsed, subject, resource });
  } catch (error) {
    console.error('PYQ paper parsing failed:', error);
    return heuristic;
  }
};

const rankTopics = (questions) => {
  const currentYear = new Date().getFullYear();
  const topicMap = new Map();

  questions.forEach((question) => {
    const topic = question.topic || 'General';
    const marks = Number(question.marks) || 0;
    const yearValue = Number.parseInt(question.year, 10);
    const recencyWeight = Number.isFinite(yearValue) ? Math.max(1, yearValue - (currentYear - 6)) : 1;

    if (!topicMap.has(topic)) {
      topicMap.set(topic, {
        topic,
        count: 0,
        marksWeight: 0,
        recencyScore: 0,
        sampleQuestions: [],
        unitId: question.unitId?._id || question.unitId || null,
        unitTitle: question.unitId?.title || '',
      });
    }

    const entry = topicMap.get(topic);
    entry.count += 1;
    entry.marksWeight += marks;
    entry.recencyScore += recencyWeight;
    if (entry.sampleQuestions.length < 2) {
      entry.sampleQuestions.push(question.prompt);
    }
  });

  return Array.from(topicMap.values())
    .map((topic) => ({
      ...topic,
      score: topic.count * 3 + topic.marksWeight * 1.5 + topic.recencyScore,
      rationale: `${topic.count} recurring question(s), ${topic.marksWeight} marks across curated PYQs`,
    }))
    .sort((a, b) => b.score - a.score);
};

const classifyPyqQuestion = async ({ subject, units, prompt, marks, questionType }) => {
  if (!units.length) {
    return {
      unitId: null,
      topic: 'General',
      mappingSource: 'fallback',
      classificationConfidence: 'low',
      classificationReason: 'No syllabus units are available for this subject.',
    };
  }

  const syllabusLines = units.map((unit) => (
    `Unit ${unit.unitNumber}: ${unit.title}\nTopics: ${(unit.topics || []).join(', ')}`
  )).join('\n\n');

  try {
    const payload = await generateJson(
      `
Classify this BCA PYQ question against the subject syllabus.
Return JSON only.

Subject: ${subject.code || ''} - ${subject.name}
Question marks: ${marks}
Question type: ${questionType}
Question text:
${prompt}

Syllabus:
${syllabusLines}

Return this JSON shape:
{
  "unitNumber": 1,
  "topic": "short topic label",
  "confidence": "low|medium|high",
  "reason": "one sentence"
}

Rules:
- Pick the single best matching unitNumber from the syllabus
- Keep topic short and aligned to the syllabus wording when possible
- If the match is weak, still choose the closest unit and mark confidence low
`,
      {
        unitNumber: units[0]?.unitNumber || 1,
        topic: 'General',
        confidence: 'low',
        reason: 'Fallback classification used.',
      }
    );

    const matchedUnit = units.find((unit) => unit.unitNumber === Number(payload.unitNumber)) || null;
    return {
      unitId: matchedUnit?._id || null,
      topic: (payload.topic || matchedUnit?.title || 'General').trim(),
      mappingSource: matchedUnit ? 'ai' : 'fallback',
      classificationConfidence: ['low', 'medium', 'high'].includes(payload.confidence) ? payload.confidence : 'low',
      classificationReason: (payload.reason || 'Mapped automatically from the syllabus.').trim(),
    };
  } catch (error) {
    console.error('PYQ classification failed:', error);
    return {
      unitId: null,
      topic: 'General',
      mappingSource: 'fallback',
      classificationConfidence: 'low',
      classificationReason: 'Automatic syllabus mapping failed, so a fallback mapping was used.',
    };
  }
};

const classifyPaperLayout = async ({ paper, subject, units }) => {
  const classifyItem = async (item) => {
    const classification = await classifyPyqQuestion({
      subject,
      units,
      prompt: item.prompt,
      marks: item.marks,
      questionType: item.questionType,
    });

    return {
      ...item,
      topic: classification.topic,
      unitId: classification.unitId,
      mappingSource: classification.mappingSource,
      classificationConfidence: classification.classificationConfidence,
      classificationReason: classification.classificationReason,
    };
  };

  const classifiedQuestionOneParts = [];
  for (const part of paper.questionOne.parts) {
    classifiedQuestionOneParts.push(await classifyItem(part));
  }

  const classifyQuestionBlock = async (question) => {
    if (question.parts.length > 0) {
      const parts = [];
      for (const part of question.parts) {
        parts.push(await classifyItem(part));
      }

      const leadTopic = parts[0]?.topic || '';
      return {
        ...question,
        parts,
        topic: leadTopic,
      };
    }

    return classifyItem(question);
  };

  const classifiedSectionA = [];
  for (const question of paper.sectionA.questions) {
    classifiedSectionA.push(await classifyQuestionBlock(question));
  }

  const classifiedSectionB = [];
  for (const question of paper.sectionB.questions) {
    classifiedSectionB.push(await classifyQuestionBlock(question));
  }

  return {
    ...paper,
    questionOne: {
      ...paper.questionOne,
      parts: classifiedQuestionOneParts,
    },
    sectionA: {
      ...paper.sectionA,
      questions: classifiedSectionA,
    },
    sectionB: {
      ...paper.sectionB,
      questions: classifiedSectionB,
    },
  };
};

const flattenPaperToQuestions = ({ paper, resource, subjectId, year, examSession }) => {
  const payloads = [];

  paper.questionOne.parts.forEach((part) => {
    payloads.push({
      resourceId: resource._id,
      subjectId,
      unitId: part.unitId || null,
      year,
      examSession,
      prompt: part.prompt,
      marks: part.marks,
      questionType: part.questionType,
      topic: part.topic || 'General',
      mappingSource: part.mappingSource || 'fallback',
      classificationConfidence: part.classificationConfidence || 'low',
      classificationReason: part.classificationReason || '',
      answerOutline: part.answerGuide || '',
      notes: '',
      section: 'question1',
      questionNumber: 1,
      subpartLabel: part.label,
      paperStyle: 'compulsory',
      choiceRule: paper.questionOne.choiceRule || '',
    });
  });

  const pushQuestionBlock = (question, section) => {
    if (question.parts.length > 0) {
      question.parts.forEach((part) => {
        payloads.push({
          resourceId: resource._id,
          subjectId,
          unitId: part.unitId || null,
          year,
          examSession,
          prompt: part.prompt,
          marks: part.marks,
          questionType: part.questionType,
          topic: part.topic || question.topic || 'General',
          mappingSource: part.mappingSource || 'fallback',
          classificationConfidence: part.classificationConfidence || 'low',
          classificationReason: part.classificationReason || '',
          answerOutline: part.answerGuide || question.answerGuide || '',
          notes: '',
          section,
          questionNumber: question.number,
          subpartLabel: part.label,
          paperStyle: question.style || 'split',
          choiceRule: question.choiceRule || '',
        });
      });
      return;
    }

    payloads.push({
      resourceId: resource._id,
      subjectId,
      unitId: question.unitId || null,
      year,
      examSession,
      prompt: question.prompt,
      marks: question.marks,
      questionType: question.questionType,
      topic: question.topic || 'General',
      mappingSource: question.mappingSource || 'fallback',
      classificationConfidence: question.classificationConfidence || 'low',
      classificationReason: question.classificationReason || '',
      answerOutline: question.answerGuide || '',
      notes: '',
      section,
      questionNumber: question.number,
      subpartLabel: '',
      paperStyle: question.style || 'single',
      choiceRule: question.choiceRule || '',
    });
  };

  paper.sectionA.questions.forEach((question) => pushQuestionBlock(question, 'section-a'));
  paper.sectionB.questions.forEach((question) => pushQuestionBlock(question, 'section-b'));

  return payloads;
};

const buildFallbackAnswerGuide = ({ topic, questionType }) => {
  if (questionType === 'long') {
    return `Cover definition, explanation, working steps, and a strong exam-focused example for ${topic}.`;
  }

  if (questionType === 'medium') {
    return `State the concept clearly, explain the main points in sequence, and add one concise example for ${topic}.`;
  }

  return `Define ${topic} briefly and mention the most important exam point.`;
};

const buildPyqReviewPrompt = ({
  subject,
  unit,
  question,
  answer,
}) => `
You are reviewing a BCA student's written answer to a curated previous-year question.
Evaluate fairly, exam-style, and return JSON only.

Subject: ${subject.code || ''} - ${subject.name}
Unit: ${unit ? `Unit ${unit.unitNumber}: ${unit.title}` : 'Not specified'}
Question:
${question.prompt}

Expected topic: ${question.topic || 'General'}
Question type: ${question.questionType}
Marks: ${question.marks}
Stored answer outline:
${question.answerOutline || 'No curated answer outline available.'}

Student answer:
${answer}

Return this JSON shape:
{
  "score": 0,
  "strengths": ["point"],
  "missingPoints": ["point"],
  "idealAnswer": "exam-ready model answer",
  "verdict": "one paragraph summary",
  "improvementTips": ["tip"]
}

Rules:
- Score must be between 0 and ${question.marks}
- Keep strengths and missingPoints concise
- Ideal answer should be exam-ready but compact
- Focus on concept correctness, completeness, and structure
`;

const sanitizeReviewPayload = (payload, question, fallback) => {
  const clampScore = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback.score;
    }

    return Math.min(question.marks, Math.max(0, Math.round(numeric)));
  };

  const cleanList = (value, fallbackValue) => (
    Array.isArray(value)
      ? value.map((item) => cleanInlineText(String(item || ''))).filter(Boolean).slice(0, 4)
      : fallbackValue
  );

  const idealAnswer = cleanBlockText(payload?.idealAnswer || '');
  const verdict = cleanBlockText(payload?.verdict || '');

  return {
    score: clampScore(payload?.score),
    strengths: cleanList(payload?.strengths, fallback.strengths),
    missingPoints: cleanList(payload?.missingPoints, fallback.missingPoints),
    idealAnswer: idealAnswer || fallback.idealAnswer,
    verdict: verdict || fallback.verdict,
    improvementTips: cleanList(payload?.improvementTips, fallback.improvementTips),
  };
};

const buildFallbackPyqReview = ({ question, answer }) => {
  const cleanedAnswer = cleanBlockText(answer);
  const wordCount = cleanedAnswer.split(/\s+/).filter(Boolean).length;
  const targetWordCount = question.questionType === 'long'
    ? 140
    : question.questionType === 'medium'
      ? 80
      : 35;
  const completenessRatio = Math.min(1, wordCount / targetWordCount);
  const baseScore = wordCount === 0 ? 0 : Math.max(1, Math.round(question.marks * completenessRatio));

  return {
    score: Math.min(question.marks, baseScore),
    strengths: wordCount > 0
      ? [
        'You attempted the question in your own words.',
        `The response addresses the topic "${question.topic || 'General'}" at a basic level.`,
      ]
      : ['No substantial answer was provided yet.'],
    missingPoints: [
      'Add a more structured exam-style introduction.',
      'Cover the key definition, working, and one example or diagram if relevant.',
      'Use clearer point-wise presentation to secure more marks.',
    ],
    idealAnswer: question.answerOutline
      ? cleanBlockText(question.answerOutline)
      : buildFallbackAnswerGuide({ topic: question.topic || 'the topic', questionType: question.questionType }),
    verdict: wordCount > 0
      ? 'This answer attempts the right area, but it still needs more precise exam points, structure, and completeness to score strongly.'
      : 'Start with a concise definition, then explain the concept step by step to build a complete exam-ready answer.',
    improvementTips: [
      'Write in points or short paragraphs instead of one long block.',
      'Add one example, diagram, or application wherever possible.',
      `Target the full ${question.marks}-mark expectation for this question type.`,
    ],
  };
};

const normalizePromptForComparison = (value = '') => cleanBlockText(value)
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const buildTemplateBlueprint = (templatePaper) => JSON.stringify({
  instructions: templatePaper.instructions,
  questionOne: {
    choiceRule: templatePaper.questionOne.choiceRule,
    partsCount: templatePaper.questionOne.parts.length,
    marksPerPart: templatePaper.questionOne.parts[0]?.marks || 3,
  },
  sectionA: {
    title: templatePaper.sectionA.title,
    answerRule: templatePaper.sectionA.answerRule,
    questionCount: templatePaper.sectionA.questions.length,
    marksPerQuestion: templatePaper.sectionA.questions[0]?.marks || 14,
    styles: templatePaper.sectionA.questions.map((question) => question.style),
  },
  sectionB: {
    title: templatePaper.sectionB.title,
    answerRule: templatePaper.sectionB.answerRule,
    questionCount: templatePaper.sectionB.questions.length,
    marksPerQuestion: templatePaper.sectionB.questions[0]?.marks || 14,
    styles: templatePaper.sectionB.questions.map((question) => question.style),
    typicalPartMarks: templatePaper.sectionB.questions[0]?.parts?.[0]?.marks || 7,
  },
}, null, 2);

const collectPaperPrompts = (paper) => ([
  ...paper.questionOne.parts.map((part) => part.prompt),
  ...paper.sectionA.questions.flatMap((question) => [question.prompt, ...question.parts.map((part) => part.prompt)]),
  ...paper.sectionB.questions.flatMap((question) => [question.prompt, ...question.parts.map((part) => part.prompt)]),
]).filter(Boolean);

const paperHasHistoricalPromptReuse = (paper, historicalPromptSet) => collectPaperPrompts(paper)
  .some((prompt) => historicalPromptSet.has(normalizePromptForComparison(prompt)));

const buildModelPaperPrompt = ({
  subject,
  templatePaper,
  importantTopics,
  questions,
}) => {
  const templateBlueprint = buildTemplateBlueprint(templatePaper);

  const historicalSignals = questions
    .slice(0, 20)
    .map((question) => (
      `- ${question.section} | ${question.paperStyle} | ${question.marks} marks | topic: ${question.topic}`
    ))
    .join('\n');

  const rankedTopics = importantTopics
    .slice(0, 10)
    .map((topic) => `${topic.topic} (${topic.count} questions, ${topic.marksWeight} marks)`)
    .join(', ');

  return `
Generate a fresh BCA university-style model paper as JSON only.
Do not copy old questions verbatim. Keep the exact examination pattern.

Subject: ${subject.code || ''} - ${subject.name}
Important topics: ${rankedTopics}

Historical paper blueprint:
${templateBlueprint}

Historical section/topic signals:
${historicalSignals}

Return this JSON shape:
{
  "title": "string",
  "paper": {
    "paperCode": "string",
    "examTitle": "string",
    "semesterLabel": "string",
    "paperLabel": "string",
    "subjectCode": "string",
    "subjectTitle": "string",
    "timeAllowed": "Three Hours",
    "maximumMarks": 70,
    "instructions": ["line 1"],
    "questionOne": {
      "number": 1,
      "prompt": "Answer any four parts:",
      "marks": 14,
      "questionType": "short",
      "style": "compulsory",
      "choiceRule": "Answer any four parts.",
      "parts": [
        {
          "label": "a",
          "prompt": "new short question",
          "marks": 3,
          "questionType": "short",
          "topic": "topic",
          "answerGuide": "marking hints"
        }
      ]
    },
    "sectionA": {
      "title": "SECTION-A",
      "answerRule": "Answer any two questions.",
      "questions": [
        {
          "number": 2,
          "prompt": "new 14-mark question",
          "marks": 14,
          "questionType": "long",
          "style": "single",
          "choiceRule": "",
          "topic": "topic",
          "answerGuide": "marking hints",
          "parts": []
        }
      ]
    },
    "sectionB": {
      "title": "SECTION-B",
      "answerRule": "Answer any two questions.",
      "questions": [
        {
          "number": 6,
          "prompt": "",
          "marks": 14,
          "questionType": "long",
          "style": "split|short-notes",
          "choiceRule": "Attempt both parts.",
          "topic": "topic",
          "answerGuide": "marking hints",
          "parts": [
            {
              "label": "a",
              "prompt": "7-mark subpart",
              "marks": 7,
              "questionType": "medium",
              "topic": "topic",
              "answerGuide": "marking hints"
            }
          ]
        }
      ]
    }
  }
}

Rules:
- Question 1 must contain short compulsory parts
- Section A must contain exactly 4 long 14-mark questions
- Section B must contain exactly 4 questions
- In Section B, the first 3 questions should usually be split into (a) and (b), 7+7 marks
- The last Section B question should be "short notes on any two" with at least 3 options
- Use only syllabus-aligned topics from the curated data
- Keep the paper readable and exam-appropriate
- Every generated prompt must be fresh and materially different from historical PYQ wording
- Do not repeat or lightly paraphrase old questions; change the task framing and wording
- Learn the format and topic distribution from history, not the exact text
- Return JSON only
`;
};

const buildFallbackModelPaperLayout = ({ subject, templatePaper, importantTopics }) => {
  const pickTopic = (index) => importantTopics[index % Math.max(importantTopics.length, 1)] || {
    topic: `Core topic ${index + 1}`,
  };

  return sanitizePaperLayout({
    rawText: templatePaper.rawText || '',
    subject,
    resource: { title: templatePaper.subjectTitle || subject.name, year: '' },
    parsed: {
      ...templatePaper,
      examTitle: withCurrentExamYear(templatePaper.examTitle),
      subjectCode: subject.code || templatePaper.subjectCode || '',
      subjectTitle: subject.name || templatePaper.subjectTitle || '',
      questionOne: {
        ...templatePaper.questionOne,
        parts: Array.from({ length: 4 }, (_, index) => {
          const topic = pickTopic(index);
          return {
            label: String.fromCharCode(97 + index),
            prompt: `Write a short note on ${topic.topic}.`,
            marks: 3,
            questionType: 'short',
            topic: topic.topic,
            answerGuide: buildFallbackAnswerGuide({ topic: topic.topic, questionType: 'short' }),
          };
        }),
      },
      sectionA: {
        ...templatePaper.sectionA,
        questions: Array.from({ length: 4 }, (_, index) => {
          const topic = pickTopic(index + 2);
          return {
            number: index + 2,
            prompt: `Explain ${topic.topic} in detail with suitable examples and exam-focused justification.`,
            marks: 14,
            questionType: 'long',
            style: 'single',
            choiceRule: '',
            topic: topic.topic,
            answerGuide: buildFallbackAnswerGuide({ topic: topic.topic, questionType: 'long' }),
            parts: [],
          };
        }),
      },
      sectionB: {
        ...templatePaper.sectionB,
        questions: [
          ...Array.from({ length: 3 }, (_, index) => {
            const firstTopic = pickTopic(index + 6);
            const secondTopic = pickTopic(index + 7);
            return {
              number: index + 6,
              prompt: '',
              marks: 14,
              questionType: 'long',
              style: 'split',
              choiceRule: 'Attempt both parts.',
              topic: firstTopic.topic,
              answerGuide: '',
              parts: [
                {
                  label: 'a',
                  prompt: `Discuss ${firstTopic.topic} with a structured explanation.`,
                  marks: 7,
                  questionType: 'medium',
                  topic: firstTopic.topic,
                  answerGuide: buildFallbackAnswerGuide({ topic: firstTopic.topic, questionType: 'medium' }),
                },
                {
                  label: 'b',
                  prompt: `Explain ${secondTopic.topic} with one suitable example or diagram.`,
                  marks: 7,
                  questionType: 'medium',
                  topic: secondTopic.topic,
                  answerGuide: buildFallbackAnswerGuide({ topic: secondTopic.topic, questionType: 'medium' }),
                },
              ],
            };
          }),
          {
            number: 9,
            prompt: 'Write notes on any two:',
            marks: 14,
            questionType: 'long',
            style: 'short-notes',
            choiceRule: 'Write notes on any two.',
            topic: pickTopic(10).topic,
            answerGuide: '',
            parts: Array.from({ length: 3 }, (_, index) => {
              const topic = pickTopic(index + 10);
              return {
                label: String.fromCharCode(97 + index),
                prompt: topic.topic,
                marks: 7,
                questionType: 'medium',
                topic: topic.topic,
                answerGuide: buildFallbackAnswerGuide({ topic: topic.topic, questionType: 'medium' }),
              };
            }),
          },
        ],
      },
    },
  });
};

const flattenModelPaperLayoutToQuizQuestions = (paper) => {
  const questions = [];

  paper.questionOne.parts.forEach((part) => {
    questions.push({
      prompt: part.prompt,
      questionType: part.questionType,
      options: [],
      answerIndex: 0,
      explanation: `Question 1 (${part.label})`,
      answerGuide: part.answerGuide || '',
      marks: part.marks,
      topic: part.topic || 'General',
      difficulty: 'easy',
    });
  });

  const pushQuestion = (question) => {
    if (question.parts.length > 0) {
      question.parts.forEach((part) => {
        questions.push({
          prompt: part.prompt,
          questionType: part.questionType,
          options: [],
          answerIndex: 0,
          explanation: `Question ${question.number}${part.label ? ` (${part.label})` : ''}`,
          answerGuide: part.answerGuide || question.answerGuide || '',
          marks: part.marks,
          topic: part.topic || question.topic || 'General',
          difficulty: part.questionType === 'medium' ? 'medium' : 'easy',
        });
      });
      return;
    }

    questions.push({
      prompt: question.prompt,
      questionType: question.questionType,
      options: [],
      answerIndex: 0,
      explanation: `Question ${question.number}`,
      answerGuide: question.answerGuide || '',
      marks: question.marks,
      topic: question.topic || 'General',
      difficulty: question.questionType === 'long' ? 'hard' : 'medium',
    });
  };

  paper.sectionA.questions.forEach(pushQuestion);
  paper.sectionB.questions.forEach(pushQuestion);
  return questions;
};

const buildSummary = async (subjectId) => {
  const [subject, units, questions, resources] = await Promise.all([
    Subject.findById(subjectId),
    Unit.find({ subjectId }).sort({ unitNumber: 1 }),
    PyqQuestion.find({ subjectId })
      .populate('unitId', 'unitNumber title')
      .sort({ year: -1, questionNumber: 1, subpartLabel: 1, createdAt: -1 }),
    Resource.find({ subjectId, category: 'pyq' }).sort({ year: -1, createdAt: -1 }),
  ]);

  if (!subject) {
    return null;
  }

  const [marksDistribution, questionTypeDistribution] = await Promise.all([
    PyqQuestion.aggregate([
      { $match: { subjectId: subject._id } },
      { $group: { _id: '$marks', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    PyqQuestion.aggregate([
      { $match: { subjectId: subject._id } },
      { $group: { _id: '$questionType', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
  ]);

  const importantTopics = rankTopics(questions);
  const unitHeatmap = units.map((unit) => {
    const unitQuestions = questions.filter((question) => String(question.unitId?._id || question.unitId || '') === String(unit._id));
    const topicMatches = importantTopics.filter((topic) => String(topic.unitId || '') === String(unit._id));

    return {
      unitId: unit._id,
      unitNumber: unit.unitNumber,
      title: unit.title,
      questionCount: unitQuestions.length,
      topics: topicMatches.map((topic) => ({
        topic: topic.topic,
        count: topic.count,
        score: topic.score,
      })),
    };
  });

  const recentPaperCoverage = resources.map((resource) => {
    const resourceQuestions = questions.filter((question) => String(question.resourceId) === String(resource._id));
    return {
      resourceId: resource._id,
      title: resource.title,
      year: resource.year || '',
      examSession: resource.examSession || '',
      questionCount: resourceQuestions.length,
      hasStructuredPaper: resource.pyqPaper?.parseStatus === 'parsed',
    };
  });

  const parsedTemplate = resources.find((resource) => resource.pyqPaper?.parseStatus === 'parsed')?.pyqPaper
    || buildDefaultPaper({ subject, resource: { title: subject.name, year: '' }, rawText: '' });

  return {
    subject,
    units,
    questions,
    resources,
    totalQuestions: questions.length,
    marksDistribution,
    questionTypeDistribution,
    importantTopics,
    unitHeatmap,
    recentPaperCoverage,
    templatePaper: parsedTemplate,
  };
};

router.get('/resources/:resourceId/questions', protect, admin, async (req, res) => {
  try {
    const questions = await PyqQuestion.find({ resourceId: req.params.resourceId })
      .populate('unitId', 'unitNumber title')
      .sort({ questionNumber: 1, subpartLabel: 1, createdAt: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/resources/:resourceId/paper', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId)
      .populate('subjectId', 'name code semester');
    if (!resource || resource.category !== 'pyq') {
      return res.status(404).json({ message: 'PYQ resource not found' });
    }

    res.json({
      resourceId: resource._id,
      subjectId: resource.subjectId,
      year: resource.year || '',
      examSession: resource.examSession || '',
      paper: resource.pyqPaper?.parseStatus === 'parsed' ? resource.pyqPaper : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/resources/:resourceId/parse-paper', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId).populate('subjectId', 'name code semester');
    if (!resource || resource.category !== 'pyq') {
      return res.status(404).json({ message: 'PYQ resource not found' });
    }

    const rawText = cleanBlockText(req.body.rawText || '');
    if (!rawText) {
      return res.status(400).json({ message: 'Raw question paper text is required.' });
    }

    const subject = await Subject.findById(resource.subjectId._id || resource.subjectId);
    const units = await Unit.find({ subjectId: resource.subjectId._id || resource.subjectId }).sort({ unitNumber: 1 });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found for this PYQ resource.' });
    }

    if (req.body.year !== undefined) {
      resource.year = String(req.body.year || '').trim();
      resource.title = buildPyqTitle({ subject, year: resource.year });
    }
    if (req.body.examSession !== undefined) {
      resource.examSession = String(req.body.examSession || '').trim();
    }

    const parsedPaper = await parsePaperWithAI({ rawText, subject, resource });
    const classifiedPaper = await classifyPaperLayout({ paper: parsedPaper, subject, units });

    await PyqQuestion.deleteMany({ resourceId: resource._id });
    const questionPayloads = flattenPaperToQuestions({
      paper: classifiedPaper,
      resource,
      subjectId: subject._id,
      year: resource.year || '',
      examSession: resource.examSession || '',
    });

    if (questionPayloads.length) {
      await PyqQuestion.insertMany(questionPayloads);
    }

    resource.pyqPaper = {
      ...classifiedPaper,
      rawText,
      parseStatus: 'parsed',
      parsedAt: new Date(),
    };
    await resource.save();

    const questions = await PyqQuestion.find({ resourceId: resource._id })
      .populate('unitId', 'unitNumber title')
      .sort({ questionNumber: 1, subpartLabel: 1, createdAt: 1 });

    res.status(201).json({
      paper: resource.pyqPaper,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/resources/:resourceId/questions', protect, admin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource || resource.category !== 'pyq') {
      return res.status(404).json({ message: 'PYQ resource not found' });
    }

    const [subject, units, existingCount] = await Promise.all([
      Subject.findById(resource.subjectId),
      Unit.find({ subjectId: resource.subjectId }).sort({ unitNumber: 1 }),
      PyqQuestion.countDocuments({ resourceId: resource._id }),
    ]);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found for this PYQ resource' });
    }

    const normalizedMarks = Number(req.body.marks);
    const normalizedQuestionType = req.body.questionType || normalizeQuestionType(normalizedMarks);
    const classification = await classifyPyqQuestion({
      subject,
      units,
      prompt: req.body.prompt,
      marks: normalizedMarks,
      questionType: normalizedQuestionType,
    });

    const question = await PyqQuestion.create({
      resourceId: resource._id,
      subjectId: resource.subjectId,
      unitId: classification.unitId,
      year: (req.body.year || resource.year || '').trim(),
      examSession: (req.body.examSession || resource.examSession || '').trim(),
      prompt: req.body.prompt,
      marks: normalizedMarks,
      questionType: normalizedQuestionType,
      topic: classification.topic,
      mappingSource: classification.mappingSource,
      classificationConfidence: classification.classificationConfidence,
      classificationReason: classification.classificationReason,
      answerOutline: req.body.answerOutline || '',
      notes: req.body.notes || '',
      section: req.body.section || 'section-a',
      questionNumber: Number(req.body.questionNumber) || existingCount + 2,
      subpartLabel: req.body.subpartLabel || '',
      paperStyle: req.body.paperStyle || 'single',
      choiceRule: req.body.choiceRule || '',
    });

    const populated = await PyqQuestion.findById(question._id).populate('unitId', 'unitNumber title');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/questions/:id', protect, admin, async (req, res) => {
  try {
    const question = await PyqQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'PYQ question not found' });
    }

    const [subject, units] = await Promise.all([
      Subject.findById(question.subjectId),
      Unit.find({ subjectId: question.subjectId }).sort({ unitNumber: 1 }),
    ]);

    if (req.body.year !== undefined) question.year = req.body.year.trim();
    if (req.body.examSession !== undefined) question.examSession = req.body.examSession.trim();
    if (req.body.prompt !== undefined) question.prompt = req.body.prompt.trim();
    if (req.body.marks !== undefined) question.marks = Number(req.body.marks);
    if (req.body.questionType !== undefined) question.questionType = req.body.questionType || normalizeQuestionType(Number(question.marks));
    if (req.body.answerOutline !== undefined) question.answerOutline = req.body.answerOutline.trim();
    if (req.body.notes !== undefined) question.notes = req.body.notes.trim();

    if (subject) {
      const classification = await classifyPyqQuestion({
        subject,
        units,
        prompt: question.prompt,
        marks: question.marks,
        questionType: question.questionType,
      });

      question.unitId = classification.unitId;
      question.topic = classification.topic;
      question.mappingSource = classification.mappingSource;
      question.classificationConfidence = classification.classificationConfidence;
      question.classificationReason = classification.classificationReason;
    }

    const saved = await question.save();
    const populated = await PyqQuestion.findById(saved._id).populate('unitId', 'unitNumber title');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/questions/:id', protect, admin, async (req, res) => {
  try {
    const question = await PyqQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'PYQ question not found' });
    }

    await question.deleteOne();
    res.json({ message: 'PYQ question removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/resources/status', protect, admin, async (req, res) => {
  try {
    const query = { category: 'pyq' };
    if (req.query.subjectId) query.subjectId = req.query.subjectId;

    const resources = await Resource.find(query)
      .populate('subjectId', 'name code semester')
      .sort({ createdAt: -1 });

    const counts = await PyqQuestion.aggregate([
      { $match: { resourceId: { $in: resources.map((resource) => resource._id) } } },
      { $group: { _id: '$resourceId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
    res.json(resources.map((resource) => ({
      resourceId: resource._id,
      title: resource.title,
      year: resource.year || '',
      examSession: resource.examSession || '',
      subject: resource.subjectId,
      questionCount: countMap.get(String(resource._id)) || 0,
      hasStructuredPaper: resource.pyqPaper?.parseStatus === 'parsed',
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/subjects/:subjectId/practice-question', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).select('name code');
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const baseQuery = { subjectId: subject._id };
    if (req.query.unitId) baseQuery.unitId = req.query.unitId;
    if (req.query.year) baseQuery.year = String(req.query.year).trim();

    const marks = Number(req.query.marks);
    if (Number.isFinite(marks) && marks > 0) {
      baseQuery.marks = marks;
    }

    if (['short', 'medium', 'long'].includes(req.query.questionType)) {
      baseQuery.questionType = req.query.questionType;
    }

    const relatedQuestionCount = await PyqQuestion.countDocuments(baseQuery);
    if (!relatedQuestionCount) {
      return res.status(404).json({
        message: 'No curated PYQ questions match the selected filters yet.',
      });
    }

    const query = { ...baseQuery };
    if (req.query.excludeId) {
      query._id = { $ne: req.query.excludeId };
    }

    const questions = await PyqQuestion.find(query)
      .populate('unitId', 'unitNumber title')
      .sort({ year: -1, questionNumber: 1, subpartLabel: 1, createdAt: -1 });

    if (!questions.length) {
      return res.status(404).json({
        message: 'No additional curated PYQ questions are available for these filters.',
      });
    }

    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
    res.json({
      question: selectedQuestion,
      subject,
      unit: selectedQuestion.unitId || null,
      relatedQuestionCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/questions/:id/review', protect, async (req, res) => {
  try {
    const answer = cleanBlockText(req.body.answer || '');
    if (answer.split(/\s+/).filter(Boolean).length < 8) {
      return res.status(400).json({
        message: 'Write a fuller answer before asking for AI review.',
      });
    }

    const question = await PyqQuestion.findById(req.params.id)
      .populate('subjectId', 'name code')
      .populate('unitId', 'unitNumber title');
    if (!question) {
      return res.status(404).json({ message: 'PYQ question not found' });
    }

    const fallback = buildFallbackPyqReview({ question, answer });
    let review = fallback;

    try {
      const payload = await generateJson(
        buildPyqReviewPrompt({
          subject: question.subjectId,
          unit: question.unitId,
          question,
          answer,
        }),
        fallback
      );
      review = sanitizeReviewPayload(payload, question, fallback);
    } catch (error) {
      console.error('PYQ answer review failed:', error);
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/subjects/:subjectId/summary', protect, async (req, res) => {
  try {
    const summary = await buildSummary(req.params.subjectId);
    if (!summary) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      subject: summary.subject,
      totalQuestions: summary.totalQuestions,
      marksDistribution: summary.marksDistribution,
      questionTypeDistribution: summary.questionTypeDistribution,
      importantTopics: summary.importantTopics.slice(0, 12),
      unitHeatmap: summary.unitHeatmap,
      recentPaperCoverage: summary.recentPaperCoverage,
      hasEnoughData: summary.totalQuestions >= 8,
      templatePaper: summary.templatePaper,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/subjects/:subjectId/model-paper', protect, async (req, res) => {
  try {
    const summary = await buildSummary(req.params.subjectId);
    if (!summary) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (summary.totalQuestions < 8) {
      return res.status(400).json({ message: 'At least 8 curated PYQ question entries are required to generate a model paper.' });
    }

    let parsedPayload = null;
    const historicalPromptSet = new Set(
      summary.questions.map((question) => normalizePromptForComparison(question.prompt)).filter(Boolean)
    );
    try {
      const prompt = buildModelPaperPrompt(summary);
      parsedPayload = await generateJson(prompt, {
        title: `${summary.subject.code || summary.subject.name} Model Paper`,
        paper: summary.templatePaper,
      });
    } catch (error) {
      console.error('Model paper AI generation failed:', error);
    }

    const paperLayout = parsedPayload?.paper
      ? sanitizePaperLayout({
        rawText: '',
        parsed: parsedPayload.paper,
        subject: summary.subject,
        resource: { title: summary.subject.name, year: '' },
      })
      : buildFallbackModelPaperLayout(summary);

    const finalPaperLayout = paperHasHistoricalPromptReuse(paperLayout, historicalPromptSet)
      ? buildFallbackModelPaperLayout(summary)
      : paperLayout;

    const quiz = await Quiz.create({
      createdBy: req.user._id,
      subjectId: summary.subject._id,
      title: parsedPayload?.title || `${summary.subject.code || summary.subject.name} Model Paper`,
      mode: 'model-paper',
      questions: flattenModelPaperLayoutToQuizQuestions(finalPaperLayout),
      paperLayout: finalPaperLayout,
    });

    res.status(201).json({
      quiz,
      paper: finalPaperLayout,
      summary: {
        importantTopics: summary.importantTopics.slice(0, 8),
        marksDistribution: summary.marksDistribution,
        questionTypeDistribution: summary.questionTypeDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
