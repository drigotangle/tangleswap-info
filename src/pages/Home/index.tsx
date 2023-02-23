import styled from 'styled-components'
import { ColumnWrapper, RowWrapper } from '../../components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import PoolDataTable from '../../components/PoolsTable'
import TokenTable from '../../components/TokenTable'
import TransactionsTable from '../../components/TransactionsTable'
import { TVLChart } from '../../components/TVLChart'

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    margin: auto auto;
`


const Home = () => {
    return(
        <HomeWrapper>
            <ColumnWrapper>
                <RowWrapper>
                    <TVLChart />
                    <DailyVolumeChart />
                </RowWrapper>
                <TokenTable />
                <PoolDataTable />
                <TransactionsTable />
            </ColumnWrapper>    
        </HomeWrapper>
    )
}

export default Home