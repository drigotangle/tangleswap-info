import { useCallback, useContext, useEffect, useState, FC } from 'react'
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
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useContext(AppContext)
    const { chain, usdPrice } = state
    const theme = useTheme();
    

    const loadDataFromLocalStorage = useCallback(
        (setLoading: (loading: boolean) => void) => {
            const storedData = localStorage.getItem('data');
            if (storedData) {
                const {
                    tvl,
                    usdPrice,
                    pools,
                    tokens,
                    liquidityTx,
                    swapTx,
                } = JSON.parse(storedData);

                setTVL(dispatch, tvl);
                setUsdPrice(dispatch, Number(usdPrice.USD));
                setPoolData(dispatch, pools);
                setTokenData(dispatch, tokens);
                setTxData(dispatch, [...liquidityTx, ...swapTx]);
            }
        },
        [dispatch],
    );

    useEffect(() => {
        loadDataFromLocalStorage(setLoading);

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
                    getLiquidityTx(20, chain),
                    getSwapTx(20, chain),
                ]);

                const firstPriceArr = pools[0].price;
                const firstLiquidityArr = pools[0].liquidity;
                const lastBlockFromLiquidityTx = liquidityTx[liquidityTx.length - 1].blockNumber;

                setLastBlockSync(lastBlockFromLiquidityTx);
                setUsdPrice(dispatch, Number(usdPrice.USD));

                // Store the fetched data in local storage
                localStorage.setItem('data', JSON.stringify({
                    tvl,
                    usdPrice,
                    pools,
                    tokens,
                    liquidityTx,
                    swapTx,
                }));

                // Update the state with the fetched data
                setTVL(dispatch, tvl);
                setPoolData(dispatch, pools);
                setTokenData(dispatch, tokens);
                setTxData(dispatch, [...liquidityTx, ...swapTx]);

                setLoading(false); // Set loading to false when the data is loaded
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [chain, dispatch, loadDataFromLocalStorage, setLoading]);

    useEffect(() => {
        // Schedule local storage deletion every 5 minutes
        const deleteLocalStorageInterval = setTimeout(() => {
            localStorage.removeItem('data');
        }, 3 * 60 * 1000);

        // Cleanup function to clear the timeout when the component is unmounted
        return () => {
            clearTimeout(deleteLocalStorageInterval);
        };
    }, []);

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

export default SubHeader