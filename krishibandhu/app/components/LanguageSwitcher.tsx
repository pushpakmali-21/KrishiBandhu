'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'HI', full: 'हिन्दी' },
  { code: 'mr', label: 'MR', full: 'मराठी' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-green-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-green-400"
        aria-label="Switch language"
        title="Language Switcher"
      >
        <Globe
          className="h-4 w-4 shrink-0 text-green-600 dark:text-lime-400"
          style={{ transform: open ? 'rotate(20deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        />
        <span>{current.code === 'hi' ? 'हिंदी' : current.code === 'mr' ? 'मराठी' : 'EN'}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="lang-dropdown">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`lang-dropdown-item ${lang.code === i18n.language ? 'active' : ''}`}
              >
                <span className="lang-code">{lang.label}</span>
                <span className="lang-full">{lang.full}</span>
                {lang.code === i18n.language && (
                  <span className="lang-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
