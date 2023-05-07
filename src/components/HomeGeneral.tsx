import { Paper, Typography } from '@mui/material'
import { FC } from 'react'
import { PaperWrapper, SpanWrapper } from '.'

interface IProps {
    volume24h: string | undefined
    feesGenerated: string | undefined
    tvl: string | undefined
}

const HomeGeneral: FC<IProps> = (props) => {
    const { volume24h, feesGenerated, tvl } = props
    return (<>
            <Paper>
                <PaperWrapper>
                    <SpanWrapper><Typography variant="h5">Volume24h: ${volume24h}</Typography></SpanWrapper>
                    <SpanWrapper><Typography variant="h5">Fees generated: ${feesGenerated}</Typography></SpanWrapper>
                    <SpanWrapper><Typography variant="h5">TVL: ${tvl}</Typography></SpanWrapper>
                </PaperWrapper>
            </Paper>
    </>)
}

export default HomeGeneral