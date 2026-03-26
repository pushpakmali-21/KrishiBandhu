'use client';
import Link from 'next/link';
import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <span>🌾</span> {t('nav.brand')}
          </h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              {t('nav.enter_dashboard')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          {t('landing.hero_title')} <br />
          <span className="text-green-600 font-black">{t('landing.hero_title_highlight')}</span>
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('landing.hero_subtitle')}
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200/50"
        >
          {t('landing.start_now')} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-green-900/5 border border-green-50">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
               <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature_price_title')}</h3>
            <p className="text-gray-600 leading-relaxed">{t('landing.feature_price_desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-green-900/5 border border-green-50">
            <div className="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
               <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature_rec_title')}</h3>
            <p className="text-gray-600 leading-relaxed">{t('landing.feature_rec_desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl shadow-green-900/5 border border-green-50">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
               <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature_trust_title')}</h3>
            <p className="text-gray-600 leading-relaxed">{t('landing.feature_trust_desc')}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-green-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>{t('landing.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
