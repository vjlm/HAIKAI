import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from '../server/api';
import { getDatabase } from '../server/db';

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Warm up DB instance on serverless cold-start
try {
  getDatabase();
} catch (e) {
  console.warn('[Vercel Serverless] DB init warning:', e);
}

// Mount the API router for both /api prefixed routes and root-mounted requests
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
