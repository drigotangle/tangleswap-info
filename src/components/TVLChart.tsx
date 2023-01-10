import { Line, LineChart } from 'recharts'
import { getTVL } from '../functions'
import { ITVL } from '../interfaces'
import { useContext, useEffect } from 'react'
import { setTVL } from '../state/Actions'
import { AppContext } from '../state'

export const TVLChart = () => {
    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        getTVL().then((res) => {
            setTVL(dispatch, res)
        })
        console.log(state, 'state')
    })

    return(
        <>
            <LineChart width={730} height={250} data={state.tvl}>
                    <Line type="monotone" dataKey="tvl" stroke="#8884d8" />
            </LineChart>            
        </>
    )
}