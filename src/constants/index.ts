import { LogoMap } from "../interfaces"

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

    return [url, nestedUrl]
}

export const logo: LogoMap = {
    '0x344D046F732d3914808b8E9043D79FDBfdbFB4a9': 'https://raw.githubusercontent.com/TangleSwap/assets/main/chains/shimmer/smr.png', //SMR
    '0x9Ee409aa1e2Cd2d813e3B2471E00d5260A71b833': 'https://raw.githubusercontent.com/TangleSwap/assets/main/chains/shimmer/usdt.png', //USDT
    '0xd82c5eb4B816FCB380Eea196342884782597c613': 'https://raw.githubusercontent.com/TangleSwap/assets/main/chains/shimmer/usdc.png', //USDC
    '0xDFc050688123a92D822afc050753Db94F2dC6618': 'https://raw.githubusercontent.com/TangleSwap/assets/main/chains/shimmer/miota.png', //MIOTA

}

export const xLogo = 'https://github.com/TangleSwap/assets/blob/main/chains/shimmer/x.png?raw=true'