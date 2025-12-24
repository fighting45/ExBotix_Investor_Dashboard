const { generateFakeTrade } = require('./fakeTradeGenerator');

let emitInterval = null;

/**
 * Start emitting fake trades to frontend via Socket.IO
 * @param {Object} io - Socket.IO instance
 * @param {number} intervalMs - Interval in milliseconds (from .env)
 */
function startLiveTradeEmitter(io, intervalMs = 10000) {
  console.log(`Starting live trade emitter (interval: ${intervalMs}ms)`);

  // Emit immediately on start
  emitTrade(io);

  // Set up periodic emission
  emitInterval = setInterval(() => {
    emitTrade(io);
  }, intervalMs);
}

/**
 * Emit a single fake trade
 */
async function emitTrade(io) {
  try {
    const trade = await generateFakeTrade();

    if (trade) {
      // Emit to all connected clients
      io.emit('new-trade', trade);

      console.log(`📊 Emitted trade: ${trade.botName} - ${trade.tradingPair} - $${trade.profit}`);
    }
  } catch (error) {
    console.error('Error emitting trade:', error.message);
  }
}

/**
 * Stop emitting trades
 */
function stopLiveTradeEmitter() {
  if (emitInterval) {
    clearInterval(emitInterval);
    emitInterval = null;
    console.log('Live trade emitter stopped');
  }
}

module.exports = {
  startLiveTradeEmitter,
  stopLiveTradeEmitter
};
