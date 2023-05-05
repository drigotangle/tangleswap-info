import { BarChart, XAxis, Bar, Tooltip, ResponsiveContainer } from 'recharts'
import { FC, useContext } from 'react'
import { AppContext } from '../state'
import { Skeleton } from '@mui/material'
import { GroupedEntry, IPoolLiquidity } from '../interfaces'
import styled from 'styled-components'
import dayjs from 'dayjs'

interface IChart {
    chartWidth: number
    chartData: IPoolLiquidity[] | GroupedEntry[] | any
}

const Wrapper = styled.div`
    margin: 0 auto;
    width: 100%;
`;

export const DailyVolumeChart: FC<IChart> = (props) => {
    const { state } = useContext(AppContext)
    const { usdPrice } = state
    const { chartWidth, chartData } = props

    return (
        <Wrapper>
            {

                chartData !== undefined

                    ?
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart height={300} data={chartData}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                minTickGap={10}
                                tickFormatter={(value) => dayjs(value).format('DD')}
                            />
                            <Bar
                                dataKey="tvl"
                                barSize={10}
                                fill="#2172E5"
                            />
                            <Tooltip
                                labelFormatter={(value: any) => `Day: ${value}`}
                                formatter={(value: any) => [`$${Number(value * usdPrice).toFixed(2)}`]}
                                cursor={{ fill: 'rgba(1, 0, 0, 0.1)' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                    :

                    <Skeleton variant="rectangular" width={500} height={300} />

            }
        </Wrapper>
    )
}

//#740E95