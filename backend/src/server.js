require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const academicRoutes = require('./routes/academic.routes');
const resourceRoutes = require('./routes/resource.routes');
const adminRoutes = require('./routes/admin.routes');
const pyqRoutes = require('./routes/pyq.routes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pyq', pyqRoutes);
app.use('/api/practice', require('./routes/practice.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/study', require('./routes/study.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/quizzes', require('./routes/quiz.routes'));
app.use('/api/flashcards', require('./routes/flashcard.routes'));
app.use('/api/topics', require('./routes/topic.routes'));
app.use('/api/results', require('./routes/results.routes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const { notFound, errorHandler } = require('./middleware/error.middleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
