const priceService = require("./priceService");

// Bot names pool
const BOT_NAMES = [
  "ARB-ALPHA-01",
  "ARB-ALPHA-02",
  "ARB-BETA-01",
  "TREND-V4",
  "TREND-V5",
  "MARKET-S2",
  "MARKET-S3",
  "SAFE-GRID-1",
  "SAFE-GRID-2",
  "SAFE-HEDGE-1",
];

// Statuses
const STATUSES = [
  "SCANNING_SPREAD",
  "HOLDING_LONG",
  "HEDGE_ACTIVE",
  "PROVIDING_BID",
];

// Trading pairs (from priceService.COINGECKO_IDS)
const TRADING_PAIRS = [
  "BTC",
  "ETH",
  "SOL",
  "XMR",
  "KAS",
  "TAO",
  "XRP",
  "PEPE",
  "DOGE",
  "ADA",
  "LINK",
  "DOT",
  "AVAX",
];

/**
 * Helper: Random element from array
 */
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Helper: Random number between min and max
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a single fake trade
 */
async function generateFakeTrade() {
  try {
    // Random crypto selection
    const coinSymbol = randomElement(TRADING_PAIRS);
    const quoteCurrency = "USDT";
    const tradingPair = `${coinSymbol}/${quoteCurrency}`;

    // Get price with spread from priceService
    const exchangeRate = await priceService.getPriceWithSpread(coinSymbol);

    // Random trade amount between $10,000 - $100,000
    const amount = randomBetween(10000, 100000);

    // Strategy is always Arbitrage
    const strategy = "Arbitrage";

    // Arbitrage profit percentage: 0.5% - 2.5%
    const profitPercent = randomBetween(0.1, 0.5);
    const profit = (amount * profitPercent) / 100;

    // Calculate buy and sell prices for arbitrage
    // Buy price is slightly lower, sell price is slightly higher
    const spreadPercent = profitPercent / 100;
    const buyPrice = exchangeRate * (1 - spreadPercent / 2);
    const sellPrice = exchangeRate * (1 + spreadPercent / 2);

    // Generate trade payload
    const trade = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      botName: randomElement(BOT_NAMES),
      tradingPair: tradingPair,
      coinSymbol: coinSymbol,
      quoteCurrency: quoteCurrency,
      exchangeRate: exchangeRate.toFixed(2),
      buyPrice: buyPrice.toFixed(2),
      sellPrice: sellPrice.toFixed(2),
      profit: profit.toFixed(2),
      amount: amount.toFixed(2),
      strategy: strategy,
      status: randomElement(STATUSES),
      timestamp: new Date().toISOString(),
      isReal: false, // Mark as fake trade
    };

    return trade;
  } catch (error) {
    console.error("Error generating fake trade:", error.message);
    return null;
  }
}

module.exports = {
  generateFakeTrade,
};
