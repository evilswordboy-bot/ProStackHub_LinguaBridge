import { CacheEntry, TranslationResultData } from '../types';

const CACHE_STORAGE_KEY = 'linguabridge_cache_v1';
const CACHE_STATS_KEY = 'linguabridge_cache_stats_v1';

export interface CacheStats {
  hits: number;
  misses: number;
}

/**
 * Generate deterministic cache key
 */
export function generateCacheKey(sourceLang: string, targetLang: string, text: string): string {
  const normalizedText = text.trim();
  return `${sourceLang}|${targetLang}|${normalizedText}`;
}

function loadCacheMap(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error loading translation cache:', err);
    return {};
  }
}

function saveCacheMap(map: Record<string, CacheEntry>): void {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Error saving translation cache:', err);
  }
}

export function getCacheStats(): CacheStats {
  try {
    const raw = localStorage.getItem(CACHE_STATS_KEY);
    return raw ? JSON.parse(raw) : { hits: 0, misses: 0 };
  } catch {
    return { hits: 0, misses: 0 };
  }
}

function incrementCacheStat(type: 'hits' | 'misses'): void {
  try {
    const stats = getCacheStats();
    stats[type] += 1;
    localStorage.setItem(CACHE_STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to update cache stats', err);
  }
}

/**
 * Check cache for an existing translation
 */
export function getCachedTranslation(
  sourceLang: string,
  targetLang: string,
  text: string
): TranslationResultData | null {
  const key = generateCacheKey(sourceLang, targetLang, text);
  const cache = loadCacheMap();
  const entry = cache[key];

  if (entry) {
    entry.hitCount = (entry.hitCount || 0) + 1;
    saveCacheMap(cache);
    incrementCacheStat('hits');

    return {
      translation: entry.translation,
      sourceLang: entry.sourceLang,
      targetLang: entry.targetLang,
      sourceLangName: entry.sourceLang,
      targetLangName: entry.targetLang,
      detectedLanguage: entry.detectedLanguage,
      formatCheck: entry.formatCheck || {
        lineCountPreserved: true,
        listsPreserved: true,
        characterCount: entry.translation.length,
        wordCount: entry.translation.split(/\s+/).length
      },
      timestamp: entry.createdAt,
      model: 'local-cache',
      isCached: true
    };
  }

  incrementCacheStat('misses');
  return null;
}

/**
 * Store completed translation in local cache
 */
export function setCachedTranslation(
  sourceLang: string,
  targetLang: string,
  text: string,
  data: TranslationResultData
): void {
  try {
    const key = generateCacheKey(sourceLang, targetLang, text);
    const cache = loadCacheMap();

    // Cache size management: Keep max 200 items to prevent storage overflow
    const keys = Object.keys(cache);
    if (keys.length >= 200) {
      delete cache[keys[0]]; // LRU eviction of oldest inserted
    }

    cache[key] = {
      key,
      sourceText: text,
      translation: data.translation,
      sourceLang: data.sourceLang,
      targetLang: data.targetLang,
      detectedLanguage: data.detectedLanguage,
      formatCheck: data.formatCheck,
      createdAt: new Date().toISOString(),
      hitCount: 0
    };

    saveCacheMap(cache);
  } catch (err) {
    console.error('Failed to write to translation cache:', err);
  }
}

/**
 * Count total cached translations
 */
export function getCacheCount(): number {
  return Object.keys(loadCacheMap()).length;
}

/**
 * Clear all cached translations
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_STORAGE_KEY);
  localStorage.setItem(CACHE_STATS_KEY, JSON.stringify({ hits: 0, misses: 0 }));
}
