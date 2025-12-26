require("dotenv").config();
const http = require("http");
const app = require("./app");
const { verifyJWTToken } = require("./utils/jwtToken");
const initializeSocket = require("./socket");
const socket = require("socket.io");
const { sequelize } = require("./models");
const priceService = require("./services/tradeGenerator/priceService");
const {
  startLiveTradeEmitter,
  stopLiveTradeEmitter,
} = require("./services/tradeGenerator/liveTradeEmitter");
const socketServer = http.createServer();

const io = socket(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

global.IO = io;

io.use(async (socket, next) => {
  // Try multiple ways to get token
  let token = socket.handshake.auth?.token || 
              socket.handshake.headers?.token ||
              socket.handshake.headers?.authorization ||
              socket.handshake.query?.token;

  console.log("Socket connection attempt:");
  console.log("  - Headers:", JSON.stringify(socket.handshake.headers, null, 2));
  console.log("  - Auth:", JSON.stringify(socket.handshake.auth, null, 2));
  console.log("  - Query:", JSON.stringify(socket.handshake.query, null, 2));
  console.log("  - Extracted token:", token ? `${token.substring(0, 20)}...` : "No token");

  if (!token) {
    console.log("  - Error: No auth token given");
    return next(new Error("No auth token given"));
  }

  // Strip "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const result = await verifyJWTToken(token);

    if (result.err) {
      console.log("  - Error: Invalid token -", result.err);
      return next(new Error("Invalid token"));
    } else {
      socket.user = result.decoded;
      console.log("  - Success: Authenticated user -", socket.user.id);
      next();
    }
  } catch (error) {
    console.log("  - Error: Authentication error -", error.message);
    next(new Error("Authentication error"));
  }
});

initializeSocket(io);

const server = http.Server(app);

const port = process.env.PORT;
const socketPort = process.env.SOCKET_PORT;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");

    // Start price update service
    const updateInterval = process.env.PRICE_UPDATE_INTERVAL || 30000;
    priceService.startPriceUpdates(parseInt(updateInterval));

    // Start live trade emitter
    const tradeInterval = process.env.TRADE_EMIT_INTERVAL || 10000;
    startLiveTradeEmitter(io, parseInt(tradeInterval));

    server.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });

    socketServer.listen(socketPort, "0.0.0.0", () => {
      console.log(`Socket Server is listening on port ${socketPort} (0.0.0.0)`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  // Stop price update service
  priceService.stopPriceUpdates();

  // Stop trade emitter
  stopLiveTradeEmitter();

  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
