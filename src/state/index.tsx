import { createContext, useReducer } from 'react'

const initialState = {tvl: []};
type AppState = typeof initialState

type ACTIONTYPE =
  | { type: "SET_LIQUIDITY_DATA"; payload: any }

function reducer(state: AppState, action: ACTIONTYPE) {
  switch (action.type) {
    case "SET_LIQUIDITY_DATA":
      return { tvl: action.payload };
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