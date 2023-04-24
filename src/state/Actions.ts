import { GroupedEntry, IPoolData, IPoolLiquidity, IToken, ITVL, ITx } from "../interfaces"


export const setTVL = (dispatch: any, payload: ITVL[] | GroupedEntry[] | IPoolLiquidity[] | undefined): void => {
    dispatch({ type: 'SET_LIQUIDITY_DATA', payload: payload })
}

export const setLiquidtyBarData = (dispatch: any, payload: ITVL[] | GroupedEntry[] | IPoolLiquidity[] | undefined): void => {
    dispatch({ type: 'SET_LIQUIDITY_BAR_DATA', payload: payload })
}

export const setTokenData = (dispatch: any, payLoad: IToken[] | undefined): void => {
    dispatch({ type: 'SET_TOKEN_DATA', payload: payLoad })
}

export const setPoolData = (dispatch: any, payLoad: IPoolData[] | undefined): void => {
    dispatch({ type: 'SET_POOL_DATA', payload: payLoad })
}

export const setTxData = (dispatch: any, payLoad: ITx[] | undefined): void => {
    dispatch({ type: 'SET_TX_DATA', payload: payLoad })
}

export const setChain = (dispatch: any, payLoad: string | undefined): void => {
    dispatch({ type: 'SET_CHAIN', payload: payLoad })
}

export const setUsdPrice = (dispatch: any, payLoad: number): void => {
    dispatch({ type: 'SET_USD_PRICE', payload: payLoad })
}