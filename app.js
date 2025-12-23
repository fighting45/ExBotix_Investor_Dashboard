const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const { unless } = require("express-unless");
const auth = require("./middlewares/auth.js");
const readOnly = require("./middlewares/readOnly.js");
const { authenticateRoutes } = require("./config/unlessRoutes");
const { authenticate } = require("./middlewares/auth.middleware");
const requestLogger = require('./middlewares/requestLogger.js')
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const os = require('os')
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Swagger documentation routes (before auth middleware)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use(requestLogger)

app.use(auth);
app.use(readOnly);

authenticate.unless = unless;
app.use(authenticate.unless(authenticateRoutes));

app.get("/api/investor/overview", (req, res) => {
  res.json({ ok: true });
});

require('./scheduler')

app.use(routes);

// app.all("*", (req, res, next) => {
//   const err = new CustomError(
//     `Can't find ${req.originalUrl} on the server!`,
//     404
//   );
//   next(err);
// });

app.use(globalErrorHandler);


module.exports = app;
