const { redisClient } = require("../config/redisConfig");

async function setSocketUserId(userId, socketId) {
  try {
    await redisClient.set(userId, socketId);
  } catch (error) {
    console.error("Error setting Redis key:", error);
    throw new Error("Failed to set Redis key");
  }
}

async function deleteSocketUserId(userId) {
  try {
    await redisClient.del(userId);
  } catch (error) {
    console.error("Error deleting Redis key:", error);
    throw new Error("Failed to delete Redis key");
  }
}

async function getUserSocketId(userId) {
  try {
    const socketId = await redisClient.get(userId);
    return socketId;
  } catch (err) {
    console.error("Error retrieving socket ID from Redis:", err);
    throw new Error("Failed to retrieve socket ID from Redis");
  }
}

module.exports = { setSocketUserId, getUserSocketId, deleteSocketUserId };
