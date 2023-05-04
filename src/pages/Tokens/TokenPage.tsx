import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { filterTvlFromLiquidityForToken, getCandlestickData, groupTVLPerDay, poolsToCandle, removeUnmatchedPools, tradingVol7d, tradingVolumefromSwap } from '../../functions'
import { CandlestickData, IPoolData, ITVL, IToken, ITx } from '../../interfaces'
import styled from "styled-components";
import { Chip, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { ColumnWrapper, HomeWrapper, PaperWrapper, SpanWrapper, SkeletonWrapper } from '../../components'
import CandleChart from '../../components/CandleChart';
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import PoolsTable from '../../components/PoolsTable';
import SubHeader from '../../components/SubHeader';
import { AppContext, initialState } from '../../state';
import { DailyVolumeChart } from '../../components/DailyVolumeChart';
import { TVLChart } from '../../components/TVLChart';

const TokenPage = () => {
  const [txs, setTxs] = useState<ITx[]>()
  const [token, setToken] = useState<IToken | any>()
  const [tokenVolume7D, setTokenVolume7D] = useState<number>()
  const [ tradingVolumeData, setTradingVolumeData] = useState<ITVL[] | any>([])
  const [tokenVolume24H, setTokenVolume24H] = useState<number>()
  const [ tokenTvlData, setTokenTvlData] = useState<ITVL[] | any>([])
  const [tokenName, setTokenName] = useState<string | any>()
  const [tokenSymbol, setTokenSymbol] = useState<string | any>()
  const [poolsArr, setPoolsArr] = useState<IPoolData[]>([])
  const [candleStickData, setCandleStickData] = useState<CandlestickData[] | any>([])
  const [tabIndex, setTabIndex] = useState(0);
  const { tokenAddress, chain } = useParams()

  const { state } = useContext(AppContext)
  const { usdPrice, txData, tokenData, poolData } = state

  useEffect(() => {
    if (usdPrice && txData && tokenData && poolData) {
      const verifyedPool = removeUnmatchedPools(poolData, tokenAddress)
      setPoolsArr(verifyedPool)
      const tokenIndex = tokenData.findIndex((item: IToken | any) => tokenAddress === item.tokenAddress)
      const _token = tokenData[tokenIndex]
      setTokenName(_token.tokenName)
      setTokenSymbol(_token.tokenSymbol)
      setToken(_token)
      const filteredTxData = txData.filter((entry: ITx) => { return entry.token0 === tokenAddress || entry.token1 === tokenAddress })
      setTxs(filteredTxData)
      const _poolsToCandle = poolsToCandle(verifyedPool, tokenAddress)
      const _candleStickData = getCandlestickData(_poolsToCandle)
      setCandleStickData(_candleStickData)
      const tradingVolumefromSwap_ = tradingVolumefromSwap(filteredTxData, tokenAddress)
      const dailyVolumeSwap = groupTVLPerDay(tradingVolumefromSwap_)
      setTokenVolume24H(dailyVolumeSwap[dailyVolumeSwap.length - 1].tvl)
      const tradingVolume7D = tradingVol7d(tradingVolumefromSwap_)
      setTradingVolumeData(dailyVolumeSwap)
      setTokenVolume7D(tradingVolume7D)
      const tokenTvl = filterTvlFromLiquidityForToken(filteredTxData, poolsArr, tokenAddress, _token.lastPrice)
      console.log(tokenTvl, 'tokenTvl')
      setTokenTvlData(tokenTvl)
    }
  }, [state])

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  if (state.poolData === initialState.poolData || state.txData === initialState.txData) {
    return (
      <>
        <SubHeader />
        <Header />
        <HomeWrapper>
          <ColumnWrapper>
            <Typography variant="h4">Token</Typography>
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Typography variant="h4">Token General</Typography>
            <Skeleton variant="rectangular" width="100%" height={150} />
            <Typography variant="h4">Pools</Typography>
            <Skeleton variant="rectangular" width="100%" height={300} />
            <Typography variant="h4">Recent transactions</Typography>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </ColumnWrapper>
        </HomeWrapper>
      </>
    );
  }


  return (<>
    <SubHeader />
    <Header />
    <HomeWrapper>
      <ColumnWrapper>
        <Typography variant='h4'>{tokenName}{' '}({tokenSymbol})</Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label={<Chip label="Price" />} />
                <Tab label={<Chip label="Trading Volume" />} />
                <Tab label={<Chip label="TVL" />} />
              </Tabs>
              {tabIndex === 0 && <CandleChart props={candleStickData} />}
              {tabIndex === 1 && <DailyVolumeChart chartWidth={500} chartData={tradingVolumeData} />}
              {tabIndex === 2 && <TVLChart chartWidth={500} chartData={tokenTvlData} />}
        
        <Typography variant='h4'>Token General</Typography>
        <Paper>
          <PaperWrapper>
            <SpanWrapper>
              <Typography variant="h5">Tvl: ${Number(token?.TVL ?? 0 * usdPrice).toFixed(2)}</Typography>
            </SpanWrapper>
            <SpanWrapper>
              <Typography variant="h5">24h trading volume: ${Number(tokenVolume24H).toFixed(2)}</Typography>
            </SpanWrapper>
            <SpanWrapper>
              <Typography variant="h5">7d trading volume: ${Number(tokenVolume7D).toFixed(2)}</Typography>
            </SpanWrapper>
          </PaperWrapper>
        </Paper>
        <Typography variant='h4'>Pools</Typography>
        <PoolsTable pooList={poolsArr} usdPrice={usdPrice} chain={chain} />
        <Typography variant='h4'>Recent transactions</Typography>
        <TransactionsTable chain={chain} txData={txs} usdPrice={usdPrice} />
      </ColumnWrapper>
    </HomeWrapper>
  </>);
}

export default TokenPage
