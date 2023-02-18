
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://burgossrodrigo:BeREmhPli0p3qFTq@tangle.hkje2xt.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const express = require('express')
const bodyParse = require('body-parser')
const dayjs = require('dayjs')
const cors = require('cors')
const ethers = require('ethers')

const json = bodyParse.json
const app = express();
const router = express.Router()

const POOL_ABI = require('./artifacts/POOLV3.json')
const FACTORY_ABI = require('./artifacts/FACTORYV3.json')
const ERC20_ABI = require('./artifacts/ERC20.json')

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
let poolsArr = []


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

const provider = new ethers.providers.JsonRpcProvider('https://smart-quick-wave.discover.quiknode.pro/e3c1d5f4c51dae28ffddcd947415045bfa0f8f7d/')

const queryTVL = async (from, to) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("tvl")
        const documents = await collection.find({}).toArray()
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

const queryLiquidityTransactions = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("liquidity-trasactions")
        const documents = await collection.find({}).toArray()
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

const querySwapTransactions = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("swap-trasactions")
        const documents = await collection.find({}).toArray()
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

const queryPools = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("pools")
        const documents = await collection.find({}).toArray()
        return documents
    } catch (error) {
        console.log(error, 'for queryPools')
    }
}

const tickToPrice = (sqrtPriceX96) => {
    let mathPrice = Number(sqrtPriceX96) ** 2 / 2 ** 192
    return mathPrice
}

const getWethPriceAndLiquidity = async (address) => {
    const feesArr = [3000, 1000, 10000]
    try {
        const factory = new ethers.Contract(address, FACTORY_ABI, provider)
        feesArr.map(async (fee) => {
            const poolAddress = await factory.getPool(address, WETH_ADDRESS, fee)
            if(poolAddress !== ZERO_ADDRESS){
                const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
                const slot0 = await poolContract.slot0()
                const liquidity = slot0.liquidity
                const wethContract = new ethers.Contract(address, ERC20_ABI, provider)
                const wethBalance = wethContract.balanceOf(poolAddress)
                const price = slot0.sqrtPriceX96
                poolsArr.push({
                    poolAddress: poolAddress,
                    liquidity: liquidity,
                    price: tickToPrice(price),
                    wethBalance: wethBalance
                })

                poolsArr.sort((a, b) => {
                    return b.liquidity - a.liquidity
                })

                return poolsArr
            }
        })
    } catch (error) {
        console.log(error, 'for getWethPriceAndLiquidity')
    }
}

app.listen(PORT, server_host, () => {
    console.log(`server is listening on port: ${PORT}`)
})

router.get('/tvl/:from/:to', cors(corsOptions), async (req, res) => {
    queryTVL().then((result) => {
        return res.json(result)
    })
})

router.get('/liquidityTransactions/:from/:to', cors(corsOptions), async (req, res) => {
    queryLiquidityTransactions().then((result) => {
        return res.json(result)
    })
})

router.get('/swapTransactions/:from/:to', cors(corsOptions), async (req, res) => {
    querySwapTransactions().then((result) => {
        return res.json(result)
    })
})

router.get('/tokens', cors(corsOptions), async (req, res) => {
    queryPools().then((result) => {
        const priceArr = result.price
        //const lastPrice = priceArr[price.length - 1].price
        const lastPrice = () => {
            if(result.token1 === WETH_ADDRESS){
                return Number(priceArr[price.length - 1].price)
            }

            if(result.token0 === WETH_ADDRESS){
                return 1 / Number(priceArr[price.length - 1].price)
            }

            return getWethPriceAndLiquidity(result.token1)
        }

        const priceChange = () => {
            let percent
            for(let i = 0; i < price.length; i++){
                if(dayjs(priceArr[i].time).format('DD') !== dayjs(priceArr[priceArr.length - 1].time).format('DD')){
                    percent = ( 100 * lastPrice ) / priceArr[i].price
                    break
                }
            }
            return percent
        }

        const TVL = async () => {
            const tokenContract = new ethers.Contract(m)
            if(result.token1 === WETH_ADDRESS){
                
            }            
        }
    })
})

