export type CropId = 'wheat' | 'jowar' | 'rice' | 'cotton' | 'jute' | 'tur' | 'redChilli';
export type TabId = 'insights' | 'marketplace' | 'mandi';
export type TransportMode = 'self' | 'buyer';
export type DemandLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CropGroup {
  key: 'grains' | 'fibres' | 'pulses' | 'spices';
  items: CropId[];
}

export interface WeatherDay {
  day: number;
  temp: number;
  humidity: number;
  rainfall: number;
  condition: string;
}

export interface WeatherData {
  location: string;
  forecast: WeatherDay[];
  lastUpdate: string;
}

export interface Buyer {
  name: string;
  loc: string;
  trust: number;
  price: string;
  kyc: boolean;
}

export interface LiveTrade {
  time: string;
  crop: CropId;
  vol: string;
  price: number;
  mandi: string;
}

export interface PriceData {
  current: number;
  history: { date: string; price: number }[];
  forecast: number[];
  demand: DemandLevel[];
  volatility: number;
}

export interface RecommendationData {
  recommendation: string;
  reasoning: string;
  confidence: number;
  expectedPrice?: number;
  daysToWait?: number;
}

export interface FarmerInputs {
  quantity: string;
  quality: string;
  storage: string;
  daysInStorage: string;
  urgency: string;
  distance: string;
  transportMode: TransportMode;
}
