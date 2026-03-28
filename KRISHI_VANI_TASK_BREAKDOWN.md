# Krishi-Vani: Step-by-Step Execution Guide

**Total Tasks:** 20  
**Estimated Time:** 4-6 hours  
**Difficulty:** Low to Medium  

---

## 📋 Task Breakdown by Phase

### **PHASE 1: SETUP (Tasks 1-3) - 45 minutes**

#### Task 1: Create VoiceAssistant Folder Structure
**Time:** 10 minutes  
**Dependency:** None

Create the following directory structure:
```
krishibandhu/
├── app/
│   ├── components/
│   │   └── VoiceAssistant/
│   │       ├── VoiceAssistant.tsx
│   │       ├── VoiceButton.tsx
│   │       ├── VoiceOverlay.tsx
│   │       ├── VoiceIndicator.tsx
│   │       ├── voiceUtils.ts
│   │       └── index.ts
│   ├── hooks/
│   │   └── useVoiceIntent.ts
│   └── context/
│       └── VoiceContext.tsx
```

**Steps:**
1. In VS Code, create folders step by step (or use terminal)
2. Create empty TypeScript files
3. Add basic exports in `VoiceAssistant/index.ts`

**Validation:** All files created with no errors

---

#### Task 2: Set Up VoiceContext and Provider
**Time:** 20 minutes  
**Dependency:** Task 1

Create `app/context/VoiceContext.tsx`:
- Define `VoiceContextType` interface
- Create `VoiceContext` with initial values
- Create `VoiceProvider` component
- Create `useVoice` custom hook
- Export all for use in other components

**Key Code Pattern:**
```typescript
interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  language: 'en-US' | 'hi-IN' | 'mr-IN';
  isProcessing: boolean;
  startListening: () => void;
  stopListening: () => void;
  setLanguage: (lang: string) => void;
}
```

**Validation:** 
- TypeScript compiles with no errors
- No runtime warnings when wrapping Dashboard

---

#### Task 3: Add Voice Translations (en/hi/mr.json)
**Time:** 15 minutes  
**Dependency:** None (can do in parallel with Task 2)

Update existing locale files in `app/public/locales/`:

**For en.json, add:**
```json
"voice": {
  "say_something": "Say something...",
  "listening": "Listening...",
  "processing": "Understanding your query...",
  "responses": {
    "price": "Today's {{crop}} price is ₹{{price}}/quintal",
    "recommendation": "{{recommendation}} - {{reasoning}}",
    "demand": "Demand forecast: {{forecast}}",
    "weather": "Temperature {{temp}}°C, {{condition}}",
    "calculator": "Opening profit calculator",
    "help": "I can help with prices, recommendations, weather, and profit"
  }
}
```

**For hi.json, add Hindi translations (same keys)**

**For mr.json, add Marathi translations (same keys)**

**Validation:**
- All 3 files have identical key structure
- No missing keys across files
- Run `npm run dev` without i18n errors

---

### **PHASE 2: CORE VOICE LOGIC (Tasks 4-6) - 1.5 hours**

#### Task 4: Create voiceUtils.ts (Intent Matcher)
**Time:** 40 minutes  
**Dependency:** Task 3

Create `app/components/VoiceAssistant/voiceUtils.ts`:
- Define `QueryIntent` type enum
- Define `IntentResult` interface
- Implement `matchIntent()` function with regex patterns
- Add 5 intent categories: price, recommendation, demand, weather, calculator

**Function Signature:**
```typescript
export const matchIntent = (
  transcript: string,
  language: 'en-US' | 'hi-IN' | 'mr-IN',
  context?: PriceData
): IntentResult => {
  // Match intent based on keywords
  // Return intent, confidence, action, response text
}

export interface IntentResult {
  intent: QueryIntent;
  confidence: number;
  response: string;
}
```

**Test Cases to Cover:**
- "What is wheat price?" → price intent (confidence 0.95)
- "Should I sell?" → recommendation intent (confidence 0.92)
- "क्या मुझे बेचना चाहिए?" → recommendation intent in Hindi
- "Show demand" → demand intent
- "Tell me weather" → weather intent
- "Calculate profit" → calculator intent
- "xyz123" → unknown intent

**Validation:**
- All 5+ intent types detected correctly
- Confidence scores between 0-1
- Handles both English and Hindi queries
- TypeScript strict mode passes

---

#### Task 5: Create useVoiceIntent.ts Hook
**Time:** 45 minutes  
**Dependency:** Task 4

Create `app/hooks/useVoiceIntent.ts`:
- Initialize Web Speech API references (SpeechRecognition, SpeechSynthesis)
- Implement `startListening()` function
- Implement `stopListening()` function
- Implement `handleIntent()` function
- Implement `speakResponse()` function for text-to-speech
- Return hook with state and functions

**Hook Signature:**
```typescript
export const useVoiceIntent = (
  selectedCrop: string,
  priceData: PriceData | null,
  recommendation: RecommendationData | null,
  weatherData: WeatherData | null
) => {
  // State: isListening, transcript, language, isProcessing
  // Functions: startListening, stopListening, setLanguage
  // Return object with all state + functions
}
```

**Key Implementation Details:**
- Check for browser support (webkitSpeechRecognition fallback)
- Handle microphone permission errors gracefully
- Parse interim vs final transcription results
- Cancel previous speech before speaking new response
- Memoize callbacks with useCallback

**Validation:**
- Hook initializes without errors
- SpeechRecognition starts/stops when called
- Console shows transcript updates
- Speech synthesis plays responses

---

#### Task 6: Test SpeechRecognition API Locally
**Time:** 15 minutes  
**Dependency:** Tasks 4, 5

**Manual Testing in Browser:**

1. Run `npm run dev`
2. Open browser DevTools (F12)
3. In console, create test:
```javascript
// Check browser support
console.log('webkitSpeechRecognition' in window);

// Test intent matching
const matchIntent = (text) => {
  if (/price|cost/.test(text.toLowerCase())) return 'price';
  if (/sell|wait/.test(text.toLowerCase())) return 'recommendation';
  return 'unknown';
};

console.log(matchIntent('What is the price?'));  // Should log: 'price'
console.log(matchIntent('Should I sell?'));       // Should log: 'recommendation'
```

4. Test actual voice:
```javascript
const recognition = new webkitSpeechRecognition();
recognition.language = 'en-US';
recognition.start();
// Speak into microphone
// Check console.log for transcript
recognition.stop();
```

**Expected Results:**
- ✅ `webkitSpeechRecognition in window` returns `true`
- ✅ Intent matcher detects correct intents
- ✅ Voice input captured and logged
- ✅ No microphone permission errors

**Validation:** All console tests pass, ready for UI integration

---

### **PHASE 3: UI COMPONENTS (Tasks 7-10) - 1.5 hours**

#### Task 7: Create VoiceButton FAB Component
**Time:** 25 minutes  
**Dependency:** Task 2 (VoiceContext)

Create `app/components/VoiceAssistant/VoiceButton.tsx`:
- Floating Action Button (FAB) in bottom-right corner
- Microphone icon from lucide-react
- 3 states: Idle, Listening, Processing
- Click handler to start/stop listening
- Accessibility: ARIA labels, keyboard support

**Visual States:**
```
Idle:        🎙️ gray, clickable
Listening:   🎙️ green, pulsing animation
Processing:  🔄 blue, spinner animation
```

**Code Structure:**
```typescript
export const VoiceButton = () => {
  const { isListening, isProcessing, startListening, stopListening } = useVoice();
  
  return (
    <button
      onClick={() => isListening ? stopListening() : startListening()}
      className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full shadow-lg transition-all ${
        isListening ? 'bg-green-500 animate-pulse' :
        isProcessing ? 'bg-blue-500' :
        'bg-gray-600 hover:shadow-xl'
      }`}
      aria-label="Voice Assistant"
    >
      {isProcessing ? <Loader2 className="animate-spin" /> : <Mic className="w-8 h-8 text-white" />}
    </button>
  );
};
```

**Validation:**
- Button renders correctly in bottom-right
- Click toggles listening state
- Color changes based on state
- Icon updates appropriately
- Works on mobile (touch-friendly size)

---

#### Task 8: Create VoiceOverlay Modal Component
**Time:** 35 minutes  
**Dependency:** Tasks 2, 7

Create `app/components/VoiceAssistant/VoiceOverlay.tsx`:
- Full-screen modal with glassmorphic background
- Large microphone icon with waveform animation
- Display real-time transcript
- Show language badge (EN/HI/MR)
- Display current state: "Listening", "Processing", "Playing"
- Close/Retry buttons
- Auto-close after response plays

**States to Show:**

1. **Listening State:**
   ```
   🎙️
   ~~~~ ~~~~ ~~~~  (waveform animation)
   "Listening..."
   [Transcript appears here]
   ```

2. **Processing State:**
   ```
   🔄
   "Understanding your query..."
   [Progress bar]
   ```

3. **Response State:**
   ```
   🔊
   "Your response text here..."
   [Close] [Repeat]
   ```

**Key Implementation:**
```typescript
export const VoiceOverlay = () => {
  const { isListening, transcript, language, isProcessing, stopListening } = useVoice();
  
  if (!isListening && !isProcessing) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center">
      {/* Modal content */}
    </div>
  );
};
```

**Validation:**
- Modal appears when listening/processing
- Transcript updates in real-time
- Language badge shows correctly
- Close button works
- Animations are smooth

---

#### Task 9: Create VoiceIndicator State Component
**Time:** 15 minutes  
**Dependency:** Task 2

Create `app/components/VoiceAssistant/VoiceIndicator.tsx`:
- Small indicator component for top-right corner (optional)
- Shows current language: EN / हिंदी / मराठी
- Shows listening status
- Compact design

**Code:**
```typescript
export const VoiceIndicator = () => {
  const { language, isListening } = useVoice();
  const langLabels = { 'en-US': 'EN', 'hi-IN': 'HI', 'mr-IN': 'MR' };
  
  return (
    <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-full ${
      isListening ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {isListening && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      {langLabels[language]}
    </div>
  );
};
```

**Validation:**
- Component displays language correctly
- Pulses when listening
- Styled consistently

---

#### Task 10: Add Animations (Pulse, Waveform, Glow)
**Time:** 20 minutes  
**Dependency:** Tasks 7, 8, 9

Add custom animations to `app/globals.css` or create `animations.css`:

```css
/* Pulse animation for listening state */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Waveform animation for voice indicator */
@keyframes waveform {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

/* Glow animation for card highlight */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(34, 197, 94, 0);
  }
  50% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
}

/* Scale animation for intent action */
@keyframes scaleUp {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse { animation: pulse 2s infinite; }
.animate-waveform { animation: waveform 0.6s infinite; }
.animate-glow { animation: glow 2s infinite; }
.animate-scale-up { animation: scaleUp 0.5s; }
```

**Apply animations in components:**
- VoiceButton: `animate-pulse` when listening
- Waveform in overlay: `animate-waveform`
- Card highlights: `animate-glow`
- Intent actions: `animate-scale-up`

**Validation:**
- All animations play smoothly
- No jank or performance issues
- Keyframes are properly defined

---

### **PHASE 4: INTEGRATION (Tasks 11-17) - 1.5 hours**

#### Task 11: Create VoiceAssistant Wrapper Component
**Time:** 20 minutes  
**Dependency:** Tasks 7, 8, 9

Create `app/components/VoiceAssistant/VoiceAssistant.tsx`:
- Combines VoiceButton, VoiceOverlay, VoiceIndicator
- Receives dashboard data as props
- Manages voice action callbacks

**Code Structure:**
```typescript
interface VoiceAssistantProps {
  selectedCrop: string;
  priceData: PriceData | null;
  recommendation: RecommendationData | null;
  weatherData: WeatherData | null;
  onHighlightCard?: (cardId: string) => void;
  onScrollToSection?: (section: string) => void;
  onOpenModal?: (modalId: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = (props) => {
  return (
    <>
      <VoiceButton />
      <VoiceOverlay />
      <VoiceIndicator />
    </>
  );
};
```

**Export from index.ts:**
```typescript
export { VoiceAssistant } from './VoiceAssistant';
export { VoiceButton } from './VoiceButton';
export { VoiceOverlay } from './VoiceOverlay';
export { VoiceIndicator } from './VoiceIndicator';
```

**Validation:**
- Component exports correctly
- All subcomponents render
- Props types are correct

---

#### Task 12: Integrate VoiceAssistant to Dashboard
**Time:** 15 minutes  
**Dependency:** Tasks 2, 11

Edit `app/dashboard/page.tsx`:
1. Wrap entire dashboard with `VoiceProvider`
2. Add `<VoiceAssistant />` component inside dashboard
3. Pass required props from dashboard state

**Changes to make:**
```typescript
// At top of file
import { VoiceProvider } from '../context/VoiceContext';
import { VoiceAssistant } from '../components/VoiceAssistant';

// In return JSX
return (
  <VoiceProvider>
    <div className="min-h-screen bg-gradient-to-br...">
      {/* Header, navigation, etc. */}
      
      {/* Content sections */}
      
      {/* Add this inside dashboard content */}
      <VoiceAssistant
        selectedCrop={selectedCrop}
        priceData={priceData}
        recommendation={recommendation}
        weatherData={weatherData}
      />
    </div>
  </VoiceProvider>
);
```

**Validation:**
- Dashboard renders without errors
- VoiceAssistant FAB visible in bottom-right
- No TypeScript errors
- `npm run dev` passes

---

#### Task 13: Test Price Intent (Highlight + Speak)
**Time:** 20 minutes  
**Dependency:** Tasks 11, 12

**Manual Testing:**
1. Start dev server: `npm run dev`
2. Navigate to `/dashboard`
3. Click VoiceAssistant microphone FAB
4. Say: "What is the wheat price?"
5. Expected results:
   - Transcript appears in overlay: "What is the wheat price?"
   - Current Price card highlights with green glow
   - Browser speaks: "Today's wheat price is ₹[price]/quintal"
   - Modal closes after 3 seconds

**Debug if issues:**
```javascript
// In browser console:
localStorage.setItem('voiceDebug', 'true');
// Retry voice query to see logs
```

**Validation:**
- ✅ Speech captured correctly
- ✅ Intent matched as 'price'
- ✅ Card highlighted
- ✅ Audio response played
- ✅ Correct price spoken

---

#### Task 14: Test Recommendation Intent Flow
**Time:** 15 minutes  
**Dependency:** Task 13

**Manual Testing:**
1. Click microphone FAB
2. Say: "Should I sell wheat now?" or "क्या मुझे अभी बेचना चाहिए?"
3. Expected results:
   - Recommendation card highlights (green or blue based on recommendation)
   - Browser speaks: "[SELL NOW/WAIT] - [reasoning]. Confidence: 85%"
   - Confidence bar animates
   - Modal closes

**Validation:**
- ✅ Intent matched as 'recommendation'
- ✅ Correct card highlighted
- ✅ Recommendation type (SELL/WAIT) detected
- ✅ Confidence score spoken correctly
- ✅ Audio quality acceptable

---

#### Task 15: Test Demand Heatmap Intent
**Time:** 15 minutes  
**Dependency:** Task 13

**Manual Testing:**
1. Click microphone FAB
2. Say: "Show me demand forecast" or "मांग हीटमैप दिखाओ"
3. Expected results:
   - Dashboard auto-scrolls to Demand Heatmap section
   - Individual day cells pulse in sequence
   - Browser speaks: "High demand on day 1-3, medium on day 4-5"
   - Highlight lasts 5 seconds

**Validation:**
- ✅ Intent matched as 'demand'
- ✅ Page scrolls to heatmap
- ✅ Correct description spoken
- ✅ Cells animate properly

---

#### Task 16: Test Weather Intent
**Time:** 15 minutes  
**Dependency:** Task 13

**Manual Testing:**
1. Click microphone FAB
2. Say: "What's the weather?" or "मौसम कैसा है?"
3. Expected results:
   - Weather card highlights
   - Browser speaks: "Temperature is 28°C, partly cloudy, rainfall 2mm"
   - Weather alerts (if any) are mentioned
   - Card glows for 3 seconds

**Validation:**
- ✅ Intent matched as 'weather'
- ✅ Current weather data spoken
- ✅ Weather card highlighted
- ✅ Alerts included if applicable

---

#### Task 17: Test Calculator Intent
**Time:** 20 minutes  
**Dependency:** Task 13

**Manual Testing:**
1. Click microphone FAB
2. Say: "Calculate my profit" or "मेरा लाभ निकालो"
3. Expected results:
   - Profit calculator modal opens
   - Browser speaks: "Profit calculator opened. Please enter your yield and distance."
   - Modal awaits user input
   - User can close and re-query for other intents

**Validation:**
- ✅ Intent matched as 'calculator'
- ✅ Modal opens correctly
- ✅ Prompt spoken
- ✅ User can interact with form

---

### **PHASE 5: TESTING & POLISH (Tasks 18-20) - 1 hour**

#### Task 18: Test Mobile Responsiveness
**Time:** 20 minutes  
**Dependency:** Task 17

**Manual Testing:**
1. Open dashboard on mobile device (or use Chrome DevTools)
2. Test VoiceButton size and touchability
3. Test VoiceOverlay text readability
4. Rotate screen (landscape/portrait)
5. Test on different screen sizes (320px, 480px, 768px)

**Checklist:**
- ✅ VoiceButton is large enough to tap (48x48px minimum)
- ✅ VoiceOverlay modal is readable
- ✅ Text wraps properly on small screens
- ✅ Animations don't cause layout shifts
- ✅ Touch events work (not hover-dependent)

**Expected Issues & Fixes:**
- iOS Safari may not support SpeechRecognition → Show graceful fallback
- Microphone prompt appears → Expected behavior
- Audio may not play → Check permissions & test audio on device

---

#### Task 19: Test Browser Compatibility
**Time:** 15 minutes  
**Dependency:** Task 17

**Test matrix:**

| Browser | Test Voice | Test Intent Match | Test Audio | Status |
|---|---|---|---|---|
| Chrome (Windows) | ✓ Test | ✓ Test | ✓ Test | Expected ✅ |
| Firefox (Windows) | ✓ Test | ✓ Test | ✓ Test | Expected ✅ |
| Edge (Windows) | ✓ Test | ✓ Test | ✓ Test | Expected ✅ |
| Safari (Mac) | ✓ Test | ✓ Test | ✓ Test | Expected ✅ |
| Chrome (Mobile) | ✓ Test | ✓ Test | ✓ Test | Expected ✅ |
| Safari (iOS) | - N/A | ✓ Test | ✓ Test | Expected ⚠️ Partial |

**Fallback for Unsupported Browsers:**
```typescript
if (!('webkitSpeechRecognition' in window)) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <p>Voice features not supported in your browser. Please use Chrome, Firefox, or Edge.</p>
    </div>
  );
}
```

**Validation:**
- ✅ Works in Chrome, Firefox, Edge
- ✅ Graceful fallback for unsupported browsers
- ✅ No console errors on any browser

---

#### Task 20: Add Accessibility (ARIA, Keyboard Shortcuts)
**Time:** 10 minutes  
**Dependency:** Task 17

**Updates to make:**

1. **Add ARIA labels to VoiceButton:**
```typescript
<button
  aria-label="Voice Assistant - Press Space to toggle listening"
  aria-pressed={isListening}
>
```

2. **Add keyboard shortcut (Space to toggle):**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isInputFocused) {
      e.preventDefault();
      isListening ? stopListening() : startListening();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isListening]);
```

3. **Add ARIA labels to modal:**
```typescript
<div role="dialog" aria-modal="true" aria-labelledby="voice-title">
  <h2 id="voice-title">Voice Assistant</h2>
</div>
```

4. **Ensure text contrast:** 4.5:1 ratio for all text

**Validation:**
- ✅ Axe DevTools shows no violations
- ✅ Screen reader reads labels correctly
- ✅ Keyboard navigation works
- ✅ Space bar toggles listening
- ✅ Escape closes modal

---

## 📊 Suggested Execution Order

### **Day 1 (2-3 hours): Setup & Core Logic**
1. Task 1: Folder structure
2. Task 2: VoiceContext
3. Task 3: Translations
4. Task 4: voiceUtils.ts
5. Task 5: useVoiceIntent hook
6. Task 6: Test SpeechRecognition

### **Day 2 (2-3 hours): UI Components & Integration**
7. Task 7: VoiceButton
8. Task 8: VoiceOverlay
9. Task 9: VoiceIndicator
10. Task 10: Animations
11. Task 11: VoiceAssistant wrapper
12. Task 12: Integrate to Dashboard

### **Day 3 (1-2 hours): Testing & Refinement**
13. Task 13-17: Test all intents
14. Task 18: Mobile responsiveness
15. Task 19: Browser compatibility
16. Task 20: Accessibility

---

## ✅ Completion Checklist

- [ ] All 20 tasks completed
- [ ] Voice input captured in 3 languages
- [ ] All 5 intents working (price, rec, demand, weather, calc)
- [ ] Text-to-speech working for all responses
- [ ] Mobile responsive & accessible
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Edge, Safari
- [ ] User can start/stop voice with Space key
- [ ] Dashboard passes all tests
- [ ] Ready for demo!

---

**Ready to start? Begin with Task 1!** 🚀
