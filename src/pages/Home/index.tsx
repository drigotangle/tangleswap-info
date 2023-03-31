import { Typography } from '@mui/material'
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
    const { chain } = state

    useEffect(() => {

        //SWAPS TX
        Promise.all([getLiquidityTx(20, chain),  getSwapTx(20, chain)])
        .then(async (res: ITx[][]) => {
        setTxData(dispatch, undefined)
          const liquidity = res[0]
          const swap = res[1]
          let all = swap.concat(liquidity)
          all.sort((a: ITx, b: ITx) => { return b.block - a.block})
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
    return(<>
        <SubHeader />
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
                <Typography variant='h6'>TangleSwap general</Typography>
                <RowWrapper>
                    <TVLChart chartWidth={500} chartData={state.tvl} />
                    <DailyVolumeChart chartWidth={500} chartData={state.barChart} />
                </RowWrapper>
                <HomeGeneral />
                <Typography variant='h6'>Top tokens</Typography>
                <TokenTable tokenList={state.tokenData} />
                <Typography variant='h6'>Top pools</Typography>
                <PoolDataTable pooList={state.poolData} />
                <Typography variant='h6'>Recent transactions</Typography>
                <TransactionsTable chain={chain} txData={state.txData} />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Home