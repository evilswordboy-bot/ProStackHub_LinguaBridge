export interface LanguageItem {
  code: string;       // ISO 639-1 code
  name: string;       // English name
  nativeName: string; // Native script name
  speechLocale: string; // BCP 47 locale tag for Web Speech API
  direction?: 'ltr' | 'rtl';
  popular?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
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
  { code: 'ru', name: 'Russian', nativeName: 'Русский', speechLocale: 'ru-RU', popular: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', speechLocale: 'nl-NL' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', speechLocale: 'tr-TR' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', speechLocale: 'vi-VN' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', speechLocale: 'pl-PL' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', speechLocale: 'id-ID' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-PK', direction: 'rtl' }
];

export function findLanguage(codeOrName: string): LanguageItem | undefined {
  const query = codeOrName.trim().toLowerCase();
  return SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === query || l.name.toLowerCase() === query
  );
}

export function getLanguageName(code: string): string {
  const lang = findLanguage(code);
  return lang ? lang.name : code;
}
