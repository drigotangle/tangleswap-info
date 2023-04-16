const { queryPools, _tokenSymbol, timeOut, tokenBalance} = require('../functions/functions')
const dayjs = require('dayjs')


const poolService = async (limit) => {
    try {
        const result = await queryPools(limit)
        let arr = []
        const dataSet = new Set()
    
        for (const data of result) {
            if(!dataSet.has(data)){
                await Promise.all([
                    tokenBalance(data.token0, data.pool, data.decimals0), 
                    tokenBalance(data.token1, data.pool, data.decimals1), 
                ]).then(([balance0, balance1]) => {
                    const tvl = data.liquidity[data.liquidity.length - 1].liquidity
                    const fee = data.fee
                    const volume24H = () => {
                        let volume;
                        for (let i = 0; i < data.liquidity.length; i++) {
                            if(dayjs(data.liquidity[i].time).format('DD') !== dayjs(data.liquidity[data.liquidity.length - 1].liquidity).format('DD')){
                                volume = Number(data.liquidity[data.liquidity.length - 1].liquidity) - Number(data.liquidity[i].liquidity)
                                break
                            }
                        }
                        return volume
                    }

                    const volume7D = () => {
                        let volume;
                        for (let i = 0; i < data.liquidity.length; i++) {
                            if(dayjs(data.liquidity[data.liquidity.length - 1].liquidity - dayjs(data.liquidity[i].time).format('DD')).format('DD') === 7){
                                volume = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                                break
                            }
                            else
                            {
                                volume = volume24H()
                            }
                        }
                        return volume
                    }
                    dataSet.add(data)
                    arr.push({
                        symbol0: data.symbol0,
                        symbol1: data.symbol1,
                        token0: data.token0,
                        token1: data.token1,
                        balance0: Number(balance0),
                        balance1: Number(balance1),
                        pool: data.pool,
                        tvl: tvl,
                        price: data.price,
                        liquidity: data.liquidity,
                        volume24H: volume24H(),
                        volume7D: volume7D(),
                        fee: fee
                    })
                })
            }
        }
        return arr
    } catch (error) {
        console.log(error, 'for pool service')
    }
}


module.exports = poolService