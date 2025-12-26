const express = require("express");
const cors = require("cors");
const path = require("path");
const { unless } = require("express-unless");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes
const routes = require("./routes");

// Middlewares
const requestLogger = require("./middlewares/requestLogger");
const { authenticate } = require("./middlewares/auth.middleware");
const readOnly = require("./middlewares/readOnly");
const { authenticateRoutes } = require("./config/unlessRoutes");

// Error handling
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");

// Scheduler
require("./scheduler");

const app = express();
// ==================== Middleware Setup ====================
// Body parser
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));

// CORS
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Request logger
app.use(requestLogger);

// ==================== Public Routes (No Auth Required) ====================
// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ==================== Authentication Middleware ====================
// Apply authentication to all routes except those in authenticateRoutes
authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));

// ==================== Protected Routes ====================
// Read-only middleware (if needed)
// app.use(readOnly);

// Direct routes
app.get("/api/investor/overview", (req, res) => {
  res.json({ ok: true });
});

// Route modules
app.use(routes);

// Catch-all route for 404 errors (Express 5 compatible)
app.use((req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);


module.exports = app;
