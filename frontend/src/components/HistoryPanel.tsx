import React, { useState } from 'react';
import { HistoryItem, Language } from '../types';
import {
  Search,
  Trash2,
  Download,
  Copy,
  Check,
  Star,
  ExternalLink,
  ArrowRight,
  Calendar,
  AlertTriangle,
  FileJson,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import {
  filterHistoryItems,
  exportToJson,
  exportToCsv,
  exportToTxt
} from '../services/history';

interface HistoryPanelProps {
  history: HistoryItem[];
  languages: Language[];
  onOpenItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onNavigateToTranslate: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  languages,
  onOpenItem,
  onDeleteItem,
  onToggleFavorite,
  onClearAll,
  onNavigateToTranslate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'older'>('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredItems = filterHistoryItems(history, searchQuery, timeFilter, languageFilter);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.translatedText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
            Translation History
          </h2>
          <p className="text-xs text-slate-400">
            Browse, search, export, or reload your previous translations stored safely in your browser.
          </p>
        </div>

        {/* Action Buttons: Export & Clear */}
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 border border-white/10 dark:border-white/10 light:border-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white p-1.5 shadow-2xl border border-white/10 z-50 animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    exportToJson(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Export as JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportToCsv(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export as CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportToTxt(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Export as TXT</span>
                </button>
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Clear all translation history?</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  This will remove all {history.length} stored translations. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all"
              >
                Confirm Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar: Search, Date Filter, Language Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by text snippet or language..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 border border-white/10 dark:border-white/10 light:border-slate-300 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        {/* Date Range Tabs */}
        <div className="sm:col-span-4 flex items-center bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 p-1 rounded-xl border border-white/5">
          {(['all', 'today', 'week', 'older'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeFilter(range)}
              className={`flex-1 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                timeFilter === range
                  ? 'bg-brand-violet text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === 'week' ? 'This Week' : range}
            </button>
          ))}
        </div>

        {/* Language Filter */}
        <div className="sm:col-span-2">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl text-xs bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-300 focus:outline-none focus:border-brand-cyan"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center border border-white/10 dark:border-white/10 light:border-slate-300">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 flex items-center justify-center text-3xl">
            📜
          </div>
          <h3 className="text-base font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-1">
            {searchQuery || timeFilter !== 'all' || languageFilter !== 'all'
              ? 'No matching translations found'
              : 'No translations yet.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'Try changing or clearing your search filters.'
              : 'Translations you make will automatically appear here for easy reference and export.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={onNavigateToTranslate}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-violet hover:bg-purple-600 transition-all shadow-md shadow-brand-violet/20"
            >
              Start Translating
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel p-4 border border-white/10 dark:border-white/10 light:border-slate-300 hover:border-brand-cyan/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details: Languages & Text */}
              <div className="space-y-2 flex-1">
                {/* Badges & Date */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                    <span className="text-brand-cyan">{item.sourceLangName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-brand-violet">{item.targetLangName}</span>
                  </div>

                  <span className="text-slate-500">•</span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Source Text Preview */}
                <p className="text-xs text-slate-400 line-clamp-2 italic">
                  "{item.sourceText}"
                </p>

                {/* Translated Text Preview */}
                <p className="text-xs sm:text-sm font-medium text-slate-100 dark:text-slate-100 light:text-slate-900 line-clamp-3 whitespace-pre-line">
                  {item.translatedText}
                </p>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center justify-end gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                {/* Favorite */}
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  title={item.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                  className={`p-2 rounded-xl border transition-colors ${
                    item.isFavorite
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'text-slate-400 hover:text-amber-300 border-white/5 bg-slate-800/40 hover:bg-slate-700'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                {/* Copy */}
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  title="Copy translation"
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-cyan border border-white/5 bg-slate-800/40 hover:bg-slate-700 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Open in Workspace */}
                <button
                  type="button"
                  onClick={() => onOpenItem(item)}
                  title="Open in editor"
                  className="p-2 rounded-xl text-brand-cyan hover:bg-brand-cyan/10 border border-white/5 bg-slate-800/40 hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete item"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 border border-white/5 bg-slate-800/40 hover:bg-slate-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
