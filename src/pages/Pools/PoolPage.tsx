import { useParams } from "react-router-dom"

const PoolPage = () => {
    const { poolAddress } = useParams()

    return(<>{poolAddress}</>)
}

export default PoolPage