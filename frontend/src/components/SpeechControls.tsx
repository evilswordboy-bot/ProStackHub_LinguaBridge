import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Square, AlertCircle } from 'lucide-react';
import {
  speakText,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  getSavedSpeechRate,
  saveSpeechRate,
  isSpeechSynthesisSupported,
  findMatchingVoice
} from '../services/speech';

interface SpeechControlsProps {
  text: string;
  langCode: string;
  speechLocale?: string;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  text,
  langCode,
  speechLocale
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(getSavedSpeechRate());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasCheckedVoice, setHasCheckedVoice] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  // Check voice availability on mount or when language changes
  useEffect(() => {
    function checkVoice() {
      if (!isSpeechSynthesisSupported()) {
        setVoiceAvailable(false);
        return;
      }
      const voice = findMatchingVoice(langCode, speechLocale);
      setVoiceAvailable(Boolean(voice));
      setHasCheckedVoice(true);
    }

    checkVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkVoice;
    }

    return () => {
      stopSpeech();
      setIsPlaying(false);
      setIsPaused(false);
    };
  }, [langCode, speechLocale]);

  // Clean error message after 5s
  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const handlePlay = () => {
    if (!text.trim()) return;
    setErrorMessage(null);

    const success = speakText({
      text,
      langCode,
      speechLocale,
      rate: playbackRate,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onPause: () => {
        setIsPaused(true);
      },
      onResume: () => {
        setIsPaused(false);
      },
      onError: (err) => {
        setIsPlaying(false);
        setIsPaused(false);
        setErrorMessage(err);
      }
    });

    if (!success && !errorMessage) {
      setErrorMessage('Speech playback is unavailable for this language on your device.');
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSpeech();
      setIsPaused(false);
    } else {
      pauseSpeech();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    saveSpeechRate(speed);
    // If playing, restart with new speed
    if (isPlaying && !isPaused) {
      handlePlay();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Play/Listen Button */}
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            disabled={!text.trim()}
            title={voiceAvailable ? 'Listen to translation' : 'Voice may not be available on this device'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-700 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700/80 hover:text-brand-cyan border border-white/10 dark:border-white/10 light:border-slate-300 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Listen</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg p-0.5 border border-brand-cyan/40">
            {/* Pause / Resume */}
            <button
              type="button"
              onClick={handlePauseResume}
              className="p-1.5 rounded-md hover:bg-white/10 text-brand-cyan transition-colors"
              title={isPaused ? 'Resume speech' : 'Pause speech'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Stop */}
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-md hover:bg-white/10 text-rose-400 transition-colors"
              title="Stop speech"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

        {/* Speed Selector (0.75x, 1x, 1.25x, 1.5x) */}
        <div className="flex items-center gap-0.5 bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 p-0.5 rounded-lg border border-white/5 dark:border-white/5 light:border-slate-300">
          {[0.75, 1.0, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedChange(speed)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                playbackRate === speed
                  ? 'bg-brand-violet text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>

      {/* Warning if no compatible voice is detected */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 dark:text-amber-400 light:text-amber-600 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {hasCheckedVoice && !voiceAvailable && !errorMessage && isPlaying && (
        <div className="text-[11px] text-slate-400">
          Speech playback is unavailable for this language on your device.
        </div>
      )}
    </div>
  );
};
