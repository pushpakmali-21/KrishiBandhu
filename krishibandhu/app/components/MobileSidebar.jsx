'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Leaf, Globe, ChevronRight, LogIn, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';

/* ── Language Data ─────────────────────────────────────── */
const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English', native: 'English' },
  { code: 'hi', label: 'HI', full: 'हिन्दी', native: 'हिंदी' },
  { code: 'mr', label: 'MR', full: 'मराठी', native: 'मराठी' },
];

/* ── Navigation Links ──────────────────────────────────── */
const NAV_LINKS = [
  { href: '#features', labelKey: 'nav.features', defaultLabel: 'Features' },
  { href: '#how-it-works', labelKey: 'nav.how_it_works', defaultLabel: 'How It Works' },
  { href: '#trust', labelKey: 'nav.trust', defaultLabel: 'Trust' },
];

/**
 * MobileSidebar — animated slide-out drawer from the right edge.
 *
 * Uses CSS keyframe animations (defined in globals.css) instead of
 * Tailwind transition utilities, because the global `*` selector's
 * transition-property was overriding transform transitions.
 *
 * Props:
 *   isOpen       – boolean controlling visibility
 *   onClose      – callback to close the drawer
 *   isLoggedIn   – controls which CTA to show
 */
export default function MobileSidebar({ isOpen, onClose, isLoggedIn = false }) {
  const { t, i18n } = useTranslation();
  const panelRef = useRef(null);

  // Track mounted state so we can play the close animation before unmounting
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  /* ── Mount / unmount with animation ────────────────── */
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Force a reflow then start the open animation
      requestAnimationFrame(() => setAnimating(true));
    } else if (mounted) {
      // Start close animation, then unmount after it finishes
      setAnimating(false);
      const timer = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ── Body scroll lock ──────────────────────────────── */
  useEffect(() => {
    if (mounted) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [mounted]);

  /* ── Escape key handler ────────────────────────────── */
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, onClose]);

  /* ── Focus trap: auto-focus panel on open ──────────── */
  useEffect(() => {
    if (animating && panelRef.current) {
      panelRef.current.focus();
    }
  }, [animating]);

  /* ── Anchor link handler ───────────────────────────── */
  const handleAnchor = useCallback((e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      onClose();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 340);
    }
  }, [onClose]);

  /* ── Language helpers ───────────────────────────────── */
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
  const cycleLang = () => {
    const idx = LANGUAGES.findIndex((l) => l.code === i18n.language);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    i18n.changeLanguage(next.code);
  };

  // Don't render anything when fully closed
  if (!mounted) return null;

  return (
    <>
      {/* ── Backdrop Overlay ──────────────────────────── */}
      <div
        data-sidebar-backdrop
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: animating
            ? 'sidebarFadeIn 0.3s ease forwards'
            : 'sidebarFadeOut 0.28s ease forwards',
        }}
      />

      {/* ── Sidebar Panel ─────────────────────────────── */}
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
        className="bg-white/[0.97] shadow-2xl shadow-black/25 backdrop-blur-2xl dark:bg-gray-950/[0.97] dark:shadow-black/60"
      >
        {/* ─ Header Row ────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-gray-100/80 px-5 py-4 dark:border-gray-800/60">
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
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/60 bg-gray-50/80 dark:border-gray-700/60 dark:bg-gray-800/60"
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

        {/* ─ Navigation Links (staggered slide-in) ──────── */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, idx) => (
              <li
                key={link.href}
                style={animating ? {
                  opacity: 0,
                  animation: `sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${100 + idx * 60}ms forwards`,
                } : {}}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-[16px] font-semibold text-gray-800 dark:text-gray-200"
                  style={{ transition: 'background-color 0.2s ease, color 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.06)';
                    e.currentTarget.style.color = '#15803d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                  }}
                  suppressHydrationWarning
                >
                  <span>{t(link.labelKey, link.defaultLabel)}</span>
                  <ChevronRight
                    className="h-4 w-4 text-gray-300 dark:text-gray-600"
                    style={{ transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease' }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* ─ Divider ──────────────────────────────────── */}
          <div
            className="my-5 h-px"
            style={animating ? {
              background: 'linear-gradient(to right, transparent, rgba(156,163,175,0.25), transparent)',
              opacity: 0,
              animation: 'sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 320ms forwards',
            } : {
              background: 'linear-gradient(to right, transparent, rgba(156,163,175,0.25), transparent)',
            }}
          />

          {/* ─ Theme Toggle Row ─────────────────────────── */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={animating ? {
              opacity: 0,
              animation: 'sidebarItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) 380ms forwards',
            } : {}}
          >
            <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400">Appearance</span>
            <ThemeToggle />
          </div>
        </nav>

        {/* ─ Bottom Utility Section (slides up) ────────── */}
        <div
          className="border-t border-gray-100/80 px-5 pb-6 pt-4 dark:border-gray-800/60"
          style={animating ? {
            opacity: 0,
            animation: 'sidebarBottomSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards',
          } : {}}
        >
          {/* Language Selector */}
          <button
            onClick={cycleLang}
            className="mb-3 flex w-full items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/60 px-4 py-3 text-left dark:border-gray-800 dark:bg-gray-900/40"
            style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.backgroundColor = '';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
          >
            <Globe className="h-5 w-5 shrink-0 text-green-600 dark:text-lime-400" />
            <div className="flex-1">
              <span className="text-[14px] font-semibold text-gray-800 dark:text-gray-200">
                {currentLang.native}
              </span>
              <span className="ml-2 text-[12px] text-gray-400 dark:text-gray-500">
                Tap to switch
              </span>
            </div>
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-950 dark:text-green-400">
              {currentLang.label}
            </span>
          </button>

          {/* Login link (only when logged out) */}
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={onClose}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-[15px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.backgroundColor = '';
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
              suppressHydrationWarning
            >
              <LogIn className="h-4 w-4" />
              {t('nav.login', 'Login')}
            </Link>
          )}

          {/* Primary CTA Button */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-bold text-white shadow-lg shadow-green-500/25 dark:text-green-950 dark:shadow-lime-500/20"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              transition: 'transform 0.15s ease, box-shadow 0.25s ease, filter 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.35)';
              e.currentTarget.style.filter = 'brightness(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.filter = '';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ''; }}
            suppressHydrationWarning
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            {isLoggedIn
              ? t('nav.go_to_dashboard', 'Go to Dashboard')
              : t('nav.enter_dashboard', 'Enter Dashboard')}
          </Link>
        </div>
      </aside>
    </>
  );
}
