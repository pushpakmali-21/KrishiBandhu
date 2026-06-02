'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';


export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-3.5 transition-shadow duration-300 sm:px-8
        border-b border-green-100 bg-white/85 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80
        ${scrolled ? 'shadow-md shadow-green-950/5 dark:shadow-black/30' : 'shadow-none'}`}
    >
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2 text-[17px] font-semibold text-green-950 dark:text-green-100"
        aria-label="KrishiBandhu home"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-lime-400 to-green-700">
          <Leaf className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
        </span>
        <span className="truncate">{t('nav.brand')}</span>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <Link href="/login" className="nav-login-btn">
          {t('nav.login')}
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
