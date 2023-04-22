import { Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PaperWrapper, SpanWrapper } from '.'
import { calculateTVLPercentageDifference, feesGenerated, getTVL, vol24H } from '../functions'
import { ITVL } from '../interfaces'
import { AppContext } from '../state'


const HomeGeneral = () => {
    const { state } = useContext(AppContext)
    const [fees, setFees] = useState<number>(0)
    const [lastTvl, setLastTvl] = useState<number>(0)
    const { usdPrice, chain, barChart } = state
    useEffect(() => {
        Promise.all([feesGenerated(chain), getTVL(100, chain)]).then(([fee, tvl]) => {
            setFees(fee)
            const lastIndex = tvl[tvl.length - 1].tvl
            setLastTvl(lastIndex)
            const tvlChange = calculateTVLPercentageDifference(tvl)
            console.log(tvlChange, 'tvlChange')
        })
    }, [state.chain])
    return (
        <Paper>
            <PaperWrapper>
                <SpanWrapper><Typography variant="h5">Volume24h: ${Number(barChart[barChart.length - 1].tvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">Fees generated: ${fees * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">TVL: ${Number(lastTvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
            </PaperWrapper>
        </Paper>
    )
}

export default HomeGeneral