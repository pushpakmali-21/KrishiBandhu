import React from 'react';
import { Building2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Buyer } from '../types/dashboard';

interface MarketplaceTabProps {
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  trustFilter: string;
  setTrustFilter: (v: string) => void;
  buyers: Buyer[];
  isLoggedIn: boolean;
  onConnectClick: (buyer: Buyer) => void;
}

export default function MarketplaceTab({
  locationFilter,
  setLocationFilter,
  trustFilter,
  setTrustFilter,
  buyers,
  isLoggedIn,
  onConnectClick
}: MarketplaceTabProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white" suppressHydrationWarning>{t('marketplace.title')}</h2>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1" suppressHydrationWarning>{t('marketplace.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t('marketplace.filter_all_locations')}</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <select
            value={trustFilter}
            onChange={(e) => setTrustFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t('marketplace.filter_trust_score')}</option>
            <option value="90">90+ (High)</option>
            <option value="80">80+ (Medium)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers
          .filter((b) => locationFilter === 'all' || b.loc.includes(locationFilter))
          .filter((b) => trustFilter === 'all' || b.trust >= parseInt(trustFilter, 10))
          .map((buyer, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-green-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-green-900/5 dark:hover:shadow-black/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${buyer.trust > 90 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'}`}>
                Trust: {buyer.trust}%
              </div>
            </div>
            <h4 className="text-lg font-black text-gray-800 dark:text-white mb-1">{buyer.name}</h4>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{buyer.loc}</p>

            <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase leading-none mb-1">Buying Price</p>
                <p className={`text-sm font-black ${buyer.price.includes('+') ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {buyer.price}
                </p>
              </div>
              <button
                onClick={() => onConnectClick(buyer)}
                className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg group-hover:bg-green-600 dark:group-hover:bg-green-700 transition-colors"
              >
                <span className="inline-flex items-center gap-1.5">
                  {!isLoggedIn && <Lock className="w-3.5 h-3.5" />}
                  {isLoggedIn ? t('marketplace.connect') : t('marketplace.login_to_connect')}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
