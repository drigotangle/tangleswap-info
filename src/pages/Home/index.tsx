import { Typography, Container, Grid, Box, Skeleton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { GlassPanelWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import HomeGeneral from '../../components/HomeGeneral'
import PoolDataTable from '../../components/PoolsTable'
import SubHeader from '../../components/SubHeader'
import TokenTable from '../../components/TokenTable'
import TransactionsTable from '../../components/TransactionsTable'
import { TVLChart } from '../../components/TVLChart'
import { groupTVLPerDay } from '../../functions'
import { ITVL } from '../../interfaces'
import { AppContext, initialState } from '../../state'
import Loading from '../../components/Loading'
import { AnyNsRecord } from 'dns'

const HomeWrapper = styled.div`
    display: flex;
    flex-directangularion: column;
    width: 80vw;
    margin: 10vh auto 10vh;
`


const Home = () => {

    const { state } = useContext(AppContext)
    const [loading, setLoading] = useState(true);
    const { chain, usdPrice, tvl } = state
    const [barChart, setBarChart] = useState<ITVL[] | any[] | any>([{}])
    const storedData = localStorage.getItem('data');

    useEffect(() => {
        if (tvl.length > 1) {
            const _barChart = groupTVLPerDay(tvl);
            setBarChart(_barChart);
        }
    }, [storedData, state]);

    if (state === initialState) {
        return (
            <>
                <SubHeader />
                <Header />
                <Container maxWidth="lg">
                    <Box mt={4} mb={4}>
                        <Typography variant="h4">TangleSwap general</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <GlassPanelWrapper>
                                <Typography variant="h6">TVL</Typography>
                                <Skeleton variant="text" width={200} height={50} />
                                <Skeleton variant="rectangular" width={500} height={200} />
                            </GlassPanelWrapper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GlassPanelWrapper>
                                <Typography variant="h6">Volume 24h</Typography>
                                <Skeleton variant="text" width={200} height={50} />
                                <Skeleton variant="rectangular" width={500} height={200} />
                            </GlassPanelWrapper>
                        </Grid>
                    </Grid>
                    <Box mt={4}>
                        <HomeGeneral />
                    </Box>
                    <Box mt={4} mb={4}>
                        <Typography variant="h4">Top tokens</Typography>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                    <Box mt={4} mb={4}>
                        <Typography variant="h4">Top pools</Typography>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                    <Box mt={4} mb={4}>
                        <Typography variant="h4">Recent transactions</Typography>
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                </Container>
            </>
        );
    }

    return (
        <>
            <SubHeader />
            <Header />
            <Container maxWidth="lg">
                <Box mt={4} mb={4}>
                    <Typography variant="h4">TangleSwap general</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <GlassPanelWrapper>
                            <Typography variant="h6">TVL</Typography>
                            <Typography variant="h3">${Number(tvl[tvl.length - 1]?.tvl * usdPrice).toFixed(2)}</Typography>
                            <TVLChart chartWidth={500} chartData={state.tvl} />
                        </GlassPanelWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <GlassPanelWrapper>
                            <Typography variant="h6">Volume 24h</Typography>
                            <Typography variant="h3">${Number(barChart[barChart?.length - 1]?.tvl ?? 0 * usdPrice).toFixed(2)}</Typography>
                            <DailyVolumeChart chartWidth={500} chartData={barChart} />
                        </GlassPanelWrapper>
                    </Grid>
                </Grid>
                <Box mt={4}>
                    <HomeGeneral />
                </Box>
                <Box mt={4} mb={4}>
                    <Typography variant="h4">Top tokens</Typography>
                </Box>
                <TokenTable tokenList={state.tokenData} />
                <Box mt={4} mb={4}>
                    <Typography variant="h4">Top pools</Typography>
                </Box>
                <PoolDataTable pooList={state.poolData} usdPrice={usdPrice} chain={chain} />
                <Box mt={4} mb={4}>
                    <Typography variant="h4">Recent transactions</Typography>
                </Box>
                <TransactionsTable chain={chain} txData={state.txData} usdPrice={usdPrice} />
            </Container>
        </>
    )
}

export default Home