import { createContext, useReducer } from 'react'
import { GroupedEntry, IPoolData, IToken, ITVL, ITx } from '../interfaces';

export const initialState = {
  tvl: [{ time: '', tvl: 0, blockNumer: 0, poolAddress: ''}],
  barChart: [{ time: '', tvl: 0, blockNumer: 0 }],
  tokenData: [{
    tokenName: '',
    tokenSymbol: '',
    lastPrice: 0,
    priceChange: 0,
    volume24h: 0,
    volume7d: 0,
    tradingVolume24h: 0,
    tradingVolume7D: 0,
    TVL: 0
  }],
  poolData: [],
  txData: [],
  chain: 'Shimmer',
  usdPrice: 0
}
type AppState = typeof initialState

type ACTIONTYPE =
  | { type: "SET_LIQUIDITY_DATA"; payload: ITVL[] | any }
  | { type: "SET_LIQUIDITY_BAR_DATA"; payload: ITVL[] | GroupedEntry[] | any }
  | { type: "SET_TOKEN_DATA"; payload: IToken[] | any }
  | { type: "SET_POOL_DATA"; payload: IPoolData[] | any }
  | { type: "SET_TX_DATA"; payload: ITx[] | any }
  | { type: "SET_CHAIN"; payload: string }
  | { type: 'SET_USD_PRICE'; payload: number }

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
    case "SET_TX_DATA":
      return { ...state, txData: action.payload }
    case "SET_CHAIN":
      return { ...state, chain: action.payload }
    case "SET_USD_PRICE":
      return { ...state, usdPrice: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<ACTIONTYPE>;
}>({ state: initialState, dispatch: () => { } })

export function AppProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext }