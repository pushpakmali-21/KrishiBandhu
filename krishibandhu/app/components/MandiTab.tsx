import React from 'react';
import { useTranslation } from 'react-i18next';
import { LiveTrade } from '../types/dashboard';

interface MandiTabProps {
  liveTrades: LiveTrade[];
  formatCurrency: (v: number) => string;
}

export default function MandiTab({ liveTrades, formatCurrency }: MandiTabProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-green-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white">Recent Sample Trades</h2>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Live trade data requires API integration with eNAM (enam.gov.in)</p>
          </div>
        </div>
        <div className="space-y-4">
          {liveTrades.map((trade, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-center font-black text-green-600 dark:text-green-400">
                  {t(`dashboard.crops.${trade.crop}`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200">{t(`dashboard.crops.${trade.crop}`)} - {trade.vol}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{trade.mandi} Mandi | {trade.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-green-700 dark:text-green-400">{formatCurrency(trade.price)}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Sample Trade</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
