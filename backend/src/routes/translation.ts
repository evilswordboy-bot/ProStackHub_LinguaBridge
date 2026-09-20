import { Router, Request, Response, NextFunction } from 'express';
import { translationRateLimiter } from '../middleware/rateLimit.js';
import { validateBody, translateSchema, detectSchema } from '../middleware/validation.js';
import { processTranslation, processDetection } from '../services/translationService.js';
import { SUPPORTED_LANGUAGES } from '../utils/languageList.js';
import { isGeminiConfigured } from '../config/env.js';

const router = Router();

/**
 * GET /api/languages
 * Returns list of all supported languages with metadata
 */
router.get('/languages', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      languages: SUPPORTED_LANGUAGES,
      count: SUPPORTED_LANGUAGES.length
    }
  });
});

/**
 * POST /api/translate
 * Translates text with Gemini, preserving formatting, line breaks, and lists
 */
router.post(
  '/translate',
  translationRateLimiter,
  validateBody(translateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, sourceLang, targetLang } = req.body;
      const result = await processTranslation(text, sourceLang, targetLang);

      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/detect
 * Detects the language of a text snippet using Gemini
 */
router.post(
  '/detect',
  translationRateLimiter,
  validateBody(detectSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body;
      const detection = await processDetection(text);

      res.json({
        success: true,
        data: detection
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
