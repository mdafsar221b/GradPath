# GradPath

GradPath is a BCA-focused academic command center built with Next.js, Express, and MongoDB. It helps students track semester progress, assignments, study resources, PYQs, and daily priorities from one workspace.

## Current Capabilities

- Student/admin authentication.
- Semester-wise BCA subjects and units.
- Unit completion tracking.
- Assignment tracker with deadlines.
- Resource library for notes, PYQs, PDFs, videos, and links.
- Admin resource upload and management.
- Smart study plan API that prioritizes deadlines, weak subjects, resource gaps, and revision candidates.
- Admin analytics for resource coverage, content type, difficulty, and recent uploads.
- Gemini-powered BCA AI tutor.
- AI-generated quizzes with scoring and topic breakdowns.
- Flashcards with spaced revision scheduling.
- Topic-level confidence tracking.
- Coding lab with AI review for BCA programming tracks.

## Advanced BCA Direction

The implementation roadmap is tracked in [docs/ADVANCED_BCA_TASKS.md](docs/ADVANCED_BCA_TASKS.md).

Next high-value milestones:

- PYQ trend tagging by unit/topic/year/marks.
- Full mock-test scheduling and exam reports.
- Real sandbox execution through a judge service for compiled languages.
- Final-year project workspace.
- AI tutor retrieval expansion over PDF contents, not only metadata.

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

Seed academic data:

```bash
npm run seed
```

Run frontend and backend together:

```bash
npm run dev-all
```

## Verification

```bash
npm run lint
npm run build
```
