const jwt = require("jsonwebtoken");

const authenticateSocketHandshake = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token not provided"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      let errorMessage = "Authentication error";
      if (err.name === "TokenExpiredError") {
        errorMessage = "Authentication error: Token has expired";
      } else if (err.name === "JsonWebTokenError") {
        errorMessage = "Authentication error: Invalid token";
      }
      return next(new Error(errorMessage));
    }

    if (!decoded.userId) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    socket.userId = decoded.userId;
    socket.username = decoded.username;
    next();
  });
};

module.exports = { authenticateSocketHandshake };
