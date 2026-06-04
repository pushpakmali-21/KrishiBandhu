'use client';

import Link from 'next/link';
import { Leaf, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileSidebar from './MobileSidebar';

const NAV_LINKS = [
  { href: '#features', labelKey: 'nav.features', defaultLabel: 'Features' },
  { href: '#how-it-works', labelKey: 'nav.how_it_works', defaultLabel: 'How It Works' },
  { href: '#trust', labelKey: 'nav.trust', defaultLabel: 'Trust' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock authentication state for demonstration
  const isLoggedIn = false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300
          border-b border-green-100/60 bg-white/85 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/85
          ${scrolled ? 'shadow-lg shadow-green-950/5 dark:shadow-black/30' : 'shadow-none'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5 text-[17px] font-bold text-green-950 dark:text-green-100"
            aria-label="KrishiBandhu home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-lime-400 to-green-700 shadow-md shadow-green-500/30">
              <Leaf className="h-[17px] w-[17px] text-white" strokeWidth={2.5} />
            </span>
            <span className="truncate" suppressHydrationWarning>{t('nav.brand')}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="rounded-lg px-4 py-2 text-[15px] font-semibold text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-950/40 dark:hover:text-green-300"
                suppressHydrationWarning
              >
                {t(link.labelKey, link.defaultLabel)}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {isLoggedIn ? (
              <Link href="/dashboard" suppressHydrationWarning className="hidden items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 transition-all hover:bg-green-700 hover:shadow-green-500/40 active:scale-95 sm:inline-flex dark:bg-lime-500 dark:text-green-950 dark:hover:bg-lime-400">
                {t('nav.go_to_dashboard', 'Go to Dashboard')}
              </Link>
            ) : (
              <>
                <Link href="/login" suppressHydrationWarning className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:inline-flex dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
                  {t('nav.login', 'Login')}
                </Link>
                <Link href="/dashboard" suppressHydrationWarning className="hidden items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 transition-all hover:bg-green-700 hover:shadow-green-500/40 active:scale-95 sm:inline-flex dark:bg-lime-500 dark:text-green-950 dark:hover:bg-lime-400">
                  {t('nav.get_started', 'Get Started')}
                </Link>
              </>
            )}

            <ThemeToggle />

            {/* Mobile menu toggle — visible only below md breakpoint */}
            <button
              type="button"
              className="nav-icon-btn md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="nav-icon-glyph" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
