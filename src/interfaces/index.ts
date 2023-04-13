export interface ITVL {
    time: number | string
    tvl: number
    block: number
}

export interface IToken {
    tokenName: string
    tokenSymbol: string
    tokenAddress: string
    lastPrice: number
    priceChange: number
    volume24H: number
    TVL?: number
  }

  export interface IPoolLiquidity {
    time: number
    liquidity: number
    block: number
  }

  export interface IPoolPrice {
    time: number
    price: number
  }

  export interface IPoolData {
    _id: string;
    symbol0: string;
    symbol1: string;
    fee: number;
    balance0: any
    balance1: any
    tickSpacing: number;
    pool: string
    price: SeriesData[]
    liquidity: IPoolLiquidity[]
    volume24H: number,
    tvl: number,
    volume7D: number
    token0: string
    token1: string
  }

  export interface ITx {
    eventName: string
    token0: string
    token1: string
    symbol0: string
    symbol1: string
    amount0: number
    amount1: number
    account: string
    block: number
    time: any
    value: any
    hash: string | undefined
  }

  export interface IFee {
    fee: number
    poolAddress: string
    time: any
  }

  export interface GroupedData {
    [day: string]: number;
  }
  
  export interface GroupedEntry {
    day: string;
    tvl: number;
  }

  export interface LiquidityPerDay {
    time: string;
    liquidity: number;
  }

  export interface CandlestickData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }
  
  export interface SeriesData {
    time: string;
    price: number;
    blockNumber: number
  }
  