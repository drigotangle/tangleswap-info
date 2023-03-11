import { Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, RowWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import Header from '../../components/Header'
import HomeGeneral from '../../components/HomeGeneral'
import PoolDataTable from '../../components/PoolsTable'
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
          const liquidity = res[0]
          const swap = res[1]
          const all = swap.concat(liquidity)
          setTxData(dispatch, all)
        })

        //DAILY VOLUME CHART
        const from = 10000
        getTVL(from, chain).then((res: ITVL[]) => {
            // let arr: ITVL[] | any = []
            // console.log(res, 'res')
            // for(let i = 0; i < res.length; i++){

            // if(i === 0 && res[i].time !== undefined){  
            //     arr.push({
            //         tvl: res[i].tvl,
            //         time: dayjs(res[i].time).format('DD')
            //     })                    
            // }

            // console.log(dayjs(res[i].time).format('DD') !== arr[arr.length - 1]?.time)
            // console.log(dayjs(res[i].time).format('DD') === dayjs(arr[arr.length - 1]?.time).format('DD'))
            // console.log(arr[arr.length - 1]?.time)

            // console.log(dayjs(res[i].time).format('DD'))
            // console.log(dayjs(arr[arr.length - 1]?.time).format('DD'))
            // if(
            //     i > 0 && 
            //     dayjs(res[i].time).format('DD') !== arr[arr.length - 1]?.time &&
            //     res[i].time !== undefined
            //     ){
            //         arr.push({
            //             tvl: res[i].tvl,
            //             time: dayjs(res[i].time).format('DD')
            //         })                    
            // }

            //  if(
            //     i > 0 && 
            //     dayjs(res[i].time).format('DD') === arr[arr.length - 1]?.time &&
            //     res[i].time !== undefined &&
            //     arr[arr.lenght - 1]?.tvl !== undefined
            //     ){
            //     console.log('chamouAqui')
            //     arr[arr.lenght - 1].tvl += res[i].tvl
            //  }
            // }
            
            // arr.sort((a: ITVL, b: ITVL) => {
            //     return Number(a.time) - Number(b.time)
            // })

            // console.log(arr, 'aqui')
            console.log(groupDataByDay(res), 'aqui')
            
            setLiquidtyBarData(dispatch, groupDataByDay(res))
        })

        //POOLS TABLE
        getPools(15, chain).then((res: IPoolData[]) => {
            console.log(res, 'pools')
            setPoolData(dispatch, res)
        })

        //TOKENS TABLE
        getTokens(chain).then((res: IToken[]) => {
            let arr: IToken[] = res
            arr.sort((a: IToken, b: IToken) => {
                return Number(a.TVL) - Number(b.TVL)
            })
            setTokenData(dispatch, arr)
        })

        //TVL CHART 
        getTVL(30, chain).then((res) => {
            console.log(res, 'meu pau')
            let chartData: ITVL[] = []
            for(const data of res){
                chartData.push({
                    time: data.time,
                    tvl: data.tvl
                })
            }
            chartData.sort((a: ITVL, b: ITVL) => {
                return Number(a.time) - Number(b.time)
            })   
            setTVL(dispatch, chartData)
        })

      }, [state.chain])
    return(<>
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
                <Typography variant='h6'>TangleSwap general</Typography>
                <RowWrapper>
                    <TVLChart />
                    <DailyVolumeChart chartWidth={200} chartData={state.barChart} />
                </RowWrapper>
                <HomeGeneral />
                <Typography variant='h6'>Top tokens</Typography>
                <TokenTable />
                <Typography variant='h6'>Top pools</Typography>
                <PoolDataTable />
                <Typography variant='h6'>Recent transactions</Typography>
                <TransactionsTable txData={state.txData} />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Home