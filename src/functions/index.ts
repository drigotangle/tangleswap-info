import axios from "axios"
import { ITVL } from "../interfaces"

export const getTVL = async (): Promise<any | ITVL[]> => {
    try {
        const result = await axios.get(`https://tvl-api.herokuapp.com/tvl`)
        return result.data
    } catch (error) {
        return error
    }
}