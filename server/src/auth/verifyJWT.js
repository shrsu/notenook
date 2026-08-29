const jwt = require("jsonwebtoken");

const verifyJWT = async (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    throw error;
  }
};

module.exports = { verifyJWT };
