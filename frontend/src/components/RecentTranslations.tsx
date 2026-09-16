import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Clock, Copy, Check, ArrowRight, ExternalLink } from 'lucide-react';

interface RecentTranslationsProps {
  items: HistoryItem[];
  onOpen: (item: HistoryItem) => void;
}

export const RecentTranslations: React.FC<RecentTranslationsProps> = ({ items, onOpen }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.translatedText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mt-8 rounded-2xl glass-panel p-5 border border-white/10 dark:border-white/10 light:border-slate-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-cyan" />
          <span>Recent Translations</span>
        </h3>
        <span className="text-xs text-slate-400">Showing last {items.slice(0, 4).length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 border border-white/5 dark:border-white/5 light:border-slate-200 hover:border-brand-cyan/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Language Pair & Time */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-1.5 font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                  <span className="text-brand-cyan">{item.sourceLangName}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-brand-violet">{item.targetLangName}</span>
                </div>
                <span className="text-[10px]">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Source & Translation Snippet */}
              <p className="text-xs text-slate-400 truncate mb-1">
                "{item.sourceText}"
              </p>
              <p className="text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">
                {item.translatedText}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-2 border-t border-white/5 dark:border-white/5 light:border-slate-200 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => handleCopy(item)}
                title="Copy translated text"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpen(item)}
                title="Open in editor"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-[11px]">Open</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
