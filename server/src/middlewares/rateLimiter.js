const { createRateLimiter } = require("./createRequestLimiter");

const rateLimiter = (options) => {
  const { excludedRoutes, maxRequests, windowSizeInSeconds } = options;
  const rateLimiter = createRateLimiter(maxRequests, windowSizeInSeconds);

  return (req, res, next) => {
    if (excludedRoutes.some((route) => req.path.startsWith(route))) {
      return next();
    } else {
      return rateLimiter(req, res, next);
    }
  };
};

module.exports = { rateLimiter };
