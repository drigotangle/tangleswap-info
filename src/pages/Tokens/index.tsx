import { Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import SubHeader from '../../components/SubHeader'
import TokenTable from '../../components/TokenTable'
import TopMoversCard from '../../components/TopMoversCard'
import { getTokens } from '../../functions'
import { IToken } from '../../interfaces'
import { AppContext } from '../../state'
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

    useEffect(() => {
        //TOKENS TABLE
    getTokens(state.chain).then((res: IToken[]) => {
        let arr: IToken[] = res
        arr.sort((a: IToken, b: IToken) => {
            return Number(a.TVL) - Number(b.TVL)
        })
            setTokenData(dispatch, arr)
        })    
      }, [state.chain])


    return(<>
        <SubHeader  />
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