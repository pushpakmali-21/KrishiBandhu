'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { matchIntent } from '../components/VoiceAssistant/voiceUtils';

interface PriceData {
  current: number;
  history: { date: string; price: number }[];
  forecast: number[];
  demand: string[];
  volatility: number;
}

interface RecommendationData {
  recommendation: string;
  reasoning: string;
  confidence: number;
  expectedPrice?: number;
  daysToWait?: number;
}

interface WeatherData {
  forecast: Array<{
    temp: number;
    condition: string;
    humidity: number;
    rainfall: number;
  }>;
}

export const useVoiceIntent = (
  selectedCrop: string,
  priceData: PriceData | null,
  recommendation: RecommendationData | null,
  weatherData: WeatherData | null,
  initialLanguage: 'en-US' | 'hi-IN' | 'mr-IN' = 'en-US'
) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'mr-IN'>(initialLanguage);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  // Normalize language codes for Web Speech API compatibility
  const getNormalizedLanguage = useCallback((lang: 'en-US' | 'hi-IN' | 'mr-IN'): string => {
    const languageMap: Record<string, string> = {
      'en-US': 'en-US',
      'hi-IN': 'hi',      // Try normalized 'hi' if 'hi-IN' not supported
      'mr-IN': 'mr',      // Try normalized 'mr' if 'mr-IN' not supported
    };
    const normalized = languageMap[lang] || 'en-US';
    console.log(`Language normalized: ${lang} → ${normalized}`);
    return normalized;
  }, []);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  // Check browser support on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser');
    }
  }, []);

  const speakResponse = useCallback(
    (text: string, lang: 'en-US' | 'hi-IN' | 'mr-IN') => {
      if (!synthRef.current) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const normalizedLang = getNormalizedLanguage(lang);
        utterance.lang = normalizedLang;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        console.log(`🔊 Speaking response in language: ${normalizedLang}`);
        synthRef.current.speak(utterance);
      } catch (err) {
        console.error('Error speaking response:', err);
      }
    },
    [getNormalizedLanguage]
  );

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      
      // Use normalized language code for better browser compatibility
      const normalizedLang = getNormalizedLanguage(language);
      recognitionRef.current.language = normalizedLang;
      
      console.log(`🎤 Starting speech recognition with language: ${normalizedLang}`);
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setLastResponse(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // Process final transcript
            setTranscript(transcriptSegment);
            
            // Match intent and get response
            setIsProcessing(true);
            const intentResult = matchIntent(transcriptSegment, language, {
              selectedCrop,
              priceData: priceData || undefined,
              recommendation: recommendation || undefined,
              weatherData: weatherData || undefined,
            });
            
            setLastResponse(intentResult.response);
            
            // Speak the response
            speakResponse(intentResult.response, language);
            
            setIsProcessing(false);
          } else {
            interimTranscript += transcriptSegment;
            setTranscript(interimTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (error: any) => {
        console.error('Speech recognition error:', error.error);
        setIsListening(false);
        
        // Set error message
        const errorMap: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'network': 'Network error. Please check your connection.',
          'permission-denied': 'Microphone permission denied.',
          'not-allowed': 'Microphone access not allowed.',
        };
        
        const errorMsg = errorMap[error.error] || `Error: ${error.error}`;
        setLastResponse(errorMsg);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  }, [language, selectedCrop, priceData, recommendation, weatherData, getNormalizedLanguage, speakResponse]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);


  const resetTranscript = useCallback(() => {
    setTranscript('');
    setLastResponse(null);
  }, []);

  return {
    isListening,
    transcript,
    language,
    isProcessing,
    lastResponse,
    startListening,
    stopListening,
    setLanguage,
    speakResponse,
    resetTranscript,
  };
};
