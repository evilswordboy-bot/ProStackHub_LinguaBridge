export interface UiDictionary {
  appName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  startTranslating: string;
  sourceLabel: string;
  targetLabel: string;
  autoDetect: string;
  detected: string;
  uncertainDetection: string;
  translateBtn: string;
  translating: string;
  swapLanguages: string;
  copyBtn: string;
  copied: string;
  listenBtn: string;
  listening: string;
  pauseBtn: string;
  resumeBtn: string;
  stopBtn: string;
  speechUnavailable: string;
  speed: string;
  voice: string;
  cachedResult: string;
  historyTitle: string;
  favoritesTitle: string;
  analyticsTitle: string;
  settingsTitle: string;
  noHistory: string;
  noFavorites: string;
  clearHistory: string;
  confirmClearHistory: string;
  exportJson: string;
  exportCsv: string;
  exportTxt: string;
  searchPlaceholder: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  characters: string;
  words: string;
  clearText: string;
}

export const DICTIONARY_EN: UiDictionary = {
  appName: 'LinguaBridge AI',
  tagline: 'Break language barriers. Instantly.',
  heroHeading: 'Every language. One bridge.',
  heroSubheading: 'Translate naturally with AI while preserving the structure and meaning of your original text.',
  startTranslating: 'Start Translating',
  sourceLabel: 'Source Language',
  targetLabel: 'Target Language',
  autoDetect: 'Auto Detect',
  detected: 'Detected',
  uncertainDetection: 'Language detection is uncertain. Please select a language manually.',
  translateBtn: 'Translate',
  translating: 'Translating...',
  swapLanguages: 'Swap Languages',
  copyBtn: 'Copy',
  copied: 'Copied!',
  listenBtn: 'Listen',
  listening: 'Speaking...',
  pauseBtn: 'Pause',
  resumeBtn: 'Resume',
  stopBtn: 'Stop',
  speechUnavailable: 'Speech playback is unavailable for this language on your device.',
  speed: 'Speed',
  voice: 'Voice',
  cachedResult: 'Cached result',
  historyTitle: 'Translation History',
  favoritesTitle: 'Favorites',
  analyticsTitle: 'Analytics & Insights',
  settingsTitle: 'Settings',
  noHistory: 'No translations yet.',
  noFavorites: 'No favorites yet.',
  clearHistory: 'Clear History',
  confirmClearHistory: 'Clear all translation history?',
  exportJson: 'Export JSON',
  exportCsv: 'Export CSV',
  exportTxt: 'Export TXT',
  searchPlaceholder: 'Search history by text or language...',
  inputPlaceholder: 'Enter text, bullet points, or paragraphs to translate...',
  outputPlaceholder: 'Your translation will appear here...',
  characters: 'Characters',
  words: 'Words',
  clearText: 'Clear text'
};

export const UI_DICTIONARIES: Record<string, UiDictionary> = {
  en: DICTIONARY_EN
};

export function getUiStrings(lang = 'en'): UiDictionary {
  return UI_DICTIONARIES[lang] || DICTIONARY_EN;
}
