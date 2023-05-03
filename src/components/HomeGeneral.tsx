import { Paper, Typography } from '@mui/material'
import { FC, useContext, useEffect, useState } from 'react'
import { PaperWrapper, SpanWrapper } from '.'
import { filterFee } from '../functions'
import { ITVL } from '../interfaces'
import { AppContext, initialState } from '../state'

interface IProps {
    volume24h: number
    feesGenerated: number
    tvl: number
}

const HomeGeneral: FC<IProps> = (props) => {
    const { volume24h, feesGenerated, tvl } = props
    return (
        <Paper>
            <PaperWrapper>
                <SpanWrapper><Typography variant="h5">Volume24h: ${Number(volume24h.toFixed(2))}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">Fees generated: ${Number(feesGenerated).toFixed(2)}</Typography></SpanWrapper>
                <SpanWrapper><Typography variant="h5">TVL: ${Number(tvl).toFixed(2)}</Typography></SpanWrapper>
            </PaperWrapper>
        </Paper>
    )
}

export default HomeGeneral