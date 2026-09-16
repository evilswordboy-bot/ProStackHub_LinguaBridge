import React, { useState } from 'react';
import { X, Moon, Sun, Monitor, Volume2, ShieldCheck, Database, Check, Trash2 } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { getCacheCount, clearCache } from '../services/cache';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  languages: Language[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  languages
}) => {
  const [cacheCount, setCacheCount] = useState<number>(getCacheCount());
  const [cacheClearedToast, setCacheClearedToast] = useState(false);

  if (!isOpen) return null;

  const handleClearCache = () => {
    clearCache();
    setCacheCount(0);
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-lg w-full rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
            Application Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Theme */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interface Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSaveSettings({ ...settings, theme: t.id as any })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-violet text-white border-brand-violet shadow-md'
                      : 'bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border-white/5 dark:border-white/5 light:border-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Setting 2: Default Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Default Source</label>
            <select
              value={settings.defaultSourceLang}
              onChange={(e) => onSaveSettings({ ...settings, defaultSourceLang: e.target.value })}
              className="w-full py-2 px-3 rounded-xl text-xs bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-300 focus:outline-none focus:border-brand-cyan"
            >
              <option value="auto">Auto Detect</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Default Target</label>
            <select
              value={settings.defaultTargetLang}
              onChange={(e) => onSaveSettings({ ...settings, defaultTargetLang: e.target.value })}
              className="w-full py-2 px-3 rounded-xl text-xs bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-white/10 dark:border-white/10 light:border-slate-300 focus:outline-none focus:border-brand-cyan"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Setting 3: Default Speech Speed */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Default Speech Speed</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onSaveSettings({ ...settings, speechRate: speed })}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  settings.speechRate === speed
                    ? 'bg-brand-violet text-white border-brand-violet shadow-md'
                    : 'bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 text-slate-300 border-white/5 hover:bg-slate-700'
                }`}
              >
                {speed}×
              </button>
            ))}
          </div>
        </div>

        {/* Setting 4: Cache Management */}
        <div className="p-4 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-100 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Local Translation Cache</span>
            </div>
            <span className="text-xs text-slate-400">
              Cached translations: <strong className="text-white dark:text-white light:text-slate-900">{cacheCount}</strong>
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Identical translations are reused instantly from local cache to eliminate latency and preserve API quota.
            Clearing the cache will not delete your saved translation history.
          </p>

          <div className="flex items-center justify-between pt-1">
            {cacheClearedToast ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Translation cache cleared.</span>
              </span>
            ) : <span></span>}

            <button
              type="button"
              onClick={handleClearCache}
              disabled={cacheCount === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>

        {/* Data Privacy Notice (Requirement #47) */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-white/5 flex gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
              Data Privacy & Security
            </h5>
            <p className="text-[11px] leading-relaxed">
              Your translation history and favorites are stored exclusively inside your browser's local storage.
              When you translate text, your query is securely processed by the configured backend Google Gemini service.
              No private keys or personal credentials are ever exposed client-side.
            </p>
          </div>
        </div>

        {/* Close Action */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-violet hover:bg-purple-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
