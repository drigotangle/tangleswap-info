import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { filterTx, getLiquidityTx, getPools, getSwapTx, groupLiquidityPerDay } from '../../functions'
import { GroupedEntry, IPoolData, IPoolLiquidity, ITx } from '../../interfaces'
import styled from "styled-components";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { ColumnWrapper, RowWrapper, SkeletonWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import SubHeader from '../../components/SubHeader';
import { AppContext } from '../../state';
import Loading from '../../components/Loading';



const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 20vw;
  gap: 2vh;
`

const HomeWrapper = styled(Container)`
  margin-top: 24px;
`;

const Title = styled(Typography)`
  margin-bottom: 16px;
`;

const BalanceContainer = styled(Paper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 16px;
`;

const Balance = styled(Typography)`
  margin-left: 8px;
`;

const PoolPage = () => {
    const [ _poolData, setPoolData ] = useState<IPoolData | any>()
    const [ liquidityData, setLiquidityData ] = useState<GroupedEntry[]>()
    const [ txs, setTxs ] = useState<ITx[] | undefined>()
    const { poolAddress, chain } = useParams()
    const { state } = useContext(AppContext)
    const { usdPrice, poolData, txData } = state
    
    useEffect(() => {
          const index = poolData.findIndex((item: IPoolData) => item.pool === poolAddress)
          const pool: IPoolData | any = poolData[index]
          setPoolData(pool)
          console.log(pool, 'poolPage')
          const poolLiquidity = groupLiquidityPerDay(pool?.liquidity)
          setLiquidityData(poolLiquidity)
          const filteredTx = txData.filter((entry: ITx) => entry.token0 === pool.token0 && entry.token1 === pool.token1)
          setTxs(filteredTx)
          console.log(txs, 'txs')
    }, [])
    
    return (
      <>
        <SubHeader />
        <Header />
        <HomeWrapper>
          {_poolData === undefined || liquidityData === undefined || txs === undefined ? (
            <Loading />
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Title variant="h5">
                  {_poolData?.symbol0}/{_poolData?.symbol1}
                </Title>
                <Typography variant="subtitle1">Total tokens locked</Typography>
                <BalanceContainer>
                  <Typography variant="h6">{_poolData?.symbol0}</Typography>
                  <Balance variant="h6">{Number(_poolData?.balance0).toFixed(2)}</Balance>
                </BalanceContainer>
                <BalanceContainer>
                  <Typography variant="h6">{_poolData?.symbol1} </Typography>
                  <Balance variant="h6">{Number(_poolData?.balance1).toFixed(2)}</Balance>
                </BalanceContainer>
                <Title variant="h4">TVL: {Number(_poolData?.tvl * usdPrice).toFixed(2)}</Title>
                <Title variant="h4">Volume (24h): {Number(_poolData?.volume24H * usdPrice).toFixed(2)}</Title>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DailyVolumeChart chartWidth={500} chartData={liquidityData} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">Recent transactions</Typography>
                <TransactionsTable chain={chain} txData={txs} usdPrice={usdPrice} />
              </Grid>
            </Grid>
          )}
        </HomeWrapper>
      </>
    );
}

export default PoolPage