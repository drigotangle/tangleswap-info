
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://burgossrodrigo:BeREmhPli0p3qFTq@tangle.hkje2xt.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const express = require('express')
const bodyParse = require('body-parser')
const dayjs = require('dayjs')
const cors = require('cors')
const ethers  = require("ethers")

const json = bodyParse.json
const app = express();
const router = express.Router()

const POOL_ABI = require('./artifacts/POOLV3.json')
const FACTORY_ABI = require('./artifacts/FACTORYV3.json')
const ERC20_ABI = require('./artifacts/ERC20.json')

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'



app.use(json());
app.use(router);
const PORT = process.env.PORT || 5000
var server_host = process.env.YOUR_HOST || '0.0.0.0';
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://tvl-api.herokuapp.com/'
  ],
};

const provider = new ethers.JsonRpcProvider('https://smart-quick-wave.discover.quiknode.pro/e3c1d5f4c51dae28ffddcd947415045bfa0f8f7d/')
// const provider = new ethers.providers.JsonRpcProvider('https://smart-quick-wave.discover.quiknode.pro/e3c1d5f4c51dae28ffddcd947415045bfa0f8f7d/')

const queryTVL = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("tvl")
        const documents = await collection.find({})
        .sort({ time: 1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
            documents.map((data) => {
                    docArr.push({
                        tvl: data.tvl,
                        time: data.time
                    })
            })
      
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const queryLiquidityTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("liquidity-trasactions")
        const documents = await collection.find({})
        .sort({ blockNumber: -1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
        documents.map((data) => {
                docArr.push({
                    eventName: data.eventName,
                    token0: data.token0Address,
                    token1: data.token1Address,
                    symbol0: data.symol0,
                    symbol1: data.symbol1,
                    amount0: data.amount1,
                    amount1: data.amount1,
                    time: data.tine
                })                        
        })
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const querySwapTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("swap-trasactions")
        .sort({ blockNumber: -1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
        documents.map((data) => {
                docArr.push({
                    eventName: data.eventName,
                    token0: data.token0Address,
                    token1: data.token1Address,
                    symbol0: data.symol0,
                    symbol1: data.symbol1,
                    amount0: data.amount0,
                    amount1: data.amount1,
                    time: data.time
                })                        
        })
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const queryPools = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("pools")
        const documents = await collection.find({}).toArray()
        return documents
    } catch (error) {
        console.log(error, 'for queryPools')
    }
}

const getWethPriceAndLiquidity = async (address) => {
    const feesArr = [3000, 1000, 10000]
    let poolsArr = []
    try {
            const factory = new ethers.Contract('0x1F98431c8aD98523631AE4a59f267346ea31F984', FACTORY_ABI, provider)
            for(let i = 0; i < feesArr.length; i++){
                const fee = feesArr[i]
                const poolAddress = await factory.getPool(address, WETH_ADDRESS, fee)
                if(poolAddress !== ZERO_ADDRESS){
                    const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
                    const slot0 = await poolContract.slot0()
                    const wethContract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider)
                    const wethBalance = await wethContract.balanceOf(poolAddress)
                    const price = Number(slot0.sqrtPriceX96)
    
                    poolsArr.push({
                        poolAddress: poolAddress,
                        price: price,
                        wethBalance: Number(wethBalance)
                    })
                }
            }
            poolsArr.sort((a, b) => {
                return b.liquidity - a.liquidity
            })
            console.log(poolsArr, Date.now(), 'chamou')
            return poolsArr
    } catch (error) {
        console.log(error, 'for getWethPriceAndLiquidity')
    }
}

const _tokenName = async (token1, token0) => {
    try {
            const tokenCtt = new ethers.Contract(
                token1 === WETH_ADDRESS && token0 !== WETH_ADDRESS ? token0 : token1,
                ERC20_ABI,
                provider
            )
    
            const tokenName = await tokenCtt.name()
            console.log(tokenName, Date.now(), 'chamou')
            return tokenName
    } catch (error) {
        console.log(error, 'for tokenName')
    }
}

const timeOut = (interval) => {
    return new Promise(resolve => setTimeout(resolve, interval));
}

app.listen(PORT, server_host, () => {
    console.log(`server is listening on port: ${PORT}`)
})

router.get('/tvl/:limit', cors(corsOptions), async (req, res) => {
    const limit = Number(req.params.limit)
    queryTVL(limit).then((result) => {
        return res.json(result)
    })
})

router.get('/liquidityTransactions/:limit', cors(corsOptions), async (req, res) => {
    const limit = Number(req.params.limit)
    queryLiquidityTransactions(limit).then((result) => {
        return res.json(result)
    })
})

router.get('/swapTransactions/:limit', cors(corsOptions), async (req, res) => {
    const limit = Number(req.params.limit)
    querySwapTransactions(limit).then((result) => {
        return res.json(result)
    })
})

router.get('/tokens', cors(corsOptions), async (res) => {
    await queryPools().then(async (poolRes) => {
        console.log(poolRes.length, 'length')
        const poolSet = new Set()
        const tokenSet = new Set()
        const interval = ((poolRes.length * 3 * 3) * 80 ) + (poolRes.length * 80)
        let tokenArr = []
        for(let i = 0; i < poolRes.length; i++){
            const result = poolRes[i]
            let _tokenAddress
            if(result.token1 === WETH_ADDRESS){
                _tokenAddress = result.token0
            }
            _tokenAddress === result.token1
            if(_tokenAddress !== undefined){
                    await Promise.all([getWethPriceAndLiquidity(_tokenAddress), _tokenName(_tokenAddress)], timeOut(interval)).then((promises) => {
                        const wethPriceAndLiquidity = promises[0]
                        const tokenName = promises[1]
                        if(!poolSet.has(result)){
                                const priceArr = result.price
                                const tvlArr = result.tvl || []
                                const liquidityArr = result.liquidity || []
                                const lastPrice = () => {
                                    const result = wethPriceAndLiquidity[0]?.price ?? 0
                                    console.log(result, 'lastPrice')
                                    console.log(typeof result, 'typeof lastPrice')
                                    return result
                                }
                        
                                const priceChange = () => {
                                    let percent
                                    for(let i = 0; i < priceArr.length; i++){
                                        if(dayjs(priceArr[i].time).format('DD') !== dayjs(priceArr[priceArr.length - 1].time).format('DD')){
                                            console.log(lastPrice(), priceArr[i].price, 'priceChange')
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
                                    console.log(accBalance, 'TVL')
                                    return accBalance
                                    }
                                }
                                
                                const volume24H = () => {
                                    let volume
                                    for(let i = 0; i < tvlArr.length; i++){liquidityArr
                                        if(dayjs(liquidityArr[i].time).format('DD') !== dayjs(liquidityArr[liquidityArr.length - 1].time).format('DD')){8
                                            console.log(Number(liquidityArr[liquidityArr.length - 1].liquidity), 'currently liquidty')
                                            console.log(Number(liquidityArr[i].liquidity), 'last liquidity')
                                            volume = Number(liquidityArr[liquidityArr.length - 1].liquidity) - Number(liquidityArr[i].liquidity)
                                            break
                                        }
                                    }
                                    console.log(volume, 'volume')
                                    return volume            
                                }
                    
                                if(!tokenSet.has(tokenName)){
                                    console.log(tokenArr, 'tokenArr')
                                    tokenArr.push({
                                        tokenName: tokenName,
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
    })
})

