import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { filterFee, filterTVL, filterTvlFromLiquidity, filterTx, getLiquidityTx, getPools, getSwapTx, groupLiquidityPerDay, groupTVLPerDay } from '../../functions'
import { GroupedEntry, IPoolData, IPoolLiquidity, ITVL, ITx } from '../../interfaces'
import styled from "styled-components";
import { Chip, Container, Grid, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { ColumnWrapper, RowWrapper, SkeletonWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import TransactionsTable from '../../components/TransactionsTable';
import SubHeader from '../../components/SubHeader';
import { AppContext, initialState } from '../../state';
import Loading from '../../components/Loading';
import { TVLChart } from '../../components/TVLChart';



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
  const [_poolData, setPoolData] = useState<IPoolData | any>()
  const [liquidityData, setLiquidityData] = useState<GroupedEntry[]>()
  const [liquiditySerie, setLiquiditySerie] = useState<ITVL[]>([])
  const [fees, setFees] = useState<ITVL[]>([])
  const [txs, setTxs] = useState<ITx[] | undefined>()
  const { poolAddress, chain } = useParams()
  const { state } = useContext(AppContext)
  const { usdPrice, poolData, txData } = state
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    if (state !== initialState) {
      const index = poolData.findIndex((item: IPoolData) => item.pool === poolAddress)
      const pool: IPoolData | any = poolData[index]
      setPoolData(pool)
      const tvlLine = filterTvlFromLiquidity(txData)
      const tvlLineForPool = tvlLine.filter((entry) => { return entry.pool === poolAddress })
      const _barChart = groupTVLPerDay(tvlLineForPool);
      setLiquidityData(_barChart)
      const filteredTx = txData.filter((entry: ITx) => entry.token0 === pool.token0 && entry.token1 === pool.token1)
      setTxs(filteredTx)
      const filteredTVL = filterTVL(tvlLine, poolAddress)
      console.log(tvlLine, 'filteredTVL')
      setLiquiditySerie(filteredTVL)
      const fees = filterFee(state.txData)
      const filterfees = fees.filter((entry: ITVL) => { return entry.pool === poolAddress })
      setFees(filterfees)
      //
    }
  }, [state])

  if (state.poolData === initialState.poolData || state.txData === initialState.txData) {
    return (
      <>
        <SubHeader />
        <Header />
        <HomeWrapper>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="text" width={200} height={50} />
              <Skeleton variant="text" width={200} height={50} />
              <Skeleton variant="text" width={200} height={50} />
              <Skeleton variant="text" width={200} height={50} />
              <Skeleton variant="text" width={200} height={50} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rectangular" width={500} height={200} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="text" width={200} height={50} />
              <Skeleton variant="rectangular" width="100%" height={300} />
            </Grid>
          </Grid>
        </HomeWrapper>
      </>
    );
  }

  return (
    <>
      <SubHeader />
      <Header />
      <HomeWrapper>
        {_poolData === undefined || liquidityData === undefined || txs === undefined ? (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">
                <Skeleton variant="text" width="100%" />
              </Typography>
              <Typography variant="subtitle1">
                <Skeleton variant="text" width="50%" />
              </Typography>
              <Paper>
                <Skeleton variant="rectangular" width="100%" height={64} />
              </Paper>
              <Paper>
                <Skeleton variant="rectangular" width="100%" height={64} />
              </Paper>
              <Typography variant="h4">
                <Skeleton variant="text" width="50%" />
              </Typography>
              <Typography variant="h4">
                <Skeleton variant="text" width="50%" />
              </Typography>
              <Typography variant="h4">
                <Skeleton variant="text" width="50%" />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">Recent transactions</Typography>
              <Paper>
                <Skeleton variant="rectangular" width="100%" height={400} />
              </Paper>
            </Grid>
          </Grid>
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
              <Title variant="h4">TVL: ${Number(liquiditySerie[liquiditySerie.length - 1]?.tvl * usdPrice).toFixed(2)}</Title>
              <Title variant="h4">Volume (24h): ${Number(_poolData?.volume24H * usdPrice).toFixed(2)}</Title>
              <Title variant="h4">Fees generated: ${Number((fees[fees.length - 1]?.tvl ?? 0) * usdPrice).toFixed(2)}</Title>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label={<Chip label="TVL Chart" />} />
                <Tab label={<Chip label="Daily Volume Chart" />} />
              </Tabs>
              {tabIndex === 0 && <TVLChart chartWidth={500} chartData={liquiditySerie} />}
              {tabIndex === 1 && <DailyVolumeChart chartWidth={500} chartData={liquidityData} />}
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