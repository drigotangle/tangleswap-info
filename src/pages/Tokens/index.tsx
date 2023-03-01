import { Paper, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, PaperWrapper, RowWrapper } from '../../components'
import Header from '../../components/Header'
import TokenTable from '../../components/TransactionsTable'
import { getTokens } from '../../functions'
import { IToken } from '../../interfaces'
import { AppContext } from '../../state'
import { setTokenData } from '../../state/Actions'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
    margin-top: 10vh;
`


const Pools = () => {

    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        
        //TOKENS TABLE
        getTokens().then((res: IToken[]) => {
            let arr: IToken[] = res
            arr.sort((a: IToken, b: IToken) => {
                return Number(a.TVL) - Number(b.TVL)
            })
            setTokenData(dispatch, arr)
        })
        
      }, [])
    return(<>
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
            <Typography variant='h6'>Your Watchlist</Typography>
            <Paper><PaperWrapper>Your saved pools will appear here</PaperWrapper></Paper>
            <Typography variant='h6'>All pools</Typography>
                <TokenTable />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Pools