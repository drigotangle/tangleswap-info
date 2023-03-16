# Overview

**Router**: In this code, we are defining multiple routes using the `router` object. The `router` object is typically used in web frameworks like Express.js to define the HTTP routes for your application.

**HTTP Methods**: The `router` object is used to define various HTTP routes. In this code, we are using the `get()` method to define a route for handling HTTP GET requests. HTTP GET requests are used to retrieve data from the server.

**Route paths**: The first argument to the `get()` method is a string that defines the path for the route. In this code, we are defining paths for retrieving TVL data, pool data, fee data, liquidity transaction data, swap transaction data, and token data. These paths are `/tvl/:limit`, `/pools/:limit`, `/fees`, `/liquidityTransactions/:limit`, `/swapTransactions/:limit`, and `/tokens` respectively.

**Middleware**: Middleware functions are functions that have access to the request and response objects, and the `next()` function in the application's request-response cycle. Middleware functions can perform tasks such as logging, authentication, and error handling. In this code, we are using `cors` middleware to enable Cross-Origin Resource Sharing (CORS), which allows resources to be requested from another domain.

**Caching**: Caching is a technique for storing frequently accessed data in memory or on disk, to reduce the number of times the data needs to be computed or fetched from a remote server. In this code, we are using caching middleware functions like `tvlCachedMiddleware`, `poolCachedMiddleware`, `feeCachedMiddleware`, `liquidityTxCachedMiddleware`, `swapTxCachedMiddleware`, and `tokenCachedMiddleware` to cache the responses for the corresponding routes.

**Controllers**: Controllers are functions that handle requests to specific routes. In this code, we are using controllers like `tvlController`, `poolController`, `feeController`, `liquidityTxController`, `swapTxController`, and `tokenController` to handle requests for the corresponding routes. These controllers typically interact with a database or external API to retrieve and return the data requested by the client.

# Services

## General services

-   The code exports functions to retrieve data from a database.
-   These functions use asynchronous programming with the `async/await` syntax to handle promises.
-   The functions use the `try/catch` statement to handle any errors that may occur during the execution of the queries.

Topic: Functions

-   `getFees` function: retrieves fee data from a database using the `queryFee` function and returns the result. If an error occurs, it logs the error to the console.
-   `getLiquidityTx` function: retrieves liquidity transaction data from a database using the `queryLiquidityTransactions` function and returns the result. If an error occurs, it logs the error to the console.
-   `getSwapTx` function: retrieves swap transaction data from a database using the `querySwapTransactions` function and returns the result. If an error occurs, it logs the error to the console.
-   `getTvl` function: retrieves TVL (Total Value Locked) data from a database using the `queryTVL` function and returns the result. If an error occurs, it logs the error to the console.

Topic: Functions Dependencies

-   The functions rely on four other functions imported from `../functions/functions` module to retrieve data from a database.
-   The imported functions are `queryFee`, `queryLiquidityTransactions`, `querySwapTransactions`, and `queryTVL`.

Topic: Exported Functions

-   `getFees`: retrieves fee data from the database and returns it.
-   `getLiquidityTx`: retrieves liquidity transaction data from the database and returns it.
-   `getSwapTx`: retrieves swap transaction data from the database and returns it.
-   `getTvl`: retrieves TVL data from the database and returns it.

## Pool service


### Required packages

-   `queryPools`: a function from `functions.js` file that queries pool data from a database.
-   `_tokenSymbol`: a function from `functions.js` file that returns a token symbol from its address.
-   `timeOut`: a function from `functions.js` file that delays a specified amount of time.
-   `tokenBalance`: a function from `functions.js` file that queries token balance data from a database.
-   `dayjs`: a library for manipulating dates and times.

### `poolService(limit)`

This is an asynchronous function that takes in a `limit` parameter and returns an array of pool data.

-   `limit`: the maximum number of results to return.

### Return value

The function returns an array of pool data, where each item in the array is an object with the following properties:

-   `symbol0`: the symbol of the first token in the pool.
-   `symbol1`: the symbol of the second token in the pool.
-   `token0`: the address of the first token in the pool.
-   `token1`: the address of the second token in the pool.
-   `balance0`: the balance of the first token in the pool.
-   `balance1`: the balance of the second token in the pool.
-   `pool`: the address of the pool.
-   `tvl`: the total value locked in the pool.
-   `priceArr`: an array of objects containing price data for the pool.
-   `liquidityArr`: an array of objects containing liquidity data for the pool.
-   `volume24H`: the 24-hour trading volume for the pool.
-   `volume7D`: the 7-day trading volume for the pool.
-   `fee`: the fee charged by the pool.

### Process

-   The function first queries pool data from the database using `queryPools()` function.
-   It then initializes an empty array called `arr`, a `Set` called `dataSet`, and an `interval` variable.
-   It loops through each item in the pool data.
-   For each item, it checks if the item already exists in the `dataSet`. If it does, it skips to the next item. If it does not, it proceeds to the next step.
-   It then uses `Promise.all()` to query token balance data for both tokens in the pool and to delay for a specified interval using `timeOut()` function.
-   It calculates the 24-hour and 7-day trading volumes using data from the `liquidityArr`.
-   It adds the pool data to the `dataSet` and pushes the pool data object to the `arr`.
-   Once all items have been processed, it returns the `arr`.

### Error handling

If an error occurs, the function logs the error and returns `undefined`.

## Token service

### Required Packages

-   `dayjs`: a library that allows for easy manipulation and formatting of dates in JavaScript.

### Functions

-   `getWethPriceAndLiquidity()`: a function that retrieves the price and liquidity of an ERC20 token in terms of WETH.
-   `_tokenName()`: a function that retrieves the name of an ERC20 token.
-   `_tokenSymbol()`: a function that retrieves the symbol of an ERC20 token.
-   `timeOut()`: a function that waits for a specified amount of time before resolving.

### Constants

-   `WETH_ADDRESS`: the Ethereum address of the Wrapped Ether (WETH) token.

### Variables

-   `poolRes`: an array of objects representing Uniswap V3 pools.
-   `poolSet`: a set of objects representing Uniswap V3 pools that have already been processed.
-   `tokenSet`: a set of Ethereum addresses representing ERC20 tokens that have already been processed.
-   `interval`: the time in milliseconds to wait for the `getWethPriceAndLiquidity()` function to resolve before timing out.
-   `tokenArr`: an array of objects representing ERC20 tokens that have been processed.

### Code

-   The `tokenService()` function makes use of the `queryPools()` function to retrieve an array of objects representing Uniswap V3 pools.
-   A `Set()` is created to keep track of processed pools and processed tokens, and an interval variable is set to determine how long to wait for the `getWethPriceAndLiquidity()` function to resolve.
-   A `for` loop is used to iterate through each pool in the `poolRes` array.
-   If the pool's `token1` property matches the `WETH_ADDRESS` constant, the `token0` property is assigned to the `_tokenAddress` variable. Otherwise, the `token1` property is assigned to the `_tokenAddress` variable.
-   If `_tokenAddress` is not `undefined`, the `getWethPriceAndLiquidity()` function is called with `_tokenAddress` as an argument, and the result is stored in a `Promise.all()` call with a call to `timeOut()`. The resulting promise is then resolved with a callback function.
-   Inside the callback function, the last price of the token, price change since yesterday, 24-hour trading volume, total value locked (TVL), and other details of the token are calculated and stored in an object. If the token address has not already been processed, the object is added to the `tokenArr` array, and the token address is added to the `tokenSet` set.
-   Finally, `tokenArr` is returned by the `tokenService()` function.

## Methods

1.  Importing libraries and initializing variables:

The code begins by importing the `ethers` library, which provides a JavaScript interface for interacting with the Ethereum blockchain. The `MongoClient` and `ServerApiVersion` classes are imported from the `mongodb` library, which is used to connect to a MongoDB database. The `uri` variable contains the connection string to the database. A `JsonRpcProvider` object is created from `ethers` using a URL of a JSON-RPC endpoint for the Ethereum network. A few constants are also defined, including `POOL_ABI`, `FACTORY_ABI`, `ERC20_ABI`, `WETH_ADDRESS`, and `ZERO_ADDRESS`.

2.  Querying the TVL (total value locked) collection:

The `queryTVL` function queries the "tvl" collection in the MongoDB database, sorts the results by time in descending order, limits the number of results to `limit`, and returns an array of objects containing the TVL and time of each document in the collection.

3.  Querying the fees-generated collection:

The `queryFee` function queries the "fees-generated" collection in the MongoDB database, returns all documents in the collection as an array, and formats each object to include the fee, time, and pool address.

4.  Querying the liquidity-transactions collection:

The `queryLiquidityTransactions` function queries the "liquidity-transactions" collection in the MongoDB database, sorts the results by block number in descending order, limits the number of results to `limit`, and returns an array of objects containing information about each liquidity transaction. The properties of each object include the event name, token addresses, symbols, amounts, time, pool, and block number.

5.  Querying the swap-transactions collection:

The `querySwapTransactions` function queries the "swap-transactions" collection in the MongoDB database, sorts the results by block number in descending order, limits the number of results to `limit`, and returns an array of objects containing information about each swap transaction. The properties of each object include the event name, token addresses, symbols, amounts, time, and block number.

6.  Converting sqrtPrice to price:

The `sqrtPriceToPrice` function takes the square root of a price value, raises it to the power of two, and divides the result by 2^192.

7.  Querying the pools collection:

The `queryPools` function queries the "pools" collection in the MongoDB database, sorts the results by time in ascending order, limits the number of results to `limit`, and returns an array of objects containing information about each pool.

8.  Getting the WETH price and liquidity:

The `getWethPriceAndLiquidity` function gets the price and liquidity of a pool that contains the specified token address and WETH. The function first creates a `Factory` object from `ethers`, passing in the address of the factory contract and the `FACTORY_ABI`. The function then iterates through an array of fees (`feesArr`) and for each fee, retrieves the pool address using the `getPool` function of the `Factory` object, passing in the token address and WETH address, and the fee. Finally, for each pool address retrieved, the function creates a `Pool` object from `ethers`, passing in the address of the pool contract and the `POOL_ABI`, and retrieves the liquidity and price of the pool using the `liquidity` and `sqrtPrice` properties of the `Pool` object, respectively.

## Cache

This code defines six caches and six middleware functions used to retrieve and return cached data in response to certain API requests. Each cache is defined using the `node-cache` package, which is an in-memory caching solution for Node.js. The caches have a set time-to-live (TTL) that determines how long the data will be stored in the cache before it is invalidated and needs to be refreshed.

The middleware functions are used to check if the requested data is available in the cache and, if it is, to return the cached data in the response. If the data is not available in the cache, the middleware function calls the next middleware function in the chain.


### `poolCache`

-   A cache that stores the list of pools.
-   The `stdTTL` (standard time-to-live) is set to 30 minutes.
-   Exports the `poolCache` object.

### `tokenCache`

-   A cache that stores the list of tokens.
-   The `stdTTL` is set to 30 minutes.
-   Exports the `tokenCache` object.

### `liquidityTxCache`

-   A cache that stores the list of liquidity transactions.
-   The `stdTTL` is set to 10 minutes.
-   Exports the `liquidityTxCache` object.

### `swapTxCache`

-   A cache that stores the list of swap transactions.
-   The `stdTTL` is set to 10 minutes.
-   Exports the `swapTxCache` object.

### `tvlCache`

-   A cache that stores the list of total value locked (TVL) data.
-   The `stdTTL` is set to 10 minutes.
-   Exports the `tvlCache` object.

### `feeCache`

-   A cache that stores the list of fee data.
-   The `stdTTL` is set to 10 minutes.
-   Exports the `feeCache` object.

## Middleware Functions

Each middleware function follows the same basic pattern:

-   Check if the requested data is available in the cache.
-   If the data is available, return it in the response with a status of 200.
-   If the data is not available, call the next middleware function in the chain.

### `poolCachedMiddleware`

-   Middleware function that checks if the `pool-list` is available in the cache.
-   If the data is available, returns it with a status of 200.
-   Exports the `poolCachedMiddleware` function.

### `tokenCachedMiddleware`

-   Middleware function that checks if the `token-list` is available in the cache.
-   If the data is available, returns it with a status of 200.
-   Exports the `tokenCachedMiddleware` function.

### `liquidityTxCachedMiddleware`

-   Middleware function that checks if the `liquidityTx-list` is available in the cache.
-   If the data is available, returns it with a status of 200.
-   Exports the `liquidityTxCachedMiddleware` function.

### `swapTxCachedMiddleware`

-   Middleware function that checks if the `swapTx-list` is available in the cache.
-   If the data is available, returns it with a status of 200.
-   Exports the `swapTxCachedMiddleware` function.

### `tvlCachedMiddleware`

-   Middleware function that checks if the `tvl-list` is available in the cache.
-   If the data is available, returns it with a status of 200.
-   Exports the `tvlCachedMiddleware` function.

### `feeCachedMiddleware`

-   Middleware function that checks if the `fee-list` is available in the cache.
-   If the data is available, returns it with a status of 200.

## Controllers


### poolController

This function fetches pool data from the `poolService`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

### tokenController

This function fetches token data from the `tokenService`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

### liquidityTxController

This function fetches liquidity transaction data from an external service using `getLiquidityTx`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

### swapTxController

This function fetches swap transaction data from an external service using `getSwapTx`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

### tvlController

This function fetches TVL (total value locked) data from an external service using `getTvl`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

### feeControler

This function fetches fee data from an external service using `getFees`, caches it, and then sends it back to the client.

#### Parameters

-   `req`: the HTTP request object
-   `res`: the HTTP response object

## Caches

The `poolCache`, `tokenCache`, `swapTxCache`, `liquidityTxCache`, `tvlCache`, and `feeCache` objects are imported from `../cache/cache`. These caches are used to store the fetched data so that subsequent requests can be served more quickly without having to fetch the data again.
