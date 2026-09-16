import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const translationRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many translation requests from this IP. Please try again shortly.',
      retryAfterSeconds: Math.ceil(config.rateLimitWindowMs / 1000)
    }
  }
});
