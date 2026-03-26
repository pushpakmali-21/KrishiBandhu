'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Zap, TrendingUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

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

export default function Dashboard() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const crops = ['wheat', 'jowar', 'cotton'];
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCrop]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [priceRes, recRes] = await Promise.all([
        axios.get(`${API_BASE}/prices/${selectedCrop}`),
        axios.get(`${API_BASE}/recommendations/${selectedCrop}`)
      ]);
      
      setPriceData(priceRes.data);
      setRecommendation({
        recommendation: recRes.data.recommendation,
        reasoning: recRes.data.reasoning,
        confidence: recRes.data.confidence,
        expectedPrice: recRes.data.expectedPrice,
        daysToWait: recRes.data.daysToWait,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reach the server.';
      console.error('Error fetching data:', err);
      setError(`Could not load market data: ${message}. Make sure the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-green-800 font-semibold text-lg">Harvesting latest data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50 px-6">
        <div className="bg-white rounded-2xl p-10 shadow-lg border border-red-200 max-w-lg text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-black text-red-800 mb-3">Data Unavailable</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-green-800 tracking-tight">KrishiBandhu</h1>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Market Intelligence</p>
          </div>
          <div className="hidden md:flex gap-3 items-center">
             <span className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {t('nav.live_mandi')}
             </span>
             <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md">{t('nav.nashik_hub')}</button>
             <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Crop Selection */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
             <h2 className="text-2xl font-extrabold text-gray-800">Crop Analysis</h2>
             <div className="bg-white p-1 rounded-xl shadow-inner border border-gray-100 flex gap-1">
               {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    selectedCrop === crop
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </button>
               ))}
             </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Current Price</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-black text-green-800">₹{priceData?.current.toLocaleString()}</span>
              <span className="text-gray-500 font-medium pb-1.5">/quintal</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">7-Day Forecast Peak</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-black text-blue-800">₹{Math.max(...(priceData?.forecast || [0])).toLocaleString()}</span>
              <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Market Volatility</p>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-black text-orange-600">{priceData?.volatility}%</span>
              <div className="flex flex-col text-[10px] font-bold text-gray-400 leading-none pb-1">
                 <span>{priceData && priceData.volatility > 4 ? 'HIGH' : 'LOW'}</span>
                 <span>RISK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Recommendation */}
          <div className="lg:col-span-2">
            <div className={`h-full rounded-3xl p-8 border-2 flex flex-col justify-center ${
              recommendation?.recommendation === 'WAIT' 
                ? 'bg-blue-50/50 border-blue-200' 
                : 'bg-green-50/50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className={`w-6 h-6 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-600' : 'text-green-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">AI Recommendation</span>
              </div>
              <h3 className={`text-3xl font-black mb-3 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-900' : 'text-green-900'}`}>
                {recommendation?.recommendation}
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed mb-6">
                {recommendation?.reasoning}
              </p>
              <div className="pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-gray-500">ML Confidence Score</span>
                   <span className="text-lg font-black text-gray-800">{recommendation?.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                   <div 
                    className={`h-full rounded-full transition-all duration-1000 ${recommendation?.recommendation === 'WAIT' ? 'bg-blue-600' : 'bg-green-600'}`}
                    style={{ width: `${recommendation?.confidence}%` }}
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
             <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center justify-between">
                <span>Price Trend & Forecast</span>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500 uppercase tracking-widest">30 Day Window</span>
             </h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData?.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'black', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#16a34a" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      name="Mandi Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* Demand Section */}
        <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">7-Day Demand Heatmap</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> High</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm"></span> Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Low</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {priceData?.demand.map((level, i) => {
              const bg = level === 'HIGH' ? 'bg-red-500' : level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500';
              return (
                <div key={i} className="group relative">
                  <div className={`h-16 rounded-xl flex items-center justify-center transition-all ${bg} opacity-10 blur-[2px] group-hover:blur-0 group-hover:opacity-100`}>
                    <span className="text-white font-black text-xs">{level}</span>
                  </div>
                  <div className={`absolute inset-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all p-2 ${
                    level === 'HIGH' ? 'border-red-200' : level === 'MEDIUM' ? 'border-yellow-200' : 'border-blue-200'
                  } group-hover:bg-transparent bg-white group-hover:border-transparent`}>
                     <span className="text-[10px] font-black text-gray-400 mb-1">DAY {i+1}</span>
                     <span className={`text-xs font-black ${
                       level === 'HIGH' ? 'text-red-600' : level === 'MEDIUM' ? 'text-yellow-600' : 'text-blue-600'
                     }`}>{level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
