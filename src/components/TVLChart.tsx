import { Area, AreaChart, XAxis, Tooltip } from 'recharts'
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
    const { usdPrice } = state

    return (
        <Wrapper>
            {

                chartData !== undefined

                    ?

                    <AreaChart width={chartWidth} height={300} data={chartData}>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            minTickGap={10}
                            color='#191B1F'
                            tickFormatter={(value) => dayjs(value).format('DD')}
                        />
                        <Area
                            dataKey="tvl"
                            strokeWidth={0}
                            fill='#740E95'
                            fillOpacity={0.5}
                        />
                        <Tooltip
                            labelFormatter={(value: any) => `Day: ${value}`}
                            formatter={(value: any) => [`$${Number(value * usdPrice).toFixed(2)}`]}
                            cursor={{ stroke: '#740E95', strokeWidth: 0.1 }}
                        />
                    </AreaChart>

                    :

                    <Skeleton variant="rectangular" width={500} height={300} />

            }
        </Wrapper>
    )
}