import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import processingRoutes from './routes/processingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (typically port 5173 / localhost)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// Body parsing with generous limit for photo uploads (base64)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Global Authentication Middleware (Demo & Header token compatible)
app.use(authMiddleware);

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ReBuild Mysore REST API',
    version: '1.0.0-hackathon',
    database_layer: 'Repository Abstraction (Mock Active)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
=====================================================
  REBUILD MYSORE — BACKEND REST API SERVER
  Status: Online & Ready
  Listening on: http://localhost:${PORT}
  Health check: http://localhost:${PORT}/api/health
  Architecture: Express + TS + Repository Pattern
  Database Mode: In-Memory Mock (Ready for Supabase)
=====================================================
  `);
});

export default app;
