import { useContext, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { AppContext } from "../../state"
import { setChain } from '../../state/Actions'

const PoolPage = () => {
    const { state } = useContext(AppContext)
    const { poolAddress } = useParams()
    
    return(<>{poolAddress}</>)
}

export default PoolPage