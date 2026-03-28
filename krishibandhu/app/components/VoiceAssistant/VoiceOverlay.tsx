'use client';

import React, { useEffect } from 'react';
import { useVoice } from '../../context/VoiceContext';
import { X, Loader2, Share2 } from 'lucide-react';

export const VoiceOverlay: React.FC = () => {
  const { isListening, transcript, language, isProcessing, lastResponse, stopListening, resetTranscript } = useVoice();
  
  // Auto-close after response plays
  useEffect(() => {
    if (lastResponse && !isProcessing && !isListening) {
      const timer = setTimeout(() => {
        resetTranscript();
        stopListening();
      }, 4000); // Close after 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [lastResponse, isProcessing, isListening, resetTranscript, stopListening]);

  // Don't show overlay if nothing is happening
  if (!isListening && !isProcessing && !lastResponse) {
    return null;
  }

  const langLabels = { 'en-US': 'EN', 'hi-IN': 'HI', 'mr-IN': 'MR' };
  const langNames = { 'en-US': 'English', 'hi-IN': 'हिंदी', 'mr-IN': 'मराठी' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header with close button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-800">Voice Assistant</h2>
          <button
            onClick={() => {
              resetTranscript();
              stopListening();
            }}
            className="text-gray-400 hover:text-gray-600 transitions-colors"
            aria-label="Close voice overlay"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main content area */}
        <div className="p-8 text-center space-y-6">
          
          {/* State indicator with animation */}
          <div>
            {isProcessing ? (
              <div className="flex justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
                </div>
              </div>
            ) : isListening ? (
              // Waveform animation
              <div className="flex justify-center items-center gap-1 h-16">
                <div className="w-1 h-8 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-12 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-10 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-14 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 h-10 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 h-12 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 h-8 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            ) : lastResponse ? (
              <div className="flex justify-center">
                <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
                  <span className="text-4xl">🔊</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Status text */}
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {isProcessing && 'Understanding your query...'}
              {isListening && !isProcessing && 'Listening...'}
              {lastResponse && !isProcessing && !isListening && 'Response playing...'}
            </p>
          </div>

          {/* Transcript display */}
          <div className="min-h-16 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            {transcript ? (
              <p className="text-base font-semibold text-gray-800 leading-relaxed">&quot;{transcript}&quot;</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Say something...</p>
            )}
          </div>

          {/* Last response display */}
          {lastResponse && !isProcessing && !isListening && (
            <div className="min-h-16 bg-green-50 rounded-2xl p-4 border border-green-100 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm font-medium text-green-800 leading-relaxed">{lastResponse}</p>
            </div>
          )}

          {/* Language badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                {langLabels[language]}
              </span>
              <span className="text-xs font-semibold text-blue-600">{langNames[language]}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex gap-3">
            {isListening && !isProcessing && (
              <button
                onClick={stopListening}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-red-700 transition-colors"
              >
                Stop Listening
              </button>
            )}
            {lastResponse && !isProcessing && !isListening && (
              <>
                <button
                  onClick={() => {
                    resetTranscript();
                    stopListening();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    resetTranscript();
                    // Reuse transcript if needed
                  }}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
