# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

# OVERVIEW


<p>
The app feeds exclusively upon the api wich works as a gateway to the database and has those endpoints
<ul>

<li>/tvl/:from: Returns an array of total value locked (TVL) data from the provided from timestamp to the latest one.</li>

<li>/tokens: Returns an array of ERC20 token data.</li>

<li>/pools/:limit: Returns an array of Uniswap pool data, limited by the limit parameter.</li>

<li>/liquidityTransactions/:limit: Returns an array of liquidity transaction data, limited by the limit parameter.</li>

<li>/swapTransactions/:limit: Returns an array of swap transaction data, limited by the limit parameter.</li>

<li>/fees: Returns an array of Uniswap fees data.</li>

</ul>

</p>

## [Routes](https://github.com/TangleSwap/info-tangleswap/blob/main/src/App.tsx)

          <Route path="/" element={<Home />} />

This is a basic route that matches the root URL path and renders the `Home` component.

          <Route path="/:chain/Pools/" element={<Pools />} />

This route matches any URL path that starts with `/:chain/Pools/` and renders the `Pools` component. The `:chain` parameter is a route parameter that will be passed as a prop to the `Pools` component.

          <Route path="/:chain/Pools/:poolAddress" element={<PoolPage />} />

This route matches any URL path that starts with `/:chain/Pools/` and is followed by a `:poolAddress` parameter. It renders the `PoolPage` component and passes both `:chain` and `:poolAddress` as props to the component.

          <Route path="/:chain/Tokens" element={<Tokens />} />

This route matches any URL path that starts with `/:chain/Tokens` and renders the `Tokens` component. The `:chain` parameter is passed as a prop to the `Tokens` component.

          <Route path="/:chain/Tokens/:tokenAddress" element={<TokenPage />} />

This route matches any URL path that starts with `/:chain/Tokens/` and is followed by a `:tokenAddress` parameter. It renders the `TokenPage` component and passes both `:chain` and `:tokenAddress` as props to the component.



## [Methods](https://github.com/TangleSwap/info-tangleswap/blob/main/src/functions/index.ts)

> 1.  `getTVL(from: number, chain: string | undefined): Promise<any | ITVL[]>`

This function retrieves TVL data from the API. It takes two parameters: `from`, a timestamp to start the data retrieval, and `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of TVL data, or an error object if the request fails.

> 2.  `getTokens(chain: string | undefined): Promise<any>`

This function retrieves ERC20 token data from the API. It takes one parameter: `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of token data, or an error object if the request fails.

> 3.  `getPools(limit: number, chain: string | undefined): Promise<any>`
> 
This function retrieves Uniswap pool data from the API. It takes two parameters: `limit`, the maximum number of pools to retrieve, and `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of pool data, or an error object if the request fails.
> 
> 4.  `getLiquidityTx(limit: number, chain: string | undefined): Promise<any>`

This function retrieves liquidity transaction data from the API. It takes two parameters: `limit`, the maximum number of transactions to retrieve, and `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of transaction data, or an error object if the request fails.

    5.  `getSwapTx(limit: number, chain: string | undefined): Promise<any>`
This function retrieves swap transaction data from the API. It takes two parameters: `limit`, the maximum number of transactions to retrieve, and `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of transaction data, or an error object if the request fails. `BACKLOG`: needs to change type for `ItxData`

    6.  `getFees(chain: string | undefined): Promise<IFee[] | any>`
   
   This function retrieves Uniswap fees data from the API. It takes one parameter: `chain`, which determines the API endpoint to use. The function returns a promise that resolves to an array of fee data, or an error object if the request fails.

    7.  `vol24H(liquidity: ITVL[]): number`
   This function calculates the 24-hour volume given an array of TVL data. It takes one parameter: `liquidity`, an array of ITVL objects containing TVL data. The function returns the absolute value of the 24-hour volume as a number.

`feesGenerated = async (chain: string | undefined): Promise<number>`

-   This function takes a `chain` parameter of type string or undefined and returns a Promise of a number.
-   It first calls the `getFees` function with the `chain` parameter to get an array of fee data.
-   It then iterates over each fee in the array and checks if its time matches the time of the last fee in the array (by comparing their formatted day strings).
-   If a fee's time matches, its fee amount is added to a `totalFee` variable.
-   The absolute value of `totalFee` is returned as the function output.

`groupDataByDay = (data: ITVL[]): GroupedEntry[]`

-   This function takes an array of `ITVL` (Interval) objects and returns an array of `GroupedEntry` objects.
-   It first initializes an empty object `groupedData` to store the grouped data.
-   It then iterates over each `ITVL` object in the input array and extracts the start time of the day for that object using the `startOf` function from the `dayjs` library.
-   It then formats the start time as a day string and uses it as a key in `groupedData`.
-   If the key does not exist in `groupedData`, it is initialized to 0.
-   The `tvl` value of the current `ITVL` object is added to the corresponding `dayFormatted` key in `groupedData`.
-   Finally, the `groupedData` object is transformed into an array of `GroupedEntry` objects and returned.

`groupLiquidityPerDay = (data: IPoolLiquidity[]): IPoolLiquidity[]`

-   This function takes an array of `IPoolLiquidity` objects and returns an array of `IPoolLiquidity` objects.
-   It first initializes an empty array `result` to store the grouped liquidity data.
-   It then iterates over each `IPoolLiquidity` object in the input array and extracts the day string using the `dayjs` library.
-   It then checks if there is an existing `IPoolLiquidity` object in the `result` array with the same day.
-   If there is, the `liquidity` value of the current object is added to the existing object's `liquidity` value.
-   If there is not, a new `IPoolLiquidity` object is created with the current day and liquidity values and added to the `result` array.
-   Finally, the `result` array is returned.
- 
`poolsForToken = (pools: IPoolData[], tokenAddress: string | undefined): IPoolData[]`

-   This function takes an array of `IPoolData` objects and a `tokenAddress` parameter of type string or undefined and returns an array of `IPoolData` objects.
-   It first initializes a new `Set` object `poolSet` to keep track of unique pool objects and an empty array `poolArr` to store the filtered pool data.
-   It then iterates over each `IPoolData` object in the input array and checks if either `token0` or `token1` of the pool matches the `tokenAddress` parameter.
-   If there is a match and the pool is not already in `poolSet`, the pool is added to `poolSet` and `poolArr`.
-   Finally, the `poolArr` array is returned.

`txsForToken = (txs: ITx[], symbol: string): ITx[]`

-   This function takes an array of `ITx` (Transaction) objects and a `symbol` parameter of type string and returns an array of `ITx` objects.
-   It first initializes a new `Set` object `txSet` to keep track of unique transaction objects and an empty array `txArr` to store the filtered transaction data.

## [State Manegement](https://github.com/TangleSwap/info-tangleswap/tree/main/src/state)

This state management code is a combination of React's `useReducer` and `createContext` hooks to create a global state. The global state is initialized with an object containing default values for `tvl`, `barChart`, `tokenData`, `poolData`, `txData`, and `chain`. The reducer function takes the current state and an action and returns the updated state.

### Context

The `createContext` hook is used to create a context object that contains the `state` and `dispatch` values. The `state` value is initialized with the initial state object, and the `dispatch` value is initialized with an empty function. The context provider is then used to provide the `state` and `dispatch` values to the children components.

### Reducer

The reducer function is used to update the global state. It takes the current state and an action and returns the updated state. The action is an object with a `type` property that indicates the type of action to perform, and a `payload` property that contains the data to update the state with.

The `switch` statement in the reducer function is used to handle the different action types. For example, if the `type` property of the action object is `'SET_LIQUIDITY_DATA'`, the `tvl` property of the state object is updated with the `payload` value. The `return` statement returns a new object that is a copy of the current state object with the updated property.

### Actions

    setTVL = (dispatch: any, payload: ITVL[] | GroupedEntry[] | IPoolLiquidity[]): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is an array of type `ITVL[]`, `GroupedEntry[]`, or `IPoolLiquidity[]`. It dispatches an action object of type `"SET_LIQUIDITY_DATA"` to the reducer with the payload as the value. The purpose of this function is to update the state with new TVL data.

    setLiquidtyBarData = (dispatch: any, payload: ITVL[] | GroupedEntry[] | IPoolLiquidity[]): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is an array of type `ITVL[]`, `GroupedEntry[]`, or `IPoolLiquidity[]`. It dispatches an action object of type `"SET_LIQUIDITY_BAR_DATA"` to the reducer with the payload as the value. The purpose of this function is to update the state with new liquidity bar chart data.

    const  setTokenData = (dispatch: any, payLoad: IToken[]): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is an array of type `IToken[]`. It dispatches an action object of type `"SET_TOKEN_DATA"` to the reducer with the payload as the value. The purpose of this function is to update the state with new token data.

    setPoolData = (dispatch: any, payLoad: IPoolData[]): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is an array of type `IPoolData[]`. It dispatches an action object of type `"SET_POOL_DATA"` to the reducer with the payload as the value. The purpose of this function is to update the state with new pool data.

    setTxData = (dispatch: any, payLoad: ITx[]): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is an array of type `ITx[]`. It dispatches an action object of type `"SET_TX_DATA"` to the reducer with the payload as the value. The purpose of this function is to update the state with new transaction data.

    setChain = (dispatch: any, payLoad: string | undefined): void

This function takes two arguments, `dispatch` and `payload`. The `dispatch` argument is a function used to send an action object to the reducer, while the `payload` argument is a string or `undefined`. It dispatches an action object of type `"SET_CHAIN"` to the reducer with the payload as the value. The purpose of this function is to update the state with a new selected chain.

## Interfaces

Interfaces define the structure of objects that will be used in a TypeScript code. Here is a brief documentation for each interface in this code:

### ITVL

This interface represents Time-Value-Liquidity data with two fields: `time` and `tvl`. `time` can be a number or a string, while `tvl` is a number.

### IToken

This interface represents information about a token with the following fields:

-   `tokenName`: the name of the token.
-   `tokenSymbol`: the symbol of the token.
-   `tokenAddress`: the contract address of the token.
-   `lastPrice`: the last price of the token.
-   `priceChange`: the price change of the token.
-   `volume24H`: the 24-hour trading volume of the token.
-   `TVL`: the total value locked in the token, optional.

### IPoolLiquidity

This interface represents Pool-Liquidity data with two fields: `time` and `liquidity`. `time` is a number, and `liquidity` is also a number representing the liquidity of the pool at a specific time.

### IPoolPrice

This interface represents Pool-Price data with two fields: `time` and `price`. `time` is a number, and `price` is also a number representing the price of the pool at a specific time.

### IPoolData

This interface represents information about a pool with the following fields:

-   `_id`: the unique identifier of the pool.
-   `symbol0`: the symbol of the first token in the pool.
-   `symbol1`: the symbol of the second token in the pool.
-   `fee`: the fee percentage of the pool.
-   `balance0`: the balance of the first token in the pool.
-   `balance1`: the balance of the second token in the pool.
-   `tickSpacing`: the tick spacing of the pool.
-   `pool`: the contract address of the pool.
-   `priceArr`: an array of `SeriesData` representing the price of the pool over time.
-   `liquidityArr`: an array of `SeriesData` representing the liquidity of the pool over time.
-   `volume24H`: the 24-hour trading volume of the pool.
-   `tvl`: the total value locked in the pool.
-   `volume7D`: the 7-day trading volume of the pool.
-   `token0`: the contract address of the first token in the pool.
-   `token1`: the contract address of the second token in the pool.

### ITx

This interface represents transaction data with the following fields:

-   `eventName`: the name of the event.
-   `token0`: the contract address of the first token.
-   `token1`: the contract address of the second token.
-   `symbol0`: the symbol of the first token.
-   `symbol1`: the symbol of the second token.
-   `amount0`: the amount of the first token in the transaction.
-   `amount1`: the amount of the second token in the transaction.
-   `blockNumber`: the block number of the transaction.
-   `time`: the timestamp of the transaction.

### IFee

This interface represents the fee data of a pool with the following fields:

-   `fee`: the fee percentage of the pool.
-   `poolAddress`: the contract address of the pool.
-   `time`: the timestamp of the fee.


### GroupedData

This interface represents a collection of data grouped by day. The keys of the object are strings representing the day, and the values are numbers.

Properties:

-   `day`: string - A string representing the day.
-   `tvl`: number - The total value locked for that day.

### GroupedEntry

This interface represents a single entry in a collection of data grouped by day. It contains a string representing the day and the total value locked for that day.

Properties:

-   `day`: string - A string representing the day.
-   `tvl`: number - The total value locked for that day.

### LiquidityPerDay

This interface represents the liquidity for a single day.

Properties:

-   `time`: string - The date and time for the liquidity data.
-   `liquidity`: number - The liquidity value for that date and time.

### CandlestickData

This interface represents data for a candlestick chart.

Properties:

-   `time`: number - The timestamp for the data point.
-   `open`: number - The opening price for the period.
-   `high`: number - The highest price for the period.
-   `low`: number - The lowest price for the period.
-   `close`: number - The closing price for the period.

### SeriesData

This interface represents a data point for a series.

Properties:

-   `time`: number - The timestamp for the data point.
-   `price`: string - The price value for the data point.

## Style

**Typography**

-   `fontFamily`: Defines the font family for text elements.
-   `body1`: Defines the styles for body text.
-   `body2`: Defines the styles for a second-level body text.
-   `h1` to `h6`: Defines the styles for headings from level 1 to level 6.

**Palette**

-   `mode`: Defines the color mode, either `light` or `dark`.
-   `background`: Defines the background color for various elements, such as the page background (`default`) and cards (`paper`).
-   `primary`: Defines the main color for the app, often used for primary actions and links.
-   `secondary`: Defines a secondary color that complements the primary color.

**GlobalStyle**

-   `createGlobalStyle`: A function from the `styled-components` library that allows defining global styles.
-   `body`: Defines the styles for the `body` element, which typically covers the entire page.
-   `margin`: Defines the margin space around the `body` element.
-   `padding`: Defines the padding space inside the `body` element.
-   `background-color`: Defines the background color for the `body` element.
-   `color`: Defines the text color for the `body` element and its descendants.





