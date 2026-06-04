'use client';

import { BarChart3, ShieldCheck, Zap, Mic, Globe2, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const FEATURE_DATA = [
  {
    icon: BarChart3,
    gradient: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'hover:border-blue-400/40',
    glow: 'hover:shadow-blue-500/10',
    titleKey: 'landing.feature_price_title',
    descKey: 'landing.feature_price_desc',
    badge: 'Real-time',
    badgeColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
  },
  {
    icon: Zap,
    gradient: 'from-amber-500/20 to-amber-600/5',
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'hover:border-amber-400/40',
    glow: 'hover:shadow-amber-500/10',
    titleKey: 'landing.feature_rec_title',
    descKey: 'landing.feature_rec_desc',
    badge: 'AI-Powered',
    badgeColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    icon: ShieldCheck,
    gradient: 'from-green-500/20 to-green-600/5',
    iconColor: 'text-green-500 dark:text-green-400',
    iconBg: 'bg-green-500/10 dark:bg-green-500/15',
    border: 'hover:border-green-400/40',
    glow: 'hover:shadow-green-500/10',
    titleKey: 'landing.feature_trust_title',
    descKey: 'landing.feature_trust_desc',
    badge: 'Verified',
    badgeColor: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-lime-300',
  },
  {
    icon: Mic,
    gradient: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    border: 'hover:border-purple-400/40',
    glow: 'hover:shadow-purple-500/10',
    titleKey: 'landing.feature_voice_title',
    descKey: 'landing.feature_voice_desc',
    badge: 'Multilingual',
    badgeColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
  },
  {
    icon: Globe2,
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    border: 'hover:border-cyan-400/40',
    glow: 'hover:shadow-cyan-500/10',
    titleKey: 'landing.feature_mandi_title',
    descKey: 'landing.feature_mandi_desc',
    badge: 'Live Data',
    badgeColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300',
  },
  {
    icon: TrendingUp,
    gradient: 'from-rose-500/20 to-rose-600/5',
    iconColor: 'text-rose-500 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    border: 'hover:border-rose-400/40',
    glow: 'hover:shadow-rose-500/10',
    titleKey: 'landing.feature_forecast_title',
    descKey: 'landing.feature_forecast_desc',
    badge: '7-Day',
    badgeColor: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300',
  },
];

const FALLBACKS = {
  'landing.feature_voice_title': 'Voice Assistant',
  'landing.feature_voice_desc': 'Ask questions in Hindi, Marathi, or English. Get instant crop price insights with your voice.',
  'landing.feature_mandi_title': 'Live Mandi Network',
  'landing.feature_mandi_desc': 'Connected to 340+ mandis across Maharashtra and beyond. Real rates, zero delay.',
  'landing.feature_forecast_title': '7-Day Price Forecast',
  'landing.feature_forecast_desc': 'AI-powered 7-day demand heatmap helps you decide the best day to sell your produce.',
};

export default function FeatureCards() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="bg-white px-5 py-20 dark:bg-gray-950 sm:px-8 sm:py-24">
      {/* Section header */}
      <div ref={sectionRef} className="section-fade mx-auto mb-14 max-w-2xl text-center">
        <span className="mb-3 inline-block rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-green-700 dark:bg-green-900/50 dark:text-lime-300">
          Everything you need
        </span>
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {t('landing.sell_smarter_title')}
        </h2>
        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          {t('landing.sell_smarter_subtitle')}
        </p>
      </div>

      {/* Card grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_DATA.map((feature, i) => {
          const Icon = feature.icon;
          const title = t(feature.titleKey) !== feature.titleKey
            ? t(feature.titleKey)
            : FALLBACKS[feature.titleKey] || feature.titleKey;
          const desc = t(feature.descKey) !== feature.descKey
            ? t(feature.descKey)
            : FALLBACKS[feature.descKey] || feature.descKey;

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={`section-fade card-glow group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60 ${feature.border} ${feature.glow} hover:shadow-xl`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-2xl">
                <div className="animate-shimmer absolute inset-0" />
              </div>

              <div className="relative z-10">
                {/* Badge */}
                <span className={`mb-4 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${feature.badgeColor}`}>
                  {feature.badge}
                </span>

                {/* Icon */}
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={2} />
                </div>

                {/* Text */}
                <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
