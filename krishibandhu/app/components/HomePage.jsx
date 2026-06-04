'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Leaf, Twitter, Github, Mail } from 'lucide-react';
import FeatureCards from './FeatureCards';
import HeroSection from './HeroSection';
import MandiTicker from './MandiTicker';
import Navbar from './Navbar';
import HowItWorks from './HowItWorks';
import LiveInsights from './LiveInsights';
import TrustSection from './TrustSection';
import CTASection from './CTASection';

const FOOTER_LINKS = {
  Product: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Marketplace', href: '/dashboard?tab=marketplace' },
    { label: 'Mandi Rates', href: '/dashboard?tab=mandi' },
    { label: 'Price Forecast', href: '/dashboard' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Farmer Stories', href: '#trust' },
  ],
};

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <MandiTicker />
      <main>
        <HeroSection />
        <FeatureCards />
        <HowItWorks />
        <LiveInsights />
        <TrustSection />
        <CTASection />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-gray-100 bg-white px-5 pt-14 pb-8 dark:border-gray-800 dark:bg-gray-950 sm:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Top row */}
          <div className="grid grid-cols-1 gap-10 mb-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand col */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lime-400 to-green-700 shadow-md shadow-green-500/25">
                  <Leaf className="h-[17px] w-[17px] text-white" strokeWidth={2.5} />
                </span>
                <span className="text-lg font-bold text-green-950 dark:text-green-100">{t('nav.brand')}</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
                AI-powered crop price intelligence for Indian farmers. Sell smarter, earn more.
              </p>
              {/* Social links */}
              <div className="flex gap-3">
                {[
                  { Icon: Twitter, href: '#', label: 'Twitter' },
                  { Icon: Github, href: '#', label: 'GitHub' },
                  { Icon: Mail, href: '#', label: 'Email' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400 transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700 dark:hover:text-green-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{group}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('landing.footer')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Made with ❤️ for Indian farmers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
