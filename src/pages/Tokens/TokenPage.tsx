import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getCandlestickData, getLiquidityTx, getPools, getSwapTx, getTokens, poolsForToken, poolsToCandle, removeUnmatchedPools, txsForToken } from '../../functions'
import { CandlestickData, IPoolData, IToken, ITx } from '../../interfaces'
import styled from "styled-components";
import { Skeleton, Typography } from "@mui/material";
import { ColumnWrapper, HomeWrapper, RowWrapper, SkeletonWrapper } from '../../components'
import CandleChart from '../../components/CandleChart';
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import PoolsTable from '../../components/PoolsTable';
import SubHeader from '../../components/SubHeader';
import { AppContext } from '../../state';

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  gap: 2vh;
`

const TokenPage = () => {
    const [ txs, setTxs ] = useState<ITx[]>()
    const [ token, setToken ] = useState<IToken>()
    const [ poolsArr, setPoolsArr ] = useState<IPoolData[]>([])
    const [ candleStickData, setCandleStickData ] = useState<CandlestickData[] | any>([])
    const { tokenAddress, chain } = useParams()

    const { state } = useContext(AppContext)
    const { usdPrice } = state
    
    useEffect(() => {
      Promise.all([getLiquidityTx(500, chain), getTokens(chain), getSwapTx(500, chain), getPools(500, chain)])
        .then(([liquidityTx, tokens, swapTx, pools]) => {
          const verifyedPool = removeUnmatchedPools(pools, tokenAddress)
          setPoolsArr(verifyedPool)
          const tokenIndex = tokens.findIndex((item: IToken) => tokenAddress === item.tokenAddress)
          const _token = tokens[tokenIndex]
          setToken(_token)
          const symbol = _token.tokenSymbol
          const _liquidityTxs = txsForToken(liquidityTx, symbol)
          const _swapTxs = txsForToken(swapTx, symbol)
          _liquidityTxs.concat(_swapTxs)
          setTxs(_liquidityTxs)
          const _poolsToCandle = poolsToCandle(verifyedPool, tokenAddress)
          const _candleStickData = getCandlestickData(_poolsToCandle)
          setCandleStickData(_candleStickData)
        }
      )
    }, [])

    useEffect(() => {
      console.log('candleStickData here:', JSON.stringify(candleStickData))
    }, [candleStickData])
    
    return (<>
      <SubHeader />
      <Header />
      <HomeWrapper>
        {
            [poolsArr, txs, candleStickData, token].includes(undefined)

              ?
            <>
            <ColumnWrapper>
              <RowWrapper>
                <SkeletonWrapper><Skeleton variant="rectangular" width={200} height={300}  /></SkeletonWrapper>
                <SkeletonWrapper><Skeleton variant="rectangular" width={600} height={300}  /></SkeletonWrapper>              
              </RowWrapper>
              <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>
              <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>              
            </ColumnWrapper>
            </>
                :
                
                <ColumnWrapper>
                <RowWrapper>
                  <ColumnWrapper>
                  <LeftWrapper>
                  <>
                Tvl: ${(Number(token?.TVL ?? 0) * usdPrice).toFixed(4)}<br />
                24h trading volume: {}<br />
                7d trading volume: {}<br />

              </>
                  </LeftWrapper>             
                  </ColumnWrapper>
                </RowWrapper>
                <CandleChart data={candleStickData} />
                <Typography variant='h6'>Pools using</Typography>
                <PoolsTable pooList={poolsArr} usdPrice={usdPrice} chain={chain} />
                <Typography variant='h6'>Recent transactions</Typography>
                <TransactionsTable chain={chain} txData={txs} usdPrice={usdPrice}  />          
              </ColumnWrapper>                

        }
        </HomeWrapper>        
      </>);
}

export default TokenPage
