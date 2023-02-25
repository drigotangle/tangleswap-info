import axios from "axios"
import { ITVL } from "../interfaces"

export const getTVL = async (from: number): Promise<any | ITVL[]> => {
    try {
        const result = await axios.get(`http://localhost:5000/tvl/${from}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getTokens = async (): Promise<any> => {
    try {
        const result = await axios.get(`http://localhost:5000/tokens`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getPools = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`http://localhost:5000/pools/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getLiquidityTx = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`http://localhost:5000/liquidityTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getSwapTx = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`http://localhost:5000/swapTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}




