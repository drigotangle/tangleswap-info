import { BarChart, ResponsiveContainer, XAxis, Bar } from 'recharts'
import { getTVL } from '../functions'
import { useContext, useEffect, useState } from 'react'
import { setTVL, setLiquidtyBarData } from '../state/Actions'
import dayjs from 'dayjs'
import { AppContext } from '../state'
import { Skeleton } from '@mui/material'
import { ITVL } from '../interfaces'
import moment from 'moment'

export const DailyVolumeChart = () => {
    const { state, dispatch } = useContext(AppContext)
    // const [ minMaxValue, setMinMaxValue ] = useState<DataKey<number>>()

    useEffect(() => {
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
    }, [])

    //1#
    // HERE WE CHECK IF THE DATA LENGTH IS GREATER THEN 0
    // IF IT DOES WE DISPLAY THE CHART OR WE DISPLAY THE
    // SKELETON
    
    return(
        <>
        {

            state.tvl.length > 0 && state.barChart !== undefined

                ?
                    <BarChart width={500} height={300} data={state.barChart}>
                        <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={10}
                        />
                        <Bar 
                        dataKey="tvl" 
                        barSize={10}
                        />              
                    </BarChart>

                :

                    <Skeleton variant="rectangular" width={500} height={300}  />

        }
        </>
    )
}