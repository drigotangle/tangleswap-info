import { ITVL } from "../interfaces"

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