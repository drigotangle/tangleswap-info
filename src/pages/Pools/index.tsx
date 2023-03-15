import { Paper, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnWrapper, HomeWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import PoolDataTable from '../../components/PoolsTable'
import { getPools } from '../../functions'
import { IPoolData } from '../../interfaces'
import { AppContext } from '../../state'
import { setPoolData, setChain } from '../../state/Actions'




const Pools = () => {

    const { dispatch, state } = useContext(AppContext)
    const { chain: urlChain } = useParams()

    useEffect(() => {
        setChain(dispatch, urlChain)
    }, [])


    useEffect(() => {
        getPools(15, urlChain).then((res: IPoolData[]) => {
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
                <PoolDataTable pooList={state.poolData} />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Pools