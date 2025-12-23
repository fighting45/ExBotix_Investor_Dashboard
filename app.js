const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const auth = require("./middleware/auth");
const readOnly = require("./middleware/readOnly");

app.use(express.json());

// Swagger documentation routes (before auth middleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(auth);
app.use(readOnly);

app.get("/api/investor/overview", (req, res) => {
  res.json({ ok: true });
});
// app.get("/api/webhook", (req, res) => {
//   res;
// });

// Price service test endpoints (for development/testing)
app.get("/api/prices/health", async (req, res) => {
  try {
    const health = await priceService.getHealthStatus();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/prices/all", async (req, res) => {
  try {
    const prices = await priceService.getAllPrices();
    const lastUpdate = await priceService.getLastUpdateTime();
    res.json({
      prices,
      lastUpdate,
      count: Object.keys(prices).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/prices/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await priceService.getPrice(symbol.toUpperCase());
    res.json({
      symbol: symbol.toUpperCase(),
      price,
      quoteCurrency: "USDT",
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.use(routes);

module.exports = app;
