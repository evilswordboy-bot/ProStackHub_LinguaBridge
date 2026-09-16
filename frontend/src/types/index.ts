export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechLocale: string;
  popular?: boolean;
  direction?: 'ltr' | 'rtl';
}

export interface DetectedLanguage {
  code: string;
  name: string;
  confidence: 'high' | 'medium' | 'uncertain';
  isUncertain: boolean;
}

export interface FormatCheckResult {
  lineCountPreserved: boolean;
  listsPreserved: boolean;
  characterCount: number;
  wordCount: number;
}

export interface TranslationResultData {
  translation: string;
  sourceLang: string;
  targetLang: string;
  sourceLangName: string;
  targetLangName: string;
  detectedLanguage?: DetectedLanguage;
  formatCheck: FormatCheckResult;
  timestamp: string;
  model: string;
  isCached?: boolean;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  sourceLangName: string;
  targetLangName: string;
  detectedLanguage?: DetectedLanguage;
  timestamp: string;
  isFavorite: boolean;
}

export interface CacheEntry {
  key: string;
  sourceText: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  detectedLanguage?: DetectedLanguage;
  formatCheck: FormatCheckResult;
  createdAt: string;
  hitCount: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  defaultSourceLang: string;
  defaultTargetLang: string;
  speechRate: number;
  historyLimit: number;
}

export interface ApiHealthStatus {
  status: string;
  service: string;
  version: string;
  gemini: {
    configured: boolean;
    model: string;
    status: 'ready' | 'key_missing';
  };
}
