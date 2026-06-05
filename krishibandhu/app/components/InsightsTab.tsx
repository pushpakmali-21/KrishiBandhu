import React from 'react';
import { Loader2, TrendingUp, Zap, Truck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { PriceData, RecommendationData, WeatherData, FarmerInputs } from '../types/dashboard';

interface InsightsTabProps {
  loading: boolean;
  error: string | null;
  priceData: PriceData | null;
  recommendation: RecommendationData | null;
  weatherData: WeatherData | null;
  farmerInputs: FarmerInputs;
  dashboardNetProfit: number;
  setShowCalcModal: (v: boolean) => void;
  formatCurrency: (v: number) => string;
  fetchDashboardData: () => void;
}

export default function InsightsTab({
  loading,
  error,
  priceData,
  recommendation,
  weatherData,
  farmerInputs,
  dashboardNetProfit,
  setShowCalcModal,
  formatCurrency,
  fetchDashboardData
}: InsightsTabProps) {
  const { t } = useTranslation();
  const quantityNum = parseFloat(farmerInputs.quantity) || 0;

  if (loading) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-6" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full animate-pulse mb-2" />
            <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-700/50 rounded-full animate-pulse" />
          </div>
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Harvesting latest data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-3xl p-12 border border-red-100 dark:border-red-900/30 shadow-sm text-center max-w-2xl mx-auto my-12 animate-in fade-in duration-500">
        <p className="text-6xl mb-6">⚠️</p>
        <h2 className="text-2xl font-black text-red-800 dark:text-red-400 mb-4">Data Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-green-700 transition shadow-lg shadow-green-200 hover:shadow-green-300"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <button onClick={() => setShowCalcModal(true)} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm transition-all hover:scale-[1.02] hover:border-green-300 dark:hover:border-green-700 hover:shadow-green-100 dark:hover:shadow-green-900/20 cursor-pointer text-left w-full group">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest" suppressHydrationWarning>{t('metrics.current_price')}</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-green-800 dark:text-green-300">{formatCurrency(priceData?.current || 0)}</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium pb-1.5">{t('dashboard.metrics.per_quintal')}</span>
          </div>
          <p className="text-[10px] font-bold text-green-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{t('profit_calculator.open_hint')}</p>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.metrics.forecast_peak')}</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-4xl font-black text-blue-800 dark:text-blue-300">{formatCurrency(priceData?.forecast?.reduce((a, b) => Math.max(a, b), 0) ?? 0)}</span>
            <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-2" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('metrics.market_volatility')}</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-black text-orange-600 dark:text-orange-400">{(priceData?.volatility ?? 0).toFixed(1)}%</span>
            <div className="flex flex-col text-[10px] font-bold text-gray-400 leading-none pb-1">
              <span>{priceData && priceData.volatility > 4 ? t('dashboard.metrics.high_risk') : t('dashboard.metrics.low_risk')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('profit_calculator.estimated_net_profit')}</p>
          <div className="mt-2">
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {quantityNum > 0 ? formatCurrency(dashboardNetProfit) : '--'}
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            {farmerInputs.transportMode === 'buyer'
              ? t('profit_calculator.buyer_pickup_note')
              : t('profit_calculator.self_drop_note')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm transition-transform hover:scale-[1.02] col-span-1 md:col-span-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 dark:text-blue-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('weather.weather_context')}</p>
                <h4 className="text-2xl font-black text-gray-800 dark:text-white">{weatherData?.forecast?.[0]?.temp ?? '--'}&deg;C - {weatherData?.forecast?.[0]?.condition ?? 'N/A'}</h4>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mt-1">{t('weather.location_nashik')}</p>
              </div>
            </div>

            {weatherData?.forecast && weatherData.forecast.some((f) => f.rainfall > 5) && (
              <div className="flex-1 w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 text-xl font-bold">!</div>
                <div>
                  <p className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest leading-none mb-1">{t('weather.alert_title')}</p>
                  <p className="text-xs text-red-600 dark:text-red-300 font-bold">{t('weather.alert_desc')}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t('weather.humidity')}</p>
                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{weatherData?.forecast?.[0]?.humidity ?? '--'}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">{t('weather.rainfall')}</p>
                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{weatherData?.forecast?.[0]?.rainfall ?? '--'}mm</p>
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
            ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
            <div className="flex items-center gap-3 mb-4">
              <Zap className={`w-6 h-6 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">{t('dashboard.recommendation.label')}</span>
            </div>
            <h3 className={`text-3xl font-black mb-3 ${recommendation?.recommendation === 'WAIT' ? 'text-blue-900 dark:text-blue-300' : 'text-green-900 dark:text-green-300'}`}>
              {recommendation?.recommendation === 'WAIT' ? t('dashboard.recommendation.wait') : t('dashboard.recommendation.sell_now')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6">
              {recommendation?.reasoning}
            </p>
            <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('dashboard.recommendation.confidence')}</span>
                <span className="text-lg font-black text-gray-800 dark:text-white">{recommendation?.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${recommendation?.recommendation === 'WAIT' ? 'bg-blue-600' : 'bg-green-600'}`}
                  style={{ width: `${recommendation?.confidence || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-black text-gray-800 dark:text-white mb-8 flex items-center justify-between">
            <span>{t('dashboard.chart.title')}</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('dashboard.chart.window')}</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData?.history || []}>
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
      <div id="demand-heatmap" className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-widest">{t('dashboard.heatmap.title')}</h3>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> {t('dashboard.heatmap.high')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-sm"></span> {t('dashboard.heatmap.medium')}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> {t('dashboard.heatmap.low')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {priceData?.demand?.map((level, i) => {
            const bg = level === 'HIGH' ? 'bg-red-500' : level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500';
            return (
              <div key={i} className="group relative">
                <div className={`h-16 rounded-xl flex items-center justify-center transition-all ${bg} opacity-10 blur-[2px] group-hover:blur-0 group-hover:opacity-100`}>
                  <span className="text-white font-black text-xs">{level}</span>
                </div>
                <div className={`absolute inset-0 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all p-2 ${level === 'HIGH' ? 'border-red-200 dark:border-red-800' : level === 'MEDIUM' ? 'border-yellow-200 dark:border-yellow-800' : 'border-blue-200 dark:border-blue-800'
                  } group-hover:bg-transparent bg-white dark:bg-gray-800 group-hover:border-transparent`}>
                  <span className="text-[10px] font-black text-gray-400 mb-1">{t('dashboard.heatmap.day')} {i + 1}</span>
                  <span className={`text-xs font-black ${level === 'HIGH' ? 'text-red-600 dark:text-red-400' : level === 'MEDIUM' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                    }`}>{level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
