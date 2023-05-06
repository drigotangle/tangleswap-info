import { Box, Pagination, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
import { FC, useContext, useEffect, useState } from 'react';
import { ITx } from '../interfaces';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChartWrapper, SkeletonWrapper } from '.'
import { StyledTableRow, StyledTableCell } from './'
import { toSignificantDigits } from '../functions/toSignificant';
import { getExplorerUrl } from '../functions';
import { AppContext, initialState } from '../state';

interface IProps {
  txData: ITx[] | undefined
  chain: string | undefined
  usdPrice?: number
}

const TransactionsTable: FC<IProps> = (props) => {
  const { state } = useContext(AppContext)
  const { txData, chain, usdPrice } = props
  const [page, setPage] = useState(1);
  const [ tx, setTx ] = useState<ITx[]>()
  dayjs.extend(relativeTime)

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const StyledPagination = styled(Pagination)`
    margin: auto;
  `

  useEffect(() => {
    if(state.txData !== initialState.txData) {
      const sortedTx = txData?.sort((a: ITx, b: ITx) => { return b.blockNumber - a.blockNumber; });
      setTx(sortedTx)
    }
  }, [state.txData])

  return (<ChartWrapper>{
    state.txData !== initialState.txData
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
            {tx?.slice((page - 1) * 10, page * 10).map((event: ITx, index: number) => (
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
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <Box width="100%" display="flex" justifyContent="center">
                  <StyledPagination
                    count={Math.ceil(tx ? tx?.length / 10 : 0)}
                    page={page}
                    onChange={handlePageChange}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    size="large"
                    color='primary'
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      :
      <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300} /></SkeletonWrapper>
  }</ChartWrapper>);
};

export default TransactionsTable;