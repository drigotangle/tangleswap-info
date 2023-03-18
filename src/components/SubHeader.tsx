import { useContext, useEffect, useState } from 'react'
import { Stack, Chip, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import styled from 'styled-components'
import { AppContext } from '../state'
import { getTVL, getUsdPrice } from '../functions'
import { setUsdPrice } from '../state/Actions';

const HeadWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
gap: 2vw;
height: max-content;
`

const StyledSpan = styled.span`
    margin: auto auto;
`

const Header = () => {
    const [ lastBlockSync, setLastBlockSync ] = useState<number>()
    const { state, dispatch } = useContext(AppContext)
    const { chain, usdPrice } = state
    useEffect(() => {
        Promise.all([getTVL(1000, chain), getUsdPrice(chain)])
        .then(([tvl, usdPrice]) => {
            // setLastBlockSync(tvl[tvl.length - 1].blockNumber)
            console.log(usdPrice, tvl[tvl.length - 1].blockNumber, 'subheader')
            setLastBlockSync(tvl[tvl.length - 1].blockNumber)
            setUsdPrice(dispatch, Number(usdPrice.USD))
        })
    }, [chain])
    return(
        <HeadWrapper>
            {
                ![lastBlockSync, usdPrice].includes(undefined)

                ?
                
                <Stack direction="row" spacing={1}>
                <StyledSpan><Chip onDelete={_ => {}} deleteIcon={<FiberManualRecordIcon color="success" />} label={`Latest synced block ${lastBlockSync}`} /></StyledSpan>
                <StyledSpan><Typography variant='subtitle1'>SMR Price: $ {usdPrice}</Typography></StyledSpan>
                </Stack>
                
                :

                <></>
            }       
        </HeadWrapper>
    )
}

export default Header