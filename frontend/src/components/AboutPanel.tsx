import React from 'react';
import { Globe2, Cpu, Mic, HardDrive, ShieldCheck, CheckCircle2, Layers } from 'lucide-react';

export const AboutPanel: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-violet via-brand-accent to-brand-cyan p-0.5 shadow-xl shadow-brand-cyan/20 mb-2">
          <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
            <Globe2 className="w-8 h-8 text-brand-cyan" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          LinguaBridge AI
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
          Translate naturally. Preserve meaning. Cross every language barrier.
        </p>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          An AI-powered language translation tool designed to make multilingual communication simple, accessible, and natural.
        </p>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col items-start space-y-2">
          <div className="p-2.5 rounded-xl bg-brand-violet/20 text-brand-violet">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100">Format Preservation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Maintains original line breaks, multi-paragraph structures, numbered sequences, and bulleted lists faithfully.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col items-start space-y-2">
          <div className="p-2.5 rounded-xl bg-brand-cyan/20 text-brand-cyan">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100">Web Speech Audio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integrated Text-to-Speech playback matched to the target language locale using the browser Web Speech API.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col items-start space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100">Local Caching & History</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant local cache recall for identical queries and full persistent history stored securely in your browser.
          </p>
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-cyan" />
          <span>Technology Stack</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">React & TypeScript</span>
              <span className="text-xs text-slate-400">Component architecture with full type safety</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Vite & Tailwind CSS</span>
              <span className="text-xs text-slate-400">Fast modern build system with responsive styling</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Gemini API (Server-Side)</span>
              <span className="text-xs text-slate-400">Secure Node.js & Express proxy protecting API credentials</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Web Speech API</span>
              <span className="text-xs text-slate-400">Native browser text-to-speech synthesis</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5 sm:col-span-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Browser Local Storage</span>
              <span className="text-xs text-slate-400">Client-side translation cache, history, and preferences</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-200">Security Architecture</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All Google Gemini API calls are mediated through a secure Node.js backend. The API key is stored strictly on the server in <code className="px-1.5 py-0.5 rounded bg-slate-800 text-brand-cyan">.env</code> and is never exposed to the client or browser bundle.
          </p>
        </div>
      </div>
    </div>
  );
};
