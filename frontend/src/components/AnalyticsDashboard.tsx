import React from 'react';
import { HistoryItem } from '../types';
import { getCacheStats, getCacheCount } from '../services/cache';
import { BarChart3, Languages, Star, Zap, Hash, FileText, TrendingUp } from 'lucide-react';

interface AnalyticsDashboardProps {
  history: HistoryItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ history }) => {
  const cacheStats = getCacheStats();
  const cachedEntriesCount = getCacheCount();

  const totalTranslations = history.length;
  const favoritesCount = history.filter((h) => h.isFavorite).length;

  // Compute total characters and words
  const totalCharacters = history.reduce((sum, h) => sum + h.sourceText.length, 0);
  const totalWords = history.reduce((sum, h) => sum + (h.sourceText.trim() ? h.sourceText.trim().split(/\s+/).length : 0), 0);

  // Compute unique languages used
  const langSet = new Set<string>();
  history.forEach((h) => {
    langSet.add(h.sourceLang);
    langSet.add(h.targetLang);
  });
  const uniqueLanguagesCount = langSet.size;

  // Language pair breakdown
  const pairCounts: Record<string, number> = {};
  history.forEach((h) => {
    const pair = `${h.sourceLangName} → ${h.targetLangName}`;
    pairCounts[pair] = (pairCounts[pair] || 0) + 1;
  });

  const sortedPairs = Object.entries(pairCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const totalCacheRequests = cacheStats.hits + cacheStats.misses;
  const hitRatio = totalCacheRequests > 0 ? Math.round((cacheStats.hits / totalCacheRequests) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-cyan" />
          <span>Usage Dashboard & Real-Time Analytics</span>
        </h2>
        <p className="text-xs text-slate-400">
          Live statistics calculated dynamically from your translation activity and cache operations.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Translations */}
        <div className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Translations</span>
            <Hash className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
            {totalTranslations}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Saved in history</span>
        </div>

        {/* Metric 2: Languages Used */}
        <div className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Languages</span>
            <Languages className="w-4 h-4 text-brand-violet" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
            {uniqueLanguagesCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Unique languages utilized</span>
        </div>

        {/* Metric 3: Favorites */}
        <div className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Favorites</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
            {favoritesCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Pinned translations</span>
        </div>

        {/* Metric 4: Cache Hits & Ratio */}
        <div className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cached Results</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
            {cacheStats.hits}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {cachedEntriesCount} entries saved ({hitRatio}% hit ratio)
          </span>
        </div>
      </div>

      {/* Volume & Volume Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Volume Stats */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 dark:border-white/10 light:border-slate-300">
          <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-cyan" />
            <span>Translation Volume Metrics</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 border border-white/5">
              <span className="text-xs text-slate-300">Total Characters Translated:</span>
              <span className="text-sm font-bold text-slate-100">{totalCharacters.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 border border-white/5">
              <span className="text-xs text-slate-300">Total Words Translated:</span>
              <span className="text-sm font-bold text-slate-100">{totalWords.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 border border-white/5">
              <span className="text-xs text-slate-300">Average Characters per Request:</span>
              <span className="text-sm font-bold text-slate-100">
                {totalTranslations > 0 ? Math.round(totalCharacters / totalTranslations) : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Language Pairs */}
        <div className="rounded-2xl glass-panel p-5 border border-white/10 dark:border-white/10 light:border-slate-300">
          <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-violet" />
            <span>Most Frequent Language Pairs</span>
          </h3>

          {sortedPairs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No language pair data available yet. Start translating to see trends!
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedPairs.map(([pair, count]) => {
                const percentage = Math.round((count / totalTranslations) * 100);
                return (
                  <div key={pair} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300">{pair}</span>
                      <span className="text-slate-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-violet to-brand-cyan h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
