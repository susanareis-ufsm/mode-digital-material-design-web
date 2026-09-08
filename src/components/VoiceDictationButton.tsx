import React from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { useSpeechDictation } from '../hooks/useSpeechDictation';

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  uiLanguage: 'pt' | 'en';
  className?: string;
  size?: 'sm' | 'md';
  title?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  uiLanguage,
  className = '',
  size = 'sm',
  title,
}) => {
  const isPt = uiLanguage === 'pt';
  const targetLanguage = isPt ? 'pt-BR' : 'en-US';

  const { isSupported, isListening, error, startListening, stopListening } = useSpeechDictation({
    language: targetLanguage,
    onResult: (transcript) => {
      onTranscript(transcript);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      alert(
        isPt
          ? 'Reconhecimento de voz não é suportado neste navegador. Use o Chrome ou Edge.'
          : 'Web Speech API is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening((text) => onTranscript(text));
    }
  };

  const buttonTitle = title || (
    isListening
      ? (isPt ? 'Parar ditado por voz' : 'Stop voice dictation')
      : (isPt ? 'Ditar resposta por voz (Microfone)' : 'Dictate answer by voice (Microphone)')
  );

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className={`opacity-40 cursor-not-allowed px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs flex items-center space-x-1 ${className}`}
        title={isPt ? 'Ditado por voz indisponível neste navegador' : 'Voice dictation unavailable in this browser'}
      >
        <MicOff className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={buttonTitle}
        aria-pressed={isListening}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer ${
          isListening
            ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-400'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
        } ${className}`}
        title={buttonTitle}
      >
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>{isPt ? 'Gravando...' : 'Listening...'}</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isPt ? 'Ditar por Voz' : 'Dictate'}</span>
          </>
        )}
      </button>

      {error && (
        <span
          className="text-[10px] text-red-600 font-semibold flex items-center space-x-0.5"
          title={error}
        >
          <AlertCircle className="w-3 h-3 text-red-500" />
        </span>
      )}
    </div>
  );
};
