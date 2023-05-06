import { Typography, Container, Grid, Box, Skeleton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { GlassPanelWrapper, HomeWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import HomeGeneral from '../../components/HomeGeneral'
import PoolDataTable from '../../components/PoolsTable'
import SubHeader from '../../components/SubHeader'
import TokenTable from '../../components/TokenTable'
import TransactionsTable from '../../components/TransactionsTable'
import { TVLChart } from '../../components/TVLChart'
import { filterFee, filterTvlFromLiquidity, formatCompactNumber, groupTVLPerDay } from '../../functions'
import { ITVL } from '../../interfaces'
import { AppContext, initialState } from '../../state'



const Home = () => {

    const { state } = useContext(AppContext)
    const { chain, usdPrice, txData, tokenData } = state
    const [barChart, setBarChart] = useState<ITVL[] | any[] | any>([{}])
    const [lineChart, setLineChart] = useState<ITVL[] | any[]>([])
    const [feeData, setFeeData] = useState<string>()
    const [ wholeTVL, setWholeTVL] = useState<string>()
    const [ volume24h, setVolume24h] = useState<string>()
    const storedData = localStorage.getItem('data');

    useEffect(() => {
        if (txData.length > 1 && state.tokenData !== initialState.tokenData) {
            const tvlLine = filterTvlFromLiquidity(txData)
            setLineChart(tvlLine)
            const _barChart = groupTVLPerDay(tvlLine);
            setBarChart(_barChart);
            const formatedVolume24h = formatCompactNumber(_barChart[_barChart.length - 1].tvl)
            setVolume24h(formatedVolume24h)
            const fees = filterFee(txData)
            const wholeFee = fees.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.tvl, 0)
            const formatedFee = formatCompactNumber(wholeFee)
            console.log(formatedFee, 'formatedFee')
            setFeeData(formatedFee)
            console.log(state.txData, 'state.txData')
            const sumTVL = tokenData.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.TVL, 0);
            const wholeTVL = sumTVL * usdPrice
            const formatedTVL = formatCompactNumber(Number(wholeTVL))
            console.log(wholeTVL, formatedTVL, 'formatedTVL')
            setWholeTVL(formatedTVL)
        }
    }, [txData, tokenData, usdPrice]);

    if (state.txData === initialState.txData || state.usdPrice === initialState.usdPrice) {
        return (<>
            <SubHeader />
            <Header />
            <HomeWrapper>
                <Container maxWidth="lg">
                    <Box mt={4} mb={4}>
                        <Typography variant="h4">TangleSwap general</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <GlassPanelWrapper>
                                <Typography variant="h6">TVL</Typography>
                                <Skeleton variant="text" width={80} height={50} />
                                <Skeleton variant="rectangular" width={250} height={200} />
                            </GlassPanelWrapper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GlassPanelWrapper>
                                <Typography variant="h6">Volume 24h</Typography>
                                <Skeleton variant="text" width={80} height={50} />
                                <Skeleton variant="rectangular" width={250} height={200} />
                            </GlassPanelWrapper>
                        </Grid>
                    </Grid>
                    <Box mt={4}>
                        <Skeleton variant="rectangular" width="100%" height={20} />
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
            </HomeWrapper>
            </>);
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
                            <Typography variant="h3">${wholeTVL}</Typography>
                            <TVLChart chartWidth={500} chartData={lineChart} />
                        </GlassPanelWrapper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <GlassPanelWrapper>
                            <Typography variant="h6">Volume 24h</Typography>
                            <Typography variant="h3">${volume24h}</Typography>
                            <DailyVolumeChart chartWidth={500} chartData={barChart} />
                        </GlassPanelWrapper>
                    </Grid>
                </Grid>
                <Box mt={4}>
                    <HomeGeneral
                        volume24h={volume24h}
                        feesGenerated={feeData}
                        tvl={wholeTVL}
                    />
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