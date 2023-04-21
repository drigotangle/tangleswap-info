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
    const { usdPrice } = state
    const tvl: ITVL[] = state.tvl
    useEffect(() => {
        feesGenerated(state.chain).then(((res: number) => { setFees(res) }))
        getTVL(10, state.chain).then((res: ITVL[]) => {
            const lastIndex = res[res.length - 1].tvl
            setLastTvl(lastIndex)
        })
    }, [state.chain])
    console.log(tvl, 'tvl')
    return (
        <Paper>
            <PaperWrapper>
                <SpanWrapper><Typography variant="h5">Volume24h: ${vol24H(state.tvl) * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">Fees generated: ${fees * usdPrice}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">TVL: ${Number(lastTvl * usdPrice).toFixed(2)}</Typography></SpanWrapper>
            </PaperWrapper>
        </Paper>
    )
}

export default HomeGeneral