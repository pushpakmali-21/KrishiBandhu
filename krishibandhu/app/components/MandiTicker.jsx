import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';

const CROPS = [
  { name: 'Wheat', price: '2,180/q', change: '+1.2%', up: true },
  { name: 'Rice', price: '3,450/q', change: '+0.8%', up: true },
  { name: 'Soybean', price: '4,720/q', change: '-0.4%', up: false },
  { name: 'Cotton', price: '6,340/q', change: '+2.1%', up: true },
  { name: 'Maize', price: '1,890/q', change: '-0.6%', up: false },
  { name: 'Onion', price: '1,120/q', change: '+3.4%', up: true },
  { name: 'Tomato', price: '890/q', change: '-1.1%', up: false },
  { name: 'Sugarcane', price: '340/q', change: '+0.3%', up: true },
];

const ITEMS = [...CROPS, ...CROPS];

export default function MandiTicker() {
  return (
    <div className="mt-1.5 flex items-center overflow-hidden border-y border-green-200 bg-green-50/80 backdrop-blur-sm sm:mt-2 dark:border-green-900/60 dark:bg-green-950/80">
      <div className="relative z-10 flex shrink-0 items-center justify-center bg-green-600 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[6px_0_12px_-2px_rgba(22,163,74,0.4)] dark:bg-lime-500 dark:text-green-950 dark:shadow-[6px_0_12px_-2px_rgba(132,204,22,0.3)]">
        Live Mandi
      </div>
      <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
        <div className="flex animate-ticker whitespace-nowrap pl-4">
          {ITEMS.map((crop, i) => {
            const TrendIcon = crop.up ? TrendingUp : TrendingDown;

            return (
              <span
                key={`${crop.name}-${i}`}
                className="inline-flex items-center gap-1.5 border-r border-green-200/60 px-6 py-2.5 text-[13px] dark:border-green-900/40"
              >
                <span className="font-semibold text-green-950 dark:text-green-100">{crop.name}</span>
                <span className="inline-flex items-center font-medium text-green-700 dark:text-green-300">
                  <IndianRupee className="h-3 w-3" strokeWidth={2.5} />
                  {crop.price}
                </span>
                <span className={`inline-flex items-center gap-1 font-medium ${crop.up ? 'text-green-600 dark:text-lime-400' : 'text-red-500 dark:text-red-400'}`}>
                  <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {crop.change}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
