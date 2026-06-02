'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DotField from './DotField';


function useCountUp(target, duration = 1400, suffix = '') {
  const ref = useRef(null);

  useEffect(() => {
    let start = null;
    let frameId = null;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      if (ref.current) {
        ref.current.textContent = Math.round(target * ease).toLocaleString('en-IN') + suffix;
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    const timeout = setTimeout(() => {
      frameId = requestAnimationFrame(step);
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration, suffix]);

  return ref;
}

export default function HeroSection() {
  const { t } = useTranslation();
  const accRef = useCountUp(85, 1200, '%');
  const farmersRef = useCountUp(50000, 1500, '+');
  const mandisRef = useCountUp(340, 1000, '');

  return (
    <section className="relative min-h-[580px] overflow-hidden bg-green-50 dark:bg-gray-950">
      <div className="absolute inset-0 opacity-30">
        <DotField
          dotSize={3}
          gap={12}
          baseColor="#84cc16"
          activeColor="#06b6d4"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-5 pb-20 pt-20 text-center sm:px-6 sm:pb-24">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100/80 px-4 py-1.5 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-900/70 dark:text-lime-200">
          <Sparkles className="h-3.5 w-3.5" />
          {t('landing.ai_badge')}
        </div>

        <h1 className="mb-5 text-4xl font-bold leading-tight text-green-950 dark:text-green-50 sm:text-5xl">
          {t('landing.hero_title')}
          <br className="hidden sm:block" />
          <span className="text-green-600 dark:text-lime-300"> {t('landing.hero_title_highlight')}</span>
        </h1>

        <p className="mb-9 max-w-md text-base leading-relaxed text-green-800/80 dark:text-green-100/75">
          {t('landing.hero_subtitle')}
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 text-[15px] font-medium text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-green-700 active:scale-[0.98] dark:bg-lime-400 dark:text-green-950 dark:hover:bg-lime-300"
        >
          {t('landing.enter_dashboard')}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>

        <div className="mt-12 flex w-full max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
          <div className="min-w-24 text-center">
            <p ref={accRef} className="text-2xl font-bold text-green-950 dark:text-green-50">0%</p>
            <p className="mt-1 text-xs text-green-700/70 dark:text-green-100/60">{t('landing.stat_accuracy')}</p>
          </div>
          <div className="hidden h-8 w-px bg-green-300 sm:block dark:bg-green-800" />
          <div className="min-w-24 text-center">
            <p ref={farmersRef} className="text-2xl font-bold text-green-950 dark:text-green-50">0+</p>
            <p className="mt-1 text-xs text-green-700/70 dark:text-green-100/60">{t('landing.stat_farmers')}</p>
          </div>
          <div className="hidden h-8 w-px bg-green-300 sm:block dark:bg-green-800" />
          <div className="min-w-24 text-center">
            <p ref={mandisRef} className="text-2xl font-bold text-green-950 dark:text-green-50">0</p>
            <p className="mt-1 text-xs text-green-700/70 dark:text-green-100/60">{t('landing.stat_mandis')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
