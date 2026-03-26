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
        className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 px-3 py-1.5 rounded-full transition-all"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span>{current.label}</span>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[150px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                  lang.code === i18n.language
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-black text-xs text-gray-400 w-6">{lang.label}</span>
                <span>{lang.full}</span>
                {lang.code === i18n.language && (
                  <span className="ml-auto text-green-600 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
