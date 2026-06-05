import { Buyer, CropGroup, LiveTrade } from '../types/dashboard';

export const cropGroups: CropGroup[] = [
  { key: 'grains', items: ['wheat', 'jowar', 'rice'] },
  { key: 'fibres', items: ['cotton', 'jute'] },
  { key: 'pulses', items: ['tur'] },
  { key: 'spices', items: ['redChilli'] },
];

export const buyers: Buyer[] = [
  { name: 'Kisan Tradelink', loc: 'Nashik Hub', trust: 98, price: '+ Rs 50', kyc: true },
  { name: 'AgroFresh Corp', loc: 'Pune Market', trust: 94, price: 'Market', kyc: true },
  { name: 'Sahyadri Farmers', loc: 'Nashik Hub', trust: 92, price: '+ Rs 20', kyc: true },
  { name: 'Mandi Direct', loc: 'Mumbai APMC', trust: 88, price: '- Rs 10', kyc: false },
  { name: 'GreenEarth exports', loc: 'Vashi Hub', trust: 85, price: 'Market', kyc: true },
  { name: 'Rural Connect', loc: 'Sangli Hub', trust: 82, price: '+ Rs 15', kyc: false },
];

export const liveTrades: LiveTrade[] = [
  { time: '2 mins ago', crop: 'wheat', vol: '15 qtl', price: 2450, mandi: 'Nashik' },
  { time: '5 mins ago', crop: 'cotton', vol: '50 qtl', price: 6800, mandi: 'Lasalgaon' },
  { time: '12 mins ago', crop: 'jowar', vol: '10 qtl', price: 3100, mandi: 'Pimpri' },
  { time: '18 mins ago', crop: 'wheat', vol: '22 qtl', price: 2445, mandi: 'Yeola' },
];

export const TRANSPORT_RATE_PER_QTL_KM = 50;
export const BUYER_PICKUP_PRICE_FACTOR = 0.98;
