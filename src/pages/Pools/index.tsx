import { Paper, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import PoolDataTable from '../../components/PoolsTable'
import { getPools } from '../../functions'
import { IPoolData } from '../../interfaces'
import { AppContext } from '../../state'
import { setPoolData, setChain } from '../../state/Actions'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
    margin-top: 10vh;
`


const Pools = () => {

    const { dispatch, state } = useContext(AppContext)
    const { chain } = state
    useEffect(() => {
        if(chain === undefined){
            setChain(dispatch, 'Ethereum')
        }
        setChain(dispatch, chain)
        getPools(15, state.chain).then((res: IPoolData[]) => {
            console.log(res, 'pools')
            setPoolData(dispatch, res)
        })
        
      }, [chain])
    return(<>
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
            <Typography variant='h6'>Your Watchlist</Typography>
            <Paper><PaperWrapper>Your saved pools will appear here</PaperWrapper></Paper>
            <Typography variant='h6'>All pools</Typography>
                <PoolDataTable />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Pools