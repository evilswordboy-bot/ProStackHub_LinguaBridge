import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { Star, Copy, Check, ExternalLink, ArrowRight, Trash2 } from 'lucide-react';

interface FavoritesPanelProps {
  favorites: HistoryItem[];
  onOpenItem: (item: HistoryItem) => void;
  onRemoveFavorite: (id: string) => void;
  onNavigateToTranslate: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  onOpenItem,
  onRemoveFavorite,
  onNavigateToTranslate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.translatedText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          <span>Favorite Translations</span>
        </h2>
        <p className="text-xs text-slate-400">
          Saved key phrases and important translations for quick access.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 flex items-center justify-center text-3xl">
            ⭐
          </div>
          <h3 className="text-base font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-1">
            No favorites yet.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Click the star icon on any translation result to pin it here.
          </p>
          <button
            type="button"
            onClick={onNavigateToTranslate}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-violet hover:bg-purple-600 transition-all shadow-md"
          >
            Go to Translator
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300 hover:border-amber-400/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Language Pair & Date */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                    <span className="text-brand-cyan">{item.sourceLangName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-brand-violet">{item.targetLangName}</span>
                  </div>
                  <span className="text-[10px]">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Original Snippet */}
                <p className="text-xs text-slate-400 italic">
                  "{item.sourceText}"
                </p>

                {/* Translated Text */}
                <p className="text-sm font-medium text-slate-100 dark:text-slate-100 light:text-slate-900 whitespace-pre-line">
                  {item.translatedText}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  title="Copy translated text"
                  className="p-2 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-white/5 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenItem(item)}
                  title="Open in translator"
                  className="p-2 rounded-lg text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveFavorite(item.id)}
                  title="Remove from favorites"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
