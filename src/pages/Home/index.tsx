import moment from 'moment'
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
import { getLiquidityTx, getPools, getSwapTx, getTokens, getTVL } from '../../functions'
import { IPoolData, IToken, ITVL, ITx } from '../../interfaces'
import { AppContext } from '../../state'
import { setLiquidtyBarData, setPoolData, setTokenData, setTVL, setTxData } from '../../state/Actions'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
`


const Home = () => {

    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        //SWAPS TX
        Promise.all([getLiquidityTx(20),  getSwapTx(20)]).
        then(async (res: ITx[][]) => {
          const liquidity = res[0]
          const swap = res[1]
          const all = swap.concat(liquidity)
          setTxData(dispatch, all)
        })

        //DAILY VOLUME CHART
        const from = 10000
        getTVL(from).then((res) => {
            let arr: ITVL[] | any = []

            for(let i = 0; i < res.length; i++){

            if(i === 0 && res[i].time !== undefined){  
                arr.push({
                    tvl: res[i].tvl + 8000,
                    time: moment(res[i].time).format('DD')
                })                    
            }


            if(
                i > 0 && 
                moment(res[i].time).format('DD') !== arr[arr.length - 1]?.time &&
                res[i].time !== undefined
                ){
                    arr.push({
                        tvl: res[i].tvl + 8000,
                        time: moment(res[i].time).format('DD')
                    })                    
            }

             if(
                i > 0 && 
                moment(res[i].time).format('DD') === arr[arr.length - 1]?.time &&
                res[i].time !== undefined &&
                arr[arr.lenght - 1]?.tvl !== undefined
                ){
                arr[arr.lenght - 1].tvl += res[i].tvl
             }
            }
            
            arr.sort((a: ITVL, b: ITVL) => {
                return Number(a.time) - Number(b.time)
            })
            
            setLiquidtyBarData(dispatch, arr)
        })

        //POOLS TABLE
        getPools(15).then((res: IPoolData[]) => {
            console.log(res, 'pools')
            setPoolData(dispatch, res)
        })

        //TOKENS TABLE
        getTokens().then((res: IToken[]) => {
            let arr: IToken[] = res
            arr.sort((a: IToken, b: IToken) => {
                return Number(a.TVL) - Number(b.TVL)
            })
            setTokenData(dispatch, arr)
        })

        //TVL CHART 
        getTVL(from).then((res) => {
            console.log(res, 'meu pau')
            let chartData: ITVL[] = []
            res.map((data: ITVL) => {
                chartData.push({
                    time: data.time,
                    tvl: data.tvl + 100000
                })
            })
            chartData.sort((a: ITVL, b: ITVL) => {
                return Number(a.time) - Number(b.time)
            })   
            setTVL(dispatch, chartData)
        })
        
      }, [])
    return(<>
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
                <RowWrapper>
                    <TVLChart />
                    <DailyVolumeChart />
                </RowWrapper>
                <HomeGeneral />
                <TokenTable />
                <PoolDataTable />
                <TransactionsTable />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Home