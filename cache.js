const Cache = require("node-cache");
const poolCache = new Cache({ stdTTL: 60 * 30 });
const tokenCache = new Cache({ stdTTL: 60 * 30 });

const poolCachedMiddleware = (req, res, next) => {
  try {
    if (poolCache.has("pool-list")) {
      return res.send(poolCache.get("pool-list")).status(200);
    }
    return next();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const tokenCachedMiddleware = (req, res, next) => {
    try {
      if (poolCache.has("token-list")) {
        return res.send(poolCache.get("token-list")).status(200);
      }
      return next();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

module.exports = {
    poolCachedMiddleware,
    tokenCachedMiddleware,
    poolCache,
    tokenCache
};