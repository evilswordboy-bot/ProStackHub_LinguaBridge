import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCacheKey,
  getCachedTranslation,
  setCachedTranslation,
  clearCache,
  getCacheCount
} from '../src/services/cache';

describe('Frontend Translation Cache Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates deterministic cache keys for identical text and languages', () => {
    const key1 = generateCacheKey('en', 'ta', 'Hello world');
    const key2 = generateCacheKey('en', 'ta', 'Hello world');
    const key3 = generateCacheKey('en', 'fr', 'Hello world');

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
  });

  it('handles whitespace normalization in cache keys', () => {
    const key1 = generateCacheKey('en', 'ta', '   Hello world   \n');
    const key2 = generateCacheKey('en', 'ta', 'Hello world');
    expect(key1).toBe(key2);
  });

  it('stores and retrieves cached translations', () => {
    const sampleData: any = {
      translation: 'வணக்கம் உலகம்',
      sourceLang: 'en',
      targetLang: 'ta',
      sourceLangName: 'English',
      targetLangName: 'Tamil',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: {
        lineCountPreserved: true,
        listsPreserved: true,
        characterCount: 13,
        wordCount: 2
      }
    };

    setCachedTranslation('en', 'ta', 'Hello world', sampleData);
    expect(getCacheCount()).toBe(1);

    const retrieved = getCachedTranslation('en', 'ta', 'Hello world');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.translation).toBe('வணக்கம் உலகம்');
    expect(retrieved?.isCached).toBe(true);
  });

  it('returns null on cache miss', () => {
    const result = getCachedTranslation('en', 'es', 'Non-existent phrase');
    expect(result).toBeNull();
  });

  it('clears all cached entries when clearCache is invoked', () => {
    const sampleData: any = {
      translation: 'Bonjour',
      sourceLang: 'en',
      targetLang: 'fr',
      sourceLangName: 'English',
      targetLangName: 'French',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: { lineCountPreserved: true, listsPreserved: true, characterCount: 7, wordCount: 1 }
    };

    setCachedTranslation('en', 'fr', 'Hello', sampleData);
    expect(getCacheCount()).toBe(1);

    clearCache();
    expect(getCacheCount()).toBe(0);
    expect(getCachedTranslation('en', 'fr', 'Hello')).toBeNull();
  });
});
