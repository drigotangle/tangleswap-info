export interface ITVL {
    time: number | string
    tvl: number
}

export interface IToken {
    tokenName: string
    tokenAddress: string
    lastPrice: number
    priceChange: number
    volume24H: number
    TVL?: number
  }

  export interface IPoolLiquidity {
    time: number
    liquidity: string
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
    tickSpacing: number;
    pool: string
    price: IPoolPrice[]
    volume24H: number,
    tvl: number,
    volume7D: number
  }

  export interface ITx {
    eventName: string
    token0: string
    token1: string
    symbol0: string
    symbol1: string
    amount0: number
    amount1: number
    blockNumber: number
    time: any
  }
  