import { GroupedEntry, IPoolData, IPoolLiquidity, IToken, ITVL, ITx } from "../interfaces"


export const setTVL = (dispatch: any, payload: ITVL[]) => {
    dispatch({type: 'SET_LIQUIDITY_DATA', payload: payload})
}

export const setLiquidtyBarData = (dispatch: any, payload: ITVL[] | GroupedEntry[] | IPoolLiquidity[]) => {
    dispatch({type: 'SET_LIQUIDITY_BAR_DATA', payload: payload})
}

export const setTokenData = (dispatch: any, payLoad: IToken[]) => {
    dispatch({type: 'SET_TOKEN_DATA', payload: payLoad})
}

export const setPoolData = (dispatch: any, payLoad: IPoolData[]) => {
    dispatch({type: 'SET_POOL_DATA', payload: payLoad})
}

export const setTxData = (dispatch: any, payLoad: ITx[]) => {
    dispatch({type: 'SET_TX_DATA', payload: payLoad})
}

export const setChain = (dispatch: any, payLoad: string | undefined) => {
    dispatch({type: 'SET_CHAIN', payload: payLoad})
}