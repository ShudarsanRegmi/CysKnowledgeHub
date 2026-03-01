import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import authRoutes         from './routes/auth';
import healthRoutes        from './routes/health';
import adminRoutes         from './routes/admin';
import topicsRoutes        from './routes/topics';
import articlesRoutes      from './routes/articles';
import uploadRoutes        from './routes/upload';
import projectsRoutes      from './routes/projects';
import achievementsRoutes  from './routes/achievements';
import interviewsRoutes    from './routes/interviews';
import companiesRoutes     from './routes/companies';
import roadmapsRoutes      from './routes/roadmaps';

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── Static uploads (article images) ─────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/health',            healthRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/topics',        topicsRoutes);
app.use('/api/articles',      articlesRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/projects',      projectsRoutes);
app.use('/api/achievements',  achievementsRoutes);
app.use('/api/interviews',    interviewsRoutes);
app.use('/api/companies',     companiesRoutes);
app.use('/api/roadmaps',      roadmapsRoutes);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
