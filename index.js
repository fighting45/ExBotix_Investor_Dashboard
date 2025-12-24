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
  },
});

global.IO = io;

// io.use( async(socket, next) => {
//   const token = socket.handshake.headers?.token;

//   if (!token) {
//     return next(new Error("No auth token given"));
//   }

//   try {
//     const result = await verifyJWTToken(token);

//     if (result.err) {
//       return next(new Error("Invalid token"));
//     } else {
//       socket.user = result.decoded;
//       const familyUsers = await familyUser.findAll({
//         attributes:['familyId'],
//         where: {
//           userId: socket.user?.id,
//         },
//         raw: true
//       });
//       socket.user.familyUsers = familyUsers;
//       next();
//     }
//   } catch (error) {
//     console.log("Auth error : ",error)
//     next(new Error("Authentication error"));
//   }
// });

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

    socketServer.listen(socketPort, () => {
      console.log(`Socket Server is listening on port ${socketPort}`);
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
