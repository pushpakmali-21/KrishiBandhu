'use client';

import { useEffect, useRef } from 'react';
import { ScanLine, BrainCircuit, IndianRupee, Mic } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: ScanLine,
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-500 dark:text-green-400',
    numColor: 'text-green-600 dark:text-green-500',
    title: 'Select Your Crop',
    desc: 'Choose from wheat, cotton, jowar, tur, and more. Set your quantity, quality, and distance to mandi.',
  },
  {
    num: '02',
    icon: BrainCircuit,
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-500 dark:text-blue-400',
    numColor: 'text-blue-600 dark:text-blue-500',
    title: 'AI Analyses the Market',
    desc: 'Our model processes 340+ mandi prices, weather data, and demand signals to forecast the next 7 days.',
  },
  {
    num: '03',
    icon: Mic,
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-500 dark:text-purple-400',
    numColor: 'text-purple-600 dark:text-purple-500',
    title: 'Ask in Your Language',
    desc: 'Use voice or text in Hindi, Marathi, or English. Get the recommendation read aloud to you instantly.',
  },
  {
    num: '04',
    icon: IndianRupee,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-500 dark:text-amber-400',
    numColor: 'text-amber-600 dark:text-amber-500',
    title: 'Sell at the Right Price',
    desc: 'Know whether to hold or sell today. Connect directly with verified buyers at premium rates.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative bg-gradient-to-b from-gray-50 to-white px-5 py-20 dark:from-gray-900 dark:to-gray-950 sm:px-8 sm:py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-green-300/40 to-transparent dark:via-green-700/30" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div ref={sectionRef} className="section-fade mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-green-700 dark:bg-green-900/50 dark:text-lime-300">
            How it works
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            From field to profit — in 4 steps
          </h2>
          <p className="mx-auto max-w-lg text-base text-gray-500 dark:text-gray-400">
            No complex setup. Open the app, tell us your crop, and get a clear decision in seconds.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}
                className="section-fade group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:shadow-black/30"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Step number */}
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${step.numColor} mb-4 block`}>
                  Step {step.num}
                </span>

                {/* Connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute top-10 right-0 hidden h-px w-6 translate-x-6 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 lg:block" />
                )}

                {/* Icon */}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${step.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${step.iconColor}`} strokeWidth={1.75} />
                </div>

                {/* Text */}
                <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
