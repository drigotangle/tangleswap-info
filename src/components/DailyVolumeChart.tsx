import { BarChart, ResponsiveContainer, XAxis, Bar } from 'recharts'
import { getTVL, minMax } from '../functions'
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
        const from = 400000 
        getTVL(from).then((res) => {
            let arr: ITVL[] | any = []
            for(let i = 0; i < res.length; i++){
                console.log(moment(res[i].time).day(), 'res')
            if(i > 0 && moment(res[i]?.time).day() !== moment(res[i - 1]?.time).day()){
                    arr.push({
                        tvl: res[i].tvl + 8000,
                        time: dayjs(res[i].time).format('DD')
                    })                    
            }

            if(i < 0){
                    arr.push({
                        tvl: res[0].tvl + 8000,
                        time: moment(res[0].time).day()
                    })                    
            }
            const day = arr.filter((obj: any) => moment(obj.time).day() === moment(res[i].time).day())
            if(arr[arr.indexOf(day)]?.tvl !== undefined){
                arr[arr.indexOf(day)].tvl =+ res[i].tvl
            }
            }
            console.log(arr, 'arr')
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

            state.tvl.length > 0 

                ?

                    <BarChart width={500} height={300} data={state.barChart}>
                        <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={10}
                        />
                        <Bar dataKey="tvl" barSize={20} />              
                    </BarChart>

                :

                    <Skeleton variant="rectangular" width={210} height={118}  />

        }
        </>
    )
}