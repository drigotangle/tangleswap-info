const { queryFee, queryLiquidityTransactions, querySwapTransactions, queryTVL } = require('../functions/functions')

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
        return result
    } catch (error) {
        console.log(error, 'for getLiquidityTx')
    }
}

module.exports = { getFees, getLiquidityTx, getFees, getTvl, getSwapTx }
