'use client';

import React from 'react';
import { VoiceButton } from './VoiceButton';
import { VoiceOverlay } from './VoiceOverlay';

interface VoiceAssistantProps {
  selectedCrop?: string;
  priceData?: unknown;
  recommendation?: unknown;
  weatherData?: unknown;
  onHighlightCard?: (cardId: string) => void;
  onScrollToSection?: (section: string) => void;
  onOpenModal?: (modalId: string) => void;
}

/**
 * VoiceAssistant - Main wrapper component combining all voice UI elements
 * Renders:
 * - VoiceButton: Floating Action Button (microphone icon)
 * - VoiceOverlay: Full-screen modal for transcription and responses
 * - VoiceIndicator: Language indicator badge
 */
export const VoiceAssistant: React.FC<VoiceAssistantProps> = () => {
  return (
    <>
      {/* Floating microphone button in bottom-right */}
      <VoiceButton />

      {/* Full-screen overlay showing transcription and responses */}
      <VoiceOverlay />

    </>
  );
};
