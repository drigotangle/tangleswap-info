const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')

const json = bodyParse.json
const app = express();
const router = express.Router()


const { poolCachedMiddleware, tokenCachedMiddleware } = require('./cache')
const { poolController, tokenController } = require('./tangle.controller')



app.use(json());
app.use(router);
const PORT = 5000
var server_host = process.env.YOUR_HOST || '0.0.0.0';
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://tvl-api.herokuapp.com',
    'https://tangleswap-info.vercel.app',
    'https://tangle-db-api.onrender.com'
  ],
};


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

const queryFee = async () => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("fees-generated")
        const documents = await collection.find({})
        .toArray()
        let docArr = []
        documents.map((data) => {
                docArr.push({
                    fee: data.fee,
                    time: data._id.getTimestamp(),
                    poolAddress: data.poolAddress
                })
        })
        return docArr
    } catch (error) {
        console.log(error, 'queryFee')
    }
}

const queryLiquidityTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("liquidity-transactions")
        const documents = await collection.find({})
        .sort({ block: -1 }) // Sort by blockNumber in descending order
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
        console.log(docArr)
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const querySwapTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db").collection("swap-transactions")
        const documents = await collection.find({})
        .sort({ block: -1 }) // Sort by blockNumber in descending order
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

// const queryPools = async (limit) => {
//     try {
//         const collection = await mongoClient.db("tangle-db").collection("pools")
//         if(limit !== undefined){
//             const documents = await collection.find({})
//             .sort({ time: 1 }) // Sort by blockNumber in descending order
//             .limit(limit) // Limit to the first 10 results
//             .toArray()
//             return documents
//         }
//         const documents = await collection.find({})
//         .toArray()
//         return documents
//     } catch (error) {
//         console.log(error, 'for queryPools')
//     }
// }

// const getWethPriceAndLiquidity = async (address) => {
//     const feesArr = [3000, 1000, 10000]
//     let poolsArr = []
//     try {
//             const factory = new ethers.Contract('0x1F98431c8aD98523631AE4a59f267346ea31F984', FACTORY_ABI, provider)
//             for(let i = 0; i < feesArr.length; i++){
//                 const fee = feesArr[i]
//                 const poolAddress = await factory.getPool(address, WETH_ADDRESS, fee)
//                 if(poolAddress !== ZERO_ADDRESS){
//                     const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
//                     const slot0 = await poolContract.slot0()
//                     const wethContract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, provider)
//                     const wethBalance = await wethContract.balanceOf(poolAddress)
//                     const price = Number(slot0.sqrtPriceX96)
    
//                     poolsArr.push({
//                         poolAddress: poolAddress,
//                         price: price,
//                         wethBalance: Number(wethBalance)
//                     })
//                 }
//             }
//             poolsArr.sort((a, b) => {
//                 return b.liquidity - a.liquidity
//             })
//             return poolsArr
//     } catch (error) {
//         console.log(error, 'for getWethPriceAndLiquidity')
//     }
// }

// const _tokenName = async (token) => {
//     try {
//             const tokenCtt = new ethers.Contract(
//                 token,
//                 ERC20_ABI,
//                 provider
//             )
    
//             const tokenName = await tokenCtt.name()
//             return tokenName
//     } catch (error) {
//         console.log(error, 'for tokenName')
//     }
// }

// const _tokenSymbol = async (token1, token0) => {
//     try {
//             const token0Ctt = new ethers.Contract(
//                 token0,
//                 ERC20_ABI,
//                 provider
//             )

//             const token1Ctt = new ethers.Contract(
//                 token1,
//                 ERC20_ABI,
//                 provider
//             )
    
//             const token0Symbol = await token0Ctt.symbol()
//             const token1Symbol = await token1Ctt.symbol()
//             const result = { symbol0: token0Symbol, symbol1:token1Symbol }
//             return result
//     } catch (error) {
//         console.log(error, 'for tokenName')
//     }
// }

// const timeOut = (interval) => {
//     return new Promise(resolve => setTimeout(resolve, interval));
// }

app.listen(PORT, () => {
    console.log(`server is listening on port: ${PORT}`)
})

router.get('/tvl/:limit', cors(corsOptions), async (req, res) => {
    const limit = Number(req.params.limit)
    queryTVL(limit).then((result) => {
        return res.json(result)
    })
})

router.get('/pools/:limit', cors(corsOptions), poolCachedMiddleware, poolController)

router.get('/fees', cors(corsOptions), async (req, res) => {
    queryFee().then((result) => {
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

router.get('/tokens', cors(corsOptions), tokenCachedMiddleware, tokenController)

