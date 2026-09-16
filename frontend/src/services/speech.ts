export interface SpeechOptions {
  text: string;
  langCode: string;
  speechLocale?: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

const SPEECH_SETTINGS_KEY = 'linguabridge_speech_rate';

export function getSavedSpeechRate(): number {
  try {
    const saved = localStorage.getItem(SPEECH_SETTINGS_KEY);
    return saved ? parseFloat(saved) : 1.0;
  } catch {
    return 1.0;
  }
}

export function saveSpeechRate(rate: number): void {
  try {
    localStorage.setItem(SPEECH_SETTINGS_KEY, rate.toString());
  } catch (err) {
    console.error('Failed to save speech rate:', err);
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Find matching voice for a language code / speechLocale
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function findMatchingVoice(
  langCode: string,
  speechLocale?: string
): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (voices.length === 0) return null;

  const code = langCode.toLowerCase();
  const locale = (speechLocale || '').toLowerCase();

  // 1. Exact locale match (e.g. ta-IN or en-US)
  if (locale) {
    const exact = voices.find((v) => v.lang.toLowerCase() === locale || v.lang.toLowerCase().replace('_', '-') === locale);
    if (exact) return exact;
  }

  // 2. Starts-with language code match (e.g. ta- or en-)
  const prefixMatch = voices.find((v) => {
    const vLang = v.lang.toLowerCase();
    return vLang.startsWith(`${code}-`) || vLang === code;
  });
  if (prefixMatch) return prefixMatch;

  return null;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function getActiveUtterance(): SpeechSynthesisUtterance | null {
  return activeUtterance;
}

export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function pauseSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function speakText(options: SpeechOptions): boolean {
  if (!isSpeechSynthesisSupported()) {
    if (options.onError) {
      options.onError('Text-to-speech is not supported in this browser.');
    }
    return false;
  }

  // Stop any active speech before starting new
  stopSpeech();

  try {
    const utterance = new SpeechSynthesisUtterance(options.text);
    const voice = findMatchingVoice(options.langCode, options.speechLocale);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else if (options.speechLocale || options.langCode) {
      utterance.lang = options.speechLocale || options.langCode;
    }
    utterance.rate = options.rate || getSavedSpeechRate();

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      activeUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      if (e.error !== 'canceled' && options.onError) {
        options.onError(`Speech error: ${e.error}`);
      }
    };

    utterance.onpause = () => {
      if (options.onPause) options.onPause();
    };

    utterance.onresume = () => {
      if (options.onResume) options.onResume();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err: any) {
    if (options.onError) {
      options.onError('Text-to-speech is not supported in this browser.');
    }
    return false;
  }
}
