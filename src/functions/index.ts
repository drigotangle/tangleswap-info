import axios from "axios"
import dayjs from "dayjs"
import { CandlestickData, GroupedData, GroupedEntry, IFee, IPoolData, IPoolLiquidity, ITVL, ITx, SeriesData } from "../interfaces"

export const getTVL = async (from: number, chain: string | any): Promise<any | ITVL[]> => {
  try {
    const url = chain === 'Ethereum' ? process.env.REACT_APP_API_ENDPOINT : process.env.REACT_APP_API_ENDPOINT_SHIMMER
    let result = await axios.get(`${url}/tvl/${from}`)
    result.data.sort((a: ITVL | any, b: ITVL | any) => a?.blockNumber - b?.blockNumber)
    console.log(result.data, 'getTvl')
    return result.data
  } catch (error) {
    console.log(error, 'for getTVL')
  }
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



export const feesGenerated = async (chain: string | undefined): Promise<number> => {
  const feesArr: IFee[] = await getFees(chain)
  let totalFee = 0
  console.log(feesArr, 'feesArr')
  for (const fees of feesArr) {
    if (dayjs(fees.time).format('DD') === dayjs(feesArr[feesArr.length - 1].time).format('DD')) {
      totalFee += fees.fee
    }
  }
  console.log(totalFee, 'totalFee')
  return Math.abs(totalFee)
}

export const groupLiquidityPerDay = (data: IPoolLiquidity[]): GroupedEntry[] => {
  const groupedData: GroupedData = {};

  data.forEach((entry: IPoolLiquidity) => {
    const date = new Date(entry.time);
    const dayFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!groupedData[dayFormatted]) {
      groupedData[dayFormatted] = 0;
    }

    groupedData[dayFormatted] += entry.liquidity;
  });

  return Object.keys(groupedData).map((day: string) => ({ day, tvl: groupedData[day] }));
};

export const groupTVLPerDay = (data: ITVL[]): GroupedEntry[] => {
  const groupedData: GroupedData = {};

  data.forEach((entry: ITVL) => {
    const date = new Date(entry.time);
    const dayFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!groupedData[dayFormatted]) {
      groupedData[dayFormatted] = 0;
    }

    groupedData[dayFormatted] += entry.tvl;
  });

  const sortedData = Object.keys(groupedData)
    .map((day: string) => ({ day, tvl: groupedData[day] }))
    .sort((a, b) => {
      const dateA = new Date(a.day);
      const dateB = new Date(b.day);
      return dateA.getTime() - dateB.getTime();
    });

  return sortedData;
};

export const txsForToken = (txs: ITx[], symbol: string): ITx[] => {
  const txSet = new Set()
  let txArr: ITx[] = []
  for (const tx of txs) {
    if (
      (tx.symbol0 === symbol) ||
      (tx.symbol1 === symbol) &&
      !txSet.has(tx)
    ) {
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
  return ohlcData
}


export const poolsToCandle = (pools: IPoolData[] | any, tokenAddress: string | undefined): SeriesData[] => {
  let poolsArr: IPoolData[] = []
  for (const pool of pools) {
    console.log(pool, 'poolsToCandle')
    if (tokenAddress === pool?.token1 || tokenAddress === pool?.token0) {
      poolsArr.push(pool)
    }
  }
  poolsArr.sort((a: IPoolData, b: IPoolData) => { return a.tvl - b.tvl })
  const result = poolsArr[0].price
  return result
}


export const getExplorerUrl = (chain: string | undefined, hash: string | undefined) => {
  switch (chain) {
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
  for (const pool of pools) {
    if ([pool.token0, pool.token1].includes(tokenAddress) && !set.has(pool)) {
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
  for (const tx of txs) {
    if (
      [tx.token0, tx.token1].includes(token0) &&
      [tx.token0, tx.token1].includes(token1) &&
      !set.has(tx)
    ) {
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
    tvl: amount(swaps[0].token0, swaps[0].amount0, swaps[0].amount1)
  }

  for (const swap of swaps) {
    if (dayjs(swap.time).format('DD') === entryTime) {
      const index = formatedSwaps.findIndex((item) => item.day === entryTime)
      formatedSwaps[index].tvl += amount(swap.token0, swap.amount0, swap.amount1)
    } else {
      formatedSwaps.push({
        day: dayjs(swap.time).format('DD'),
        tvl: amount(swap.token0, swap.amount0, swap.amount1)
      })
      entryTime = dayjs(swap.time).format('DD')
    }
  }

  return formatedSwaps

}


export const volume24h = (groupedEntry: GroupedEntry[]): number => {
  let volume7D = 0
  for (const data of groupedEntry) {
    if (groupedEntry.indexOf(data) <= 1) {
      console.log(volume7D, 'volume7D')
      volume7D += data.tvl
    }
    break
  }
  return volume7D
}

export const calculateTVLPercentageDifference = (barChart: ITVL[]): number | null => {
  if (!barChart || barChart.length === 0) {
    return null;
  }

  // Find the most recent data point
  const mostRecentDataPoint = barChart[barChart.length - 1];

  // Find the data point from 24 hours ago
  const currentTime = new Date(mostRecentDataPoint.time);
  const time24HoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const dataPoint24HoursAgo = barChart
    .slice()
    .reverse()
    .find((data) => new Date(data.time).getTime() <= new Date(time24HoursAgo).getTime());

  if (!dataPoint24HoursAgo || dataPoint24HoursAgo.tvl === 0) {
    return null;
  }

  // Calculate the percentage difference
  const difference = mostRecentDataPoint.tvl - dataPoint24HoursAgo.tvl;
  const percentageDifference = (difference / dataPoint24HoursAgo.tvl) * 100;

  return percentageDifference;
}

export const filterTVL = (tvl: ITVL[], poolAddress: string | any) => {
  const filteredTVL = tvl.filter((entry: ITVL) => entry.pool === poolAddress)
  console.log(filteredTVL, 'filteredTVL')
  return filteredTVL
}

export const filterFee = (data: ITx[]) => {
  let feesArr: ITVL[] = []
  for (const fee of data) {
    if (fee.eventName === 'Swap') {
      feesArr.push({
        time: fee.time,
        tvl: fee.feePaid,
        blockNumber: fee.blockNumber,
        pool: fee.pool
      })
    }
  }
  return feesArr
}

export const filterTvlFromLiquidity = (data: ITx[]) => {
  let feesArr: ITVL[] = []

  data = data.sort((a: any, b: any) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime()
  })

  for (const _tvl of data) {
    if (feesArr.length === 0) {
      feesArr.push({
        time: _tvl.time,
        tvl: _tvl.value,
        blockNumber: _tvl.block,
        pool: _tvl.pool
      })
    }

    if (_tvl.eventName === 'IncreaseLiquidity') {
      feesArr.push({
        time: _tvl.time,
        tvl: feesArr[feesArr.length - 1].tvl + _tvl.value,
        blockNumber: _tvl.block,
        pool: _tvl.pool
      })
    }

    if (_tvl.eventName === 'DecreaseLiquidity') {
      feesArr.push({
        time: _tvl.time,
        tvl: feesArr[feesArr.length - 1].tvl - _tvl.value,
        blockNumber: _tvl.block,
        pool: _tvl.pool
      })
    }
  }
  return feesArr
}

export const tradingVolumefromSwap = (data: ITx[], tokenAddress: string | any) => {
  let swapArr: ITVL[] = []

  data = data.sort((a: any, b: any) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime()
  })

  for (const _tvl of data) {
    if (_tvl.eventName === 'Swap') {
      if (_tvl.token0 === tokenAddress) {
        swapArr.push({
          time: _tvl.time,
          tvl: Math.abs(_tvl.amount0),
          blockNumber: _tvl.block,
          pool: _tvl.pool
        })
      }

      if (_tvl.token1 === tokenAddress) {
        swapArr.push({
          time: _tvl.time,
          tvl: Math.abs(_tvl.amount1),
          blockNumber: _tvl.block,
          pool: _tvl.pool
        })
      }
    }
  }
  return swapArr
}

export const tradingVol7d = (data: ITVL[]) => {
  let accVolume = 0
  for (const entry of data) {
    accVolume += Math.abs(entry.tvl)
    if (data.indexOf(entry) < 6) {
      break
    }
  }
  return accVolume
}

export const filterTvlFromLiquidityForToken = (data: ITx[], pools: IPoolData[], tokenAddress: string | any, tokenPrice: number | any) => {
  let tvlArr: ITVL[] = []

  for (const pool of pools) {
    console.log(pool.pool)
    for (const _tvl of data) {
      if (_tvl.pool === pool.pool) {
        if (tvlArr.length === 0) {
          if (_tvl.token0 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: _tvl.amount0 * tokenPrice,
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }

          if (_tvl.token1 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: _tvl.amount1 * tokenPrice,
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }

        } else {
          if (_tvl.eventName === 'IncreaseLiquidity' && _tvl.token0 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: tvlArr[tvlArr.length - 1].tvl + (_tvl.amount0 * tokenPrice),
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }

          if (_tvl.eventName === 'IncreaseLiquidity' && _tvl.token1 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: tvlArr[tvlArr.length - 1].tvl + (_tvl.amount1 * tokenPrice),
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }

          if (_tvl.eventName === 'DecreaseLiquidity' && _tvl.token0 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: tvlArr[tvlArr.length - 1].tvl - (_tvl.amount0 * tokenPrice),
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }

          if (_tvl.eventName === 'DecreaseLiquidity' && _tvl.token1 === tokenAddress) {
            tvlArr.push({
              time: _tvl.time,
              tvl: tvlArr[tvlArr.length - 1].tvl - (_tvl.amount1 * tokenPrice),
              blockNumber: _tvl.block,
              pool: _tvl.pool
            })
          }
        }
      }
    }
  }
  return tvlArr
}

