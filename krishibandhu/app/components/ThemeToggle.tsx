'use client';

import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? 'dark' : 'light'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      suppressHydrationWarning
    >
      <span className="theme-toggle-icon-wrap">
        <Sun
          className="theme-icon sun-icon"
          style={{ opacity: isDark ? 0 : 1, transform: isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)' }}
        />
        <Moon
          className="theme-icon moon-icon"
          style={{ opacity: isDark ? 1 : 0, transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)' }}
        />
      </span>
    </button>
  );
}
