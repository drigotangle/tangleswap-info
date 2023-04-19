import axios from "axios"
import dayjs from "dayjs"
import { CandlestickData, GroupedData, GroupedEntry, IFee, IPoolData, IPoolLiquidity, ITVL, ITx, SeriesData } from "../interfaces"

export const getTVL = async (from: number, chain: string | undefined): Promise<any | ITVL[]> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        let result = await axios.get(`${url}/tvl/${from}`)
        result.data.sort((a: ITVL, b: ITVL) => a.blockNumber - b.blockNumber)
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

export const getPools = async (limit: number, chain: string | undefined): Promise<IPoolData | any> => {
    try {
        const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
        const result = await axios.get(`${url}/pools/${limit}`)
        console.log(result.data, 'poolsAqui')
        return result.data
    } catch (error: any) {
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
                totalFee += fees.fee
            }            
        }
        console.log(totalFee, 'totalFee')
    return Math.abs(totalFee)
}

export const groupDataByDay = (data: ITVL[]): GroupedEntry[] => {
    const groupedData: GroupedData = {};
    data.sort((a: ITVL, b: ITVL) => { return a.blockNumber - b.blockNumber });
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

  export const groupLiquidityPerDay = (data: IPoolLiquidity[]): GroupedEntry[] => {
    const groupedData: GroupedData = {};
  
    data.forEach((entry: IPoolLiquidity) => {
      const dayStart = dayjs(entry.time).format('DD');
      const dayFormatted = dayjs(dayStart).format('DD');
  
      if (!groupedData[dayFormatted]) {
        groupedData[dayFormatted] = 0;
      }
  
      groupedData[dayFormatted] += entry.liquidity;
    });
  
    return Object.keys(groupedData).map((day: string) => ({ day, tvl: groupedData[day] }));
  };
  
export const poolsForToken = (pools: IPoolData[], tokenAddress: string | undefined): IPoolData[] => {
    const poolSet = new Set()
    let poolArr: IPoolData[] = []
    for(const pool of pools){

        if(
          (pool.token0 === tokenAddress) ||
          (pool.token1 === tokenAddress) &&
          !poolSet.has(pool) &&
          pool !== undefined
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

export const getCandlestickData = (data: SeriesData[]): CandlestickData[] => {
  const ohlcData: CandlestickData[] = []
  let currentOHLC: CandlestickData | any = null
  console.log(data, 'data')
  // Sort the data by timestamp
  data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  // Loop through each data point and calculate the OHLC values for the time interval
  for (let i = 0; i < data.length; i++) {
    const currentData = data[i]
    const timestamp = new Date(currentData.time).getTime()

    // If the current data point has a price value, update the OHLC values
    if (currentData.price) {
      if (!currentOHLC) {
        // If there is no current OHLC data, start a new time interval
        currentOHLC = {
          open: currentData.price,
          high: currentData.price,
          low: currentData.price,
          close: currentData.price,
          timestamp
        }
      } else if (timestamp - currentOHLC.timestamp >= 60000) {
        // If the current data point is outside the current time interval, push the current OHLC data and start a new time interval
        ohlcData.push(currentOHLC)
        currentOHLC = {
          open: currentData.price,
          high: currentData.price,
          low: currentData.price,
          close: currentData.price,
          timestamp
        }
      } else {
        // Update the current OHLC data for the time interval
        currentOHLC.high = Math.max(currentOHLC.high, currentData.price)
        currentOHLC.low = Math.min(currentOHLC.low, currentData.price)
        currentOHLC.close = currentData.price
      }
    }
  }

  // Push the final OHLC data point
  if (currentOHLC) {
    ohlcData.push(currentOHLC)
  }
  console.log(ohlcData, 'ohlcData')
  return ohlcData
}


export const poolsToCandle = (pools: IPoolData[] | any, tokenAddress: string | undefined): SeriesData[] => {
    let poolsArr: IPoolData[] = []
    for(const pool of pools) {
    console.log(pool, 'poolsToCandle')
      if(tokenAddress === pool?.token1 || tokenAddress === pool?.token0){
        console.log('chamou:', pool)
        poolsArr.push(pool)
      }
    }
    poolsArr.sort((a: IPoolData, b: IPoolData) => { return a.tvl - b.tvl})
    const result = poolsArr[0].price
    return result
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

export const getExplorerUrl = (chain: string | undefined, hash: string | undefined) => {
  switch(chain){
    case 'Shimmer':
      return `https://explorer.evm.testnet.shimmer.network/tx/${hash}`
    case 'Ethereum':
      return `https://etherscan.io/tx/${hash}`
    default:
      return `https://explorer.evm.testnet.shimmer.network/tx/${hash}`
  }
}

export const removeUnmatchedPools = (pools: IPoolData[], tokenAddress: string | any): IPoolData[] => {
  const formattedArr: IPoolData[] = []
  const set = new Set()
  for(const pool of pools){
    if([pool.token0, pool.token1].includes(tokenAddress) && !set.has(pool)){
      formattedArr.push(pool)
      set.add(pool)
    }
  }
  formattedArr.sort((a: IPoolData, b: IPoolData) => { return a.liquidity[a.liquidity.length - 1].liquidity - b.liquidity[b.liquidity.length - 1].liquidity })
  return formattedArr
}

export const filterTx = (txs: ITx[], token0: string, token1: string) => {
  let txArr: ITx[] = []
  const set = new Set()
  for(const tx of txs){
    if(
      [tx.token0, tx.token1].includes(token0) &&
      [tx.token0, tx.token1].includes(token1) &&
      !set.has(tx)
      ){
        txArr.push(tx)
        set.add(tx)
    }
  }
  return txArr
}

export const tradingVolume24h = (swaps: ITx[], tokenAddress: string | any): GroupedEntry[] => {

  let formatedSwaps: GroupedEntry[] = []
  const amount = (tokenAddress0: string, amount0: number, amount1: number): number => { return tokenAddress === tokenAddress0 ? amount0 : amount1 }
  let entryTime = dayjs(swaps[0].time).format('DD')

  formatedSwaps[0] = {
    day: entryTime,
    tvl:  amount(swaps[0].token0, swaps[0].amount0, swaps[0].amount1)
  } 

  for(const swap of swaps){
    if(dayjs(swap.time).format('DD') === entryTime){
      const index = formatedSwaps.findIndex((item) => item.day === entryTime)
      formatedSwaps[index].tvl += amount(swap.token0, swap.amount0, swap.amount1)
    }else{
      formatedSwaps.push({
        day: dayjs(swap.time).format('DD'),
        tvl: amount(swap.token0, swap.amount0, swap.amount1)
      })
      entryTime = dayjs(swap.time).format('DD')
    }
  }

  return formatedSwaps

}

export const volume7D = (groupedEntry: GroupedEntry[]): number => {
  let volume7D = 0
  for(const data of groupedEntry){
    if(groupedEntry.indexOf(data) <= 7){
      console.log(volume7D, 'volume7D')
      volume7D += data.tvl
    }
    break
  }
  return volume7D
}




