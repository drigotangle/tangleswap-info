const Cache = require("node-cache");
const poolCache = new Cache({ stdTTL: 60 * 30 });
const tokenCache = new Cache({ stdTTL: 60 * 30 });
const liquidityTxCache = new Cache({ stdTTL: 60 * 5 });
const swapTxCache = new Cache({ stdTTL: 60 * 5 });
const tvlCache = new Cache({ stdTTL: 60 * 5 });
const feeCache = new Cache({ stdTTL: 60 * 5 });


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

  const liquidityTxCachedMiddleware = (req, res, next) => {
    try {
      if (swapTxCache.has("liquidityTx-list")) {
        return res.send(liquidityTxCache.get("liquidityTx-list")).status(200);
      }
      return next();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const tvlCachedMiddleware = (req, res, next) => {
    try {
      if (tvlCache.has("tvl-list")) {
        return res.send(tvlCache.get("tvl-list")).status(200);
      }
      return next();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const swapTxCachedMiddleware = (req, res, next) => {
    try {
      if (liquidityTxCache.has("swapTx-list")) {
        return res.send(swapTxCache.get("swapTx-list")).status(200);
      }
      return next();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const feeCachedMiddleware = (req, res, next) => {
    try {
      if (feeCache.has("fee-list")) {
        return res.send(feeCache.get("fee-list")).status(200);
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
    tokenCache,
    liquidityTxCache,
    swapTxCache,
    tvlCache,
    feeCache,
    liquidityTxCachedMiddleware,
    swapTxCachedMiddleware,
    tvlCachedMiddleware,
    feeCachedMiddleware
};