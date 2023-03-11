export const apiUrl = {
    'Ethereum': process.env.REACT_APP_API_ENDPOINT,
    'Shimmer': process.env.REACT_APP_API_ENDPOINT_SHIMMER
}

export const setUrl = (chain: string, pool: string) => {
    const url = `/${chain}/${pool}`

    const nestedUrl = {
        'Ethereum': `../pools/Ethereum/${chain}/${pool}`,
        'Shimmer': `../pools/Shimmer/${chain}/${pool}`
    }

    return [ url, nestedUrl ]
}