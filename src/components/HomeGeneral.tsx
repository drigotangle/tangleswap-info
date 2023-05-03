import { Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PaperWrapper, SpanWrapper } from '.'
import { calculateTVLPercentageDifference, feesGenerated, filterFee, getTVL, vol24H } from '../functions'
import { ITVL } from '../interfaces'
import { AppContext, initialState } from '../state'


const HomeGeneral = () => {
    const { state } = useContext(AppContext)
    const [fees, setFees] = useState<ITVL[]>([])
    const [lastTvl, setLastTvl] = useState<number>(0)
    const { usdPrice, chain, barChart } = state
    useEffect(() => {
        if(![state.tvl === initialState.tvl, state.txData === initialState.txData].includes(false)){
            setLastTvl(state.tvl[state.tvl.length - 1].tvl)
            const fees = filterFee(state.txData)
            setFees(fees)
        }
    }, [state.chain])
    return (
        <Paper>
            <PaperWrapper>
                <SpanWrapper><Typography variant="h5">Volume24h: ${Number(barChart[barChart.length - 1].tvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">Fees generated: ${(fees[fees.length - 1]?.tvl ?? 0) * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">TVL: ${Number(lastTvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
            </PaperWrapper>
        </Paper>
    )
}

export default HomeGeneral