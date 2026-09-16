import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory or project root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  nodeEnv: process.env.NODE_ENV || 'development',
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
};

export function isGeminiConfigured(): boolean {
  return Boolean(
    config.geminiApiKey &&
    config.geminiApiKey.trim().length > 0 &&
    !config.geminiApiKey.includes('your_gemini_api_key') &&
    !config.geminiApiKey.includes('your_api_key_here')
  );
}
