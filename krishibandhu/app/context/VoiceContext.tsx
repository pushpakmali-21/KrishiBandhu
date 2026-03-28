'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useVoiceIntent } from '../hooks/useVoiceIntent';

export interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  language: 'en-US' | 'hi-IN' | 'mr-IN';
  isProcessing: boolean;
  lastResponse: string | null;
  startListening: () => void;
  stopListening: () => void;
  setLanguage: (lang: 'en-US' | 'hi-IN' | 'mr-IN') => void;
  speakResponse: (text: string, lang: 'en-US' | 'hi-IN' | 'mr-IN') => void;
  resetTranscript: () => void;
}

export const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

/**
 * VoiceProvider component - wraps Dashboard with voice functionality
 * Provides access to voice recognition, text-to-speech, and intent matching
 */
export const VoiceProvider: React.FC<{
  children: ReactNode;
  selectedCrop?: string;
  priceData?: any;
  recommendation?: any;
  weatherData?: any;
}> = ({ 
  children, 
  selectedCrop = 'wheat',
  priceData = null,
  recommendation = null,
  weatherData = null,
}) => {
  const [language, setLanguageState] = useState<'en-US' | 'hi-IN' | 'mr-IN'>('en-US');

  const voice = useVoiceIntent(
    selectedCrop,
    priceData,
    recommendation,
    weatherData,
    language
  );

  const setLanguage = (lang: 'en-US' | 'hi-IN' | 'mr-IN') => {
    setLanguageState(lang);
    voice.setLanguage(lang);
    console.log('✓ Language switched to:', lang);
  };

  const contextValue: VoiceContextType = {
    ...voice,
    language,
    setLanguage,
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};

/**
 * Custom hook to use Voice context
 * Must be used within VoiceProvider
 */
export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};
