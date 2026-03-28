'use client';

import React from 'react';
import { useVoice } from '../../context/VoiceContext';

export const VoiceIndicator: React.FC = () => {
  const { language, isListening } = useVoice();
  
  const langLabels = { 'en-US': 'EN', 'hi-IN': 'HI', 'mr-IN': 'MR' };
  const langNames = { 'en-US': 'English', 'hi-IN': 'हिंदी', 'mr-IN': 'मराठी' };
  const langFlags = { 'en-US': '🇬🇧', 'hi-IN': '🇮🇳', 'mr-IN': '🇮🇳' };

  return (
    <div
      className={`fixed top-20 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
        isListening
          ? 'bg-green-100 text-green-700 shadow-lg shadow-green-200'
          : 'bg-gray-100 text-gray-600'
      }`}
      title={langNames[language]}
    >
      {isListening && (
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
      <span>{langFlags[language]}</span>
      <span className="uppercase tracking-tight">{langLabels[language]}</span>
    </div>
  );
};
