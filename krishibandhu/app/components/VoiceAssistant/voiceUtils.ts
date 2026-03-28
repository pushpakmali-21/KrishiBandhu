// Voice utility functions and intent matcher
// Supports English, Hindi, and Marathi voice queries

export type QueryIntent = 
  | 'price' 
  | 'recommendation' 
  | 'demand' 
  | 'weather' 
  | 'calculator' 
  | 'help' 
  | 'unknown';

export interface IntentResult {
  intent: QueryIntent;
  confidence: number;
  response: string;
  action?: 'highlight-price' | 'highlight-recommendation' | 'scroll-heatmap' | 'highlight-weather' | 'open-calculator';
}

// ==================== English Patterns ====================
const ENGLISH_PATTERNS = {
  price: [
    /\b(what\s+is|whats|tell me|what|price|cost|rate|rupees|rs)\b/i,
    /\b(current|today|today's|todays)\b.*\b(price|cost|rate|rupees|rs|mandi)\b/i,
    /\b(price|cost|rate)\b.*\b(of|for)\b/i,
  ],
  recommendation: [
    /\b(should|should\s+i|must|must\s+i|do\s+i|sell|wait|hold|ruko|bechu)\b/i,
    /\b(advice|suggest|recommend|what.*do)\b/i,
    /\b(best|good|wise)\b.*\b(time|now|today)\b/i,
  ],
  demand: [
    /\b(demand|heatmap|forecast|trend|market|trading|buy|sell|high|low|peak)\b/i,
    /\b(show|display|see|view)\b.*\b(demand|heatmap|forecast)\b/i,
    /\b(7.?day|seven.?day|coming.*days)\b/i,
  ],
  weather: [
    /\b(weather|mausam|temperature|temp|rain|rainy|sunny|cold|hot|condition|humidity|rainfall)\b/i,
    /\b(how's|hows|how\s+is|climate)\b/i,
  ],
  calculator: [
    /\b(profit|calculate|calculat|expense|cost|earning|earn|labh|nikal|kharch)\b/i,
    /\b(how much|kitna|much will|take home)\b/i,
  ],
  help: [
    /\b(help|what|how|guide|explain|tell|can you)\b/i,
  ],
};

// ==================== Hindi Patterns ====================
const HINDI_PATTERNS = {
  price: [
    /\b(क्या|कीमत|भाव|दाम|किमत|रुपये|रु|आज|आजकी|वर्तमान)\b/i,
    /\b(गेहूं|गेहूँ|कपास|जवार|ज्वार|चावल|दाल|मिर्च)\b.*\b(कीमत|भाव|दाम)\b/i,
    /\b(बताओ|बताएं|बता|क्या है|कितने)\b/i,
  ],
  recommendation: [
    /\b(बेचना|बेचूं|बेचूँ|रुको|रूको|प्रतीक्षा|इंतज़ार|क्या करूं|क्या करूँ|चाहिए|सलाह|सुझाव)\b/i,
    /\b(अभी|अब|आज|अभी|तुरंत|कल|कब)\b.*\b(बेचूं|बेचूँ|बेचना)\b/i,
  ],
  demand: [
    /\b(मांग|माँग|चाहिए|चलन|बाजार|व्यापार|व्यापारी|खरीद|बिक्री)\b/i,
    /\b(दिखाओ|दिखाएं|दिखा|देखो|देखें|दिन|सप्ताह)\b.*\b(मांग|माँग|चलन)\b/i,
  ],
  weather: [
    /\b(मौसम|ठंड|गरम|गर्मी|बारिश|बारिस|बर्षा|धूप|तापमान|नमी|आर्द्रता|स्थिति|हालत|हवा)\b/i,
    /\b(कैसा|कैसी|कितने|डिग्री|सेल्सियस|आज|अभी)\b/i,
  ],
  calculator: [
    /\b(लाभ|नफा|खर्च|खर्च|किराया|ख़र्च|निकालो|निकाले|कितन|कितना|होगा|होंगे)\b/i,
    /\b(मुझे|उपज|दूरी|दूरी|रुपया|रु|कमा|कमाऊंगा)\b/i,
  ],
  help: [
    /\b(मदद|सहायता|बताओ|बतायें|कैसे|क्या|समझाओ|समझाएं)\b/i,
  ],
};

// ==================== Marathi Patterns ====================
const MARATHI_PATTERNS = {
  price: [
    /\b(किंमत|भाव|दाम|आज|आजकी|वर्तमान|रुपये|रु|क्या|कितने)\b/i,
    /\b(गहू|कापूस|ज्वारी|तांदूळ|दळ|मिरची)\b.*\b(किंमत|भाव|दाम)\b/i,
    /\b(बोला|बोलून|सांगा|सांगून|आहे|झाले)\b/i,
  ],
  recommendation: [
    /\b(विकून|विकायच|थांबा|थांबायच|प्रतीक्षा|काय करायचे|काय करू|सल्ला|शिफारस)\b/i,
    /\b(आता|आजच|लगेच|उद्या|कधी|तातडीने)\b.*\b(विकून|विकायचे)\b/i,
  ],
  demand: [
    /\b(मागणी|माहिती|बाजार|व्यापार|खरेदी|विक्री|दिवस|हीटमॅप)\b/i,
    /\b(दाखवा|दाखवून|पाहा|पाहून|दाखवा|दिवा|सप्ताह)\b/i,
  ],
  weather: [
    /\b(हवामान|थंड|उष्ण|उष्णता|पाऊस|धूप|तापमान|नमी|स्थिती|हालचाल|दिवस)\b/i,
    /\b(कसे|कसे|किती|अंश|आज|आता|सेल्सियस)\b/i,
  ],
  calculator: [
    /\b(नफा|खर्च|किराया|काढा|काढून|कितके|कितके|होईल|होतील|लाभ)\b/i,
    /\b(माझे|उत्पादन|अंतर|रुपये|रु|कमवतील|कमवू|कमा)\b/i,
  ],
  help: [
    /\b(मदत|साहाय्य|सांगा|कसे|काय|समजून|समजा|बोला)\b/i,
  ],
};

/**
 * Matches user transcript to an intent with high accuracy
 * Supports English, Hindi (Devanagari), and Marathi
 * @param transcript - The voice input text
 * @param language - The language code (en-US, hi-IN, mr-IN)
 * @param context - Optional context with crop and price data
 * @returns IntentResult with matched intent and confidence score
 */
export const matchIntent = (
  transcript: string,
  language: 'en-US' | 'hi-IN' | 'mr-IN',
  context?: {
    selectedCrop?: string;
    priceData?: any;
    recommendation?: any;
    weatherData?: any;
  }
): IntentResult => {
  if (!transcript || transcript.trim().length === 0) {
    return {
      intent: 'unknown',
      confidence: 0,
      response: 'No speech detected. Please try again.',
    };
  }

  const patterns = language === 'en-US' 
    ? ENGLISH_PATTERNS 
    : language === 'hi-IN' 
    ? HINDI_PATTERNS 
    : MARATHI_PATTERNS;

  const cropName = context?.selectedCrop 
    ? formatCropName(context.selectedCrop)
    : 'wheat';
  const currentPrice = context?.priceData?.current || '2150';
  const recommendation = context?.recommendation?.recommendation || 'WAIT';
  const reasoning = context?.recommendation?.reasoning || 'Market volatility is moderate';
  const confidence = context?.recommendation?.confidence || 85;
  const temp = context?.weatherData?.forecast?.[0]?.temp || '28';
  const condition = context?.weatherData?.forecast?.[0]?.condition || 'Partly Cloudy';

  // Check each intent type
  for (const intentType of ['price', 'recommendation', 'demand', 'weather', 'calculator', 'help'] as const) {
    const patternList = patterns[intentType] || [];
    const matchCount = patternList.filter(pattern => pattern.test(transcript)).length;

    if (matchCount > 0) {
      const matchConfidence = Math.min(0.95, (matchCount / patternList.length) * 0.95 + 0.1);
      
      // Generate response based on intent type
      let response = '';
      let action: IntentResult['action'] = undefined;

      switch (intentType) {
        case 'price':
          response = language === 'en-US'
            ? `Today's ${cropName} price is ₹${currentPrice} per quintal`
            : language === 'hi-IN'
            ? `आज ${cropName} की कीमत ₹${currentPrice} प्रति क्विंटल है`
            : `आज ${cropName}ची किंमत ₹${currentPrice} प्रति क्विंटल आहे`;
          action = 'highlight-price';
          break;

        case 'recommendation':
          response = language === 'en-US'
            ? `${recommendation} - ${reasoning}. Confidence: ${confidence}%`
            : language === 'hi-IN'
            ? `${recommendation} - ${reasoning}। आत्मविश्वास: ${confidence}%`
            : `${recommendation} - ${reasoning}। विश्वास: ${confidence}%`;
          action = 'highlight-recommendation';
          break;

        case 'demand':
          response = language === 'en-US'
            ? `Here is the 7-day demand forecast. Check the heatmap below for detailed demand trends.`
            : language === 'hi-IN'
            ? `यहाँ 7 दिन की मांग पूर्वानुमान है। विस्तृत मांग प्रवृत्ति के लिए नीचे हीटमैप देखें।`
            : `येथे 7 दिवसांचा मागणी पूर्वानुमान आहे। विस्तृत मागणी ट्रेंडसाठी खाली हीटमॅप पहा।`;
          action = 'scroll-heatmap';
          break;

        case 'weather':
          response = language === 'en-US'
            ? `Temperature is ${temp}°C, ${condition}. Humidity and rainfall data are displayed on the weather card.`
            : language === 'hi-IN'
            ? `तापमान ${temp}°C है, ${condition}। आर्द्रता और वर्षा डेटा मौसम कार्ड पर प्रदर्शित हैं।`
            : `तापमान ${temp}°C आहे, ${condition}। आर्द्रता आणि वर्षा डेटा हवामान कार्डवर दर्शविला आहे।`;
          action = 'highlight-weather';
          break;

        case 'calculator':
          response = language === 'en-US'
            ? `Opening profit calculator. Please enter your yield in quintals and distance to mandi in kilometers.`
            : language === 'hi-IN'
            ? `लाभ कैलकुलेटर खोल रहा हूं। कृपया अपनी उपज क्विंटल में और मंडी की दूरी किलोमीटर में दर्ज करें।`
            : `नफा कॅल्क्युलेटर उघडत आहे। कृपया तुमची उत्पादन क्विंटलमध्ये आणि मंडीचे अंतर किलोमीटरमध्ये टाका।`;
          action = 'open-calculator';
          break;

        case 'help':
          response = language === 'en-US'
            ? `I can help you with prices, recommendations, weather, demand forecasts, and profit calculations. Try asking about prices, recommendations, or demand forecasts.`
            : language === 'hi-IN'
            ? `मैं आपको कीमतों, सिफारिशों, मौसम, मांग पूर्वानुमान और लाभ गणना में मदद कर सकता हूं।`
            : `मी तुम्हाला किंमती, शिफारसी, हवामान, मागणी पूर्वानुमान आणि नफा गणनामध्ये मदत करू शकतो।`;
          break;

        default:
          response = 'Unknown intent';
      }

      return {
        intent: intentType,
        confidence: matchConfidence,
        response,
        action,
      };
    }
  }

  // If no intent matched, return unknown
  const unknownResponse = language === 'en-US'
    ? 'I did not understand. Try asking about prices, recommendations, weather, or demand forecasts.'
    : language === 'hi-IN'
    ? 'मैं समझ नहीं सका। कीमतों, सिफारिशों, मौसम या मांग पूर्वानुमान के बारे में पूछने का प्रयास करें।'
    : 'मी समजू शकलो नाही. किंमती, शिफारसी, हवामान किंवा मागणी पूर्वानुमानाबद्दल विचारा.';

  return {
    intent: 'unknown',
    confidence: 0,
    response: unknownResponse,
  };
};

/**
 * Format crop name for readable output
 * @param crop - The crop code name (wheat, cotton, jowar, etc.)
 * @returns Formatted crop name
 */
function formatCropName(crop: string): string {
  const cropNames: Record<string, string> = {
    wheat: 'Wheat',
    jowar: 'Jowar',
    rice: 'Rice',
    cotton: 'Cotton',
    jute: 'Jute',
    tur: 'Tur (Arhar)',
    redChilli: 'Red Chilli',
  };
  return cropNames[crop] || 'Wheat';
}
