const poolService = require('./pool.service')
const tokenService = require('./token.service')
const { poolCache, tokenCache } = require('./cache')

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
  
  module.exports = {
    poolController,
    tokenController
  }