import { Paper, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnWrapper, HomeWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import PoolDataTable from '../../components/PoolsTable'
import SubHeader from '../../components/SubHeader'
import { getPools } from '../../functions'
import { IPoolData } from '../../interfaces'
import { AppContext } from '../../state'
import { setPoolData, setChain } from '../../state/Actions'
import Loading from '../../components/Loading'




const Pools = () => {

    const { dispatch, state } = useContext(AppContext)
    const [loading, setLoading] = useState(true);
    const { chain: urlChain } = useParams()
    const { chain, usdPrice } = state


    useEffect(() => {
        setChain(dispatch, urlChain)
    }, [])


    useEffect(() => {
        getPools(15, urlChain).then((res: IPoolData[]) => {
            console.log(res, 'pools')
            setPoolData(dispatch, res)
        })       
    }, [])

    if (loading) {
        return (<>
            <SubHeader setLoading={setLoading} />
            <Header />
            <Loading />
        </>)
    }

    return(<>
        <SubHeader setLoading={setLoading} />
        <Header />  
        <HomeWrapper>
            <ColumnWrapper>
            <Typography variant='h4'>Your Watchlist</Typography>
            <Paper><PaperWrapper>Your saved pools will appear here</PaperWrapper></Paper>
            <Typography variant='h4'>All pools</Typography>
            <PoolDataTable pooList={state.poolData} usdPrice={usdPrice} chain={chain} />
            </ColumnWrapper>    
        </HomeWrapper>
        </>)
}

export default Pools