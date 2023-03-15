import { BarChart, XAxis, Bar } from 'recharts'
import { FC, useContext } from 'react'
import { AppContext } from '../state'
import { Skeleton } from '@mui/material'
import { GroupedEntry, IPoolLiquidity } from '../interfaces'
import { ChartWrapper } from '.'
import styled from 'styled-components'

interface IChart {
    chartWidth: number
    chartData: IPoolLiquidity[] | GroupedEntry[] | undefined
}

const Wrapper = styled.div`
    margin: auto auto;
`

export const DailyVolumeChart: FC<IChart> = (props) => {
    const { chartWidth, chartData } = props
    // const [ minMaxValue, setMinMaxValue ] = useState<DataKey<number>>()

    // useEffect(() => {
    //     const from = 10000
    //     getTVL(from).then((res) => {
    //         let arr: ITVL[] | any = []

    //         for(let i = 0; i < res.length; i++){

    //         if(i === 0 && res[i].time !== undefined){  
    //             arr.push({
    //                 tvl: res[i].tvl + 8000,
    //                 time: moment(res[i].time).format('DD')
    //             })                    
    //         }


    //         if(
    //             i > 0 && 
    //             moment(res[i].time).format('DD') !== arr[arr.length - 1]?.time &&
    //             res[i].time !== undefined
    //             ){
    //                 arr.push({
    //                     tvl: res[i].tvl + 8000,
    //                     time: moment(res[i].time).format('DD')
    //                 })                    
    //         }

    //          if(
    //             i > 0 && 
    //             moment(res[i].time).format('DD') === arr[arr.length - 1]?.time &&
    //             res[i].time !== undefined &&
    //             arr[arr.lenght - 1]?.tvl !== undefined
    //             ){
    //             arr[arr.lenght - 1].tvl += res[i].tvl
    //          }
    //         }
            
    //         arr.sort((a: ITVL, b: ITVL) => {
    //             return Number(a.time) - Number(b.time)
    //         })
            
    //         setLiquidtyBarData(dispatch, arr)
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
                    <BarChart width={chartWidth} height={300} data={chartData}>
                        <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={10}
                        />
                        <Bar 
                            dataKey="tvl" 
                            barSize={10}
                            fill="#740E95"
                        />              
                    </BarChart>

                :

                    <Skeleton variant="rectangular" width={500} height={300}  />

        }
        </Wrapper>
    )
}

//#740E95