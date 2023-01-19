import styled from 'styled-components'
import { DailyVolumeChart } from '../../components/DailyVolumeChart'
import { TVLChart } from '../../components/TVLChart'

const HomeChartWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

const Home = () => {
    return(
        <>
            <HomeChartWrapper>
                <TVLChart />
                <DailyVolumeChart />
            </HomeChartWrapper>    
        </>
    )
}

export default Home