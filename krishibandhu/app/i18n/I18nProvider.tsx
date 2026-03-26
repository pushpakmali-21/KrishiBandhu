'use client';

import { useEffect } from 'react';
// Initialize i18n on first client render
import '../i18n/config';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is initialised in the import above; nothing extra needed
  }, []);

  return <>{children}</>;
}
