const { queryPools, _tokenName, getDaysDifference } = require('../functions/functions')
const { getSwapTx } = require('./general.service')


const WETH_ADDRESS = process.env.WETH_ADDRESS

const tokenService = async () => {
    try {
        const poolRes = await queryPools(1000)
        const tokenSet = new Set()

        let tokenArr = []
        for (const pool of poolRes) {
            console.log(pool.pool, 'pool')
            if (tokenSet.has(pool.token0)) {
                const swaps = await getSwapTx(500)
                swaps.filter((entry) => entry.pool === pool.pool)
                const tokenAddress = pool.token0
                const tokenIndex = tokenArr.findIndex((item) => item.tokenAddress === tokenAddress)
                const indexedToken = tokenArr[tokenIndex]
                const _lastPrice = pool.price[pool.price.length - 1].price
                const liquidityArr = pool.liquidity
                let volume24h
                let volume7d
                let tradingVolume24h
                let tradingVolume7d
                indexedToken.price < _lastPrice ? indexedToken.price = _lastPrice : indexedToken.price
                indexedToken.tvl += liquidityArr[liquidityArr.length - 1].liquidity
                for (let i = 0; i < liquidityArr.length; i++) {
                    const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].liquidity, liquidityArr[i].time)
                    if (daysDifference === 1) {
                        volume24h = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                        break
                    }
                }
                indexedToken.volume24h += volume24h
                for (let i = 0; i < liquidityArr.length; i++) {
                    const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].liquidity, liquidityArr[i].time)
                    if (daysDifference === 7) {
                        volume24h = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                        break
                    }
                }
                indexedToken.volume7d += volume7d

                for (const swap of swaps) {
                    tradingVolume24h += swap.amount0
                    const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                    if (daysDifference === 1) {
                        break
                    }
                }
                indexedToken.tradingVolume24h += tradingVolume24h

                for (const swap of swaps) {
                    tradingVolume24h += swap.amount0
                    const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                    if (daysDifference === 7) {
                        break
                    }
                }
                indexedToken.tradingVolume24h += tradingVolume7d
            } else {
                const tokenSymbol = pool.symbol0
                const tokenAddress = pool.token0
                const [tokenName, swaps] = await Promise.all([_tokenName(tokenAddress), getSwapTx(500)])
                const liquidityArr = pool.liquidity
                const priceArr = pool.price

                const volume24h = () => {
                    let volume;
                    for (let i = 0; i < liquidityArr.length; i++) {
                        const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].liquidity, liquidityArr[i].time)
                        if (daysDifference === 1) {
                            volume = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                            break
                        }
                    }
                    return volume
                }

                const tradingVolume24h = () => {
                    let volume = 0
                    swaps.filter((entry) => entry.pool === pool.pool)
                    for (const swap of swaps) {
                        volume += swap.amount0
                        const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                        if (daysDifference === 1) {
                            break
                        }
                    }
                    return volume
                }

                const tradingVolume7D = () => {
                    let volume = 0
                    swaps.filter((entry) => entry.pool === pool.pool)
                    for (const swap of swaps) {
                        volume += swap.amount0
                        const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                        if (daysDifference === 7) {
                            break
                        } else {
                            tradingVolume24h()
                        }
                    }
                }

                const priceChange = () => {
                    let percent
                    for (let i = 0; i < priceArr.length; i++) {
                        const daysDifference = getDaysDifference(pool.price[pool.price.length - 1].time, pool.price[i].time)
                        if (daysDifference === 1) {
                            percent = (100 * lastPrice()) / priceArr[i].price
                            break
                        }
                    }
                    return percent
                }

                const TVL = () => {
                    return liquidityArr[liquidityArr.length - 1].liquidity
                }

                const lastPrice = () => {
                    return priceArr[priceArr.length - 1].price
                }

                tokenSet.add(tokenAddress)
                console.log(
                    'tokenName:', tokenName,
                    'tokenSymbol:', tokenSymbol,
                    'tokenAddress:', tokenAddress,
                    'lastPrice:', lastPrice(),
                    'priceChange:', priceChange(),
                    'volume24H:', volume24h(),
                    'tradingVolume24h:', tradingVolume24h(),
                    'tradingVolume7D:', tradingVolume7D(),
                    'TVL:', TVL()
                )
                tokenArr.push({
                    tokenName: tokenName,
                    tokenSymbol: tokenSymbol,
                    tokenAddress: tokenAddress,
                    lastPrice: lastPrice(),
                    priceChange: priceChange(),
                    volume24H: volume24h(),
                    tradingVolume24h: tradingVolume24h(),
                    tradingVolume7D: tradingVolume7D(),
                    TVL: TVL()
                })
            }



            if (tokenSet.has(pool.token1)) {
                const swaps = await getSwapTx(500)
                swaps.filter((entry) => entry.pool === pool.pool)
                const tokenAddress = pool.token1
                const tokenIndex = tokenArr.findIndex((item) => item.tokenAddress === tokenAddress)
                const indexedToken = tokenArr[tokenIndex]
                const _lastPrice = pool.price[pool.price.length - 1].price
                const liquidityArr = pool.liquidity
                let volume24h
                let volume7d
                let tradingVolume24h
                let tradingVolume7d
                indexedToken.price < _lastPrice ? indexedToken.price = _lastPrice : indexedToken.price
                indexedToken.tvl += liquidityArr[liquidityArr.length - 1].liquidity
                for (let i = 0; i < liquidityArr.length; i++) {
                    const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].time, liquidityArr[i].time)
                    if (daysDifference === 1) {
                        volume24h = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                        break
                    }
                }
                indexedToken.volume24h += volume24h
                for (let i = 0; i < liquidityArr.length; i++) {
                    const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].time, liquidityArr[i].time)
                    if (daysDifference === 7) {
                        volume24h = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                        break
                    }
                }
                indexedToken.volume7d += volume7d

                for (const swap of swaps) {
                    tradingVolume24h += swap.amount1
                    const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                    if (daysDifference === 1) {
                        break
                    }
                }
                indexedToken.tradingVolume24h += tradingVolume24h

                for (const swap of swaps) {
                    tradingVolume24h += swap.amount1
                    const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                    if (daysDifference === 7) {
                        break
                    }
                }
                indexedToken.tradingVolume24h += tradingVolume7d

            } else {
                const tokenSymbol = pool.symbol1
                const tokenAddress = pool.token1
                const [tokenName, swaps] = await Promise.all([_tokenName(tokenAddress), getSwapTx(500)])
                const liquidityArr = pool.liquidity
                const priceArr = pool.price

                const volume24h = () => {
                    let volume;
                    for (let i = 0; i < liquidityArr.length; i++) {
                        const daysDifference = getDaysDifference(liquidityArr[liquidityArr.length - 1].time, liquidityArr[i].time)
                        if (daysDifference === 1) {
                            volume = Number(liquidity[liquidity.length - 1].liquidity) - Number(liquidity[i].liquidity)
                            break
                        }
                    }
                    return volume
                }

                const tradingVolume24h = () => {
                    let volume = 0
                    swaps.filter((entry) => entry.pool === pool.pool)
                    for (const swap of swaps) {
                        volume += swap.amount1
                        const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                        if (daysDifference === 1) {
                            break
                        }
                    }
                    return volume
                }

                const tradingVolume7D = () => {
                    swaps.filter((entry) => entry.pool === pool.pool)
                    let volume = 0
                    for (const swap of swaps) {
                        volume += swap.amount1
                        const daysDifference = getDaysDifference(swap.time, swaps[swaps.length - 1].time)
                        if (daysDifference === 7) {
                            break
                        } else {
                            tradingVolume24h()
                        }
                    }
                }

                const priceChange = () => {
                    let percent
                    for (let i = 0; i < priceArr.length; i++) {
                        const daysDifference = getDaysDifference(pool.price[pool.price.length - 1].time, pool.price[i].time)
                        if (daysDifference === 1) {
                            percent = (100 * lastPrice()) / priceArr[i].price
                            break
                        }
                    }
                    return percent
                }

                const TVL = () => {
                    return liquidityArr[liquidityArr.length - 1].liquidity
                }

                const lastPrice = () => {
                    return priceArr[priceArr.length - 1].price
                }

                tokenSet.add(tokenAddress)
                tokenArr.push({
                    tokenName: tokenName,
                    tokenSymbol: tokenSymbol,
                    tokenAddress: tokenAddress,
                    lastPrice: lastPrice(),
                    priceChange: priceChange(),
                    volume24H: volume24h(),
                    tradingVolume24h: tradingVolume24h(),
                    tradingVolume7D: tradingVolume7D(),
                    TVL: TVL()
                })
            }
        }
        return tokenArr
    } catch (error) {
        console.log(error, 'tokenService')
    }
}



module.exports = tokenService