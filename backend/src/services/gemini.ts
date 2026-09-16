import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, isGeminiConfigured } from '../config/env.js';
import { findLanguage, getLanguageName } from '../utils/languageList.js';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server. Please add your key to backend/.env');
    }
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAI;
}

export interface DetectionResult {
  code: string;
  name: string;
  confidence: 'high' | 'medium' | 'uncertain';
  isUncertain: boolean;
}

export interface GeminiTranslationOutput {
  translatedText: string;
  detectedLanguage?: DetectionResult;
  model: string;
}

/**
 * Detect language of the input text using Gemini
 */
export async function detectLanguageWithGemini(text: string): Promise<DetectionResult> {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env');
  }

  const prompt = `You are an expert linguistic classifier.
Analyze the following text and identify its primary language:

---
${text.slice(0, 1000)}
---

Respond strictly with a JSON object in this exact format, with no markdown code fences and no extra text:
{"code": "ISO 639-1 two-letter code (e.g. en, ta, hi, fr, es, etc.)", "name": "Language English Name", "confidence": "high" | "medium" | "uncertain"}

If the text is too short, gibberish, or highly ambiguous, set "confidence" to "uncertain".`;

  try {
    const client = getClient();
    const model = client.getGenerativeModel({ model: config.geminiModel });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // Clean any markdown formatting if present
    const cleanJson = rawResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    const isUncertain = parsed.confidence === 'uncertain' || !parsed.code;
    return {
      code: parsed.code || 'unknown',
      name: parsed.name || 'Unknown',
      confidence: parsed.confidence || (isUncertain ? 'uncertain' : 'high'),
      isUncertain
    };
  } catch (err) {
    console.error('[Gemini Detection Error]:', err);
    return {
      code: 'unknown',
      name: 'Unknown',
      confidence: 'uncertain',
      isUncertain: true
    };
  }
}

/**
 * Translate text preserving exact formatting, lists, line breaks, and punctuation
 */
export async function translateWithGemini(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<GeminiTranslationOutput> {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env');
  }

  const sourceLangName = sourceLang.toLowerCase() === 'auto' ? 'Auto-Detect' : getLanguageName(sourceLang);
  const targetLangName = getLanguageName(targetLang);

  const systemInstruction = `You are an intelligent, professional language translator.
Translate the input text accurately from ${sourceLangName} to ${targetLangName}.

STRICT INSTRUCTIONS:
- Translate accurately.
- Preserve meaning.
- Preserve tone.
- Do not add explanations.
- Do not summarize.
- Do not rewrite unnecessarily.
- Preserve line breaks.
- Preserve paragraphs.
- Preserve punctuation (commas, periods, question marks, exclamation marks, quotation marks, parentheses, colon, semicolon).
- Preserve numbered lists (e.g., 1., 2., 3.).
- Preserve bullet lists (e.g., *, -, •).
- Preserve headings where possible.
- Return ONLY the translation.
- Do not surround the answer with markdown unless markdown exists in the original text.`;

  const userPrompt = `Translate the following content into ${targetLangName} while strictly adhering to all formatting and list preservation rules:

${text}`;

  const client = getClient();
  const model = client.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction
  });

  const response = await model.generateContent(userPrompt);
  let translatedText = response.response.text();

  // Strip accidental outer quotes or common wrapper artifacts if model wrapped whole output
  if (translatedText.startsWith('```') && translatedText.endsWith('```')) {
    translatedText = translatedText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
  }

  // Handle auto-detection if source was auto
  let detectedLanguage: DetectionResult | undefined;
  if (sourceLang.toLowerCase() === 'auto') {
    detectedLanguage = await detectLanguageWithGemini(text);
  }

  return {
    translatedText,
    detectedLanguage,
    model: config.geminiModel
  };
}
