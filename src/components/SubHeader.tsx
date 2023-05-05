import { useCallback, useContext, useEffect, useState } from 'react'
import { Stack, Chip, Typography } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import styled from 'styled-components'
import { AppContext } from '../state'
import { getLiquidityTx, getPools, getSwapTx, getTVL, getTokens, getUsdPrice } from '../functions'
import { setPoolData, setTokenData, setTxData, setUsdPrice } from '../state/Actions';
import { useTheme } from '@mui/material/styles';
import { IPoolData, IToken, ITx } from '../interfaces';


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
                usdPrice,
                pools,
                tokens,
                liquidityTx,
                swapTx,
            ] = await Promise.all([
                getUsdPrice(chain),
                getPools(1000, chain),
                getTokens(chain),
                getLiquidityTx(1000, chain),
                getSwapTx(1000, chain),
            ]);


            const lastBlockFromLiquidityTx = liquidityTx[liquidityTx.length - 1].blockNumber;


            setLastBlockSync(lastBlockFromLiquidityTx);
            setUsdPrice(dispatch, Number(usdPrice.USD));

            const orderedTokenData = tokens.sort((a: IToken, b: IToken) => { return (b.lastPrice * usdPrice) - (a.lastPrice * usdPrice); });
            const orderedPoolData = pools.sort((a: IPoolData, b: IPoolData) => { return (Number(b.liquidity) * usdPrice) - (Number(a.liquidity) * usdPrice) })
            const orderedLiquidity = liquidityTx.sort((a: ITx, b: ITx) => { return Number(a.blockNumber) - Number(b.blockNumber) });
            const orderedSwap = swapTx.sort((a: ITx, b: ITx) => { return Number(a.blockNumber) - Number(b.blockNumber) });


            // Update the state with the fetched data
            setPoolData(dispatch, orderedPoolData);
            setTokenData(dispatch, orderedTokenData);
            setTxData(dispatch, [...orderedLiquidity, ...orderedSwap]);

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