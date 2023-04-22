import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getCandlestickData, getLiquidityTx, getPools, getSwapTx, getTokens, volume7D, poolsToCandle, removeUnmatchedPools, tradingVolume24h, txsForToken } from '../../functions'
import { CandlestickData, GroupedData, GroupedEntry, IPoolData, IToken, ITx } from '../../interfaces'
import styled from "styled-components";
import { Paper, Skeleton, Typography } from "@mui/material";
import { ColumnWrapper, HomeWrapper, PaperWrapper, SpanWrapper, SkeletonWrapper } from '../../components'
import CandleChart from '../../components/CandleChart';
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import PoolsTable from '../../components/PoolsTable';
import SubHeader from '../../components/SubHeader';
import { AppContext } from '../../state';
import Loading from '../../components/Loading';

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  gap: 2vh;
`

const TokenPage = () => {
  const [txs, setTxs] = useState<ITx[]>()
  const [token, setToken] = useState<IToken | any>()
  const [_tradingVolume24h, _setTradingVolume24h] = useState<number>()
  const [loading, setLoading] = useState(true);
  const [tokenVolume7D, setTokenVolume7D] = useState<number>()
  const [tokenVolume24H, setTokenVolume24H] = useState<number>()
  const [ tokenName, setTokenName] = useState<string | any>()
  const [ tokenSymbol, setTokenSymbol ] = useState<string | any>()
  const [poolsArr, setPoolsArr] = useState<IPoolData[]>([])
  const [candleStickData, setCandleStickData] = useState<CandlestickData[] | any>([])
  const { tokenAddress, chain } = useParams()

  const { state } = useContext(AppContext)
  const { usdPrice, txData, tokenData, poolData } = state

  useEffect(() => {
    if(usdPrice && txData && tokenData && poolData){
      const verifyedPool = removeUnmatchedPools(poolData, tokenAddress)
      setPoolsArr(verifyedPool)
      const tokenIndex = tokenData.findIndex((item: IToken | any) => tokenAddress === item.tokenAddress)
      const _token = tokenData[tokenIndex]
      setTokenName(_token.tokenName)
      setTokenSymbol(_token.tokenSymbol)
      // const _volume7D = _token.volume7d = token.volume7D * usdPrice
      setToken(_token)
      // const _volume24h = _token.volume24h * usdPrice
      // setTokenVolume24H(_volume24h)
      // setTokenVolume7D(_volume7D)
      console.log(txData, 'before')
      const filteredTxData = txData.filter((entry: ITx) => { return entry.token0 === tokenAddress || entry.token1 === tokenAddress})
      console.log(filteredTxData, 'after')
      setTxs(filteredTxData)
      const _poolsToCandle = poolsToCandle(verifyedPool, tokenAddress)
      const _candleStickData = getCandlestickData(_poolsToCandle)
      setCandleStickData(_candleStickData)
      const _swapTxs = txData.filter((entry: ITx | any) => entry.eventName === 'IncreaseLiquidity')
      const trandingVolume = tradingVolume24h(_swapTxs, tokenAddress)
      _setTradingVolume24h(trandingVolume[trandingVolume.length - 1].tvl * verifyedPool[0].price[verifyedPool[0].price.length - 1].price * usdPrice)
    }
  }, [state])

  useEffect(() => {
    console.log('candleStickData here:', JSON.stringify(candleStickData))
  }, [candleStickData])

  if (loading) {
    return (<>
        <SubHeader  />
        <Header />
        <Loading />
    </>)
}

  return (<>
    <SubHeader  />
    <Header />
    <HomeWrapper>
      {
        [poolsArr, txs, candleStickData, token].includes(undefined)

          ? 

          <>
            <Loading />
          </>

          :

          <ColumnWrapper>
            <Typography variant='h4'>{tokenName}{' '}({tokenSymbol})</Typography>
            {candleStickData.length > 0 ? <CandleChart props={candleStickData} /> : null}
            <Typography variant='h4'>Token General</Typography>
            <Paper>
              <PaperWrapper>
                <SpanWrapper>
                  <Typography variant="h5">Tvl: ${Number(token?.TVL ?? 0 * usdPrice).toFixed(2)}</Typography>
                </SpanWrapper>
                <SpanWrapper>
                  <Typography variant="h5">24h trading volume: ${}</Typography>
                </SpanWrapper>
                <SpanWrapper>
                  <Typography variant="h5">7d trading volume: ${}</Typography>
                </SpanWrapper>
              </PaperWrapper>
            </Paper>
            <Typography variant='h4'>Pools</Typography>
            <PoolsTable pooList={poolsArr} usdPrice={usdPrice} chain={chain} />
            <Typography variant='h4'>Recent transactions</Typography>
            <TransactionsTable chain={chain} txData={txs} usdPrice={usdPrice} />
          </ColumnWrapper>

      }
    </HomeWrapper>
  </>);
}

export default TokenPage
