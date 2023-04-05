import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getLiquidityTx, getPools, groupLiquidityPerDay } from '../../functions'
import { IPoolData, IPoolLiquidity, ITx } from '../../interfaces'
import styled from "styled-components";
import { Skeleton, Typography } from "@mui/material";
import { ColumnWrapper, HomeWrapper, RowWrapper, SkeletonWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import SubHeader from '../../components/SubHeader';


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

const PoolPage = () => {
    const [ poolData, setPoolData ] = useState<IPoolData>()
    const [ liquidityData, setLiquidityData ] = useState<IPoolLiquidity[]>()
    const [ txs, setTxs ] = useState<ITx[] | undefined>()
    const { poolAddress, chain } = useParams()
    
    useEffect(() => {
      Promise.all([getLiquidityTx(50, chain),  getPools(50, chain)])
        .then(([tx, pools]) => {
          let txArr: ITx[] = []
          const index = pools.findIndex((item: IPoolData) => item.pool === poolAddress)
          setPoolData(pools[index])
          console.log(groupLiquidityPerDay(pools[index].liquidityArr), 'daily')
          setLiquidityData(groupLiquidityPerDay(pools[index].liquidityArr))
            for(const _tx of tx){
              console.log(_tx.pool, poolAddress, 'igual?')
              if(
                _tx.pool === pools[index].pool
                ){
                txArr.push(_tx)
              }
            }
          setTxs(txArr)
          console.log(txs, poolData, liquidityData, 'data')
        })
    }, [])
    
    return (<>
      <SubHeader />
      <Header />
      <HomeWrapper>
        {
            [poolData, liquidityData, txs].includes(undefined)

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
                    <Title variant="h5"> {poolData?.symbol0}/{poolData?.symbol1} </Title>
                    <> 
                      Total tokens locked
                      <BalanceContainer>
                        <Typography variant="h6">{poolData?.symbol0} balance</Typography>
                        <Balance variant="h6">{' '}{poolData?.balance0 ?? 0}</Balance>
                      </BalanceContainer>
                      <BalanceContainer>
                        <Typography variant="h6">{poolData?.symbol1} balance</Typography>
                        <Balance variant="h6">{' '}{poolData?.balance1 ?? 0}</Balance>
                      </BalanceContainer>                    
                    </>
                    <Title variant="h6" style={{ marginTop: 32 }}>
                      TVL: {poolData?.tvl}
                    </Title>
                    <Title variant="h6" style={{ marginTop: 16 }}>
                      Volume (24h): {poolData?.volume24H}
                    </Title>
                  </LeftWrapper>             
                  </ColumnWrapper>
                <DailyVolumeChart chartWidth={600} chartData={liquidityData}/>
                </RowWrapper>
                <Typography variant='h6'>Recent transactions</Typography>
                <TransactionsTable chain={chain} txData={txs} />             
              </ColumnWrapper>                

        }
        </HomeWrapper>        
      </>);
}

export default PoolPage