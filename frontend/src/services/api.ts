import { Language, TranslationResultData, DetectedLanguage, ApiHealthStatus } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  code: string;
  constructor(message: string, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/**
 * Check backend health and Gemini configuration status
 */
export async function checkBackendHealth(): Promise<ApiHealthStatus> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      service: 'LinguaBridge AI Backend',
      version: '1.0.0',
      gemini: {
        configured: false,
        model: 'unknown',
        status: 'key_missing'
      }
    };
  }
}

/**
 * Fetch supported languages catalog
 */
export async function getSupportedLanguages(): Promise<Language[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/languages`);
    if (!res.ok) {
      throw new Error('Failed to load supported languages');
    }
    const json = await res.json();
    return json.data.languages;
  } catch (err) {
    console.error('Failed to fetch languages, using default fallback list', err);
    // Safe fallback if server is unreachable
    return [
      { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-US', popular: true },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN', popular: true },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN', popular: true },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN', popular: true },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN', popular: true },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN', popular: true },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN', popular: true },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN', popular: true },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN', popular: true },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN', popular: true },
      { code: 'es', name: 'Spanish', nativeName: 'Español', speechLocale: 'es-ES', popular: true },
      { code: 'fr', name: 'French', nativeName: 'Français', speechLocale: 'fr-FR', popular: true },
      { code: 'de', name: 'German', nativeName: 'Deutsch', speechLocale: 'de-DE', popular: true },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', speechLocale: 'it-IT' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', speechLocale: 'pt-PT' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', speechLocale: 'ar-SA', direction: 'rtl', popular: true },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', speechLocale: 'ja-JP', popular: true },
      { code: 'ko', name: 'Korean', nativeName: '한국어', speechLocale: 'ko-KR', popular: true },
      { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', speechLocale: 'zh-CN', popular: true },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', speechLocale: 'ru-RU', popular: true }
    ];
  }
}

/**
 * Execute translation request through backend Gemini API
 */
export async function requestTranslation(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResultData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  try {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const json = await res.json();

    if (!res.ok || !json.success) {
      const errMsg = json?.error?.message || 'Translation failed. Please try again.';
      const errCode = json?.error?.code || 'TRANSLATION_ERROR';
      throw new ApiError(errMsg, errCode);
    }

    return json.data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Translation request timed out. Please try again.', 'TIMEOUT');
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      'Unable to connect to the translation service.',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Detect language of input text
 */
export async function requestLanguageDetection(text: string): Promise<DetectedLanguage> {
  try {
    const res = await fetch(`${BASE_URL}/api/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        code: 'unknown',
        name: 'Unknown',
        confidence: 'uncertain',
        isUncertain: true
      };
    }
    return json.data;
  } catch (err) {
    return {
      code: 'unknown',
      name: 'Unknown',
      confidence: 'uncertain',
      isUncertain: true
    };
  }
}
