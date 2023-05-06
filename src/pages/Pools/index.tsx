import { Paper, Skeleton, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnWrapper, HomeWrapper, PaperWrapper } from '../../components'
import Header from '../../components/Header'
import PoolDataTable from '../../components/PoolsTable'
import SubHeader from '../../components/SubHeader'
import { getPools } from '../../functions'
import { IPoolData } from '../../interfaces'
import { AppContext, initialState } from '../../state'
import { setPoolData, setChain } from '../../state/Actions'
import Loading from '../../components/Loading'




const Pools = () => {

    const { state } = useContext(AppContext)
    const { chain, usdPrice } = state


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
                        <Typography variant="h4">All pools</Typography>
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
                <Typography variant='h4'>All pools</Typography>
                <PoolDataTable pooList={state.poolData} usdPrice={usdPrice} chain={chain} />
            </ColumnWrapper>
        </HomeWrapper>
    </>)
}

export default Pools