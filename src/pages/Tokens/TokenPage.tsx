import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getCandlestickData, getLiquidityTx, getPools, getTokens, poolsForToken, poolsToCandle, txsForToken } from '../../functions'
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
    const [ poolsArr, setPoolsArr ] = useState<IPoolData[]>()
    const [ candleStickData, setCandleStickData ] = useState<CandlestickData[]>([{time: '0', open: 0, high: 0, low: 0, close: 0}])
    const { tokenAddress, chain } = useParams()

    const { state } = useContext(AppContext)
    const { usdPrice } = state
    
    useEffect(() => {
      Promise.all([getLiquidityTx(50, chain), getPools(50, chain), getTokens(chain)])
        .then(([tx, pools, tokens]) => {
          console.log(tx, pools, tokens, 'chamou')
          const index = tokens.findIndex((item: IToken) => tokenAddress === item.tokenAddress)
          const symbol = tokens[index].tokenSymbol
          console.log(tokens[index], 'indexToken')
          setPoolsArr(poolsForToken(pools, tokenAddress))
          setTxs(txsForToken(tx, symbol))
          const _poolsToCandle = poolsToCandle(pools, tokenAddress)
          const _candleStickData = getCandlestickData(_poolsToCandle, 15)
          console.log(_poolsToCandle, _candleStickData, 'veho')
          setCandleStickData(_candleStickData)     
        })
    }, [])
    
    return (<>
      <SubHeader />
      <Header />
      <HomeWrapper>
        {
            [poolsArr, txs, candleStickData].includes(undefined)

              ?

            <RowWrapper>
              <SkeletonWrapper><Skeleton variant="rectangular" width={200} height={300}  /></SkeletonWrapper>
              <SkeletonWrapper><Skeleton variant="rectangular" width={600} height={300}  /></SkeletonWrapper>              
            </RowWrapper>              
    
                :
                
                <ColumnWrapper>
                <RowWrapper>
                  <ColumnWrapper>
                  <LeftWrapper>
                  </LeftWrapper>             
                  </ColumnWrapper>
                </RowWrapper>
                <CandleChart data={candleStickData} />
                <Typography variant='h6'>Recent transactions</Typography>
                <PoolsTable pooList={state.poolData} usdPrice={usdPrice} chain={chain} />
                <TransactionsTable chain={chain} txData={txs}  />          
              </ColumnWrapper>                

        }
        </HomeWrapper>        
      </>);
}

export default TokenPage
