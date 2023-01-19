import axios from "axios"
import { ITVL } from "../interfaces"
import { BaseAxisProps } from 'recharts/types/util/types'

export const getTVL = async (from: number): Promise<any | ITVL[]> => {
    try {
        const result = await axios.get(`http://localhost:5000/tvl/${from}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const minMax = (arr: any[]): BaseAxisProps[] | any => {
    const minValue = Math.min(...arr.map(obj => obj.tvl));
    const maxValue = Math.max(...arr.map(obj => obj.tvl));
    const result = {
        range: [minValue, maxValue]
    }
    //@ts-ignore
    return result
}