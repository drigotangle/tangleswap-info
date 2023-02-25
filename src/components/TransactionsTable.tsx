import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';
import { getLiquidityTx, getSwapTx } from '../functions';
import { ITx } from '../interfaces';
import { AppContext } from '../state';
import { setTxData } from '../state/Actions';
import relativeTime from 'dayjs/plugin/relativeTime';


const TokenTable = () => {
  const { state, dispatch } = useContext(AppContext)    
  useEffect(() => {
    Promise.all([getLiquidityTx(20),  getSwapTx(20)]).
    then(async (res: ITx[][]) => {
      const liquidity = res[0]
      const swap = res[1]
      const all = swap.concat(liquidity)
      setTxData(dispatch, all)
    })
    // getLiquidityTx(20).then((res: ITx[]) => {
    //     let arr: ITx[] = res
    //     arr.sort((a: ITx, b: ITx) => {
    //         return Number(a.blockNumber) - Number(b.blockNumber)
    //     })
    //     console.log(arr)
    //     setTxData(dispatch, arr)
    // })

    // getSwapTx(20).then((res: ITx[]) => {
    //   let arr: ITx[] = res
    //   arr.sort((a: ITx, b: ITx) => {
    //       return Number(a.blockNumber) - Number(b.blockNumber)
    //   })
    //   console.log(arr)
    //   setTxData(dispatch, arr)      
    // })
  }, [])

  dayjs.extend(relativeTime)

  return (

    state.txData.length > 0 

    ?

    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Event Name</TableCell>
          <TableCell>Symbol 0</TableCell>
          <TableCell>Symbol 1</TableCell>
          <TableCell>Amount 0</TableCell>
          <TableCell>Amount 1</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.txData.map((event: ITx, index) => (
          <TableRow key={index}>
            <TableCell>{event.eventName}</TableCell>
            <TableCell>{event.symbol0}</TableCell>
            <TableCell>{event.symbol1}</TableCell>
            <TableCell>{event.amount0}</TableCell>
            <TableCell>{event.amount1}</TableCell>
            <TableCell>{dayjs(event.time).fromNow()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

    :

    <Skeleton variant="rectangular" width={1280} height={300}  />

  );
};

export default TokenTable;