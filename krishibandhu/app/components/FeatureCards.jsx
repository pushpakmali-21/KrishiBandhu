'use client';

import { BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function FeatureCards() {
  const { t } = useTranslation();
  const cardRefs = useRef([]);

  const FEATURES = [
    {
      icon: BarChart3,
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
      title: t('landing.feature_price_title'),
      desc: t('landing.feature_price_desc'),
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
      title: t('landing.feature_rec_title'),
      desc: t('landing.feature_rec_desc'),
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-lime-300',
      title: t('landing.feature_trust_title'),
      desc: t('landing.feature_trust_desc'),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setTimeout(() => {
              entry.target.classList.remove('opacity-0', 'translate-y-5');
            }, idx * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white px-5 py-16 dark:bg-gray-950 sm:px-8">
      <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900 dark:text-white">
        {t('landing.sell_smarter_title')}
      </h2>
      <p className="mx-auto mb-10 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
        {t('landing.sell_smarter_subtitle')}
      </p>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              data-idx={i}
              className="translate-y-5 rounded-lg border border-gray-100 bg-white p-6 opacity-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-950/5 dark:border-gray-800 dark:bg-gray-900/80 dark:hover:shadow-black/30"
            >
              <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${feature.iconBg}`}>
                <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
