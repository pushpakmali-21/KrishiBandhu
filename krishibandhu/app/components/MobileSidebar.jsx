'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Leaf,
  Globe,
  ChevronRight,
  ChevronDown,
  LogIn,
  LayoutDashboard,
  BarChart3,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sprout,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';

/* ── Language Data ─────────────────────────────────────────── */
const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'HI', full: 'हिन्दी', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'MR', full: 'मराठी', native: 'मराठी', flag: '🇮🇳' },
];

/* ── Navigation Links (mirrors Navbar) ─────────────────────── */
const NAV_LINKS = [
  {
    href: '#features',
    labelKey: 'nav.features',
    defaultLabel: 'Features',
    Icon: BarChart3,
    submenu: [
      { href: '#features',     Icon: BarChart3,   label: 'Crop Price AI',  desc: 'Real-time mandi prices' },
      { href: '#how-it-works', Icon: Zap,         label: 'How It Works',   desc: 'Step-by-step guide' },
      { href: '#trust',        Icon: ShieldCheck,  label: 'Farmer Stories', desc: 'Verified success stories' },
    ],
  },
  {
    href: '#how-it-works',
    labelKey: 'nav.how_it_works',
    defaultLabel: 'How It Works',
    Icon: Zap,
  },
  {
    href: '#live-insights',
    labelKey: 'nav.live_insights',
    defaultLabel: 'Live Insights',
    Icon: TrendingUp,
    submenu: [
      { href: '#live-insights', Icon: TrendingUp,   label: 'Market Trends',  desc: 'Live commodity charts' },
      { href: '#features',      Icon: Sprout,       label: 'Crop Advisory',  desc: 'AI-powered suggestions' },
      { href: '#trust',         Icon: MessageCircle, label: 'Community',     desc: 'Connect with farmers' },
    ],
  },
  {
    href: '#trust',
    labelKey: 'nav.trust',
    defaultLabel: 'Trust',
    Icon: ShieldCheck,
  },
];

/* ── Accordion Item ─────────────────────────────────────────── */
function AccordionNavItem({ link, idx, animating, activeSection, onNavigate }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const sectionId = link.href.replace('#', '');
  const isActive =
    activeSection === sectionId ||
    (link.submenu && link.submenu.some((s) => s.href.replace('#', '') === activeSection));

  const label = t(link.labelKey, link.defaultLabel);

  if (!link.submenu) {
    return (
      <li
        style={animating ? {
          opacity: 0,
          animation: `sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${80 + idx * 55}ms forwards`,
        } : {}}
      >
        <a
          href={link.href}
          onClick={(e) => { e.preventDefault(); onNavigate(link.href); }}
          className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors
            ${isActive
              ? 'bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-lime-400'
              : 'text-gray-800 hover:bg-green-500/06 hover:text-green-700 dark:text-gray-200 dark:hover:bg-green-500/10 dark:hover:text-green-300'}`}
          suppressHydrationWarning
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors
            ${isActive
              ? 'border-green-400/40 bg-green-500/15 dark:border-lime-400/30 dark:bg-lime-400/10'
              : 'border-gray-200/60 bg-gray-100/60 group-hover:border-green-300/50 group-hover:bg-green-500/10 dark:border-gray-700/50 dark:bg-gray-800/50'}`}
          >
            <link.Icon
              className={`h-4 w-4 ${isActive ? 'text-green-600 dark:text-lime-400' : 'text-gray-500 group-hover:text-green-600 dark:text-gray-400'}`}
              strokeWidth={2}
            />
          </span>
          <span className="flex-1 text-[15.5px] font-semibold">{label}</span>
          <ChevronRight className={`h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-green-500' : 'text-gray-400'}`} strokeWidth={2} />
        </a>
      </li>
    );
  }

  return (
    <li
      style={animating ? {
        opacity: 0,
        animation: `sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${80 + idx * 55}ms forwards`,
      } : {}}
    >
      {/* Parent trigger */}
      <button
        type="button"
        onClick={() => setExpanded((o) => !o)}
        className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors
          ${isActive
            ? 'bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-lime-400'
            : 'text-gray-800 hover:bg-green-500/06 hover:text-green-700 dark:text-gray-200 dark:hover:bg-green-500/10 dark:hover:text-green-300'}`}
        aria-expanded={expanded}
        suppressHydrationWarning
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors
          ${isActive
            ? 'border-green-400/40 bg-green-500/15 dark:border-lime-400/30 dark:bg-lime-400/10'
            : 'border-gray-200/60 bg-gray-100/60 group-hover:border-green-300/50 group-hover:bg-green-500/10 dark:border-gray-700/50 dark:bg-gray-800/50'}`}
        >
          <link.Icon
            className={`h-4 w-4 ${isActive ? 'text-green-600 dark:text-lime-400' : 'text-gray-500 group-hover:text-green-600 dark:text-gray-400'}`}
            strokeWidth={2}
          />
        </span>
        <span className="flex-1 text-[15.5px] font-semibold">{label}</span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-250 ${expanded ? 'rotate-180' : ''} ${isActive ? 'text-green-500' : 'text-gray-400'}`}
          strokeWidth={2.5}
        />
      </button>

      {/* Accordion content */}
      {expanded && (
        <div className="accordion-content mt-1 ml-4 space-y-0.5 border-l-2 border-green-200/50 pl-3 dark:border-green-900/60">
          {link.submenu.map((sub) => (
            <a
              key={sub.href}
              href={sub.href}
              onClick={(e) => { e.preventDefault(); onNavigate(sub.href); }}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-green-500/08 dark:hover:bg-green-500/10"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200/50 bg-white/70 group-hover:border-green-300/60 group-hover:bg-green-500/10 dark:border-gray-700/40 dark:bg-gray-800/40">
                <sub.Icon className="h-3.5 w-3.5 text-green-600 dark:text-lime-400" strokeWidth={2} />
              </span>
              <span>
                <span className="block font-semibold text-gray-800 group-hover:text-green-700 dark:text-gray-200 dark:group-hover:text-lime-400">{sub.label}</span>
                <span className="block text-[11px] text-gray-400 dark:text-gray-500">{sub.desc}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

/* ── Main Sidebar ─────────────────────────────────────────── */
export default function MobileSidebar({ isOpen, onClose, isLoggedIn = false, activeSection = '' }) {
  const { t, i18n } = useTranslation();
  const panelRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  /* Mount / unmount with animation */
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const rafId = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(rafId);
    } else if (mounted) {
      const timer = setTimeout(() => {
        setAnimating(false);
        setMounted(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);


  /* Body scroll lock — restores scroll synchronously so navigation doesn't fight with scrollTo */
  useEffect(() => {
    if (mounted) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      };
    }
  }, [mounted]);


  /* Escape key handler */
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, onClose]);

  /* Focus trap */
  useEffect(() => {
    if (animating && panelRef.current) panelRef.current.focus();
  }, [animating]);

  /* Anchor + close */
  const handleNavigate = useCallback((href) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 340);
  }, [onClose]);

  /* Language helpers */
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
  const cycleLang = () => {
    const idx = LANGUAGES.findIndex((l) => l.code === i18n.language);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    i18n.changeLanguage(next.code);
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────── */}
      <div
        data-sidebar-backdrop
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: animating
            ? 'sidebarFadeIn 0.3s ease forwards'
            : 'sidebarFadeOut 0.28s ease forwards',
        }}
      />

      {/* ── Panel ───────────────────────────────────────── */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        data-sidebar-panel
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          width: '85vw',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          animation: animating
            ? 'sidebarSlideIn 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards'
            : 'sidebarSlideOut 0.28s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        }}
        className="sidebar-glass shadow-2xl shadow-black/20 dark:shadow-black/60"
      >
        {/* Accent gradient line at very top */}
        <div className="sidebar-accent-line" />

        {/* ─ Header ────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-green-100/60 px-5 py-4 dark:border-green-900/30">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 text-[17px] font-bold text-green-950 dark:text-green-100"
            aria-label="KrishiBandhu home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-lime-400 to-green-700 shadow-md shadow-green-500/30">
              <Leaf className="h-[17px] w-[17px] text-white" strokeWidth={2.5} />
            </span>
            <span suppressHydrationWarning>{t('nav.brand')}</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/60 bg-white/50 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/40"
            aria-label="Close navigation menu"
            style={{ transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9) rotate(90deg)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
          >
            <X className="h-5 w-5 text-gray-400 group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400" strokeWidth={2.5} />
          </button>
        </div>

        {/* ─ Nav Links ─────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link, idx) => (
              <AccordionNavItem
                key={link.href}
                link={link}
                idx={idx}
                animating={animating}
                activeSection={activeSection}
                onNavigate={handleNavigate}
              />
            ))}
          </ul>

          {/* Divider */}
          <div
            className="my-4 h-px"
            style={animating ? {
              background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.2), transparent)',
              opacity: 0,
              animation: 'sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 360ms forwards',
            } : {
              background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.2), transparent)',
            }}
          />

          {/* Appearance row */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-2.5"
            style={animating ? {
              opacity: 0,
              animation: 'sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 420ms forwards',
            } : {}}
          >
            <span className="text-[13.5px] font-semibold text-gray-500 dark:text-gray-400">Appearance</span>
            <ThemeToggle />
          </div>
        </nav>

        {/* ─ Bottom Utility ────────────────────────────── */}
        <div
          className="border-t border-green-100/60 px-4 pb-6 pt-4 dark:border-green-900/30"
          style={animating ? {
            opacity: 0,
            animation: 'sidebarBottomSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards',
          } : {}}
        >
          {/* Language selector */}
          <button
            onClick={cycleLang}
            className="mb-3 flex w-full items-center gap-3 rounded-xl border border-green-200/50 bg-white/50 px-4 py-3 text-left backdrop-blur-sm dark:border-green-900/40 dark:bg-green-950/20"
            style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
              e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.backgroundColor = '';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
          >
            <Globe className="h-5 w-5 shrink-0 text-green-600 dark:text-lime-400" />
            <div className="flex flex-1 items-center gap-2">
              <span className="text-base">{currentLang.flag}</span>
              <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                {currentLang.native}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">· tap to switch</span>
            </div>
            <span className="rounded-lg bg-green-100/80 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-green-700 dark:bg-green-900/60 dark:text-green-400">
              {currentLang.label}
            </span>
          </button>

          {/* Login link (logged-out only) */}
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={onClose}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200/70 bg-white/60 py-3 text-[14.5px] font-semibold text-gray-700 backdrop-blur-sm transition-all duration-150 active:scale-[0.97] active:bg-gray-50 hover:border-gray-400/50 hover:bg-gray-50/90 dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-gray-600/60 dark:hover:bg-gray-800/50 dark:active:bg-gray-800"
              suppressHydrationWarning
            >
              <LogIn className="h-4 w-4" />
              {t('nav.login', 'Login')}
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-bold text-white shadow-lg shadow-green-500/25 transition-all duration-150 active:scale-[0.97] active:brightness-90 hover:shadow-green-500/40 hover:brightness-110 dark:text-green-950 dark:shadow-lime-500/20"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e, #a3e635)',
            }}
            suppressHydrationWarning
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            {isLoggedIn
              ? t('nav.go_to_dashboard', 'Go to Dashboard')
              : t('nav.enter_dashboard', 'Enter Dashboard')}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </Link>
        </div>
      </aside>
    </>
  );
}
