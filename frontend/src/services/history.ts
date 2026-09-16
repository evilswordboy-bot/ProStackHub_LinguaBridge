import { HistoryItem, TranslationResultData } from '../types';

const HISTORY_STORAGE_KEY = 'linguabridge_history_v1';

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load history from localStorage:', err);
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to persist history to localStorage:', err);
  }
}

export function addHistoryItem(
  sourceText: string,
  data: TranslationResultData
): HistoryItem {
  const history = getHistory();

  // Create new entry
  const newItem: HistoryItem = {
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sourceText,
    translatedText: data.translation,
    sourceLang: data.sourceLang,
    targetLang: data.targetLang,
    sourceLangName: data.sourceLangName || data.sourceLang,
    targetLangName: data.targetLangName || data.targetLang,
    detectedLanguage: data.detectedLanguage,
    timestamp: data.timestamp || new Date().toISOString(),
    isFavorite: false
  };

  // Prepend new item, limit history to 500 entries
  const updated = [newItem, ...history.filter(item => 
    // Avoid immediate duplicates of the same content
    !(item.sourceText === sourceText && item.targetLang === data.targetLang)
  )].slice(0, 500);

  saveHistory(updated);
  return newItem;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  const history = getHistory();
  const filtered = history.filter((item) => item.id !== id);
  saveHistory(filtered);
  return filtered;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function toggleFavorite(id: string): HistoryItem[] {
  const history = getHistory();
  const updated = history.map((item) =>
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  );
  saveHistory(updated);
  return updated;
}

export function getFavorites(): HistoryItem[] {
  return getHistory().filter((item) => item.isFavorite);
}

/**
 * Filter history items by search query and time range
 */
export function filterHistoryItems(
  items: HistoryItem[],
  query: string,
  timeFilter: 'all' | 'today' | 'week' | 'older',
  languageFilter: string
): HistoryItem[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;

  return items.filter((item) => {
    // 1. Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchSource = item.sourceText.toLowerCase().includes(q);
      const matchTrans = item.translatedText.toLowerCase().includes(q);
      const matchLang =
        item.sourceLangName.toLowerCase().includes(q) ||
        item.targetLangName.toLowerCase().includes(q) ||
        item.sourceLang.toLowerCase().includes(q) ||
        item.targetLang.toLowerCase().includes(q);

      if (!matchSource && !matchTrans && !matchLang) return false;
    }

    // 2. Language filter
    if (languageFilter && languageFilter !== 'all') {
      const matchLangFilter =
        item.sourceLang === languageFilter || item.targetLang === languageFilter;
      if (!matchLangFilter) return false;
    }

    // 3. Time filter
    const itemTime = new Date(item.timestamp).getTime();
    if (timeFilter === 'today') {
      return itemTime >= startOfToday;
    } else if (timeFilter === 'week') {
      return itemTime >= startOfWeek && itemTime < startOfToday;
    } else if (timeFilter === 'older') {
      return itemTime < startOfWeek;
    }

    return true;
  });
}

/**
 * Export history items to JSON file
 */
export function exportToJson(items: HistoryItem[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  downloadFile(dataStr, `linguabridge_history_${new Date().toISOString().slice(0, 10)}.json`);
}

/**
 * Export history items to CSV file
 */
export function exportToCsv(items: HistoryItem[]): void {
  const headers = ['Timestamp', 'Source Language', 'Target Language', 'Source Text', 'Translated Text', 'Favorite'];
  const rows = items.map((i) => [
    `"${i.timestamp}"`,
    `"${i.sourceLangName}"`,
    `"${i.targetLangName}"`,
    `"${i.sourceText.replace(/"/g, '""')}"`,
    `"${i.translatedText.replace(/"/g, '""')}"`,
    i.isFavorite ? 'Yes' : 'No'
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  downloadFile(dataStr, `linguabridge_history_${new Date().toISOString().slice(0, 10)}.csv`);
}

/**
 * Export history items to plain TXT file
 */
export function exportToTxt(items: HistoryItem[]): void {
  const formatted = items
    .map((item, idx) => {
      return `=====================================================
Translation #${idx + 1} [${item.timestamp}]
From: ${item.sourceLangName} (${item.sourceLang})
To:   ${item.targetLangName} (${item.targetLang})
Favorite: ${item.isFavorite ? 'Yes' : 'No'}
-----------------------------------------------------
SOURCE TEXT:
${item.sourceText}

TRANSLATION:
${item.translatedText}
`;
    })
    .join('\n\n');

  const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(formatted);
  downloadFile(dataStr, `linguabridge_history_${new Date().toISOString().slice(0, 10)}.txt`);
}

function downloadFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.setAttribute('href', dataUrl);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
