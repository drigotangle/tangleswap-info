const { getWethPriceAndLiquidity, _tokenName, _tokenSymbol, timeOut, queryPools } = require('../functions/functions')
const dayjs = require('dayjs')


const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

const tokenService = async () => {
    try {
            const poolRes = await queryPools(50)
            const poolSet = new Set()
            const tokenSet = new Set()
            const interval = ((poolRes.length * 9) * 40 ) + ((result.length * 40 )* 2) * 1.2
        
            let tokenArr = []
            for(let i = 0; i < poolRes.length; i++){
                const result = poolRes[i]
                let _tokenAddress
                if(result.token1 === WETH_ADDRESS){
                    _tokenAddress = result.token0
                }
                _tokenAddress === result.token1
                if(_tokenAddress !== undefined){
                        await Promise.all([getWethPriceAndLiquidity(_tokenAddress), _tokenName(_tokenAddress), _tokenSymbol(result.token1, result.token0), timeOut(interval)]).then((promises) => {
                            const wethPriceAndLiquidity = promises[0]
                            const tokenName = promises[1]
                            const tokenSymbol = promises[2]
                            if(!poolSet.has(result)){
                                    const priceArr = result.price
                                    const tvlArr = result.tvl || []
                                    const liquidityArr = result.liquidity || []
                                    const lastPrice = () => {
                                        if(wethPriceAndLiquidity?.length > 0){
                                            const result = wethPriceAndLiquidity[0]?.price ?? 0
                                            return result
                                        }
                                        return 0
                                    }
                            
                                    const priceChange = () => {
                                        let percent
                                        for(let i = 0; i < priceArr.length; i++){
                                            if(dayjs(priceArr[i].time).format('DD') !== dayjs(priceArr[priceArr.length - 1].time).format('DD')){
                                                percent = ( 100 * lastPrice() ) / priceArr[i].price
                                                break
                                            }
                                        }
                                        return percent
                                    }
                            
                                    const TVL = () => {
                                        if(wethPriceAndLiquidity.length > 0){
                                            const initialValue = 0
                                            const accBalance = wethPriceAndLiquidity?.reduce((acc, cur) => {
                                                return acc + cur.wethBalance
                                            }, 0)
                                        return accBalance
                                        }
                                    }
                                    
                                    const volume24H = () => {
                                        let volume
                                        for(let i = 0; i < tvlArr.length; i++){
                                            if(dayjs(liquidityArr[i].time).format('DD') !== dayjs(liquidityArr[liquidityArr.length - 1].time).format('DD')){
                                                volume = Number(liquidityArr[liquidityArr.length - 1].liquidity) - Number(liquidityArr[i].liquidity)
                                                break
                                            }
                                        }
                                        return volume            
                                    }
                        
                                    if(!tokenSet.has(tokenName)){
                                        console.log('chamou')
                                        tokenArr.push({
                                            tokenName: tokenName,
                                            tokenSymbol: tokenSymbol,
                                            tokenAddress: result.token1 === WETH_ADDRESS && result.token0 !== WETH_ADDRESS ? result.token0 : result.token1,
                                            lastPrice: lastPrice(),
                                            priceChange: priceChange(),
                                            volume24H: volume24H(),
                                            TVL: TVL()
                                        })
                                        tokenSet.add(tokenName)
                                        poolSet.add(result)
                                    }
                            }
                        })
                }  
        }
            return tokenArr
    } catch (error) {
        console.log(error, 'tokenService')
    }
}



module.exports = tokenService