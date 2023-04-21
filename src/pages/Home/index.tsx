import { Typography, Container, Grid, Box } from '@mui/material'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, RowWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import HomeGeneral from '../../components/HomeGeneral'
import PoolDataTable from '../../components/PoolsTable'
import SubHeader from '../../components/SubHeader'
import TokenTable from '../../components/TokenTable'
import TransactionsTable from '../../components/TransactionsTable'
import { TVLChart } from '../../components/TVLChart'
import { getLiquidityTx, getPools, getSwapTx, getTokens, getTVL, groupDataByDay } from '../../functions'
import { IPoolData, IToken, ITVL, ITx } from '../../interfaces'
import { AppContext } from '../../state'
import { setLiquidtyBarData, setPoolData, setTokenData, setTVL, setTxData } from '../../state/Actions'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: 10vh auto 10vh;
`


const Home = () => {

    const { dispatch, state } = useContext(AppContext)
    const { chain, usdPrice } = state

    useEffect(() => {

        //SWAPS TX
        Promise.all([getLiquidityTx(20, chain), getSwapTx(20, chain)])
            .then(async (res: ITx[][]) => {
                setTxData(dispatch, undefined)
                const liquidity = res[0]
                const swap = res[1]
                let all = swap.concat(liquidity)
                all.sort((a: ITx, b: ITx) => { return b.block - a.block })
                setTxData(dispatch, all)
            })

        //DAILY VOLUME CHART
        const from = 10000
        getTVL(from, chain).then((res: ITVL[]) => {
            setLiquidtyBarData(dispatch, undefined)
            setLiquidtyBarData(dispatch, groupDataByDay(res))
        })

        //POOLS TABLE
        getPools(15, chain).then((res: IPoolData[]) => {
            setPoolData(dispatch, undefined)
            setPoolData(dispatch, res)
        })

        //TOKENS TABLE
        getTokens(chain).then((res: IToken[]) => {
            setTokenData(dispatch, undefined)
            let arr: IToken[] = res
            arr.sort((a: IToken, b: IToken) => {
                return Number(a.TVL) - Number(b.TVL)
            })
            setTokenData(dispatch, arr)
        })

        //TVL CHART 
        getTVL(30, chain).then((res) => {
            setTVL(dispatch, undefined)

            setTVL(dispatch, groupDataByDay(res))
        })

    }, [state.chain])
    return (
        <>
            <SubHeader />
            <Header />
            <Container maxWidth="lg">
                <Box mt={4} mb={4}>
                    <Typography variant="h4">TangleSwap general</Typography>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">TVL</Typography>
                        <TVLChart chartWidth={500} chartData={state.tvl} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Volume 24h</Typography>
                        <DailyVolumeChart chartWidth={500} chartData={state.barChart} />
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