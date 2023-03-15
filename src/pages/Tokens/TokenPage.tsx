import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getLiquidityTx, getPools, getSwapTx, groupLiquidityPerDay } from '../../functions'
import { IPoolData, IPoolLiquidity, ITx } from '../../interfaces'
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
    const [ liquidityData, setLiquidityData ] = useState<IPoolLiquidity[]>()
    const [ poolsArr, setPoolsArr ] = useState<IPoolData[]>()
    const { tokenAddress, chain } = useParams()
    
    useEffect(() => {
      Promise.all([getSwapTx(50, chain),  getPools(50, chain)])
        .then(([tx, pools]) => {
          let poolArr: IPoolData[] = []
          console.log(pools, 'pool')
            for(const pool of pools){
              if(
                pool.token0 === tokenAddress ||
                pool.token1 === tokenAddress
                ){
                  console.log('chamou')
                  poolArr.push(pool)
              }
            }
            setPoolsArr(poolArr)
          console.log(poolArr, liquidityData, 'data')
        })
    }, [])
    
    return (<>
      <Header />
      <HomeWrapper>
        {
            [poolsArr].includes(undefined)

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
                <DailyVolumeChart chartWidth={600} chartData={liquidityData}/>
                </RowWrapper>
                <Typography variant='h6'>Recent transactions</Typography>
                <PoolsTable pooList={poolsArr} />            
              </ColumnWrapper>                

        }
        </HomeWrapper>        
      </>);
}

export default TokenPage