import { IPoolData, IToken, ITVL, ITx } from "../interfaces"

/**
 * 
 * @param dispatch 
 * @param payload 
 */

export const setTVL = (dispatch: any, payload: ITVL[]) => {
    dispatch({type: 'SET_LIQUIDITY_DATA', payload: payload})
}

export const setLiquidtyBarData = (dispatch: any, payload: ITVL[]) => {
    dispatch({type: 'SET_LIQUIDITY_BAR_DATA', payload: payload})
}

export const setTokenData = (dispatch: any, payLoad: IToken[]) => {
    dispatch({type: 'SET_TOKEN_DATA', payload: payLoad})
}

export const setPoolData = (dispatch: any, payLoad: IPoolData[]) => {
    dispatch({type: 'SET_POOL_DATA', payload: payLoad})
}

export const setLiquidityTxData = (dispatch: any, payLoad: ITx[]) => {
    dispatch({type: 'SET_LIQUIDITY_TX_DATA', payload: payLoad})
}