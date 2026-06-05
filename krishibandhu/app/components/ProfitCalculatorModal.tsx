import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TransportMode, PriceData } from '../types/dashboard';

interface ProfitCalculatorModalProps {
  calcYield: string;
  setCalcYield: (v: string) => void;
  calcDistance: string;
  setCalcDistance: (v: string) => void;
  calcTransportMode: TransportMode;
  setCalcTransportMode: (v: TransportMode) => void;
  priceData: PriceData | null;
  setShowCalcModal: (v: boolean) => void;
  formatCurrency: (v: number) => string;
  TRANSPORT_RATE_PER_QTL_KM: number;
  BUYER_PICKUP_PRICE_FACTOR: number;
}

export default function ProfitCalculatorModal({
  calcYield,
  setCalcYield,
  calcDistance,
  setCalcDistance,
  calcTransportMode,
  setCalcTransportMode,
  priceData,
  setShowCalcModal,
  formatCurrency,
  TRANSPORT_RATE_PER_QTL_KM,
  BUYER_PICKUP_PRICE_FACTOR
}: ProfitCalculatorModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-transparent dark:border-gray-700">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t('profit_calculator.title')}</h3>
            <button onClick={() => setShowCalcModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold" aria-label="Close profit calculator">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('profit_calculator.yield_label')}</label>
                <input
                  type="number"
                  placeholder={t('profit_calculator.yield_placeholder')}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={calcYield}
                  onChange={(e) => setCalcYield(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('profit_calculator.distance_label')}</label>
                <input
                  type="number"
                  placeholder={t('profit_calculator.distance_placeholder')}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={calcDistance}
                  onChange={(e) => setCalcDistance(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{t('farmer_form.transport_label')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['self', 'buyer'] as TransportMode[]).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setCalcTransportMode(mode)}
                      className={`py-3 rounded-xl text-xs font-black transition-all ${calcTransportMode === mode
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/40'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                      {mode === 'self' ? t('farmer_form.transport_self') : t('farmer_form.transport_buyer')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
                <p className="text-xs font-bold text-orange-700 dark:text-orange-400 leading-relaxed uppercase tracking-widest mb-1">{t('profit_calculator.risk_low')}</p>
                {(() => {
                  const expectedGainPct = priceData?.current && priceData?.forecast?.length
                    ? (((priceData.forecast.reduce((a, b) => Math.max(a, b), 0) - priceData.current) / priceData.current) * 100).toFixed(1)
                    : 'N/A';
                  return (
                    <p className="text-xs text-orange-600 dark:text-orange-300 font-medium">
                      {expectedGainPct}% gain with {(priceData?.volatility ?? 0).toFixed(1)}% volatility = LOW RISK advice.
                    </p>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: t('profit_calculator.sell_today'), price: priceData?.current || 0, color: 'green' },
                { label: t('profit_calculator.wait_for_peak'), price: priceData?.forecast?.reduce((a, b) => Math.max(a, b), 0) ?? 0, color: 'blue' }
              ].map((option, i) => {
                const yieldNum = parseFloat(calcYield) || 0;
                const distNum = parseFloat(calcDistance) || 0;
                const freight = calcTransportMode === 'self' ? yieldNum * distNum * TRANSPORT_RATE_PER_QTL_KM : 0;
                const gross = option.price * yieldNum * (calcTransportMode === 'buyer' ? BUYER_PICKUP_PRICE_FACTOR : 1);
                const net = Math.max(0, gross - freight);

                return (
                  <div key={i} className={`rounded-2xl p-5 border ${option.color === 'green' ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-100 dark:shadow-none'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${option.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {option.label}
                    </p>
                    <div className="flex justify-between items-end mb-4">
                      <span className={`text-2xl font-black ${option.color === 'green' ? 'text-green-900 dark:text-green-300' : 'text-blue-900 dark:text-blue-300'}`}>
                        {formatCurrency(net)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 lowercase">{t('profit_calculator.net_profit')}</span>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400 dark:text-gray-500 uppercase">{t('profit_calculator.gross')}</span>
                        <span className="text-gray-600 dark:text-gray-300">{formatCurrency(gross)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400 dark:text-gray-500 uppercase">{t('profit_calculator.freight')}</span>
                        <span className="text-gray-600 dark:text-gray-300">- {formatCurrency(freight)}</span>
                      </div>
                      {calcTransportMode === 'buyer' && (
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 pt-2">{t('profit_calculator.buyer_pickup_note')}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={() => setShowCalcModal(false)}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black dark:hover:bg-gray-600 transition-all"
            >
              {t('profit_calculator.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
