import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Language,
  TranslationResultData,
  DetectedLanguage,
  HistoryItem,
  AppSettings,
  ApiHealthStatus
} from './types';
import { checkBackendHealth, getSupportedLanguages, requestTranslation } from './services/api';
import { getCachedTranslation, setCachedTranslation } from './services/cache';
import { getHistory, addHistoryItem, deleteHistoryItem, clearHistory, toggleFavorite } from './services/history';
import { stopSpeech } from './services/speech';

import { Header } from './components/Header';
import { TranslationEditor } from './components/TranslationEditor';
import { TranslationResult } from './components/TranslationResult';
import { SwapLanguages } from './components/SwapLanguages';
import { QuickPhrases } from './components/QuickPhrases';
import { RecentTranslations } from './components/RecentTranslations';
import { HistoryPanel } from './components/HistoryPanel';
import { FavoritesPanel } from './components/FavoritesPanel';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SettingsModal } from './components/SettingsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { AboutPanel } from './components/AboutPanel';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultSourceLang: 'auto',
  defaultTargetLang: 'ta', // Default to Tamil as emphasized in internship spec
  speechRate: 1.0,
  historyLimit: 500
};

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'about' | 'favorites' | 'analytics'>('translate');

  // Languages & State
  const [languages, setLanguages] = useState<Language[]>([]);
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('ta');
  const [sourceText, setSourceText] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<TranslationResultData | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History & Favorites
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Modals & Health
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [health, setHealth] = useState<ApiHealthStatus | null>(null);

  // User Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('linguabridge_settings_v1');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Reference for screen reader announcements
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // 1. Initial Data Load & Theme Initialization
  useEffect(() => {
    // Load history
    setHistory(getHistory());

    // Check backend health
    checkBackendHealth().then(setHealth);

    // Fetch supported languages
    getSupportedLanguages().then((langs) => {
      setLanguages(langs);
    });
  }, []);

  // 2. Handle Theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
      root.classList.toggle('light', !systemDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
      root.classList.toggle('light', settings.theme === 'light');
    }
  }, [settings.theme]);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('linguabridge_settings_v1', JSON.stringify(newSettings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  // 3. Core Translation Workflow
  const handleTranslate = useCallback(async () => {
    const trimmed = sourceText.trim();
    if (!trimmed) {
      setErrorMessage('Please enter some text to translate.');
      return;
    }

    setErrorMessage(null);

    // Step A: Check Local Translation Cache
    const cached = getCachedTranslation(sourceLang, targetLang, trimmed);
    if (cached) {
      setTranslationResult(cached);
      if (cached.detectedLanguage) {
        setDetectedLanguage(cached.detectedLanguage);
      }
      setAriaAnnouncement(`Translation completed from cache. Output is ready in ${cached.targetLangName}`);
      return;
    }

    // Step B: Call Backend Gemini Translation API
    setIsTranslating(true);
    setAriaAnnouncement('Translating text with Gemini AI...');

    try {
      const data = await requestTranslation(trimmed, sourceLang, targetLang);
      
      // Update UI state
      setTranslationResult(data);
      if (data.detectedLanguage) {
        setDetectedLanguage(data.detectedLanguage);
      }

      // Save in local cache
      setCachedTranslation(sourceLang, targetLang, trimmed, data);

      // Save in history
      addHistoryItem(trimmed, data);
      setHistory(getHistory());

      setAriaAnnouncement(`Translation completed. Output ready in ${data.targetLangName}`);

      // Trigger subtle celebration on long formatted texts
      if (trimmed.length > 80 && trimmed.includes('\n')) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#00D9FF', '#7C3AED', '#3B82F6']
        });
      }
    } catch (err: any) {
      const msg = err.message || 'Translation could not be completed. Please try again.';
      setErrorMessage(msg);
      setAriaAnnouncement(`Error: ${msg}`);
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLang, targetLang]);

  // 4. Swap Languages & Text
  const handleSwapLanguages = useCallback(() => {
    // If source is auto and we haven't detected a language yet, fallback
    const effectiveSource = sourceLang === 'auto'
      ? (detectedLanguage?.code && !detectedLanguage.isUncertain ? detectedLanguage.code : 'en')
      : sourceLang;

    const newSourceLang = targetLang;
    const newTargetLang = effectiveSource;

    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);

    // Also swap source text and translated text if available without losing content
    if (translationResult?.translation) {
      const prevSource = sourceText;
      const prevTrans = translationResult.translation;
      setSourceText(prevTrans);
      setTranslationResult({
        ...translationResult,
        translation: prevSource,
        sourceLang: newSourceLang,
        targetLang: newTargetLang,
        isCached: false
      });
    }
  }, [sourceLang, targetLang, detectedLanguage, translationResult, sourceText]);

  // 5. Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Escape: Stop speech and close modals
      if (e.key === 'Escape') {
        stopSpeech();
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      // Ctrl+Enter or Cmd+Enter: Translate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleTranslate();
        return;
      }

      // Ctrl+K or Cmd+K: Focus editor
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const ta = document.querySelector('textarea');
        if (ta) ta.focus();
        return;
      }

      // Ctrl+Shift+C: Copy translated result
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (translationResult?.translation) {
          navigator.clipboard.writeText(translationResult.translation);
          setAriaAnnouncement('Translation copied to clipboard.');
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTranslate, translationResult]);

  // 6. History Item Handlers
  const handleOpenHistoryItem = (item: HistoryItem) => {
    setSourceText(item.sourceText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setTranslationResult({
      translation: item.translatedText,
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
      sourceLangName: item.sourceLangName,
      targetLangName: item.targetLangName,
      detectedLanguage: item.detectedLanguage,
      formatCheck: {
        lineCountPreserved: true,
        listsPreserved: true,
        characterCount: item.translatedText.length,
        wordCount: item.translatedText.split(/\s+/).length
      },
      timestamp: item.timestamp,
      model: 'history'
    });
    setActiveTab('translate');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleToggleFavorite = (id?: string) => {
    if (id) {
      const updated = toggleFavorite(id);
      setHistory(updated);
    } else if (translationResult) {
      // Find matching item in history or create one
      const matching = history.find(
        (h) => h.sourceText === sourceText && h.targetLang === translationResult.targetLang
      );
      if (matching) {
        const updated = toggleFavorite(matching.id);
        setHistory(updated);
      }
    }
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const isCurrentFavorite = Boolean(
    translationResult &&
    history.some(
      (h) => h.isFavorite && h.sourceText === sourceText && h.targetLang === translationResult.targetLang
    )
  );

  const favoritesList = history.filter((h) => h.isFavorite);

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark dark:bg-brand-dark light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors duration-200">
      {/* Screen Reader Live Region for Announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {ariaAnnouncement}
      </div>

      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={settings.theme}
        setTheme={(theme) => handleSaveSettings({ ...settings, theme })}
        health={health}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        historyCount={history.length}
        favoritesCount={favoritesList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'translate' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-2 pt-2 pb-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent dark:from-white dark:to-slate-400 light:from-slate-900 light:to-slate-700">
                LinguaBridge AI
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto">
                Translate naturally. Preserve meaning. Cross every language barrier.
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between animate-fade-in">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="font-bold ml-2 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Two-Panel Workspace Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch min-h-[440px]">
              {/* Left Panel: Source Text Editor */}
              <TranslationEditor
                sourceText={sourceText}
                setSourceText={setSourceText}
                sourceLang={sourceLang}
                setSourceLang={setSourceLang}
                targetLang={targetLang}
                setTargetLang={setTargetLang}
                languages={languages}
                detectedLanguage={detectedLanguage}
                onTranslate={handleTranslate}
                isTranslating={isTranslating}
                onSelectSuggestion={(text, target) => {
                  setSourceText(text);
                  setTargetLang(target);
                }}
              />

              {/* Center Swap Button (Absolute on desktop, inline on mobile) */}
              <div className="hidden lg:flex absolute left-1/2 top-5 -translate-x-1/2 z-20">
                <SwapLanguages
                  onSwap={handleSwapLanguages}
                  disabled={isTranslating}
                />
              </div>

              <div className="flex lg:hidden justify-center my-1">
                <SwapLanguages
                  onSwap={handleSwapLanguages}
                  disabled={isTranslating}
                />
              </div>

              {/* Right Panel: Translation Result & Actions */}
              <TranslationResult
                result={translationResult}
                targetLang={targetLang}
                setTargetLang={setTargetLang}
                languages={languages}
                onTranslateAgain={handleTranslate}
                onToggleFavorite={() => handleToggleFavorite()}
                isFavorite={isCurrentFavorite}
                isLoading={isTranslating}
              />
            </div>

            {/* Quick Templates & Phrases */}
            <QuickPhrases
              onSelectPhrase={(text, suggestedTarget) => {
                setSourceText(text);
                if (suggestedTarget) setTargetLang(suggestedTarget);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />

            {/* Recent Translations Strip */}
            <RecentTranslations
              items={history}
              onOpen={handleOpenHistoryItem}
            />
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            languages={languages}
            onOpenItem={handleOpenHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onToggleFavorite={handleToggleFavorite}
            onClearAll={handleClearAllHistory}
            onNavigateToTranslate={() => setActiveTab('translate')}
          />
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <AboutPanel />
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <FavoritesPanel
            favorites={favoritesList}
            onOpenItem={handleOpenHistoryItem}
            onRemoveFavorite={handleToggleFavorite}
            onNavigateToTranslate={() => setActiveTab('translate')}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard history={history} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 dark:border-white/5 light:border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">LinguaBridge AI</span>
            <span>•</span>
            <span>ProStackHub AI Internship — Task 1</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-brand-cyan transition-colors"
            >
              Shortcuts
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-brand-cyan transition-colors"
            >
              Privacy & Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        languages={languages}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
