const Redis = require("ioredis");
const redisClient = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT,password : process.env.REDIS_PASSWORD});
const pubClient = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT,password : process.env.REDIS_PASSWORD});
const subClient = pubClient.duplicate();

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Redis Connected..."));

module.exports = { redisClient, pubClient, subClient };
