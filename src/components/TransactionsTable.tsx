import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material';
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
  usdPrice?: number
}

const TransactionsTable: FC<IProps> = (props) => {
  const { txData, chain, usdPrice } = props
  dayjs.extend(relativeTime)

  return (<ChartWrapper>{
    ![txData, usdPrice, txData].includes(undefined)
      ?
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <TableCell><Typography variant="h5">Event Name</Typography></TableCell>
              <TableCell><Typography variant="h5">Total Value</Typography></TableCell>
              <TableCell><Typography variant="h5">First Amount</Typography></TableCell>
              <TableCell><Typography variant="h5">Second Amount</Typography></TableCell>
              <TableCell><Typography variant="h5">Account</Typography></TableCell>
              <TableCell><Typography variant="h5">Time</Typography></TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {txData?.map((event: ITx, index) => (
              <StyledTableRow key={index} onClick={() => window.open(getExplorerUrl(chain, event.hash))}>
                <StyledTableCell>
                  <Typography color='primary' variant="h5">
                    {
                      event.eventName === 'Swap'
                        ? `Swap ${event.symbol0} for ${event.symbol1}`
                        : event.eventName === 'IncreaseLiquidity'
                          ? `Add ${event.symbol0} and ${event.symbol1}`
                          : event.eventName === 'DecreaseLiquidity'
                            ? `Remove ${event.symbol0} and ${event.symbol1}`
                            : event.eventName
                    }
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">${Number(event.value * (usdPrice ?? 1)).toFixed(2)}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">{toSignificantDigits(event.amount0, 3) + " " + event.symbol0}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">{toSignificantDigits(event.amount1, 3) + " " + event.symbol1}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography color='primary' variant="h5">
                    {event.account
                      ? event.account.substring(0, 5) + "..." + event.account?.substring(event.account?.length - 4)
                      : ""}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">{dayjs(event.time).fromNow()}</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      :
      <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300} /></SkeletonWrapper>
  }</ChartWrapper>);
};

export default TransactionsTable;