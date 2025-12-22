const axios = require("axios");
const { redisClient } = require("../../redis");

const COINGECKO_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XMR: "monero",
  KAS: "kaspa",
  TAO: "bittensor",
  XRP: "ripple",
  PEPE: "pepe",
  DOGE: "dogecoin",
  ADA: "cardano",
  LINK: "chainlink",
  DOT: "polkadot",
  AVAX: "avalanche-2",
  ENT: "eternity",
  RIO: "realio-network",
};

class PriceService {
  constructor() {
    this.updateInterval = null;
    this.isUpdating = false;
  }

  //Start background price updates
  //Update interval in milliseconds (default: 30000ms = 30s)

  startPriceUpdates(intervalMs = 30000) {
    console.log(`Starting price update service (interval: ${intervalMs}ms)`);

    // Initial fetch
    this.updatePrices();

    // Set up periodic updates
    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, intervalMs);
  }

  //Fetch prices from CoinGecko and store in Redis

  async updatePrices() {
    if (this.isUpdating) {
      console.log("Price update already in progress, skipping...");
      return;
    }

    this.isUpdating = true;

    try {
      const coinIds = Object.values(COINGECKO_IDS).join(",");
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`;

      console.log("Fetching prices from CoinGecko...");
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.data) {
        throw new Error("Empty response from CoinGecko");
      }

      // Store each price in Redis with 2-minute expiry
      let updatedCount = 0;
      for (const [symbol, coinId] of Object.entries(COINGECKO_IDS)) {
        const priceData = response.data[coinId];
        if (priceData && priceData.usd) {
          const price = priceData.usd;
          await redisClient.setex(
            `price:${symbol}:USDT`,
            120,
            price.toString()
          );
          updatedCount++;
        } else {
          console.warn(`No price data found for ${symbol} (${coinId})`);
        }
      }

      console.log(
        `Successfully updated ${updatedCount}/${
          Object.keys(COINGECKO_IDS).length
        } prices`
      );

      // Store last update timestamp
      await redisClient.set("price:last_update", new Date().toISOString());
    } catch (error) {
      if (error.response) {
        console.error(
          `CoinGecko API error: ${error.response.status} - ${error.response.statusText}`
        );
        if (error.response.status === 429) {
          console.error(
            "Rate limit exceeded. Consider increasing update interval."
          );
        }
      } else if (error.request) {
        console.error(
          "No response from CoinGecko API. Network issue or timeout."
        );
      } else {
        console.error("Error setting up price request:", error.message);
      }
    } finally {
      this.isUpdating = false;
    }
  }

  // Get price for a specific symbol

  async getPrice(symbol, quoteCurrency = "USDT") {
    try {
      const cacheKey = `price:${symbol}:${quoteCurrency}`;
      const cachedPrice = await redisClient.get(cacheKey);

      if (!cachedPrice) {
        throw new Error(
          `Price not available for ${symbol}/${quoteCurrency}. Price service may not be initialized yet.`
        );
      }

      return parseFloat(cachedPrice);
    } catch (error) {
      console.error(
        `Error getting price for ${symbol}/${quoteCurrency}:`,
        error.message
      );
      throw error;
    }
  }

  //Get all available prices

  async getAllPrices(quoteCurrency = "USDT") {
    const prices = {};

    for (const symbol of Object.keys(COINGECKO_IDS)) {
      try {
        prices[symbol] = await this.getPrice(symbol, quoteCurrency);
      } catch (error) {
        // Skip symbols that don't have prices yet
        console.warn(`Skipping ${symbol}: ${error.message}`);
      }
    }

    return prices;
  }

  //Get price with spread simulation (for realistic trading simulation)

  async getPriceWithSpread(symbol, quoteCurrency = "USDT") {
    const basePrice = await this.getPrice(symbol, quoteCurrency);

    // Random spread between 0.1% and 0.3%
    const spreadPercent = 0.001 + Math.random() * 0.002;
    const spread = basePrice * spreadPercent;

    // Randomly add or subtract spread
    const adjustment = Math.random() > 0.5 ? spread : -spread;

    return basePrice + adjustment;
  }

  //Get last update timestamp

  async getLastUpdateTime() {
    try {
      return await redisClient.get("price:last_update");
    } catch (error) {
      console.error("Error getting last update time:", error);
      return null;
    }
  }

  //Check if price service is healthy

  async getHealthStatus() {
    try {
      const lastUpdate = await this.getLastUpdateTime();
      const prices = await this.getAllPrices();
      const priceCount = Object.keys(prices).length;
      const totalCoins = Object.keys(COINGECKO_IDS).length;

      return {
        status: priceCount > 0 ? "healthy" : "unhealthy",
        lastUpdate,
        availablePrices: priceCount,
        totalCoins,
        coverage: `${((priceCount / totalCoins) * 100).toFixed(1)}%`,
      };
    } catch (error) {
      return {
        status: "error",
        error: error.message,
      };
    }
  }

  // Stop price updates

  stopPriceUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log("Price update service stopped");
    }
  }

  //Get supported symbols

  getSupportedSymbols() {
    return Object.keys(COINGECKO_IDS);
  }

  //Check if a symbol is supported

  isSymbolSupported(symbol) {
    return COINGECKO_IDS.hasOwnProperty(symbol);
  }
}

module.exports = new PriceService();
