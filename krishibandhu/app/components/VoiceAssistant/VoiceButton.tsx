'use client';

import React from 'react';
import { useVoice } from '../../context/VoiceContext';
import { Mic, Square, Loader2 } from 'lucide-react';

export const VoiceButton: React.FC = () => {
  const { isListening, isProcessing, language, startListening, stopListening } = useVoice();

  // Check browser support without state
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  if (!SpeechRecognition) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'hi-IN', label: 'हिंदी' },
    { code: 'mr-IN', label: 'मराठी' },
  ];

  let bgColor = 'bg-gray-600 hover:bg-gray-700';
  let icon = <Mic className="w-8 h-8 text-white" />;

  if (isProcessing) {
    bgColor = 'bg-blue-600 hover:bg-blue-700';
    icon = <Loader2 className="w-8 h-8 text-white animate-spin" />;
  } else if (isListening) {
    bgColor = 'bg-green-500 hover:bg-green-600 animate-pulse';
    icon = <Square className="w-8 h-8 text-white fill-white" />;
  }

  const currentLang = languages.find(l => l.code === language);

  return (
    <>

      {/* Main Microphone Button */}
      <button
        onClick={handleClick}
        className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${bgColor}`}
        aria-label={
          isListening
            ? 'Stop voice recording'
            : isProcessing
            ? 'Processing voice input'
            : 'Start voice recording'
        }
        aria-pressed={isListening}
        disabled={isProcessing}
        title={
          isListening
            ? 'Click to stop listening'
            : isProcessing
            ? 'Processing...'
            : `Click to speak (${currentLang?.label})`
        }
      >
        {icon}

        {/* Ripple effect when listening */}
        {isListening && (
          <>
            <div className="absolute w-16 h-16 rounded-full border-2 border-green-400 animate-ping opacity-75" />
            <div className="absolute w-20 h-20 rounded-full border-2 border-green-300 animate-pulse opacity-50" />
          </>
        )}
      </button>
    </>
  );
};
