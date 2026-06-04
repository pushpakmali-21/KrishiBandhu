'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Zap, ShieldCheck, BarChart3, IndianRupee } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DotField from './DotField';

function useCountUp(target, duration = 1600, suffix = '') {
  const ref = useRef(null);
  useEffect(() => {
    let start = null, frameId = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = Math.round(target * ease).toLocaleString('en-IN') + suffix;
      }
      if (progress < 1) frameId = requestAnimationFrame(step);
    }
    const t = setTimeout(() => { frameId = requestAnimationFrame(step); }, 400);
    return () => { clearTimeout(t); if (frameId) cancelAnimationFrame(frameId); };
  }, [target, duration, suffix]);
  return ref;
}

// Mini sparkline bars for mockup
const SPARKLINE = [42, 55, 48, 60, 52, 70, 65, 80, 74, 88, 82, 95];

function MockupCard() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className={`relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Glow behind card */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-br from-green-500 via-lime-400 to-emerald-600 rounded-3xl scale-90" />

      <div className="mockup-card p-5 animate-float" style={{ animationDuration: '5s' }}>
        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/20">
              <BarChart3 className="h-3.5 w-3.5 text-green-400" />
            </span>
            <span className="text-xs font-bold text-green-300 uppercase tracking-widest">Live Price Intelligence</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* Main metric */}
        <div className="mb-1 flex items-end gap-2">
          <span className="text-3xl font-black text-white flex items-center gap-0.5">
            <IndianRupee className="h-6 w-6 text-green-400" />
            2,450
          </span>
          <span className="text-xs text-gray-400 mb-1">/quintal</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-400">
            <TrendingUp className="h-3 w-3" />
            +3.2%
          </span>
          <span className="text-xs text-gray-500">Wheat · Nashik Mandi</span>
        </div>

        {/* Sparkline */}
        <div className="flex items-end gap-1 h-14 mb-4">
          {SPARKLINE.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-500"
              style={{
                height: `${v}%`,
                background: i === SPARKLINE.length - 1
                  ? 'linear-gradient(to top, #16a34a, #4ade80)'
                  : `rgba(74, 222, 128, ${0.15 + (i / SPARKLINE.length) * 0.35})`,
                transitionDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>

        {/* AI Recommendation pill */}
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">AI Recommendation</span>
          </div>
          <p className="text-xs font-bold text-white">SELL NOW — Prices peak in 2 days</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-green-500 to-lime-400" />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-500">Confidence</span>
            <span className="text-[9px] font-bold text-green-400">82%</span>
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Forecast Peak', value: '₹2,680', color: 'text-blue-400' },
            { label: 'Volatility', value: '3.8%', color: 'text-orange-400' },
            { label: 'Net Profit', value: '₹18,200', color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/5 p-2 text-center">
              <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge top-right */}
      <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-gray-900/90 px-3 py-1.5 shadow-xl backdrop-blur-sm">
        <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
        <span className="text-[10px] font-black text-green-300">340+ Mandis</span>
      </div>

      {/* Floating badge bottom-left */}
      <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-gray-900/90 px-3 py-1.5 shadow-xl backdrop-blur-sm">
        <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-[10px] font-black text-amber-300">50k+ Farmers</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const accRef   = useCountUp(85, 1400, '%');
  const farmersRef = useCountUp(50000, 1600, '+');
  const mandisRef  = useCountUp(340, 1200, '');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/60 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* Soft dot field */}
      <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]">
        <DotField dotSize={2.5} gap={14} baseColor="#84cc16" activeColor="#06b6d4" proximity={100} shockRadius={200} shockStrength={4} resistance={700} returnDuration={1.5} />
      </div>

      {/* Gradient orbs */}
      <div className="hero-orb w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-[0.08] dark:opacity-[0.12]"
           style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }} />
      <div className="hero-orb w-[400px] h-[400px] bottom-[-80px] left-[-80px] opacity-[0.06] dark:opacity-[0.08]"
           style={{ background: 'radial-gradient(circle, #a3e635, transparent 70%)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* ── Left: Text Content ── */}
          <div className="flex flex-col items-start">
            {/* AI Badge */}
            <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-green-100/70 px-4 py-1.5 text-xs font-semibold text-green-700 dark:border-green-800/70 dark:bg-green-900/50 dark:text-lime-300 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t('landing.ai_badge')}
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-1 mb-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-green-950 dark:text-white sm:text-5xl lg:text-[3.25rem]">
              {t('landing.hero_title')}
              <br />
              <span className="text-gradient">{t('landing.hero_title_highlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up-2 mb-8 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
              {t('landing.hero_subtitle')}
            </p>

            {/* CTAs */}
            <div className="animate-fade-up-2 flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-green-600 px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-green-500/25 transition-all duration-200 hover:bg-green-700 hover:shadow-green-500/40 hover:-translate-y-0.5 active:scale-[0.98] dark:bg-lime-500 dark:text-green-950 dark:hover:bg-lime-400 dark:shadow-lime-500/20"
              >
                {t('landing.enter_dashboard')}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-6 py-3.5 text-[15px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-green-700 dark:hover:text-green-300"
              >
                See how it works
              </a>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up-2 flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <p ref={accRef} className="text-2xl font-black text-green-950 dark:text-white">0%</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{t('landing.stat_accuracy')}</p>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <div>
                <p ref={farmersRef} className="text-2xl font-black text-green-950 dark:text-white">0+</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{t('landing.stat_farmers')}</p>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <div>
                <p ref={mandisRef} className="text-2xl font-black text-green-950 dark:text-white">0</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{t('landing.stat_mandis')}</p>
              </div>
            </div>
          </div>

          {/* ── Right: Dashboard Mockup ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[400px] lg:max-w-[440px]">
              <MockupCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
