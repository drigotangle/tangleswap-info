import { Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PaperWrapper } from '.'
import { feesGenerated, getTVL, vol24H } from '../functions'
import { ITVL } from '../interfaces'
import { AppContext } from '../state'



const SpanWrapper = styled.div`
    width: max-content;
`

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

        })
    }, [state.chain])
    return (
        <Paper>
            <PaperWrapper>
                <SpanWrapper><Typography variant="h5">Volume24h: ${barChart[barChart.length - 1].tvl * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">Fees generated: ${fees * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">TVL: ${Number(lastTvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
            </PaperWrapper>
        </Paper>
    )
}

export default HomeGeneral