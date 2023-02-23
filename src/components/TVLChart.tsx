import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import { DataKey } from 'recharts/types/util/types'
import { getTVL } from '../functions'
import { useContext, useEffect, useState } from 'react'
import { setTVL } from '../state/Actions'
import { AppContext } from '../state'
import dayjs from 'dayjs'
import { Skeleton } from '@mui/material'
import { ITVL } from '../interfaces'

export const TVLChart = () => {
    const { state, dispatch } = useContext(AppContext)
    const [ minMaxValue, setMinMaxValue ] = useState<DataKey<number>>()

    useEffect(() => {
        const from = 10000       
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

    //1#
    // HERE WE CHECK IF THE DATA LENGTH IS GREATER THEN 0
    // IF IT DOES WE DISPLAY THE CHART OR WE DISPLAY THE
    // SKELETON
    
    return(
        <>
        {

            state.tvl.length > 0 

                ?

                    <AreaChart width={500} height={300} data={state.tvl}>
                        <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(time) => dayjs(time).format('DD')}
                        minTickGap={10}
                        />
                        <Area dataKey="tvl" strokeWidth={2}/>              
                    </AreaChart>

                :

                    <Skeleton variant="rectangular" width={500} height={300}  />

        }
        </>
    )
}