# Krishi-Vani: Voice-First Assistant Implementation Plan

**Version:** 1.0  
**Date:** March 28, 2026  
**Status:** Ready for Implementation  
**Estimated Effort:** 4-6 hours  

---

## 1. Feature Overview

### 1.1 What is Krishi-Vani?
A voice-activated intelligent assistant that breaks the literacy barrier for non-English speaking farmers. Enables hands-free navigation and voice responses to common farming queries.

### 1.2 Core Capabilities
- ✅ **Voice Input Recognition** - Understand farmer queries in English, Hindi, and Marathi
- ✅ **Intent Matching** - Parse query intent (check price, recommendation, demand, weather, etc.)
- ✅ **Text-to-Speech Output** - Read recommendations and prices aloud in farmer's language
- ✅ **Visual Highlights** - Accompany voice with UI animations/highlights
- ✅ **Offline Fallback** - Works with browser cache when internet is weak

### 1.3 Sample Voice Queries & Responses

| Query (Hindi) | English Translation | Expected Response | Action |
|---|---|---|---|
| "क्या मुझे गेहूं बेचना चाहिए?" | Should I sell wheat today? | Reads AI recommendation + confidence score | Highlights recommendation card |
| "आज गेहूं की कीमत क्या है?" | What is wheat price today? | "Today's wheat price is 2150 rupees per quintal" | Highlights price card + plays audio |
| "मांग पूर्वानुमान दिखाएं" | Show demand forecast | "High demand on day 1-3, medium on day 4-5" | Scrolls to heatmap, highlights days |
| "मौसम कैसा है?" | How's the weather? | Reads temp, condition, rainfall warnings | Highlights weather card |
| "मेरा लाभ क्या होगा?" | What's my profit? | Opens calculator, speaks scenario comparison | Opens profit modal |

---

## 2. Architecture & Tech Stack

### 2.1 Technology Choices
```
Frontend Voice Processing:
├── Web Speech API (SpeechRecognition) - Browser native, no server needed
├── Web Speech API (SpeechSynthesis) - Text-to-speech output
├── react-speech-recognition - React wrapper for voice API
├── speech-lang-detector - Detect language from audio
└── Intent Matcher - Custom simple regex-based parser

State Management:
├── React Context (useVoiceContext hook)
└── zustand (optional, for global voice state)

UI Components:
├── VoiceAssistant FAB (floating action button)
├── VoiceOverlay Modal (transcription display)
├── VoiceIndicator Pulse Animation
└── Voice Permission Dialog

Languages Support:
├── English (en-US)
├── Hindi (hi-IN)
└── Marathi (mr-IN)
```

### 2.2 Integration Points
```
Dashboard (page.tsx)
    ↓
VoiceAssistant Component (wrapper)
    ├── VoiceButton (FAB trigger)
    ├── VoiceOverlay (modal)
    └── useVoiceIntent Hook (logic)
         ├── Calls Intent Matcher
         ├── Updates Dashboard State
         ├── Triggers Animations
         └── Plays Audio Response
```

---

## 3. Component Architecture

### 3.1 File Structure
```
krishibandhu/
├── app/
│   ├── components/
│   │   ├── VoiceAssistant/
│   │   │   ├── VoiceAssistant.tsx          (Main wrapper)
│   │   │   ├── VoiceButton.tsx             (FAB microphone icon)
│   │   │   ├── VoiceOverlay.tsx            (Transcription modal)
│   │   │   ├── VoiceIndicator.tsx          (Listening/processing state)
│   │   │   └── voiceUtils.ts               (Intent matcher, voice helpers)
│   │   └── LanguageSwitcher.tsx            (Updated to include voice lang)
│   │
│   ├── hooks/
│   │   └── useVoiceIntent.ts               (Custom hook for voice logic)
│   │
│   ├── context/
│   │   └── VoiceContext.tsx                (Global voice state)
│   │
│   ├── dashboard/
│   │   └── page.tsx                        (Updated with VoiceAssistant)
│   │
│   └── public/locales/
│       ├── en.json                         (Updated translations)
│       ├── hi.json                         (Updated translations)
│       └── mr.json                         (Updated translations)
```

### 3.2 Component Specs

#### **VoiceAssistant.tsx** (Container)
```typescript
interface VoiceAssistantProps {
  selectedCrop: string;
  priceData: PriceData | null;
  recommendation: RecommendationData | null;
  weatherData: WeatherData | null;
  onNavigate?: (section: 'insights' | 'calculator' | 'heatmap') => void;
}

// State managed via Context
- isListening: boolean
- transcript: string
- language: 'en-US' | 'hi-IN' | 'mr-IN'
- isProcessing: boolean
- lastResponse: { text: string; audio: string } | null
```

#### **VoiceButton.tsx** (FAB)
```typescript
// Floating Action Button (bottom-right corner)
- Position: fixed bottom-8 right-8 z-40
- Icon: Microphone icon from lucide-react
- States:
  ✓ Idle - gray, clickable
  ✓ Listening - pulsing green with animation
  ✓ Processing - spinner
- Actions:
  - Click to start/stop listening
  - Long-press feedback (haptic if available)
```

#### **VoiceOverlay.tsx** (Modal)
```typescript
// Full-screen overlay showing:
- Large microphone icon with waveform animation
- Real-time transcription text
- Detected language badge (EN / HI / MR)
- Listening state: "Say something..."
- Processing state: "Understanding..."
- Response state: "Playing response..."
- Close button (X) or auto-close after response
```

---

## 4. Implementation Details

### 4.1 Intent Matching Logic (voiceUtils.ts)

```typescript
type QueryIntent = 
  | 'price' 
  | 'recommendation' 
  | 'demand' 
  | 'weather' 
  | 'calculator' 
  | 'help' 
  | 'unknown';

interface IntentResult {
  intent: QueryIntent;
  confidence: number;
  action: () => void;
  response: string;
}

// Regex-based intent matcher
const matchIntent = (transcript: string, language: string): IntentResult => {
  const lower = transcript.toLowerCase();
  
  // Price queries
  if (/price|kitne|cost|rate|kimat/.test(lower)) {
    return {
      intent: 'price',
      confidence: 0.95,
      action: highlightPriceCard,
      response: `Today's ${crop} price is ₹${currentPrice}/quintal`
    };
  }
  
  // Recommendation queries
  if (/should|bechna|wait|ruko|khareed/.test(lower)) {
    return {
      intent: 'recommendation',
      confidence: 0.92,
      action: highlightRecommendationCard,
      response: `${recommendation} - ${reasoning}`
    };
  }
  
  // Demand queries
  if (/demand|heatmap|chal|market|beech/.test(lower)) {
    return {
      intent: 'demand',
      confidence: 0.88,
      action: scrollToHeatmap,
      response: 'Here is the 7-day demand forecast...'
    };
  }
  
  // Weather queries
  if (/weather|mausam|rain|garm|cold|temp/.test(lower)) {
    return {
      intent: 'weather',
      confidence: 0.90,
      action: highlightWeatherCard,
      response: weatherDescription
    };
  }
  
  // Profit calculator
  if (/profit|kharch|expense|labh|calculate/.test(lower)) {
    return {
      intent: 'calculator',
      confidence: 0.85,
      action: openCalculator,
      response: 'Opening profit calculator. Tell me your yield and distance.'
    };
  }
  
  // Help intent
  if (/help|kaise|kya|samjhao/.test(lower)) {
    return {
      intent: 'help',
      confidence: 0.80,
      action: showHelp,
      response: 'I can help you with prices, recommendations, weather, and more.'
    };
  }
  
  return {
    intent: 'unknown',
    confidence: 0.0,
    action: () => {},
    response: 'I did not understand. Try asking about price, weather, or recommendations.'
  };
};
```

### 4.2 Custom Hook: useVoiceIntent.ts

```typescript
export const useVoiceIntent = (
  selectedCrop: string,
  priceData: PriceData | null,
  recommendation: RecommendationData | null,
  weatherData: WeatherData | null
) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en-US' | 'hi-IN' | 'mr-IN'>('en-US');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser');
      return;
    }
    
    recognitionRef.current = new webkitSpeechRecognition();
    recognitionRef.current.language = language;
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcriptSegment);
          handleIntent(transcriptSegment);
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };
    
    recognitionRef.current.onerror = (error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  }, [language]);
  
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);
  
  const handleIntent = useCallback((text: string) => {
    setIsProcessing(true);
    const result = matchIntent(text, language);
    
    // Execute the action (highlight card, scroll, open modal)
    result.action();
    
    // Speak the response
    speakResponse(result.response, language);
    
    setIsProcessing(false);
  }, [language]);
  
  const speakResponse = (text: string, lang: 'en-US' | 'hi-IN' | 'mr-IN') => {
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.language = lang;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    
    synthRef.current.speak(utterance);
  };
  
  return {
    isListening,
    transcript,
    language,
    isProcessing,
    startListening,
    stopListening,
    setLanguage
  };
};
```

### 4.3 VoiceContext.tsx

```typescript
interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  language: 'en-US' | 'hi-IN' | 'mr-IN';
  isProcessing: boolean;
  startListening: () => void;
  stopListening: () => void;
  setLanguage: (lang: 'en-US' | 'hi-IN' | 'mr-IN') => void;
}

export const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCrop, priceData, recommendation, weatherData } = useContext(DashboardContext);
  const voice = useVoiceIntent(selectedCrop, priceData, recommendation, weatherData);
  
  return (
    <VoiceContext.Provider value={voice}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within VoiceProvider');
  return context;
};
```

### 4.4 Translation Updates (locales/en.json, hi.json, mr.json)

```json
{
  "voice": {
    "say_something": "Say something...",
    "listening": "Listening...",
    "processing": "Understanding your query...",
    "responses": {
      "price": "Today's {{crop}} price is ₹{{price}}/quintal",
      "recommendation": "{{recommendation}} - {{reasoning}}. Confidence: {{confidence}}%",
      "demand": "Demand forecast shows {{forecast}}",
      "weather": "Temperature is {{temp}}°C, {{condition}}",
      "calculator": "Opening profit calculator",
      "help": "I can help you with prices, recommendations, weather, and profit calculation"
    },
    "errors": {
      "not_supported": "Speech recognition is not supported in your browser",
      "not_understood": "I did not understand. Please try again",
      "microphone_denied": "Microphone permission was denied"
    }
  }
}
```

---

## 5. UI/UX Specifications

### 5.1 VoiceButton Position & Styling
```
Location: Fixed bottom-right corner
- Bottom: 32px (8 units * 4px)
- Right: 32px
- Z-index: 40 (above content, below modals)

States:
┌─────────────────────────────┐
│ Idle (Gray)                 │
│ ⭕ 🔊 - cursor: pointer     │
│ Hover: shadow-lg            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Listening (Green + Pulse)   │
│ ⭕ 🎙️ - animate-pulse       │
│ Waveform ripple animation   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Processing (Blue + Spinner) │
│ ⭕ 🔄 - animate-spin        │
│ "Understanding..."          │
└─────────────────────────────┘
```

### 5.2 VoiceOverlay Modal
```
Full-screen overlay with glassmorphic background:
┌────────────────────────────────────┐
│ ✕ [Close]                          │
├────────────────────────────────────┤
│                                    │
│              🎙️                    │
│      ~~~~ ~~~~ ~~~~                │
│   (Waveform animation)             │
│                                    │
│   "Listening..."                   │
│   [Real-time transcription]        │
│                                    │
│   🇮🇳 Hindi (HI)                   │
│                                    │
│ [Stop Listening]  [Try Again]      │
└────────────────────────────────────┘

Processing State:
┌────────────────────────────────────┐
│              🔄                    │
│   Understanding your query...      │
│                                    │
│   ████████░░░░░░░░ 50%            │
└────────────────────────────────────┘

Response State:
┌────────────────────────────────────┐
│              🔊                    │
│                                    │
│   "Today's wheat price is          │
│    ₹2150 per quintal. Demand is    │
│    high. Recommendation: WAIT"     │
│                                    │
│                 [Close] [Repeat]   │
└────────────────────────────────────┘
```

### 5.3 Visual Feedback on Dashboard
```
When voice intent triggers action:

1. Price Query → Current Price Card
   - Green border glow (2s animation)
   - Scale up slightly (1.05x)
   - Trigger confetti animation

2. Recommendation Query → Recommendation Card
   - Color-coded glow (green/blue based on recommendation)
   - Progress bar animation fills to confidence score
   - 3-second highlight duration

3. Demand Query → Heatmap Section
   - Auto-scroll with smooth behavior
   - Individual day cells pulse sequence
   - 5-second highlight

4. Weather Query → Weather Card
   - Icon animation (rain emoji spins, sun bounces)
   - Border glow animation
```

---

## 6. Implementation Roadmap

### **Phase 1: Setup (1 hour)**
- [ ] Create folder structure under `app/components/VoiceAssistant/`
- [ ] Set up `VoiceContext.tsx` and wrap Dashboard with provider
- [ ] Install dependencies (no new packages, use Web Speech API)
- [ ] Create localization strings

### **Phase 2: Core Voice Logic (1.5 hours)**
- [ ] Implement `useVoiceIntent.ts` hook with SpeechRecognition
- [ ] Implement `voiceUtils.ts` with intent matcher (regex patterns)
- [ ] Implement text-to-speech synthesis
- [ ] Test with sample queries

### **Phase 3: UI Components (1.5 hours)**
- [ ] Build `VoiceButton.tsx` FAB component
- [ ] Build `VoiceOverlay.tsx` modal with animations
- [ ] Build `VoiceIndicator.tsx` for state visualization
- [ ] Add animations (pulse, waveform, highlight effects)

### **Phase 4: Integration (1 hour)**
- [ ] Add `VoiceAssistant.tsx` wrapper to Dashboard
- [ ] Connect voice actions to dashboard state updates
- [ ] Pass callbacks for card highlighting, scrolling, modal opening
- [ ] Test all intent flows

### **Phase 5: Testing & Polish (0.5 hours)**
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari limitations on Web Speech)
- [ ] Accessibility audit (ARIA labels, keyboard support)
- [ ] Error handling for permissions denied

---

## 7. Code Quality Checklist

- [ ] TypeScript strict mode enabled
- [ ] All hooks properly memoized (useCallback, useMemo)
- [ ] Error boundaries implemented
- [ ] Graceful fallbacks for unsupported browsers
- [ ] Comment important logic sections
- [ ] Mobile-responsive design
- [ ] Keyboard shortcuts (Space to toggle listening)
- [ ] Analytics tracking (optional: log every voice query)

---

## 8. Testing Strategy

### 8.1 Unit Tests (voiceUtils.test.ts)
```typescript
describe('Intent Matching', () => {
  test('matches price queries in English', () => {
    expect(matchIntent('What is the price?', 'en-US').intent).toBe('price');
  });
  
  test('matches price queries in Hindi', () => {
    expect(matchIntent('क्या आज कीमत कितनी है?', 'hi-IN').intent).toBe('price');
  });
  
  test('matches recommendation queries', () => {
    expect(matchIntent('Should I sell?', 'en-US').intent).toBe('recommendation');
  });
  
  test('handles unknown queries gracefully', () => {
    expect(matchIntent('xyzabc', 'en-US').intent).toBe('unknown');
  });
});
```

### 8.2 Integration Tests
```typescript
describe('VoiceAssistant Integration', () => {
  test('starts listening on button click', () => {
    // Simulate button click, verify isListening state changes
  });
  
  test('speaks response after intent match', () => {
    // Mock SpeechSynthesis.speak, verify it's called
  });
  
  test('highlights card when price intent matched', () => {
    // Verify card border/glow animation applied
  });
});
```

### 8.3 Manual Testing Scenarios
| Scenario | Test Steps | Expected Result |
|---|---|---|
| **Query in English** | Say "What is wheat price?" | Highlights price card, speaks price |
| **Query in Hindi** | Change language to हिंदी, say "राज मुझे गेहूं बेचना चाहिए?" | Highlights recommendation card |
| **Unsupported Browser** | Test in Safari (iOS) | Shows fallback message, button disabled |
| **Microphone Permission Denied** | Deny permission on first use | Shows error modal with retry button |
| **Network Interrupted** | Disconnect internet mid-query | Falls back to cached data if available |

---

## 9. Browser Compatibility

| Browser | Support | Notes |
|---|---|---|
| Chrome 25+ | ✅ Full | Web Speech API stable |
| Firefox 25+ | ✅ Full | Web Speech API via moz prefix |
| Safari 14.1+ | ⚠️ Partial | Desktop OK, iOS limited (no SpeechRecognition) |
| Edge 79+ | ✅ Full | Based on Chromium |
| Opera 27+ | ✅ Full | Based on Chromium |
| IE 11 | ❌ Not Supported | No Web Speech API |

---

## 10. Accessibility & Internationalization

### 10.1 A11y Considerations
- Voice output for visually impaired farmers ✅
- Keyboard shortcuts: Space to toggle listening, Escape to close
- ARIA labels on all interactive elements
- High contrast mode support for text overlay
- Screen reader announcements for state changes

### 10.2 Languages Roadmap
- Phase 1: English, Hindi (Devanagari), Marathi
- Phase 2 (Future): Gujarati, Tamil, Telugu, Kannada
- Phonetic input support for vernacular queries

---

## 11. Performance Optimization

```typescript
// Lazy load Web Speech API only when needed
const SpeechRecognition = 
  (window as any).SpeechRecognition || 
  (window as any).webkitSpeechRecognition;

// Memoize intent matcher to avoid recalculation
const memoizedMatcher = useMemo(
  () => matchIntent(transcript, language),
  [transcript, language]
);

// Cancel previous speech before playing new one
synthRef.current.cancel();
```

---

## 12. Future Enhancements

- 🔮 **NLP Integration:** Replace regex with ML (DialogFlow, Rasa)
- 🔮 **Multilingual Code-Switching:** Understand mixed English-Hindi queries
- 🔮 **Farmer Feedback Loop:** "Was this recommendation helpful?" → ML training
- 🔮 **Offline Mode:** Service Worker caching for voice queries
- 🔮 **Personal Voice Profile:** Remember farmer's language preference, accent
- 🔮 **Haptic Feedback:** Vibration on mobile when listening/responding
- 🔮 **WhatsApp Integration:** Send voice recommendations via WhatsApp

---

## 13. Success Metrics

- ✅ Voice queries correctly matched to intent 90%+ of the time
- ✅ Support 3+ Indian languages with accent recognition
- ✅ Response latency < 2 seconds (listening + processing + response)
- ✅ User satisfaction: 4.5+/5 stars (post-launch surveys)
- ✅ Adoption: 20%+ of users use voice weekly
- ✅ Accessibility: Pass WCAG 2.1 AA standards

---

## Appendix A: Sample Regex Patterns for Intent Matching

```typescript
// Price intent
const pricePatterns = [
  /(price|cost|rate|kitne|kya?|khete\s+ho)/i,
  /(kimat|bhav|daam)/i,  // Hindi/Marathi
];

// Recommendation intent
const recommendationPatterns = [
  /(should|sell|wait|ruko|reh)/i,
  /(bechna|beech|khareedi|lagta|man)/i,  // Hindi
];

// Demand intent
const demandPatterns = [
  /(demand|heatmap|forecast|trend)/i,
  /(chal|beech|bazaar|market)/i,  // Hindi
];

// Weather intent
const weatherPatterns = [
  /(weather|rain|temperature|condition)/i,
  /(mausam|barish|garam|cold|thandi)/i,  // Hindi
];

// Calculator intent
const calculatorPatterns = [
  /(profit|calculate|expenses|earnings)/i,
  /(labh|kharch|koshti|nikal)/i,  // Hindi
];
```

---

**End of Implementation Plan**

---

### Quick Start Commands
```bash
# After implementation, test voice functionality:
npm run dev

# In browser console, test intent matcher:
const result = matchIntent('Tell me wheat price', 'en-US');
console.log(result);

# Record voice queries and log transcripts:
localStorage.setItem('voiceDebug', 'true');
```
