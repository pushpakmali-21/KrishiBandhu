const mockPrices = {
  wheat: {
    current: 2150,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2024-03-17', price: 2050 },
      { date: '2024-03-18', price: 2080 },
      { date: '2024-03-19', price: 2100 },
      { date: '2024-03-20', price: 2120 },
      { date: '2024-03-21', price: 2130 },
      { date: '2024-03-22', price: 2140 },
      { date: '2024-03-23', price: 2150 },
      { date: '2024-03-24', price: 2160 },
      { date: '2024-03-25', price: 2170 },
    ],
    forecast: [2180, 2200, 2220, 2250, 2280, 2310, 2340],
    demand: ['HIGH', 'HIGH', 'MEDIUM', 'MEDIUM', 'HIGH', 'HIGH', 'MEDIUM'],
    volatility: 2.5
  },
  jowar: {
    current: 2400,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2024-03-17', price: 2300 },
      { date: '2024-03-18', price: 2320 },
      { date: '2024-03-19', price: 2340 },
      { date: '2024-03-20', price: 2360 },
      { date: '2024-03-21', price: 2380 },
      { date: '2024-03-22', price: 2390 },
      { date: '2024-03-23', price: 2400 },
      { date: '2024-03-24', price: 2410 },
      { date: '2024-03-25', price: 2420 },
    ],
    forecast: [2450, 2480, 2510, 2530, 2550, 2570, 2590],
    demand: ['MEDIUM', 'MEDIUM', 'HIGH', 'HIGH', 'MEDIUM', 'LOW', 'LOW'],
    volatility: 3.2
  },
  cotton: {
    current: 5800,
    get lastUpdate() { return new Date(); },
    history: [
      { date: '2024-03-17', price: 5500 },
      { date: '2024-03-18', price: 5550 },
      { date: '2024-03-19', price: 5620 },
      { date: '2024-03-20', price: 5680 },
      { date: '2024-03-21', price: 5720 },
      { date: '2024-03-22', price: 5760 },
      { date: '2024-03-23', price: 5800 },
      { date: '2024-03-24', price: 5850 },
      { date: '2024-03-25', price: 5900 },
    ],
    forecast: [5950, 6000, 6050, 6100, 6120, 6150, 6200],
    demand: ['LOW', 'LOW', 'MEDIUM', 'HIGH', 'HIGH', 'HIGH', 'MEDIUM'],
    volatility: 4.1
  }
};

module.exports = mockPrices;
