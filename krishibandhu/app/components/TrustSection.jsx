'use client';

import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ramesh Patil',
    role: 'Wheat Farmer, Nashik',
    avatar: 'RP',
    avatarBg: 'bg-green-600',
    text: 'KrishiBandhu told me to wait 3 days before selling my wheat. I did, and got ₹180 more per quintal. Best decision of this season.',
    stars: 5,
    crop: '🌾 Wheat',
  },
  {
    name: 'Sunita Deshmukh',
    role: 'Cotton Grower, Aurangabad',
    avatar: 'SD',
    avatarBg: 'bg-blue-600',
    text: 'The voice assistant in Marathi is a game changer for me. I just say "कापूस किंमत" and it gives me the latest rate and buyer list.',
    stars: 5,
    crop: '🌿 Cotton',
  },
  {
    name: 'Jagdish Kumar',
    role: 'Sugarcane Farmer, Kolhapur',
    avatar: 'JK',
    avatarBg: 'bg-amber-600',
    text: 'Connected with Kisan Tradelink through the marketplace. They gave me ₹50 extra and picked up from my farm. No middleman loss.',
    stars: 5,
    crop: '🌱 Sugarcane',
  },
  {
    name: 'Priya Gaikwad',
    role: 'Onion Farmer, Lasalgaon',
    avatar: 'PG',
    avatarBg: 'bg-purple-600',
    text: 'The AI forecast was 87% accurate this month. I sold at the peak price 4 out of 5 times. My income went up by almost 30%.',
    stars: 5,
    crop: '🧅 Onion',
  },
];

const TRUST_STATS = [
  { value: '50,000+', label: 'Active Farmers', emoji: '👨‍🌾' },
  { value: '₹12 Cr+', label: 'Profit Generated', emoji: '💰' },
  { value: '340+', label: 'Mandis Tracked', emoji: '🏪' },
  { value: '85%', label: 'Forecast Accuracy', emoji: '🎯' },
];

export default function TrustSection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="trust" className="bg-white px-5 py-20 dark:bg-gray-950 sm:px-8 sm:py-24">
      {/* Stats bar */}
      <div ref={sectionRef} className="section-fade mx-auto mb-16 max-w-5xl">
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50/50 p-6 dark:border-green-900/40 dark:from-green-950/50 dark:to-gray-900/50 sm:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <p className="text-2xl font-black text-green-800 dark:text-green-300 sm:text-3xl">{s.value}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          Farmer Stories
        </span>
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Trusted by farmers across India
        </h2>
        <p className="mx-auto max-w-lg text-base text-gray-500 dark:text-gray-400">
          Real results from farmers who switched from guessing to knowing.
        </p>
      </div>

      {/* Testimonials grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="section-fade group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:shadow-black/30"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 h-6 w-6 text-gray-100 dark:text-gray-800" />

            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array(t.stars).fill(0).map((_, si) => (
                <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Crop badge */}
            <span className="mb-3 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {t.crop}
            </span>

            {/* Quote text */}
            <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.avatarBg} text-xs font-black text-white`}>
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
