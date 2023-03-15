import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getLiquidityTx, getPools, getSwapTx, getTokens, groupLiquidityPerDay, poolsForToken, txsForToken } from '../../functions'
import { IPoolData, IPoolLiquidity, IToken, ITx } from '../../interfaces'
import styled from "styled-components";
import { Skeleton, Typography } from "@mui/material";
import { ColumnWrapper, HomeWrapper, RowWrapper, SkeletonWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import PoolsTable from '../../components/PoolsTable';


const Title = styled(Typography)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const Balance = styled(Typography)`
  font-size: 24px;
  margin-left: 8px;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  gap: 2vh;
`

const TokenPage = () => {
    const [ txs, setTxs ] = useState<ITx[]>()
    const [ poolsArr, setPoolsArr ] = useState<IPoolData[]>()
    const { tokenAddress, chain } = useParams()
    
    useEffect(() => {
      Promise.all([getLiquidityTx(50, chain),  getPools(50, chain), getTokens(chain)])
        .then(([tx, pools, tokens]) => {
          console.log(tx, 'tx')
          const index = tokens.findIndex((item: IToken) => tokenAddress === item.tokenAddress)
          const symbol = tokens[index].tokenSymbol
          console.log(tokens[index], 'index')
          setPoolsArr(poolsForToken(pools, tokenAddress))
          setTxs(txsForToken(tx, symbol))
          console.log(txs, symbol, poolsArr, 'aqui as coisa')          
        })
    }, [])
    
    return (<>
      <Header />
      <HomeWrapper>
        {
            [poolsArr, txs].includes(undefined)

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
                <Typography variant='h6'>Recent transactions</Typography>
                <PoolsTable pooList={poolsArr} />
                <TransactionsTable txData={txs}  />          
              </ColumnWrapper>                

        }
        </HomeWrapper>        
      </>);
}

export default TokenPage
