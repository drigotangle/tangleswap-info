import { ITVL } from "../interfaces"

/**
 * 
 * @param dispatch 
 * @param payload 
 */

export const setTVL = (dispatch: any, payload: any) => {
    dispatch({type: 'SET_LIQUIDITY_DATA', payload: payload})
}