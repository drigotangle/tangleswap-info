import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import dayjs from 'dayjs';
import { FC } from 'react';
import { ITx } from '../interfaces';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChartWrapper, SkeletonWrapper } from '.'
import { StyledTableRow } from './'
import { toSignificantDigits } from '../functions/toSignificant';

interface IProps {
  txData: ITx[] | undefined
}

const TransactionsTable: FC<IProps> = (props) => {
  const { txData } = props    
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

  return (<ChartWrapper>{
    txData !== undefined && txData.length > 0
      ?
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <TableCell>Event Name</TableCell>
            {/* <TableCell>Total Value</TableCell> */}
            <TableCell>First Amount</TableCell>
            <TableCell>Second Amount</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Time</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {txData?.map((event: ITx, index) => (
            <StyledTableRow key={index}>
              <TableCell>{
                event.eventName === 'Swap'
                  ? `Swap ${event.symbol0} for ${event.symbol1}`
                : event.eventName === 'IncreaseLiquidity'
                  ? `Add ${event.symbol0} and ${event.symbol1}`
                : event.eventName === 'DecreaseLiquidity'
                  ? `Remove ${event.symbol0} and ${event.symbol1}`
                : event.eventName
              }</TableCell>
              {/* <TableCell>{"$" + toSignificantDigits(event.fiatValue, 3)}</TableCell> */}
              <TableCell>{toSignificantDigits(event.amount0, 3) + " " + event.symbol0}</TableCell>
              <TableCell>{toSignificantDigits(event.amount1, 3) + " " + event.symbol1}</TableCell>
              <TableCell>{event.account
                ? event.account.substring(0, 5) + "..." + event.account?.substring(event.account?.length - 4)
                : ""}</TableCell>
              <TableCell>{dayjs(event.time).fromNow()}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    :
    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>
  }</ChartWrapper>);
};

export default TransactionsTable;