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