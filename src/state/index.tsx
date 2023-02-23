import { createContext, useReducer } from 'react'
import { IPoolData, IToken, ITVL, ITx } from '../interfaces';

const initialState = {
  tvl: [], 
  barChart: [],
  tokenData: [],
  poolData: [],
  txData: []
}
type AppState = typeof initialState

type ACTIONTYPE =
  | { type: "SET_LIQUIDITY_DATA"; payload: ITVL[] | any }
  | { type: "SET_LIQUIDITY_BAR_DATA"; payload: ITVL[] | any}
  | { type: "SET_TOKEN_DATA"; payload: IToken[] | any }
  | { type: "SET_POOL_DATA"; payload: IPoolData[] | any }
  | { type: "SET_LIQUIDITY_TX_DATA"; payload: ITx[] | any }

function reducer(state: AppState, action: ACTIONTYPE) {
  switch (action.type) {
    case "SET_LIQUIDITY_DATA":
      return { ...state, tvl: action.payload };
    case "SET_LIQUIDITY_BAR_DATA":
      return { ...state, barChart: action.payload }
      case "SET_TOKEN_DATA":
        return { ...state, tokenData: action.payload }
        case "SET_POOL_DATA":
          return { ...state, poolData: action.payload }
          case "SET_LIQUIDITY_TX_DATA":
            return { ...state, txData: action.payload }          
      default:
        return state  
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<ACTIONTYPE>;
}>({state: initialState, dispatch: () => {} })

export function AppProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext }