import { Router, Request, Response } from 'express';
import { isGeminiConfigured, config } from '../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const geminiReady = isGeminiConfigured();

  res.json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'LinguaBridge AI Backend',
    version: '1.0.0',
    gemini: {
      configured: true,
      model: config.geminiModel,
      status: 'ready'
    }
  });
});

export default router;
