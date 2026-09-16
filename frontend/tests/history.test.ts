import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  toggleFavorite,
  filterHistoryItems
} from '../src/services/history';

describe('Frontend Translation History & Favorites Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty history', () => {
    expect(getHistory()).toEqual([]);
  });

  it('adds history items with unique IDs and correct metadata', () => {
    const mockData: any = {
      translation: 'Bonjour le monde',
      sourceLang: 'en',
      targetLang: 'fr',
      sourceLangName: 'English',
      targetLangName: 'French',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: { lineCountPreserved: true, listsPreserved: true, characterCount: 16, wordCount: 3 }
    };

    const item = addHistoryItem('Hello world', mockData);
    expect(item.id).toBeDefined();
    expect(item.sourceText).toBe('Hello world');
    expect(item.translatedText).toBe('Bonjour le monde');
    expect(item.isFavorite).toBe(false);

    const history = getHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(item.id);
  });

  it('toggles favorite status properly', () => {
    const mockData: any = {
      translation: 'Hola mundo',
      sourceLang: 'en',
      targetLang: 'es',
      sourceLangName: 'English',
      targetLangName: 'Spanish',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: { lineCountPreserved: true, listsPreserved: true, characterCount: 10, wordCount: 2 }
    };

    const item = addHistoryItem('Hello world', mockData);
    expect(item.isFavorite).toBe(false);

    const updated = toggleFavorite(item.id);
    expect(updated.find((i) => i.id === item.id)?.isFavorite).toBe(true);

    const reverted = toggleFavorite(item.id);
    expect(reverted.find((i) => i.id === item.id)?.isFavorite).toBe(false);
  });

  it('filters history items by text query and language', () => {
    const item1: any = {
      id: '1',
      sourceText: 'Open the gate',
      translatedText: 'கதவைத் திறக்கவும்',
      sourceLang: 'en',
      targetLang: 'ta',
      sourceLangName: 'English',
      targetLangName: 'Tamil',
      timestamp: new Date().toISOString(),
      isFavorite: false
    };

    const item2: any = {
      id: '2',
      sourceText: 'Good evening',
      translatedText: 'Bonsoir',
      sourceLang: 'en',
      targetLang: 'fr',
      sourceLangName: 'English',
      targetLangName: 'French',
      timestamp: new Date().toISOString(),
      isFavorite: false
    };

    const items = [item1, item2];

    // Filter by text match in Tamil
    const filteredByTamil = filterHistoryItems(items, 'கதவைத்', 'all', 'all');
    expect(filteredByTamil.length).toBe(1);
    expect(filteredByTamil[0].id).toBe('1');

    // Filter by language code 'fr'
    const filteredByFr = filterHistoryItems(items, '', 'all', 'fr');
    expect(filteredByFr.length).toBe(1);
    expect(filteredByFr[0].id).toBe('2');
  });

  it('deletes history items correctly', () => {
    const mockData: any = {
      translation: 'Test translation',
      sourceLang: 'en',
      targetLang: 'es',
      sourceLangName: 'English',
      targetLangName: 'Spanish',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: { lineCountPreserved: true, listsPreserved: true, characterCount: 16, wordCount: 2 }
    };

    const item = addHistoryItem('Test', mockData);
    expect(getHistory().length).toBe(1);

    deleteHistoryItem(item.id);
    expect(getHistory().length).toBe(0);
  });

  it('clears all history on clearHistory', () => {
    const mockData: any = {
      translation: 'Test translation',
      sourceLang: 'en',
      targetLang: 'es',
      sourceLangName: 'English',
      targetLangName: 'Spanish',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash',
      formatCheck: { lineCountPreserved: true, listsPreserved: true, characterCount: 16, wordCount: 2 }
    };

    addHistoryItem('A', mockData);
    addHistoryItem('B', mockData);
    expect(getHistory().length).toBe(2);

    clearHistory();
    expect(getHistory().length).toBe(0);
  });
});
