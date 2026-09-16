import React, { useState } from 'react';
import { Copy, Check, Star, RefreshCw, Zap, CheckCircle, Clock } from 'lucide-react';
import { Language, TranslationResultData } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { SpeechControls } from './SpeechControls';

interface TranslationResultProps {
  result: TranslationResultData | null;
  targetLang: string;
  setTargetLang: (code: string) => void;
  languages: Language[];
  onTranslateAgain: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isLoading: boolean;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  result,
  targetLang,
  setTargetLang,
  languages,
  onTranslateAgain,
  onToggleFavorite,
  isFavorite,
  isLoading
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result?.translation) return;

    try {
      await navigator.clipboard.writeText(result.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard API failed, attempting textarea fallback:', err);
      // Fallback for restricted clipboard contexts
      const ta = document.createElement('textarea');
      ta.value = result.translation;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Copy failed:', fallbackErr);
      }
      document.body.removeChild(ta);
    }
  };

  const targetLanguageObj = languages.find((l) => l.code === targetLang);

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-300 shadow-xl transition-all">
      {/* Top Bar: Target Language Selector & Status Badges */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/80">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            To
          </span>
          <LanguageSelector
            selectedCode={targetLang}
            onSelect={setTargetLang}
            languages={languages}
            allowAutoDetect={false}
            label="Select target language"
          />
        </div>

        {/* Caching & Model Tags */}
        <div className="flex items-center gap-2">
          {result?.isCached && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>⚡ Loaded from cache</span>
            </span>
          )}

          {result?.formatCheck?.listsPreserved && (
            <span 
              title="Lists & paragraph breaks preserved"
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Format Preserved</span>
            </span>
          )}
        </div>
      </div>

      {/* Output Content Area */}
      <div className="relative flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-10 h-10 border-3 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400 animate-pulse">
              Translating contextually and preserving formatting...
            </p>
          </div>
        ) : result ? (
          <div className="h-full flex flex-col justify-between">
            {/* Formatted Output with preserved whitespace and line breaks */}
            <div 
              className="whitespace-pre-wrap font-normal text-slate-100 dark:text-slate-100 light:text-slate-900 text-sm sm:text-base leading-relaxed select-text"
              dir={targetLanguageObj?.direction || 'ltr'}
            >
              {result.translation}
            </div>

            {/* Metadata Footer */}
            <div className="mt-6 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>•</span>
                <span>{result.translation.length} characters</span>
              </div>
              <span>Engine: {result.model}</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-500 light:text-slate-400 select-none">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 flex items-center justify-center mb-3">
              <span className="text-2xl">🌐</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1">
              Your translation will appear here
            </h4>
            <p className="text-xs max-w-xs text-slate-400">
              Select languages, type or paste your content, and press Translate or Ctrl + Enter.
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {result && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/80">
          {/* Left: Text-to-Speech Controls */}
          <SpeechControls
            text={result.translation}
            langCode={result.targetLang}
            speechLocale={targetLanguageObj?.speechLocale}
          />

          {/* Right Actions: Copy, Favorite, Translate Again */}
          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title="Copy translation (Ctrl+Shift+C)"
              aria-label="Copy translation"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-200 dark:text-slate-200 light:text-slate-700 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 hover:text-brand-cyan border border-white/10 dark:border-white/10 light:border-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>✓ Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Favorite Toggle */}
            <button
              type="button"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'text-slate-400 hover:text-amber-300 border-white/10 dark:border-white/10 light:border-slate-300 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Translate Again */}
            <button
              type="button"
              onClick={onTranslateAgain}
              title="Re-translate with Gemini"
              aria-label="Translate again"
              className="p-2 rounded-lg text-slate-400 hover:text-white border border-white/10 dark:border-white/10 light:border-slate-300 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
