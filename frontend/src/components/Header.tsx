import React from 'react';
import { Globe2, History, Star, Settings, Moon, Sun, Monitor, Keyboard, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { ApiHealthStatus } from '../types';

interface HeaderProps {
  activeTab: 'translate' | 'history' | 'about' | 'favorites' | 'analytics';
  setActiveTab: (tab: 'translate' | 'history' | 'about' | 'favorites' | 'analytics') => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  health: ApiHealthStatus | null;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  health,
  onOpenSettings,
  onOpenShortcuts,
  historyCount,
  favoritesCount
}) => {
  const isGeminiReady = health?.gemini?.configured;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-brand-dark/80 dark:bg-brand-dark/80 light:bg-white/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('translate')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet via-brand-accent to-brand-cyan p-0.5 shadow-lg shadow-brand-cyan/20">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-brand-cyan animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent dark:from-white dark:to-slate-400 light:from-slate-900 light:to-slate-700">
                LinguaBridge <span className="text-brand-cyan font-extrabold">AI</span>
              </span>
              
              {/* Live Engine Status Badge */}
              <div 
                className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                  isGeminiReady
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
                title={isGeminiReady ? `Connected to ${health?.gemini?.model}` : 'Gemini API Key missing in backend/.env'}
              >
                {isGeminiReady ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Gemini AI</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Setup Required</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 hidden md:block">
              Translate naturally. Preserve meaning. Cross every language barrier.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-1 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-200">
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'translate'
                ? 'bg-brand-violet text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Translator</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-brand-violet text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'about'
                ? 'bg-brand-violet text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>About</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-brand-violet text-white shadow-md'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/30 text-amber-200">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Tools: Keyboard Shortcuts, Theme, Settings */}
        <div className="flex items-center gap-2">
          {/* Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (Ctrl+K)"
            aria-label="Keyboard Shortcuts"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:flex items-center justify-center"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            title={`Current Theme: ${theme}`}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-brand-cyan" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Monitor className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Application Settings"
            aria-label="Settings"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
