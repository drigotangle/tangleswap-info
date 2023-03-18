const poolService = require('../services/pool.service')
const tokenService = require('../services/token.service')
const { poolCache, tokenCache, swapTxCache, liquidityTxCache, tvlCache, feeCache, usdPriceCache } = require('../cache/cache')
const { getLiquidityTx, getSwapTx, getTvl, getFees, usdPrice } = require('../services/general.service')


const poolController = async (req, res) => {
  const limit = Number(req.params.limit)
    try {
      const data = await poolService(limit);
      poolCache.set("pool-list", data);
      res.send(data);
      res.status(200);
    } catch (err) {
      res.status(500);
      console.log(err);
      throw err;
    }
  }

  const tokenController = async (req, res) => {
    try {
      const data = await tokenService()
      tokenCache.set("token-list", data);
      res.send(data);
      res.status(200);
    } catch (err) {
      res.status(500);
      console.log(err);
      throw err;
    }
  }

  const liquidityTxController = async (req, res) => {
    const limit = Number(req.params.limit)
    try {
      const data = await getLiquidityTx(limit)
      liquidityTxCache.set("liquidityTx-list", data);
      res.send(data);
      res.status(200);
    } catch (err) {
      res.status(500);
      console.log(err);
      throw err;
    }
  }

  const swapTxController = async (req, res) => {
    const limit = Number(req.params.limit)
    try {
      const data = await getSwapTx(limit)
      swapTxCache.set("swapTx-list", data);
      res.send(data);
      res.status(200);
    } catch (err) {
      res.status(500);
      console.log(err);
      throw err;
    }
  }

  const tvlController = async (req, res) => {
    const limit = Number(req.params.limit)
      try {
        const data = await getTvl(limit);
        tvlCache.set("tvl-list", data);
        res.send(data);
        res.status(200);
      } catch (err) {
        res.status(500);
        console.log(err);
        throw err;
      }
    }

    const usdPriceController = async (req, res) => {
        try {
          const data = await usdPrice();
          usdPriceCache.set("usdPrice", data);
          res.send(data);
          res.status(200);
        } catch (err) {
          res.status(500);
          console.log(err);
          throw err;
        }
      }

    const feeControler = async (req, res) => {
      const limit = Number(req.params.limit)
        try {
          const data = await getFees(limit);
          feeCache.set("fee-list", data);
          res.send(data);
          res.status(200);
        } catch (err) {
          res.status(500);
          console.log(err);
          throw err;
        }
      }
  
  module.exports = {
    poolController,
    tokenController,
    liquidityTxController,
    swapTxController,
    tvlController,
    feeControler,
    usdPriceController
  }