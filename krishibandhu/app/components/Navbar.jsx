'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Leaf,
  BarChart3,
  Zap,
  ShieldCheck,
  Sprout,
  TrendingUp,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileSidebar from './MobileSidebar';

/* ── Nav structure with sub-menus ────────────────────────── */
const NAV_LINKS = [
  {
    href: '#features',
    labelKey: 'nav.features',
    defaultLabel: 'Features',
    submenu: [
      {
        href: '#features',
        Icon: BarChart3,
        label: 'Crop Price AI',
        desc: 'Real-time mandi price intelligence',
      },
      {
        href: '#how-it-works',
        Icon: Zap,
        label: 'How It Works',
        desc: 'Step-by-step guide for farmers',
      },
      {
        href: '#trust',
        Icon: ShieldCheck,
        label: 'Farmer Stories',
        desc: 'Verified success stories',
      },
    ],
  },
  {
    href: '#how-it-works',
    labelKey: 'nav.how_it_works',
    defaultLabel: 'How It Works',
  },
  {
    href: '#live-insights',
    labelKey: 'nav.live_insights',
    defaultLabel: 'Live Insights',
    submenu: [
      {
        href: '#live-insights',
        Icon: TrendingUp,
        label: 'Market Trends',
        desc: 'Live commodity price charts',
      },
      {
        href: '#features',
        Icon: Sprout,
        label: 'Crop Advisory',
        desc: 'AI-powered crop suggestions',
      },
      {
        href: '#trust',
        Icon: MessageCircle,
        label: 'Community',
        desc: 'Connect with 50k+ farmers',
      },
    ],
  },
  {
    href: '#trust',
    labelKey: 'nav.trust',
    defaultLabel: 'Trust',
  },
];

/* ── Sections tracked for active highlight ───────────────── */
const SECTION_IDS = ['features', 'how-it-works', 'live-insights', 'trust'];

/* ── Desktop sub-menu dropdown ───────────────────────────── */
function DesktopDropdown({ items, onNavigate }) {
  return (
    <div className="submenu-panel" role="menu">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          role="menuitem"
          className="submenu-item"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.href);
          }}
        >
          <span className="submenu-icon-wrap">
            <item.Icon className="h-4 w-4 text-green-600 dark:text-lime-400" strokeWidth={2} />
          </span>
          <span>
            <span className="submenu-label block">{item.label}</span>
            <span className="submenu-desc block">{item.desc}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

/* ── NavItem — handles both simple links and dropdown parents ── */
function NavItem({ link, activeSection, onNavigate }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hoverTimer = useRef(null);

  const sectionId = link.href.replace('#', '');
  const isActive =
    activeSection === sectionId ||
    (link.submenu && link.submenu.some((s) => s.href.replace('#', '') === activeSection));

  // Open on hover — close with a small delay so mouse can move into dropdown
  const openMenu = () => { clearTimeout(hoverTimer.current); setOpen(true); };
  const closeMenu = () => { hoverTimer.current = setTimeout(() => setOpen(false), 150); };

  // Escape key closes dropdown
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const label = t(link.labelKey, link.defaultLabel);

  // Simple anchor link (no submenu)
  if (!link.submenu) {
    return (
      <a
        href={link.href}
        onClick={(e) => { e.preventDefault(); onNavigate(link.href); }}
        className={`relative rounded-lg px-4 py-2 text-[14.5px] font-semibold transition-colors
          hover:bg-green-50 hover:text-green-700
          dark:hover:bg-green-950/40 dark:hover:text-green-300
          ${isActive
            ? 'nav-link-active dark:text-green-400'
            : 'text-gray-700 dark:text-gray-300'}`}
        suppressHydrationWarning
      >
        {label}
      </a>
    );
  }

  // Nav item with dropdown — label click NAVIGATES, chevron click toggles dropdown
  return (
    <div
      ref={ref}
      className="relative flex"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {/* Label — navigates directly on click */}
      <a
        href={link.href}
        onClick={(e) => { e.preventDefault(); setOpen(false); onNavigate(link.href); }}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-0.5 rounded-lg pl-4 pr-1 py-2 text-[14.5px] font-semibold transition-colors
          hover:bg-green-50 hover:text-green-700
          dark:hover:bg-green-950/40 dark:hover:text-green-300
          ${isActive
            ? 'nav-link-active dark:text-green-400'
            : 'text-gray-700 dark:text-gray-300'}`}
        suppressHydrationWarning
      >
        {label}
      </a>
      {/* Chevron — toggles dropdown only */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        tabIndex={-1}
        aria-hidden="true"
        className={`flex items-center rounded-lg pr-2 pl-0.5 py-2 transition-colors
          hover:bg-green-50 hover:text-green-700
          dark:hover:bg-green-950/40 dark:hover:text-green-300
          ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
        />
      </button>

      {open && (
        <DesktopDropdown
          items={link.submenu}
          onNavigate={(href) => { setOpen(false); onNavigate(href); }}
        />
      )}
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────── */
export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Mock authentication state
  const isLoggedIn = false;

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Intersection Observer — active section tracking */
  useEffect(() => {
    const observers = [];
    const visibleMap = {};

    const pickActive = () => {
      // Prefer the topmost visible section
      for (const id of SECTION_IDS) {
        if (visibleMap[id]) { setActiveSection(id); return; }
      }
      setActiveSection('');
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibleMap[id] = entry.isIntersecting;
          pickActive();
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Smooth-scroll anchor helper */
  const handleNavigate = useCallback((href) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`navbar-glass sticky top-0 z-50 ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">

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
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                activeSection={activeSection}
                onNavigate={handleNavigate}
              />
            ))}
          </div>

          {/* Right controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                suppressHydrationWarning
                className="hidden items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 transition-all hover:bg-green-700 hover:shadow-green-500/40 active:scale-95 sm:inline-flex dark:bg-lime-500 dark:text-green-950 dark:hover:bg-lime-400"
              >
                {t('nav.go_to_dashboard', 'Go to Dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  suppressHydrationWarning
                  className="nav-login-btn hidden sm:inline-flex"
                >
                  {t('nav.login', 'Login')}
                </Link>
                <Link
                  href="/dashboard"
                  suppressHydrationWarning
                  className="hidden items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-green-500/25 transition-all hover:bg-green-700 hover:shadow-green-500/40 active:scale-95 sm:inline-flex dark:bg-lime-500 dark:text-green-950 dark:hover:bg-lime-400"
                >
                  {t('nav.get_started', 'Get Started')}
                </Link>
              </>
            )}

            <ThemeToggle />

            {/* Animated hamburger — visible only below md */}
            <button
              type="button"
              className={`hamburger-btn md:hidden ${sidebarOpen ? 'open' : ''}`}
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={sidebarOpen}
            >
              <span className="hb-bar hb-top" />
              <span className="hb-bar hb-mid" />
              <span className="hb-bar hb-bot" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        activeSection={activeSection}
      />
    </>
  );
}
