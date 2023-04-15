const { queryFee, queryLiquidityTransactions, querySwapTransactions, queryTVL } = require('../functions/functions')
const axios = require("axios")

const getFees = async () => {
    try {
        const result = await queryFee()
        return result
    } catch (error) {
        console.log(error, 'for getFees')
    }
}

const getLiquidityTx = async (limit) => {
    try {
        const result = await queryLiquidityTransactions(limit)
        console.log(result, 'here')
        return result
    } catch (error) {
        console.log(error, 'for getLiquidityTx')
    }
}

const getSwapTx = async (limit) => {
    try {
        const result = await querySwapTransactions(limit)
        return result
    } catch (error) {
        console.log(error, 'for getLiquidityTx')
    }
}

const getTvl = async (limit) => {
    try {
        const result = await queryTVL(limit)
        result.sort((a, b) => { return b.blockNumber - a.blockNumber })
        return result
    } catch (error) {
        console.log(error, 'for getLiquidityTx')
    }
}

const usdPrice = async () => {
    try {
        const data = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=SMR&tsyms=USD&api_key=6a7c5b414fe864392a0da94c64d4b52ec4d87c46adadfee50a60da0371429ecb`)
        return data.data
    } catch (error) {
        console.log(error, 'for usdPrice')
    }
}

module.exports = { getFees, getLiquidityTx, getFees, getTvl, getSwapTx, usdPrice }
