const mockPrices = {
  // ==========================================
  // GRAINS
  // ==========================================
  wheat: {
    current: 2150,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 2050 }, { date: '2026-03-18', price: 2080 },
      { date: '2026-03-19', price: 2100 }, { date: '2026-03-20', price: 2120 },
      { date: '2026-03-21', price: 2130 }, { date: '2026-03-22', price: 2140 },
      { date: '2026-03-23', price: 2150 }, { date: '2026-03-24', price: 2160 },
      { date: '2026-03-25', price: 2170 },
    ],
    forecast: [2180, 2200, 2220, 2250, 2280, 2310, 2340],
    demand: ['HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'HIGH', 'HIGH', 'MEDIUM'],
    volatility: 2.5
  },
  jowar: {
    current: 2400,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 2300 }, { date: '2026-03-18', price: 2320 },
      { date: '2026-03-19', price: 2340 }, { date: '2026-03-20', price: 2360 },
      { date: '2026-03-21', price: 2380 }, { date: '2026-03-22', price: 2390 },
      { date: '2026-03-23', price: 2400 }, { date: '2026-03-24', price: 2410 },
      { date: '2026-03-25', price: 2420 },
    ],
    forecast: [2450, 2480, 2510, 2530, 2550, 2570, 2590],
    demand: ['MEDIUM', 'MEDIUM', 'HIGH', 'HIGH', 'MEDIUM', 'LOW', 'LOW'],
    volatility: 3.2
  },
  rice: {
    current: 3100,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 2950 }, { date: '2026-03-18', price: 2980 },
      { date: '2026-03-19', price: 3000 }, { date: '2026-03-20', price: 3020 },
      { date: '2026-03-21', price: 3050 }, { date: '2026-03-22', price: 3080 },
      { date: '2026-03-23', price: 3090 }, { date: '2026-03-24', price: 3100 },
      { date: '2026-03-25', price: 3100 },
    ],
    forecast: [3120, 3140, 3150, 3180, 3200, 3220, 3250],
    demand: ['HIGH', 'HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'HIGH', 'HIGH'],
    volatility: 1.8
  },

  // ==========================================
  // FIBRES
  // ==========================================
  cotton: {
    current: 5800,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 5500 }, { date: '2026-03-18', price: 5550 },
      { date: '2026-03-19', price: 5620 }, { date: '2026-03-20', price: 5680 },
      { date: '2026-03-21', price: 5720 }, { date: '2026-03-22', price: 5760 },
      { date: '2026-03-23', price: 5800 }, { date: '2026-03-24', price: 5850 },
      { date: '2026-03-25', price: 5900 },
    ],
    forecast: [5950, 6000, 6050, 6100, 6120, 6150, 6200],
    demand: ['LOW', 'LOW', 'MEDIUM', 'HIGH', 'HIGH', 'HIGH', 'MEDIUM'],
    volatility: 4.1
  },
  jute: {
    current: 4200,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 4300 }, { date: '2026-03-18', price: 4280 },
      { date: '2026-03-19', price: 4250 }, { date: '2026-03-20', price: 4220 },
      { date: '2026-03-21', price: 4200 }, { date: '2026-03-22', price: 4180 },
      { date: '2026-03-23', price: 4190 }, { date: '2026-03-24', price: 4200 },
      { date: '2026-03-25', price: 4210 },
    ],
    forecast: [4220, 4250, 4280, 4300, 4350, 4380, 4400],
    demand: ['MEDIUM', 'LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'HIGH', 'HIGH'],
    volatility: 5.5
  },

  // ==========================================
  // PULSES
  // ==========================================
  tur: { // Arhar Dal
    current: 9800,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 9200 }, { date: '2026-03-18', price: 9350 },
      { date: '2026-03-19', price: 9400 }, { date: '2026-03-20', price: 9550 },
      { date: '2026-03-21', price: 9600 }, { date: '2026-03-22', price: 9700 },
      { date: '2026-03-23', price: 9750 }, { date: '2026-03-24', price: 9800 },
      { date: '2026-03-25', price: 9850 },
    ],
    forecast: [9900, 9950, 10050, 10100, 10200, 10250, 10300],
    demand: ['HIGH', 'HIGH', 'HIGH', 'HIGH', 'HIGH', 'HIGH', 'HIGH'],
    volatility: 6.2
  },

  // ==========================================
  // SPICES
  // ==========================================
  redChilli: {
    current: 18500,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2026-03-17', price: 19000 }, { date: '2026-03-18', price: 18900 },
      { date: '2026-03-19', price: 18800 }, { date: '2026-03-20', price: 18750 },
      { date: '2026-03-21', price: 18600 }, { date: '2026-03-22', price: 18550 },
      { date: '2026-03-23', price: 18500 }, { date: '2026-03-24', price: 18450 },
      { date: '2026-03-25', price: 18400 },
    ],
    forecast: [18300, 18200, 18100, 18000, 17900, 18000, 18100],
    demand: ['LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'LOW', 'MEDIUM', 'HIGH'],
    volatility: 8.5 // High volatility for spices
  }
};

module.exports = mockPrices;