import axios from "axios"
import dayjs from "dayjs"
import { GroupedData, GroupedEntry, IFee, IPoolLiquidity, ITVL, LiquidityPerDay } from "../interfaces"

export const getTVL = async (from: number, chain: string | undefined): Promise<any | ITVL[]> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/tvl/${from}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getTokens = async (chain: string | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/tokens`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getPools = async (limit: number, chain: string | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/pools/${limit}`)
        console.log(result.data, 'poolsAqui')
        return result.data
    } catch (error) {
        return error
    }
}

export const getLiquidityTx = async (limit: number, chain: string | undefined | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/liquidityTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getSwapTx = async (limit: number, chain: string | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/swapTransactions/${limit}`)
        return result.data
    } catch (error) {
        return error
    }
}

export const getFees = async (chain: string | undefined): Promise<IFee[] | any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/fees`)
        console.log(result.data, 'fees')
        return result.data
    } catch (error) {
        return error
    }
}

//

export const vol24H = (liquidity: ITVL[]) => {
    let volume = 0;
    for (const tvl of liquidity) {
        if(dayjs(tvl.time).format('DD') === dayjs(liquidity[liquidity.length - 1].tvl).format('DD')){
            volume = Number(liquidity[liquidity.length - 1].tvl) - Number(tvl.tvl)
            break
        }
    }
    return Math.abs(volume)
}

export const feesGenerated = async (chain: string | undefined): Promise<number> => {
    const feesArr: IFee[] = await getFees(chain)
    let totalFee = 0
    console.log(feesArr, 'feesArr')
        for(const fees of feesArr){
            if(dayjs(fees.time).format('DD') === dayjs(feesArr[feesArr.length - 1].time).format('DD')){
                console.log(fees.fee, 'fee')
                totalFee += fees.fee
            }            
        }
        console.log(totalFee, 'totalFee')
    return Math.abs(totalFee)
}

export const groupDataByDay = (data: ITVL[]): GroupedEntry[] => {
    const groupedData: GroupedData = {};
  
    data.forEach((entry: ITVL) => {
      const dayStart = dayjs(entry.time).startOf('day').valueOf();
      const dayFormatted = dayjs(dayStart).format('DD');
  
      if (!groupedData[dayFormatted]) {
        groupedData[dayFormatted] = 0;
      }
  
      groupedData[dayFormatted] += entry.tvl;
    });
  
    return Object.keys(groupedData).map((day: string) => ({ day, tvl: groupedData[day] }));
  }

  export const groupLiquidityPerDay = (data: IPoolLiquidity[]): IPoolLiquidity[] => {
    const result: IPoolLiquidity[] = [];
    
    data.forEach(({ time, liquidity }) => {
      const day = dayjs(time).format('DD');
      const existingEntry = result.find(entry => entry.time === Number(day));
      
      if (existingEntry) {
        existingEntry.liquidity += liquidity;
      } else {
        result.push({
          time: Number(day),
          liquidity
        });
      }
    });
  
    return result;
  }
  





