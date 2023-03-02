import { Paper, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ColumnWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import PoolDataTable from '../../components/PoolsTable'
import { getPools } from '../../functions'
import { IPoolData } from '../../interfaces'
import { AppContext } from '../../state'
import { setPoolData } from '../../state/Actions'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
    margin-top: 10vh;
`


const Pools = () => {

    const { dispatch } = useContext(AppContext)

    useEffect(() => {
        //POOLS TABLE
        getPools(15).then((res: IPoolData[]) => {
            console.log(res, 'pools')
            setPoolData(dispatch, res)
        })
        
      }, [])
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