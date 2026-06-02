'use client';

import { useTranslation } from 'react-i18next';
import FeatureCards from './FeatureCards';
import HeroSection from './HeroSection';
import MandiTicker from './MandiTicker';
import Navbar from './Navbar';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <MandiTicker />
      <HeroSection />
      <FeatureCards />
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-500">
        {t('landing.footer')}
      </footer>
    </div>
  );
}
