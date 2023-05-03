import { useCallback, useContext, useEffect, useState } from 'react'
import { Stack, Chip, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import styled from 'styled-components'
import { AppContext } from '../state'
import { getLiquidityTx, getPools, getSwapTx, getTVL, getTokens, getUsdPrice } from '../functions'
import { setPoolData, setTVL, setTokenData, setTxData, setUsdPrice } from '../state/Actions';
import { useTheme } from '@mui/material/styles';


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

const SubHeader = () => {
    const [lastBlockSync, setLastBlockSync] = useState<number>()
    const { state, dispatch } = useContext(AppContext)
    const { chain, usdPrice } = state
    const theme = useTheme();

    const fetchData = async () => {
        try {
            const [
                tvl,
                usdPrice,
                pools,
                tokens,
                liquidityTx,
                swapTx,
            ] = await Promise.all([
                getTVL(1000, chain),
                getUsdPrice(chain),
                getPools(1000, chain),
                getTokens(chain),
                getLiquidityTx(100, chain),
                getSwapTx(100, chain),
            ]);


            const lastBlockFromLiquidityTx = liquidityTx[liquidityTx.length - 1].blockNumber;

            const orderedLiquidityTx = liquidityTx.sort((a: any, b: any) => { return b.block - a.block });
            const orderedswapTx = swapTx.sort((a: any, b: any) => { return b.block - a.block });

            setLastBlockSync(lastBlockFromLiquidityTx);
            setUsdPrice(dispatch, Number(usdPrice.USD));

            // Update the state with the fetched data
            setTVL(dispatch, tvl);
            setPoolData(dispatch, pools);
            setTokenData(dispatch, tokens);
            setTxData(dispatch, [...orderedLiquidityTx, ...orderedswapTx]);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [chain, dispatch]);

    return (
        <HeadWrapper>
            {
                <Stack direction="row" spacing={1}>
                    <StyledSpan><Chip onDelete={_ => { }} deleteIcon={<FiberManualRecordIcon color="success" />} label={`Latest synced block ${lastBlockSync ?? 0}`} /></StyledSpan>
                    <StyledSpan><Typography variant='subtitle1' style={{ color: theme.palette.secondary.contrastText }}  >SMR Price: $ {usdPrice ?? 0}</Typography></StyledSpan>
                </Stack>
            }
        </HeadWrapper>
    )
}

export default SubHeader;