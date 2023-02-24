
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
        const collection = await mongoClient.db("tangle-db").collection("liquidity-transactions")
        const documents = await collection.find({})
        .sort({ blockNumber: 1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
        documents.map((data) => {
                docArr.push({
                    eventName: data.eventName,
                    token0: data.token0Address,
                    token1: data.token1Address,
                    symbol0: data.symbol0,
                    symbol1: data.symbol1,
                    amount0: data.amount0,
                    amount1: data.amount1,
                    time: data._id.getTimestamp(),
                    blockNumber: data.block
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

const queryPools = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("pools")
        if(limit !== undefined){
            const documents = await collection.find({})
            .sort({ time: 1 }) // Sort by blockNumber in descending order
            .limit(limit) // Limit to the first 10 results
            .toArray()
            return documents
        }
        const documents = await collection.find({})
        .toArray()
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
            return tokenName
    } catch (error) {
        console.log(error, 'for tokenName')
    }
}

const _tokenSymbol = async (token1, token0) => {
    try {
            const token0Ctt = new ethers.Contract(
                token0,
                ERC20_ABI,
                provider
            )

            const token1Ctt = new ethers.Contract(
                token1,
                ERC20_ABI,
                provider
            )
    
            const token0Symbol = await token0Ctt.symbol()
            const token1Symbol = await token1Ctt.symbol()
            const result = { symbol0: token0Symbol, symbol1:token1Symbol }
            return result
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

router.get('/pools/:limit', cors(corsOptions), async (req, res) => {
    const limit = Number(req.params.limit)

    const result = await queryPools(limit)
    let arr = []
    const dataSet = new Set()
    const interval = result.length * 200

    for (const data of result) {
        if(!dataSet.has(data)){
            const [symbols, _] = await Promise.all([_tokenSymbol(data.token0, data.token1), timeOut(interval)])
        const symbol0 = symbols?.symbol0
        const symbol1 = symbols?.symbol1
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
                    volume = Number(liquidityArr[liquidityArr.length - 1].liquidity) - Number(liquidityArr[i].liquidity)
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
            symbol0: symbol0,
            symbol1: symbol1,
            tvl: tvl,
            volume24H: volume24H(),
            volume7D: volume7D(),
            fee: fee
        })
        }
    }

    return res.json(arr)
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

router.get('/tokens', cors(corsOptions), async (req, res) => {
    queryPools().then(async (poolRes) => {
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
                                    return result
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
                                    for(let i = 0; i < tvlArr.length; i++){liquidityArr
                                        if(dayjs(liquidityArr[i].time).format('DD') !== dayjs(liquidityArr[liquidityArr.length - 1].time).format('DD')){
                                            volume = Number(liquidityArr[liquidityArr.length - 1].liquidity) - Number(liquidityArr[i].liquidity)
                                            break
                                        }
                                    }
                                    return volume            
                                }
                    
                                if(!tokenSet.has(tokenName)){
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
    return res.json(tokenArr)
    })
})

