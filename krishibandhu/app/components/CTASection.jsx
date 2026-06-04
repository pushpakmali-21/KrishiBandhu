'use client';

import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-5 py-20 dark:from-green-900 dark:via-green-950 dark:to-gray-950 sm:px-8 sm:py-24">
      {/* Decorative orbs */}
      <div className="hero-orb w-[600px] h-[600px] top-[-150px] right-[-150px] opacity-20"
           style={{ background: 'radial-gradient(circle, #a3e635, transparent 70%)' }} />
      <div className="hero-orb w-[400px] h-[400px] bottom-[-100px] left-[-100px] opacity-15"
           style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06]"
           style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
          <Leaf className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
        <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Start earning more from your harvest
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-green-100/80">
          Join 50,000+ farmers who use KrishiBandhu to make smarter sell decisions — every single day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-green-700 shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-2xl active:scale-[0.98]"
          >
            Enter Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50"
          >
            Login / Register
          </Link>
        </div>

        {/* Trust note */}
        <p className="mt-8 text-sm text-green-200/60">
          Free to use · No app download needed · Works in Hindi, Marathi & English
        </p>
      </div>
    </section>
  );
}
