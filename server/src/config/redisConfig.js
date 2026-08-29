const redis = require("redis");

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to redis cloud");
});

redisClient.connect().catch(console.error);

module.exports = { redisClient };
