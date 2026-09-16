import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Sparkles, Check, X } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedCode: string;
  onSelect: (code: string) => void;
  languages: Language[];
  allowAutoDetect?: boolean;
  isAutoDetectSelected?: boolean;
  label?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedCode,
  onSelect,
  languages,
  allowAutoDetect = false,
  isAutoDetectSelected = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedLang = languages.find((l) => l.code === selectedCode);
  const currentDisplayName = isAutoDetectSelected ? 'Auto Detect' : selectedLang?.name || selectedCode;

  // Filter languages by search query
  const filteredLanguages = languages.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const popularLanguages = languages.filter((l) => l.popular);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || 'Select language'}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700/80 dark:hover:bg-slate-700/80 light:hover:bg-slate-200 border border-white/10 dark:border-white/10 light:border-slate-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
      >
        {isAutoDetectSelected ? (
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
        ) : null}
        <span>{currentDisplayName}</span>
        {selectedLang && !isAutoDetectSelected && (
          <span className="text-xs text-slate-400 font-normal">({selectedLang.nativeName})</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modal / Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 light:bg-white p-3 shadow-2xl border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-xl animate-fade-in">
          {/* Search Header */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search languages..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-400 border border-white/10 dark:border-white/10 light:border-slate-300 focus:outline-none focus:border-brand-cyan"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Auto Detect Option */}
          {allowAutoDetect && !searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSelect('auto');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm mb-2 transition-colors ${
                isAutoDetectSelected
                  ? 'bg-brand-cyan/15 text-brand-cyan font-medium border border-brand-cyan/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span>Auto Detect</span>
              </div>
              {isAutoDetectSelected && <Check className="w-4 h-4 text-brand-cyan" />}
            </button>
          )}

          {/* Quick Popular Chips */}
          {!searchQuery && popularLanguages.length > 0 && (
            <div className="mb-2 pb-2 border-b border-white/5 dark:border-white/5 light:border-slate-200">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
                Popular Languages
              </span>
              <div className="flex flex-wrap gap-1">
                {popularLanguages.slice(0, 8).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelect(l.code);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                      selectedCode === l.code && !isAutoDetectSelected
                        ? 'bg-brand-violet text-white font-medium'
                        : 'bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Language List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1" role="listbox">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching languages found.
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedCode === lang.code && !isAutoDetectSelected;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelect(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-violet/20 text-brand-cyan font-medium'
                        : 'text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="font-medium">{lang.name}</span>
                      <span className="ml-2 text-xs text-slate-400">({lang.nativeName})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-cyan" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
