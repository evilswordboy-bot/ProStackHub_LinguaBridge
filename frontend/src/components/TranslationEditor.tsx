import React, { useRef } from 'react';
import { Sparkles, Trash2, ArrowRight, CornerDownLeft, AlertTriangle } from 'lucide-react';
import { Language, DetectedLanguage } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface TranslationEditorProps {
  sourceText: string;
  setSourceText: (text: string) => void;
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
  languages: Language[];
  detectedLanguage?: DetectedLanguage | null;
  onTranslate: () => void;
  isTranslating: boolean;
  onSelectSuggestion?: (text: string, targetCode: string) => void;
}

export const TranslationEditor: React.FC<TranslationEditorProps> = ({
  sourceText,
  setSourceText,
  sourceLang,
  setSourceLang,
  setTargetLang,
  languages,
  detectedLanguage,
  onTranslate,
  isTranslating,
  onSelectSuggestion
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = sourceText.length;
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;

  const isAuto = sourceLang.toLowerCase() === 'auto';

  // Smart suggestions when input is empty
  const suggestions = [
    {
      title: 'Business Email with Action List',
      target: 'ta',
      targetName: 'Tamil',
      text: `Hello Team,

Please review the project milestones:
1. Complete the core backend translation service.
2. Verify format and list preservation.
3. Test speech playback and offline caching.

Best regards,\nEngineering Team`
    },
    {
      title: 'Travel & Accommodation Inquiry',
      target: 'fr',
      targetName: 'French',
      text: `Good morning!

Could you please confirm the following:
* Check-in time after 2:00 PM
* Airport shuttle availability
* High-speed Wi-Fi in the room

Thank you for your assistance.`
    },
    {
      title: 'Technical Support Ticket',
      target: 'ja',
      targetName: 'Japanese',
      text: `Issue Description:
The payment portal returned error code #503.

Steps to reproduce:
1. Navigate to checkout.
2. Select credit card payment.
3. Click "Complete Purchase".`
    }
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-300 shadow-xl transition-all">
      {/* Top Bar: Source Language Selector & Auto-Detect Status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/80">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            From
          </span>
          <LanguageSelector
            selectedCode={sourceLang}
            onSelect={setSourceLang}
            languages={languages}
            allowAutoDetect={true}
            isAutoDetectSelected={isAuto}
            label="Select source language"
          />
        </div>

        {/* Auto Detect Indicator Badge */}
        {isAuto && (
          <div className="flex items-center gap-1.5 text-xs">
            {detectedLanguage && !detectedLanguage.isUncertain ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                <Sparkles className="w-3 h-3 animate-pulse-subtle" />
                <span>Detected: <strong>{detectedLanguage.name}</strong></span>
                {detectedLanguage.confidence === 'high' && (
                  <span className="text-[10px] opacity-75">(High confidence)</span>
                )}
              </span>
            ) : detectedLanguage?.isUncertain ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                <AlertTriangle className="w-3 h-3" />
                <span>Detection uncertain. Choose manually.</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Auto detecting...</span>
            )}
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 p-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter or paste text to translate...
Supports paragraphs, numbered lists (1. 2.), bullet points, emojis, and symbols."
          className="w-full flex-1 bg-transparent resize-none border-0 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 dark:placeholder-slate-500 light:placeholder-slate-400 focus:outline-none focus:ring-0 text-sm sm:text-base leading-relaxed"
          rows={10}
          maxLength={10000}
        />

        {/* Smart Suggestions when empty */}
        {!sourceText && (
          <div className="mt-2 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-200">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              💡 Smart Example Templates (Format-Preserving):
            </span>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSourceText(s.text);
                    setTargetLang(s.target);
                    if (onSelectSuggestion) onSelectSuggestion(s.text, s.target);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 border border-white/5 text-left transition-colors group"
                >
                  <div>
                    <span className="text-xs font-semibold text-brand-cyan group-hover:underline">
                      {s.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-sm">
                      Target: {s.targetName}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/80">
        {/* Character & Word Counter */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{charCount.toLocaleString()} / 10,000 chars</span>
          <span>•</span>
          <span>{wordCount.toLocaleString()} words</span>

          {sourceText && (
            <button
              type="button"
              onClick={() => setSourceText('')}
              title="Clear input text"
              aria-label="Clear input text"
              className="p-1 rounded hover:text-rose-400 transition-colors ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Primary Translate Action */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline-flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Ctrl + Enter
          </span>

          <button
            type="button"
            onClick={onTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-violet to-brand-accent hover:from-purple-600 hover:to-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-violet/25 transition-all"
          >
            {isTranslating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span>Translate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
