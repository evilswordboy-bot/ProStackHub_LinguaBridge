import express from 'express';
import cors from 'cors';
import { config, isGeminiConfigured } from './config/env.js';
import translationRoutes from './routes/translation.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// CORS configuration allowing frontend clients
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        config.clientUrl,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
      ];
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation: Origin not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging in development
if (config.nodeEnv !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// Routes
app.use('/api', healthRoutes);
app.use('/api', translationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`
============================================================
🌐 LINGUABRIDGE AI — BACKEND SERVICE STARTED
============================================================
* Status:       ONLINE
* Port:         ${config.port}
* Environment:  ${config.nodeEnv}
* Gemini Model: ${config.geminiModel}
* Gemini Key:   ${isGeminiConfigured() ? '✅ Configured' : '⚠️  MISSING (Set GEMINI_API_KEY in backend/.env)'}
* Health Check: http://localhost:${config.port}/api/health
* API Endpoint: http://localhost:${config.port}/api/translate
============================================================
    `);
  });
}
