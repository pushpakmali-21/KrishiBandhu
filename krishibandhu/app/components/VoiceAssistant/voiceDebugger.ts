/**
 * Voice Recognition Debugging Utility
 * Helps diagnose language support and browser compatibility issues
 */

export const voiceDebugger = {
  /**
   * Test if browser supports a specific language code
   */
  testLanguageSupport: async (languageCode: string): Promise<{
    supported: boolean;
    message: string;
    alternatives: string[];
  }> => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return {
        supported: false,
        message: 'Speech Recognition API not available',
        alternatives: [],
      };
    }

    try {
      const recognition = new SpeechRecognition();
      
      // Try to set the language
      recognition.language = languageCode;
      
      // Check if it was actually set
      if (recognition.language === languageCode) {
        console.log(`✅ Language ${languageCode} is supported`);
        return {
          supported: true,
          message: `Language ${languageCode} is supported`,
          alternatives: [],
        };
      } else {
        console.warn(`⚠️ Language ${languageCode} was not set. Got: ${recognition.language}`);
        return {
          supported: false,
          message: `Language ${languageCode} not supported. Browser set to: ${recognition.language}`,
          alternatives: [recognition.language],
        };
      }
    } catch (err) {
      return {
        supported: false,
        message: `Error testing language: ${err}`,
        alternatives: [],
      };
    }
  },

  /**
   * Test Hindi language variants
   */
  testHindiVariants: async () => {
    const variants = ['hi', 'hi-IN', 'hi-India', 'hin'];
    const results: Record<string, boolean> = {};

    for (const variant of variants) {
      const result = await voiceDebugger.testLanguageSupport(variant);
      results[variant] = result.supported;
      console.log(`Hindi variant '${variant}': ${result.supported ? '✅' : '❌'}`);
    }

    return results;
  },

  /**
   * Test Marathi language variants
   */
  testMarathiVariants: async () => {
    const variants = ['mr', 'mr-IN', 'mr-India', 'mar'];
    const results: Record<string, boolean> = {};

    for (const variant of variants) {
      const result = await voiceDebugger.testLanguageSupport(variant);
      results[variant] = result.supported;
      console.log(`Marathi variant '${variant}': ${result.supported ? '✅' : '❌'}`);
    }

    return results;
  },

  /**
   * Get browser capabilities
   */
  getBrowserCapabilities: () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechSynthesis = (window as any).speechSynthesis;

    return {
      browser: getBrowserInfo(),
      speechRecognitionSupported: !!SpeechRecognition,
      speechSynthesisSupported: !!SpeechSynthesis,
      availableVoices: SpeechSynthesis?.getVoices?.() || [],
    };
  },

  /**
   * Full diagnostic report
   */
  runFullDiagnostic: async () => {
    console.group('🔍 Full Voice API Diagnostic Report');
    
    const capabilities = voiceDebugger.getBrowserCapabilities();
    console.log('Browser Capabilities:', capabilities);

    if (capabilities.speechRecognitionSupported) {
      console.group('Testing Language Support');
      
      console.log('English (en-US):');
      await voiceDebugger.testLanguageSupport('en-US');
      
      console.log('\nHindi Variants:');
      await voiceDebugger.testHindiVariants();
      
      console.log('\nMarathi Variants:');
      await voiceDebugger.testMarathiVariants();
      
      console.groupEnd();
    }

    console.log('\nAvailable TTS Voices:', capabilities.availableVoices.map((v: any) => ({ name: v.name, lang: v.lang })));
    
    console.groupEnd();
  },
};

/**
 * Get browser information
 */
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Chromium') === -1) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Edg') > -1) {
    browserName = 'Edge';
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Trident') > -1) {
    browserName = 'IE';
    browserVersion = ua.match(/rv:([\d.]+)/)?.[1] || 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    userAgent: ua,
  };
}

/**
 * Export diagnostic function to window for console access
 */
if (typeof window !== 'undefined') {
  (window as any).voiceDebugger = voiceDebugger;
  console.log('💡 Voice debugger available: window.voiceDebugger');
  console.log('   - voiceDebugger.runFullDiagnostic()');
  console.log('   - voiceDebugger.testLanguageSupport(lang)');
  console.log('   - voiceDebugger.testHindiVariants()');
  console.log('   - voiceDebugger.testMarathiVariants()');
}
