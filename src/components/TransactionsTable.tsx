import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { ITx } from '../interfaces';
import { AppContext } from '../state';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SkeletonWrapper } from '.'
import { StyledTableRow } from './'


const TransactionsTable = () => {
  const { state } = useContext(AppContext)    
  // useEffect(() => {
  //   Promise.all([getLiquidityTx(20),  getSwapTx(20)]).
  //   then(async (res: ITx[][]) => {
  //     const liquidity = res[0]
  //     const swap = res[1]
  //     const all = swap.concat(liquidity)
  //     setTxData(dispatch, all)
  //   })
  // }, [])

  dayjs.extend(relativeTime)

  return (

    state.txData.length > 0 

    ?

    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <StyledTableRow>
          <TableCell>Event Name</TableCell>
          <TableCell>Symbol 0</TableCell>
          <TableCell>Symbol 1</TableCell>
          <TableCell>Amount 0</TableCell>
          <TableCell>Amount 1</TableCell>
          <TableCell>Time</TableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {state.txData.map((event: ITx, index) => (
          <StyledTableRow key={index}>
            <TableCell>{event.eventName}</TableCell>
            <TableCell>{event.symbol0}</TableCell>
            <TableCell>{event.symbol1}</TableCell>
            <TableCell>{event.amount0}</TableCell>
            <TableCell>{event.amount1}</TableCell>
            <TableCell>{dayjs(event.time).fromNow()}</TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>

  );
};

export default TransactionsTable;