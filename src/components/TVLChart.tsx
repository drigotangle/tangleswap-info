import { Area, AreaChart, XAxis } from 'recharts'
import { FC, useContext } from 'react'
import { AppContext } from '../state'
import dayjs from 'dayjs'
import { Skeleton } from '@mui/material'
import styled from 'styled-components'
import { GroupedEntry, IPoolLiquidity } from '../interfaces'

interface IChart {
    chartWidth: number
    chartData: IPoolLiquidity[] | GroupedEntry[] | any
}

const Wrapper = styled.div`
    margin: auto auto;
`

export const TVLChart: FC<IChart> = (props) => {
    const { chartWidth, chartData } = props
    const { state } = useContext(AppContext)

    // useEffect(() => {
    //     const from = 10000       
    //     getTVL(from).then((res) => {
    //         console.log(res, 'meu pau')
    //         let chartData: ITVL[] = []
    //         res.map((data: ITVL) => {
    //             chartData.push({
    //                 time: data.time,
    //                 tvl: data.tvl + 100000
    //             })
    //         })
    //         chartData.sort((a: ITVL, b: ITVL) => {
    //             return Number(a.time) - Number(b.time)
    //         })   
    //         setTVL(dispatch, chartData)
    //     })
    // }, [])

    //1#
    // HERE WE CHECK IF THE DATA LENGTH IS GREATER THEN 0
    // IF IT DOES WE DISPLAY THE CHART OR WE DISPLAY THE
    // SKELETON
    
    return(
        <Wrapper>
        {

            chartData !== undefined 

                ?

                    <AreaChart width={chartWidth} height={300} data={chartData}>
                        <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={10}
                        color='#191B1F'
                        />
                        <Area 
                            dataKey="tvl" 
                            strokeWidth={2}
                            fill='#2172E5'
                            fillOpacity={1} 
                        />              
                    </AreaChart>

                :

                    <Skeleton variant="rectangular" width={500} height={300}  />

        }
        </Wrapper>
    )
}