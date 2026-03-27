'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Zap, TrendingUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001/api';

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

interface FarmerInputs {
  quantity: string;
  quality: string;
  storage: string;
  daysInStorage: string;
  urgency: string;
}

export default function Dashboard() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [farmerInputs, setFarmerInputs] = useState<FarmerInputs>({
    quantity: '',
    quality: 'A',
    storage: 'Fresh',
    daysInStorage: '',
    urgency: 'Flexible'
  });
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcYield, setCalcYield] = useState('');
  const [calcDistance, setCalcDistance] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<'insights' | 'marketplace' | 'mandi'>('insights');

  const cropGroups = [
    { key: 'grains', items: ['wheat', 'jowar', 'rice'] },
    { key: 'fibres', items: ['cotton', 'jute'] },
    { key: 'pulses', items: ['tur'] },
    { key: 'spices', items: ['redChilli'] }
  ];
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCrop]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [priceRes, recRes, weatherRes] = await Promise.all([
        axios.get(`${API_BASE}/prices/${selectedCrop}`),
        axios.get(`${API_BASE}/recommendations/${selectedCrop}`),
        axios.get(`${API_BASE}/weather/forecast`)
      ]);

      setPriceData(priceRes.data);
      setRecommendation({
        recommendation: recRes.data.recommendation,
        reasoning: recRes.data.reasoning,
        confidence: recRes.data.confidence,
        expectedPrice: recRes.data.expectedPrice,
        daysToWait: recRes.data.daysToWait,
      });
      setWeatherData(weatherRes.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reach the server.';
      console.warn('API Error:', message);
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-green-800 tracking-tight" suppressHydrationWarning>{t('nav.brand')}</h1>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest" suppressHydrationWarning>{t('dashboard.subtitle')}</p>
          </div>
          <div className="hidden md:flex gap-3 items-center">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full" suppressHydrationWarning>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {t('nav.live_mandi')}
            </span>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md" suppressHydrationWarning>{t('nav.nashik_hub')}</button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white/50 p-1.5 rounded-2xl border border-green-100 max-w-fit mx-auto shadow-sm">
          {[
            { id: 'insights', label: t('tabs.insights'), icon: '📊' },
            { id: 'marketplace', label: t('tabs.marketplace'), icon: '🤝' },
            { id: 'mandi', label: t('tabs.mandi'), icon: '🚚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${currentTab === tab.id
                ? 'bg-green-600 text-white shadow-xl shadow-green-200'
                : 'text-gray-500 hover:bg-white hover:text-green-600'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        {currentTab === 'insights' && (
          <>
            {/* Crop Selection */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-extrabold text-gray-800" suppressHydrationWarning>{t('dashboard.crop_analysis')}</h2>
                  <button
                    onClick={() => setShowInputModal(true)}
                    className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                    suppressHydrationWarning
                  >
                    {t('dashboard.edit_inputs')}
                  </button>
                </div>
                <div className="bg-white p-1 rounded-xl shadow-inner border border-gray-100 relative min-w-[220px] shadow-sm hover:shadow-md transition-shadow">
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full bg-transparent px-4 py-2.5 rounded-lg font-black text-sm text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer z-10 relative"
                  >
                    {cropGroups.map((group) => (
                      <optgroup key={group.key} label={t(`dashboard.crop_groups.${group.key}`)}>
                        {group.items.map((crop) => (
                          <option key={crop} value={crop}>
                            {t(`dashboard.crops.${crop}`)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 text-green-600 pointer-events-none text-xs font-black">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="bg-white rounded-3xl p-12 border border-red-100 shadow-sm text-center max-w-2xl mx-auto my-12 animate-in fade-in duration-500">
                <p className="text-6xl mb-6">⚠️</p>
                <h2 className="text-2xl font-black text-red-800 mb-4">Data Unavailable</h2>
                <p className="text-gray-600 font-medium leading-relaxed mb-8">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-green-700 transition shadow-lg shadow-green-200 hover:shadow-green-300"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <button onClick={() => setShowCalcModal(true)} className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-all hover:scale-[1.02] hover:border-green-300 hover:shadow-green-100 cursor-pointer text-left w-full group">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest" suppressHydrationWarning>{t('metrics.current_price')}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-4xl font-black text-green-800">₹{priceData?.current.toLocaleString()}</span>
                      <span className="text-gray-500 font-medium pb-1.5">/quintal</span>
                    </div>
                    <p className="text-[10px] font-bold text-green-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to calculate profit →</p>
                  </button>

                  <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.metrics.forecast_peak')}</p>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-4xl font-black text-blue-800">₹{Math.max(...(priceData?.forecast || [0])).toLocaleString()}</span>
                      <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('metrics.market_volatility')}</p>
                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-4xl font-black text-orange-600">{priceData?.volatility}%</span>
                      <div className="flex flex-col text-[10px] font-bold text-gray-400 leading-none pb-1">
                        <span>{priceData && priceData.volatility > 4 ? t('dashboard.metrics.high_risk') : t('dashboard.metrics.low_risk')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm transition-transform hover:scale-[1.02] col-span-1 md:col-span-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                          {weatherData?.forecast[0].condition === 'Rainy' ? '🌧️' : '☀️'}
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('weather.weather_context')}</p>
                          <h4 className="text-2xl font-black text-gray-800">{weatherData?.forecast[0].temp}°C — {weatherData?.forecast[0].condition}</h4>
                          <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">{t('weather.location_nashik')}</p>
                        </div>
                      </div>

                      {weatherData?.forecast.some((f: any) => f.rainfall > 5) && (
                        <div className="flex-1 w-full bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-xl font-bold">!</div>
                          <div>
                            <p className="text-xs font-black text-red-700 uppercase tracking-widest leading-none mb-1">{t('weather.alert_title')}</p>
                            <p className="text-xs text-red-600 font-bold">{t('weather.alert_desc')}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t('weather.humidity')}</p>
                          <p className="text-lg font-black text-gray-700">{weatherData?.forecast[0].humidity}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t('weather.rainfall')}</p>
                          <p className="text-lg font-black text-gray-700">{weatherData?.forecast[0].rainfall}mm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intelligence Row */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">

                  {/* Recommendation */}
                  <div className="lg:col-span-2">
                    <div className={`h-full rounded-3xl p-8 border-2 flex flex-col justify-center ${recommendation?.recommendation === 'WAIT'
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-green-50/50 border-green-200'
                      }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className={`w-6 h-6 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-600' : 'text-green-600'}`} />
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">{t('dashboard.recommendation.label')}</span>
                      </div>
                      <h3 className={`text-3xl font-black mb-3 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-900' : 'text-green-900'}`}>
                        {recommendation?.recommendation === 'WAIT' ? t('dashboard.recommendation.wait') : t('dashboard.recommendation.sell_now')}
                      </h3>
                      <p className="text-gray-700 font-medium leading-relaxed mb-6">
                        {recommendation?.reasoning}
                      </p>
                      <div className="pt-6 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">{t('dashboard.recommendation.confidence')}</span>
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
                      <span>{t('dashboard.chart.title')}</span>
                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500 uppercase tracking-widest">{t('dashboard.chart.window')}</span>
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
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">{t('dashboard.heatmap.title')}</h3>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> {t('dashboard.heatmap.high')}</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm"></span> {t('dashboard.heatmap.medium')}</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> {t('dashboard.heatmap.low')}</span>
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
                          <div className={`absolute inset-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all p-2 ${level === 'HIGH' ? 'border-red-200' : level === 'MEDIUM' ? 'border-yellow-200' : 'border-blue-200'
                            } group-hover:bg-transparent bg-white group-hover:border-transparent`}>
                            <span className="text-[10px] font-black text-gray-400 mb-1">{t('dashboard.heatmap.day')} {i + 1}</span>
                            <span className={`text-xs font-black ${level === 'HIGH' ? 'text-red-600' : level === 'MEDIUM' ? 'text-yellow-600' : 'text-blue-600'
                              }`}>{level}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Marketplace Tab */}
        {currentTab === 'marketplace' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-800" suppressHydrationWarning>{t('marketplace.title')}</h2>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1" suppressHydrationWarning>{t('marketplace.subtitle')}</p>
              </div>
              <div className="flex gap-2">
                <select className="bg-white border border-green-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>{t('marketplace.filter_all_locations')}</option>
                  <option>Nashik</option>
                  <option>Pune</option>
                  <option>Mumbai</option>
                </select>
                <select className="bg-white border border-green-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>{t('marketplace.filter_trust_score')}</option>
                  <option>90+ (High)</option>
                  <option>80+ (Medium)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Kisan Tradelink', loc: 'Nashik Hub', trust: 98, price: '+ ₹50', kyc: true },
                { name: 'AgroFresh Corp', loc: 'Pune Market', trust: 94, price: 'Market', kyc: true },
                { name: 'Sahyadri Farmers', loc: 'Nashik Hub', trust: 92, price: '+ ₹20', kyc: true },
                { name: 'Mandi Direct', loc: 'Mumbai APMC', trust: 88, price: '- ₹10', kyc: false },
                { name: 'GreenEarth exports', loc: 'Vashi Hub', trust: 85, price: 'Market', kyc: true },
                { name: 'Rural Connect', loc: 'Sangli Hub', trust: 82, price: '+ ₹15', kyc: false },
              ].map((buyer, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-xl">🏢</div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${buyer.trust > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      Trust: {buyer.trust}%
                    </div>
                  </div>
                  <h4 className="text-lg font-black text-gray-800 mb-1">{buyer.name}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{buyer.loc}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Buying Price</p>
                      <p className={`text-sm font-black ${buyer.price.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>
                        {buyer.price}
                      </p>
                    </div>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg group-hover:bg-green-600 transition-colors">
                      {t('marketplace.connect')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Mandi Tab */}
        {currentTab === 'mandi' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
              <h2 className="text-2xl font-black text-gray-800 mb-6">{t('mandi.live_trades')}</h2>
              <div className="space-y-4">
                {[
                  { time: '2 mins ago', crop: 'Wheat', vol: '15 qtl', price: '₹2,450', mandi: 'Nashik' },
                  { time: '5 mins ago', crop: 'Cotton', vol: '50 qtl', price: '₹6,800', mandi: 'Lasalgaon' },
                  { time: '12 mins ago', crop: 'Jowar', vol: '10 qtl', price: '₹3,100', mandi: 'Pimpri' },
                  { time: '18 mins ago', crop: 'Wheat', vol: '22 qtl', price: '₹2,445', mandi: 'Yeola' },
                ].map((trade, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-green-600">
                        {t(`dashboard.crops.${trade.crop.toLowerCase()}`).charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{t(`dashboard.crops.${trade.crop.toLowerCase()}`)} — {trade.vol}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trade.mandi} Mandi • {trade.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-700">{trade.price}</p>
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Verified Trade</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>      {/* Farmer Input Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">{t('farmer_form.title')}</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">{t('farmer_form.quantity_label')}</label>
                  <input
                    type="number"
                    placeholder={t('farmer_form.quantity_placeholder')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    value={farmerInputs.quantity}
                    onChange={(e) => setFarmerInputs({ ...farmerInputs, quantity: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">{t('farmer_form.quality_label')}</label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                      value={farmerInputs.quality}
                      onChange={(e) => setFarmerInputs({ ...farmerInputs, quality: e.target.value })}
                    >
                      <option value="A">{t('farmer_form.quality_a')}</option>
                      <option value="B">{t('farmer_form.quality_b')}</option>
                      <option value="C">{t('farmer_form.quality_c')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">{t('farmer_form.storage_label')}</label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                      value={farmerInputs.storage}
                      onChange={(e) => setFarmerInputs({ ...farmerInputs, storage: e.target.value })}
                    >
                      <option value="Fresh">{t('farmer_form.storage_fresh')}</option>
                      <option value="Stored">{t('farmer_form.storage_stored')}</option>
                    </select>
                  </div>
                </div>

                {farmerInputs.storage === 'Stored' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-gray-500 mb-2">{t('farmer_form.days_label')}</label>
                    <input
                      type="number"
                      placeholder={t('farmer_form.days_placeholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      value={farmerInputs.daysInStorage}
                      onChange={(e) => setFarmerInputs({ ...farmerInputs, daysInStorage: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">{t('farmer_form.urgency_label')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Immediate', '3Days', 'Flexible'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setFarmerInputs({ ...farmerInputs, urgency: u })}
                        className={`py-3 rounded-xl text-xs font-black transition-all ${farmerInputs.urgency === u
                          ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                      >
                        {t(`farmer_form.urgency_${u.toLowerCase()}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setShowInputModal(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
                >
                  {t('farmer_form.cancel')}
                </button>
                <button
                  onClick={() => setShowInputModal(false)}
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-green-200 hover:bg-green-700 transition-all"
                >
                  {t('farmer_form.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Profit Calculator Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">{t('profit_calculator.title')}</h3>
                <button onClick={() => setShowCalcModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">{t('profit_calculator.yield_label')}</label>
                    <input
                      type="number"
                      placeholder={t('profit_calculator.yield_placeholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      value={calcYield}
                      onChange={(e) => setCalcYield(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">{t('profit_calculator.distance_label')}</label>
                    <input
                      type="number"
                      placeholder={t('profit_calculator.distance_placeholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      value={calcDistance}
                      onChange={(e) => setCalcDistance(e.target.value)}
                    />
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <p className="text-xs font-bold text-orange-700 leading-relaxed uppercase tracking-widest mb-1">{t('profit_calculator.risk_low')}</p>
                    <p className="text-xs text-orange-600 font-medium">8.8% gain with {priceData?.volatility}% volatility = LOW RISK advice.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: t('profit_calculator.sell_today'), price: priceData?.current || 0, color: 'green' },
                    { label: t('profit_calculator.wait_for_peak'), price: Math.max(...(priceData?.forecast || [0])), color: 'blue' }
                  ].map((option, i) => {
                    const yieldNum = parseFloat(calcYield) || 0;
                    const distNum = parseFloat(calcDistance) || 0;
                    const freight = 5 * distNum; // Mock freight cost: ₹5/km
                    const gross = option.price * yieldNum;
                    const net = gross - freight;

                    return (
                      <div key={i} className={`rounded-2xl p-5 border ${option.color === 'green' ? 'bg-green-50/50 border-green-200' : 'bg-blue-50/50 border-blue-200 shadow-lg shadow-blue-100'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${option.color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>
                          {option.label}
                        </p>
                        <div className="flex justify-between items-end mb-4">
                          <span className={`text-2xl font-black ${option.color === 'green' ? 'text-green-900' : 'text-blue-900'}`}>
                            ₹{net.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 lowercase">{t('profit_calculator.net_profit')}</span>
                        </div>
                        <div className="space-y-1 pt-3 border-t border-dashed border-gray-200">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">{t('profit_calculator.gross')}</span>
                            <span className="text-gray-600">₹{gross.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">{t('profit_calculator.freight')}</span>
                            <span className="text-gray-600">- ₹{freight.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setShowCalcModal(false)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all"
                >
                  {t('profit_calculator.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


