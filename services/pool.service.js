const { queryPools, getDaysDifference, tokenBalance } = require('../functions/functions')
const dayjs = require('dayjs')


const poolService = async (limit) => {
    try {
        const pools = await queryPools(limit)
        let arr = []
        const poolSet = new Set()

        for (const pool of pools) {
            if (!poolSet.has(pool)) {
                const liquidityArr = pool.liquidity
                const [balance0, balance1] = await Promise.all([tokenBalance(pool.token0, pool.pool, pool.decimals0), tokenBalance(pool.token1, pool.pool, pool.decimals1)])
                const tvl = liquidityArr[liquidityArr.length - 1].liquidity
                const fee = pool.fee
                const volume24H = () => {
                    let volume = 0;
                    for (let i = 0; i < liquidityArr.length; i++) {
                        volume += Number(liquidityArr[i].liquidity)
                        if (getDaysDifference(liquidityArr[liquidityArr.length - 1].liquidity, liquidityArr[i].time) === 1) {
                            break
                        }
                    }
                    return volume
                }

                const volume7D = () => {
                    let volume = 0;
                    for (let i = 0; i < liquidityArr.length; i++) {
                        volume += Number(liquidityArr[i].liquidity)
                        if (getDaysDifference(liquidityArr[liquidityArr.length - 1].liquidity, liquidityArr[i].time) === 7) {
                            break
                        }
                    }
                    return volume
                }

                poolSet.add(pool)
                arr.push({
                    symbol0: pool.symbol0,
                    symbol1: pool.symbol1,
                    token0: pool.token0,
                    token1: pool.token1,
                    balance0: Number(balance0),
                    balance1: Number(balance1),
                    pool: pool.pool,
                    tvl: tvl,
                    price: pool.price,
                    liquidity: liquidityArr,
                    volume24H: volume24H(),
                    volume7D: volume7D(),
                    fee: fee
                })
            }
        }
return arr
    } catch (error) {
    console.log(error, 'for pool service')
}
}


module.exports = poolService