import { Paper } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PaperWrapper } from '.'
import { feesGenerated, vol24H } from '../functions'
import { ITVL } from '../interfaces'
import { AppContext } from '../state'



const SpanWrapper = styled.div`
    width: max-content;
`

const HomeGeneral = () => {
    const { state } = useContext(AppContext)
    const [ fees, setFees ] = useState<number>()
    const tvl: ITVL[] = state.tvl
    useEffect(() => {
        feesGenerated().then(((res: number) => { setFees(res) }))
    }, [])

    return(

    <Paper>
        <PaperWrapper>
                <SpanWrapper>Volume24h: {vol24H(state.tvl)}</SpanWrapper>
                <SpanWrapper>Fees generated: {fees}</SpanWrapper>
                <SpanWrapper>TVL: {tvl[tvl.length - 1]?.tvl}</SpanWrapper>
        </PaperWrapper>
    </Paper>
    )
}

export default HomeGeneral