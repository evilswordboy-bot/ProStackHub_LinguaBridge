import { translateWithGemini, detectLanguageWithGemini, DetectionResult } from './gemini.js';
import { getLanguageName, findLanguage } from '../utils/languageList.js';

export interface TranslationResponsePayload {
  translation: string;
  sourceLang: string;
  targetLang: string;
  sourceLangName: string;
  targetLangName: string;
  detectedLanguage?: DetectionResult;
  formatCheck: {
    lineCountPreserved: boolean;
    listsPreserved: boolean;
    characterCount: number;
    wordCount: number;
  };
  timestamp: string;
  model: string;
}

/**
 * Remove accidental meta commentary if the AI inadvertently generated prefixes
 */
function sanitizeAiTranslation(text: string): string {
  let cleaned = text.trim();
  // Strip common AI meta prefixes
  const metaPrefixRegex = /^(here (is|are) (the )?(translated|translation)[^:\n]*:?\s*|translation:\s*)/i;
  if (metaPrefixRegex.test(cleaned)) {
    cleaned = cleaned.replace(metaPrefixRegex, '').trim();
  }
  return cleaned;
}

/**
 * Validates format preservation between original and translated text
 */
function verifyFormatPreservation(original: string, translated: string) {
  const origLines = original.split('\n');
  const transLines = translated.split('\n');

  // Check if numbered or bulleted list patterns exist in original
  const listRegex = /^\s*(\d+[\.\)]|[\*\-•])\s+/;
  const origListCount = origLines.filter((l) => listRegex.test(l)).length;
  const transListCount = transLines.filter((l) => listRegex.test(l)).length;

  const listsPreserved = origListCount === 0 || transListCount > 0;
  // Allow ±20% line variation due to wrapped sentences in certain scripts, but check for catastrophic flattening
  const lineCountPreserved = origLines.length === 1 || transLines.length >= Math.floor(origLines.length * 0.7);

  const wordCount = translated.trim() ? translated.trim().split(/\s+/).length : 0;
  const characterCount = translated.length;

  return {
    lineCountPreserved,
    listsPreserved,
    characterCount,
    wordCount
  };
}

export async function processTranslation(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponsePayload> {
  const result = await translateWithGemini(text, sourceLang, targetLang);
  const cleanedTranslation = sanitizeAiTranslation(result.translatedText);

  if (!cleanedTranslation) {
    throw new Error('Translation could not be completed. Please try again.');
  }

  const formatCheck = verifyFormatPreservation(text, cleanedTranslation);

  const resolvedSourceLang = result.detectedLanguage?.code || sourceLang;
  const sourceLangName = getLanguageName(resolvedSourceLang);
  const targetLangName = getLanguageName(targetLang);

  return {
    translation: cleanedTranslation,
    sourceLang: resolvedSourceLang,
    targetLang,
    sourceLangName,
    targetLangName,
    detectedLanguage: result.detectedLanguage,
    formatCheck,
    timestamp: new Date().toISOString(),
    model: result.model
  };
}

export async function processDetection(text: string): Promise<DetectionResult> {
  return await detectLanguageWithGemini(text);
}
