import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const translateSchema = z
  .object({
    text: z
      .string({ required_error: 'Please enter some text to translate.' })
      .trim()
      .min(1, 'Please enter some text to translate.')
      .max(10000, 'Text exceeds maximum limit of 10,000 characters.'),
    sourceLang: z.string().trim().optional(),
    sourceLanguage: z.string().trim().optional(),
    targetLang: z.string().trim().optional(),
    targetLanguage: z.string().trim().optional()
  })
  .refine((data) => Boolean(data.sourceLang || data.sourceLanguage), {
    message: 'Source language is required.',
    path: ['sourceLang']
  })
  .refine((data) => Boolean(data.targetLang || data.targetLanguage), {
    message: 'Target language is required.',
    path: ['targetLang']
  })
  .transform((data) => ({
    text: data.text,
    sourceLang: (data.sourceLanguage || data.sourceLang || 'auto').trim(),
    targetLang: (data.targetLanguage || data.targetLang || 'ta').trim()
  }));

export const detectSchema = z.object({
  text: z
    .string({ required_error: 'Text is required for language detection' })
    .trim()
    .min(1, 'Please enter text to detect language.')
    .max(5000, 'Text exceeds maximum detection limit of 5,000 characters.')
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid input data';
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: firstError,
          details: result.error.format()
        }
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
