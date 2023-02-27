import axios from "axios"
import { ITVL } from "../interfaces"

export const getTVL = async (from: number): Promise<any | ITVL[]> => {
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/tvl/${from}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getTokens = async (): Promise<any> => {
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/tokens`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getPools = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/pools/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getLiquidityTx = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/liquidityTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getSwapTx = async (limit: number): Promise<any> => {
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/swapTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}




