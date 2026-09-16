import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface SwapLanguagesProps {
  onSwap: () => void;
  disabled?: boolean;
}

export const SwapLanguages: React.FC<SwapLanguagesProps> = ({ onSwap, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onSwap}
      disabled={disabled}
      title="Swap Languages and Content"
      aria-label="Swap source and target languages"
      className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center shadow-sm ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-white/5 bg-slate-800/40 text-slate-500'
          : 'border-white/10 dark:border-white/10 light:border-slate-300 bg-slate-800/80 dark:bg-slate-800/80 light:bg-white text-slate-200 dark:text-slate-200 light:text-slate-700 hover:text-brand-cyan hover:border-brand-cyan/50 hover:bg-slate-700 active:scale-95'
      }`}
    >
      <ArrowLeftRight className="w-4 h-4" />
    </button>
  );
};
