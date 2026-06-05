'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Zap, IndianRupee, BarChart3 } from 'lucide-react';

const DEFAULT_INSIGHTS = [
  { crop: 'Wheat', emoji: '🌾', price: 2450, change: +3.2, rec: 'SELL NOW', conf: 82, up: true, peak: 2680, color: 'green' },
  { crop: 'Cotton', emoji: '🌿', price: 6800, change: +1.8, rec: 'HOLD', conf: 74, up: true, peak: 7150, color: 'blue' },
  { crop: 'Jowar', emoji: '🌽', price: 3100, change: -0.6, rec: 'WAIT', conf: 68, up: false, peak: 3380, color: 'amber' },
  { crop: 'Tur Dal', emoji: '🫘', price: 8400, change: +2.1, rec: 'SELL NOW', conf: 79, up: true, peak: 8750, color: 'green' },
];

const BAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BAR_VALS = [62, 78, 55, 88, 72, 95, 81];

const colorMap = {
  green: { badge: 'bg-green-500/15 text-green-400', bar: 'bg-green-500' },
  blue:  { badge: 'bg-blue-500/15 text-blue-400',  bar: 'bg-blue-500' },
  amber: { badge: 'bg-amber-500/15 text-amber-400', bar: 'bg-amber-500' },
};

export default function LiveInsights() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [insightsData, setInsightsData] = useState(DEFAULT_INSIGHTS);
  const insight = insightsData[active] || DEFAULT_INSIGHTS[0];
  const c = colorMap[insight?.color || 'blue'] || colorMap.blue;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
        const res = await fetch(`${API_BASE}/insights`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        if (data && data.length > 0) {
          setInsightsData(data);
        }
      } catch (err) {
        console.error('Failed to load live insights:', err);
      }
    };
    fetchInsights();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle crops
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % insightsData.length), 3000);
    return () => clearInterval(id);
  }, [insightsData.length]);

  return (
    <section id="live-insights" className="relative bg-gray-950 px-5 py-20 sm:px-8 sm:py-24 overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Glow orbs */}
      <div className="hero-orb w-[400px] h-[400px] top-[-80px] left-[-80px] opacity-10"
           style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }} />
      <div className="hero-orb w-[300px] h-[300px] bottom-[-60px] right-[-60px] opacity-8"
           style={{ background: 'radial-gradient(circle, #a3e635, transparent 70%)' }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div ref={sectionRef} className="section-fade mb-14 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Live AI Insights
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Real predictions, real profits
          </h2>
          <p className="mx-auto max-w-lg text-base text-gray-400">
            Watch our AI model score each crop in real-time. No guesswork — just clear buy/sell signals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: crop selector */}
          <div className="lg:col-span-2 space-y-3">
            {insightsData.map((ins, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                  active === i
                    ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10'
                    : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ins.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{ins.crop}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {ins.price.toLocaleString('en-IN')}/q
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${ins.up ? 'text-green-400' : 'text-red-400'}`}>
                    {ins.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {ins.change > 0 ? '+' : ''}{ins.change}%
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3 mockup-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{insight.emoji}</span>
                <div>
                  <h3 className="text-lg font-black text-white">{insight.crop}</h3>
                  <p className="text-xs text-gray-500">Nashik Mandi · Updated 2 min ago</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${c.badge}`}>
                <Zap className="h-3 w-3" />
                {insight.rec}
              </span>
            </div>

            {/* Price display */}
            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-black text-white flex items-center gap-1">
                <IndianRupee className="h-7 w-7 text-green-400" />
                {insight.price.toLocaleString('en-IN')}
              </span>
              <span className={`flex items-center gap-1 text-sm font-bold mb-1 ${insight.up ? 'text-green-400' : 'text-red-400'}`}>
                {insight.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {insight.change > 0 ? '+' : ''}{insight.change}%
              </span>
              <span className="text-xs text-gray-500 mb-1">/ quintal</span>
            </div>

            {/* 7-day demand heatmap bars */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">7-Day Demand Forecast</span>
              </div>
              <div className="flex items-end gap-2 h-16">
                {BAR_VALS.map((v, i) => (
                  <div key={i} className="flex flex-col flex-1 items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${c.bar} opacity-80`}
                      style={{ height: `${v}%`, transitionDelay: `${i * 60}ms` }}
                    />
                    <span className="text-[9px] text-gray-600">{BAR_DAYS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence meter */}
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">AI Confidence Score</span>
                <span className="text-sm font-black text-white">{insight.conf}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full insight-bar transition-all duration-700`}
                  style={{ width: `${insight.conf}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-600">Expected peak: ₹{insight.peak.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-green-500 font-bold">Next 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
