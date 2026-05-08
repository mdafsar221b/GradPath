# GradPath

GradPath is a BCA-focused academic data and exam-preparation system built with Next.js, Express, and MongoDB. Its main purpose is to organize notes and previous-year question papers by semester, subject, and unit, then use that curated structure for PYQ analysis, topic-wise practice, and model paper generation.

## Core Problem

BCA students usually receive notes and previous-year papers in scattered PDFs, drives, and chats. Faculty and students do not have a structured way to:

- keep academic material mapped to the syllabus
- inspect repeated topics and marks patterns across PYQs
- move from raw papers to subject-wise model paper generation

## Core Workflow

1. Admin uploads notes and PYQ resources into the academic library.
2. Resources are stored against semester, subject, and unit metadata.
3. PYQ papers can be curated into structured question entries.
4. Students open the same curated data through the resource library and practice workspace.
5. Students can use one universal discussion group for broad academic help, then continue inside subject, unit, or PYQ-specific discussion threads.
6. The system analyzes historical PYQ patterns and generates model papers from curated local academic data.

## Main Capabilities

- Student/admin authentication.
- Semester-wise BCA subjects and units.
- Unit completion tracking.
- Resource library for notes, PYQs, PDFs, videos, and links.
- Admin resource upload, filtering, review, and quality-state management.
- PYQ question curation and structured paper parsing workflow.
- Topic-wise practice with matched PYQ signals.
- PYQ subject summaries with important topics, marks distribution, and pattern signals.
- Model paper generation from curated PYQ history.
- Universal discussion group with visible student names and semester badges.
- Contextual academic discussions attached to subjects, units, PYQ papers, and model-paper views.
- Assignment tracking, quizzes, flashcards, and AI tutor as supporting study tools.

## Positioning

GradPath is not meant to be presented as a generic chatbot. The main contribution is the structured academic data pipeline:

- syllabus-linked resources
- curated previous-year questions
- subject-wise PYQ analysis
- exam-style paper generation from local academic history

The AI components are used after the academic data has already been organized.

## Submission Notes

For a concise viva/demo narrative, see [SUBMISSION_FLOW.md](SUBMISSION_FLOW.md).

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS.
- Backend: Express 5, MongoDB, Mongoose.
- Storage: Cloudinary for PDF resources.
- State: Zustand.

## Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create environment files:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# backend/.env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Deployment setup:

```bash
# Vercel project environment variables
NEXT_PUBLIC_API_URL=/api
API_PROXY_TARGET=https://your-backend-domain.com/api
```

```bash
# backend/.env
CORS_ORIGIN=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

Seed academic data:

```bash
npm run seed
```

Run frontend and backend together:

```bash
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```
