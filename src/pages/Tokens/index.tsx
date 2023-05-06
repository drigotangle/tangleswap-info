import { Paper, Skeleton, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import SubHeader from '../../components/SubHeader'
import TokenTable from '../../components/TokenTable'
import TopMoversCard from '../../components/TopMoversCard'
import { getTokens } from '../../functions'
import { IToken } from '../../interfaces'
import { AppContext, initialState } from '../../state'
import { setTokenData } from '../../state/Actions'
import Loading from '../../components/Loading'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
    margin-top: 10vh;
`


const Pools = () => {

    const { dispatch, state } = useContext(AppContext)


    if (state === initialState) {
        return (
            <>
                <SubHeader />
                <Header />
                <HomeWrapper>
                    <ColumnWrapper>
                        <Typography variant="h4">Your Watchlist</Typography>
                        <Paper>
                            <Skeleton variant="rectangular" width="100%" height={100} />
                        </Paper>
                        <Typography variant="h4">Top movers</Typography>
                        <Skeleton variant="rectangular" width="100%" height={150} />
                        <Typography variant="h4">Top tokens</Typography>
                        <Skeleton variant="rectangular" width="100%" height={300} />
                    </ColumnWrapper>
                </HomeWrapper>
            </>
        );
    }



    return (<>
        <SubHeader />
        <Header />
        <HomeWrapper>
            <ColumnWrapper>
                <Typography variant='h4'>Your Watchlist</Typography>
                <Paper><PaperWrapper>Your saved pools will appear here</PaperWrapper></Paper>
                <Typography variant='h4'>Top movers</Typography>
                <Paper>
                    <TopMoversCard />
                </Paper>
                <Typography variant='h4'>Top tokens</Typography>
                <TokenTable tokenList={state.tokenData} />
            </ColumnWrapper>
        </HomeWrapper>
    </>)
}

export default Pools