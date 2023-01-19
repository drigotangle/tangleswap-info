import { createContext, useReducer } from 'react'
import { ITVL } from '../interfaces';

const initialState = {
  tvl: [], 
  barChart: []
}
type AppState = typeof initialState

type ACTIONTYPE =
  | { type: "SET_LIQUIDITY_DATA"; payload: ITVL[] | any }
  | { type: "SET_LIQUIDITY_BAR_DATA"; payload: ITVL[] | any}

function reducer(state: AppState, action: ACTIONTYPE) {
  switch (action.type) {
    case "SET_LIQUIDITY_DATA":
      return { tvl: action.payload, barChart: state.barChart };
    case "SET_LIQUIDITY_BAR_DATA":
      return { tvl: state.tvl, barChart: action.payload }
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