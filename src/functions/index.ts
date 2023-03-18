import axios from "axios"
import dayjs from "dayjs"
import { CandlestickData, GroupedData, GroupedEntry, IFee, IPoolData, ITVL, ITx, SeriesData } from "../interfaces"

const WETH_ADDRESS = '0x9a0F333908010331769F1B4764Ff2b3a1e965897'

export const getTVL = async (from: number, chain: string | undefined): Promise<any | ITVL[]> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/tvl/${from}`)
        console.log(result.data, 'getTVL')
        return result.data
    } catch (error) {
        console.log(error, 'for getTVL')
    }
}

export const getTokens = async (chain: string | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/tokens`)
        console.log(result.data, 'tokens')
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

export const getLiquidityTx = async (limit: number, chain: string | undefined): Promise<any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/liquidityTransactions/${limit}`)
        console.log(result.data, 'getLiquidityTx')
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
      const dayStart = entry.time
      const dayFormatted = dayjs(dayStart).format('DD');
  
      if (!groupedData[dayFormatted]) {
        groupedData[dayFormatted] = 0;
      }
  
      groupedData[dayFormatted] += entry.tvl;
    });
  
    return Object.keys(groupedData).map((day: string) => ({ day, tvl: groupedData[day] }));
  }

  export const groupLiquidityPerDay = (data: {time: string, liquidity: number}[]): {time: number, liquidity: number}[] => {
    const result: {time: number, liquidity: number}[] = [];
  
    data.forEach(({ time, liquidity }) => {
      const day = Number(dayjs(time).format('DD'));
      const existingEntry = result.find(entry => entry.time === day);
  
      if (existingEntry) {
        existingEntry.liquidity += liquidity;
      } else {
        result.push({
          time: day,
          liquidity
        });
      }
    });
  
    return result;
  }
  
export const poolsForToken = (pools: IPoolData[], tokenAddress: string | undefined): IPoolData[] => {
    const poolSet = new Set()
    let poolArr: IPoolData[] = []
    for(const pool of pools){
        if(
          (pool.token0 === tokenAddress) ||
          (pool.token1 === tokenAddress) &&
          !poolSet.has(pool)
          ){
            poolSet.add(pool)
            poolArr.push(pool)
        }
    }     
      return poolArr
}

export const txsForToken = (txs: ITx[], symbol: string): ITx[] => {
    const txSet = new Set()
    let txArr: ITx[] = []
    for(const tx of txs){
        if(
            (tx.symbol0 === symbol) ||
            (tx.symbol1 === symbol) &&
            !txSet.has(tx)
        ){  
            txSet.add(tx)
            txArr.push(tx)
        }
    }
    return txArr
}

export const getCandlestickData = (series: {time: string, price: number}[], resolution: number): CandlestickData[] => {
  const candlestickData: CandlestickData[] = [];
  let currentCandle: CandlestickData | null = null;
  let nextCandleTime: number = 0;
  
  for (let i = 0; i < series.length; i++) {
    const data = series[i];
    const time = new Date(data.time).getTime();
    const price = data.price;
    const resolutionMillis = resolution * 60 * 1000;

    if (!currentCandle) {
      const start = Math.floor(time / resolutionMillis) * resolutionMillis;
      const end = start + resolutionMillis;
      nextCandleTime = end;
      currentCandle = {
        time: new Date(start).toISOString(),
        open: price,
        high: price,
        low: price,
        close: price
      };
    } else {
      if (time >= nextCandleTime) {
        candlestickData.push(currentCandle);
        currentCandle = null;
        i--;
        continue;
      } else {
        if (price > currentCandle.high) {
          currentCandle.high = price;
        }
        if (price < currentCandle.low) {
          currentCandle.low = price;
        }
        currentCandle.close = price;
      }
    }
  }

  if (currentCandle) {
    candlestickData.push(currentCandle);
  }
  console.log(candlestickData, 'candlestickData')
  return candlestickData;
}


export const poolsToCandle = (pools: IPoolData[], tokenAddress: string | undefined): SeriesData[] => {
    let poolsArr: IPoolData[] = []
    for(const pool of pools) {
      if ((tokenAddress === pool.token1 && WETH_ADDRESS === pool.token0) || 
      (tokenAddress === pool.token0 && WETH_ADDRESS === pool.token1)
      ) {
        console.log(pool, 'poolsToCandle')
        poolsArr.push(pool)
      }      
    }
      poolsArr.sort((a: IPoolData, b: IPoolData) => Number(b.priceArr[b.priceArr.length - 1]?.price) - Number(a.priceArr[b.priceArr.length - 1].price))
      console.log(poolsArr[0].priceArr, 'poolsToCandle')
      return poolsArr[0].priceArr
}

export const getUsdPrice = async (chain: string) => {
  try {
    const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
    const data = await axios.get(`${url}/USDPrice`)
    return data.data

  } catch (error) {
    console.log(error, 'for getUsdPrice')
  }
}




