const ethers  = require("ethers")

const provider = new ethers.JsonRpcProvider(process.env.SHIMMER_RPC)

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://burgossrodrigo:BeREmhPli0p3qFTq@tangle.hkje2xt.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const ERC20_ABI = require('../artifacts/ERC20.json')

const WETH_ADDRESS = process.env.WETH_ADDRESS
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const queryTVL = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db-shimmer").collection("tvl")
        const documents = await collection.find({})
        .sort({ blockNumber: -1 }) // Sort by blockNumber in ascending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
            documents.map((data) => {
                    docArr.push({
                        tvl: data.tvl,
                        time: data.time,
                        blockNumber: data.block ?? data.blockNumber
                    })
            })
      
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const queryFee = async () => {
    try {
        const collection = await mongoClient.db("tangle-db-shimmer").collection("fees-generated")
        const documents = await collection.find({})
        .toArray()
        let docArr = []
        const feeSet = new Set()
            documents.map((data) => {
                if(!feeSet.has(data)){
                docArr.push({
                    fee: data.fee,
                    time: data.time,
                    poolAddress: data.poolAddress,
                    blockNumber: data.block ?? data.blockNumber
                })
                feeSet.add(data)
            }
        })
        return docArr
    } catch (error) {
        console.log(error, 'queryFee')
    }
}

const queryLiquidityTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db-shimmer").collection("liquidity-transactions")
        const documents = await collection.find({})
        .sort({ block: -1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
        const docSet = new Set()
        documents.map((data) => {
        if(!docSet.has(data)){
            docArr.push({
                eventName: data.eventName,
                token0: data.token0Address,
                token1: data.token1Address,
                symbol0: data.symbol0,
                symbol1: data.symbol1,
                amount0: data.amount0,
                amount1: data.amount1,
                value: data.value,
                account: data.account,
                time: data.time,
                pool: data.pool,
                blockNumber: data.block ?? data.blockNumber,
                hash: data.hash
            })
            docSet.add(data)
        }                    
        })
        console.log(docArr)
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const querySwapTransactions = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db-shimmer").collection("swap-transactions")
        const documents = await collection.find({})
        .sort({ block: -1 }) // Sort by blockNumber in descending order
        .limit(limit) // Limit to the first 10 results
        .toArray()
        let docArr = []
        const docSet = new Set()
        documents.map((data) => {
            if(!docSet.has(data)){
                docArr.push({
                    eventName: data.eventName,
                    token0: data.token0Address,
                    token1: data.token1Address,
                    value: data.value,
                    symbol0: data.symbol0,
                    symbol1: data.symbol1,
                    amount0: data.amount0,
                    amount1: data.amount1,
                    time: data.time,
                    account: data.account,
                    blockNumber: data.block ?? data.blockNumber,
                    hash: data.hash
                })               
                docSet.add(data)
            }
        })
        return docArr
    } catch (error) {
        console.log(error, 'for getLastTVL')
    }
}

const queryPools = async (limit) => {
    try {
        const collection = await mongoClient.db("tangle-db-shimmer").collection("pools")
        const poolsArr = []
        const poolSet = new Set()
        if(limit !== undefined){
            const documents = await collection.find({})
            .sort({ blockNumber: 1 }) // Sort by blockNumber in descending order
            .limit(limit) // Limit to the first 10 results
            .toArray()
            for(const pool of documents){
                if(!poolSet.has(pool)){
                    poolsArr.push(pool)
                    poolSet.add(pool)
                }
            }
        }
        return poolsArr
    } catch (error) {
        console.log(error, 'for queryPools')
    }
}

const _tokenName = async (token) => {
    try {
            const tokenCtt = new ethers.Contract(token, ERC20_ABI, provider)
    
            const tokenName = await tokenCtt.name()
            return tokenName
    } catch (error) {
        console.log(error, 'for tokenName')
    }
}

const _tokenSymbol = async (address) => {
    try {
            const erc20 = new ethers.Contract(address, ERC20_ABI, provider)    
            const result = await erc20.symbol()
            return result
    } catch (error) {
        console.log(error, 'for tokenName')
    }
}

const tokenBalance = async (address, poolAddress) => {
    try {
        const erc20 = new ethers.Contract(address, ERC20_ABI, provider)
        const balance = await erc20.balanceOf(poolAddress)
        return balance
    } catch (error) {
        console.log(error, 'for tokenBalance')
    }
} 

const timeOut = (interval) => {
    return new Promise(resolve => setTimeout(resolve, interval));
}

module.exports = {
    queryTVL,
    queryFee,
    queryLiquidityTransactions,
    querySwapTransactions,
    queryPools,
    _tokenName,
    _tokenSymbol,
    timeOut,
    tokenBalance
}