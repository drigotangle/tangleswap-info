import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import dayjs from 'dayjs';
import { FC } from 'react';
import { ITx } from '../interfaces';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChartWrapper, SkeletonWrapper } from '.'
import { StyledTableRow, StyledTableCell } from './'
import { toSignificantDigits } from '../functions/toSignificant';
import { getExplorerUrl } from '../functions';

interface IProps {
  txData: ITx[] | undefined
  chain: string | undefined
}

const TransactionsTable: FC<IProps> = (props) => {
  const { txData, chain } = props    
  dayjs.extend(relativeTime)

  return (<ChartWrapper>{
    txData !== undefined && txData.length > 0
      ?
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <TableCell>Event Name</TableCell>
            <TableCell>Total Value</TableCell>
            <TableCell>First Amount</TableCell>
            <TableCell>Second Amount</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Time</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {txData?.map((event: ITx, index) => (
            <StyledTableRow key={index} onClick={() => window.open(getExplorerUrl(chain, event.hash))}>
              <StyledTableCell>{
                event.eventName === 'Swap'
                  ? `Swap ${event.symbol0} for ${event.symbol1}`
                : event.eventName === 'IncreaseLiquidity'
                  ? `Add ${event.symbol0} and ${event.symbol1}`
                : event.eventName === 'DecreaseLiquidity'
                  ? `Remove ${event.symbol0} and ${event.symbol1}`
                : event.eventName
              }</StyledTableCell>
              <StyledTableCell>{event.value}</StyledTableCell>
              {/* <StyledTableCell>{"$" + toSignificantDigits(event.fiatValue, 3)}</StyledTableCell> */}
              <StyledTableCell>{toSignificantDigits(event.amount0, 3) + " " + event.symbol0}</StyledTableCell>
              <StyledTableCell>{toSignificantDigits(event.amount1, 3) + " " + event.symbol1}</StyledTableCell>
              <StyledTableCell>{event.account
                ? event.account.substring(0, 5) + "..." + event.account?.substring(event.account?.length - 4)
                : ""}</StyledTableCell>
              <StyledTableCell>{dayjs(event.time).fromNow()}</StyledTableCell>
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