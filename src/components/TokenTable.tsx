import { Box, Pagination, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartWrapper, PriceChangeSpan, SkeletonWrapper, StyledTableCell, TokenImage } from '.';
import { IToken } from '../interfaces';
import { AppContext, initialState } from '../state';
import { StyledTableRow } from './'
import { logo, xLogo } from '../constants';
import styled from 'styled-components';

interface IProps {
  tokenList: IToken[] | any
}

const TokenTable: FC<IProps> = (props) => {

  const { state } = useContext(AppContext)
  const { tokenList } = props
  const navigate = useNavigate()

  const { chain, usdPrice } = state

  const [page, setPage] = useState(1);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const StyledPagination = styled(Pagination)`
    margin: auto;
  `

  return (<ChartWrapper>
    {

      state.tokenData !== initialState.tokenData

        ?

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <TableCell><Typography variant="h5">Name</Typography></TableCell>
                <TableCell><Typography variant="h5">Address</Typography></TableCell>
                <TableCell><Typography variant="h5">Last Price</Typography></TableCell>
                <TableCell><Typography variant="h5">Price Change</Typography></TableCell>
                <TableCell><Typography variant="h5">Volume 24H</Typography></TableCell>
                <TableCell><Typography variant="h5">TVL</Typography></TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {tokenList?.slice((page - 1) * 10, page * 10).map((token: IToken) => (
                <StyledTableRow key={token.tokenAddress} onClick={() => navigate(`/${chain}/Tokens/${token.tokenAddress}`)}>
                  <StyledTableCell>
                    <Typography variant="h5"><span><TokenImage src={logo[token.tokenAddress] ?? xLogo} />{token.tokenName}</span></Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h5">{token.tokenAddress}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h5">${Number(Number(token.lastPrice) * usdPrice).toFixed(2)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h5">
                      {
                        isNaN(Number(token.priceChange / 100))
                          ?
                          'N/A'
                          :
                          <PriceChangeSpan priceChange={token.priceChange / 100}>{Number(token.priceChange / 100).toFixed(2)}%</PriceChangeSpan>
                      }
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h5">${isNaN(token.volume24H) ? 0 : Number(token.volume24H * usdPrice).toFixed(2)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="h5">${Number(token.TVL * usdPrice).toFixed(2) ?? 'N/A'}</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box width="100%" display="flex" justifyContent="center">
                    <StyledPagination
                      count={Math.ceil(tokenList ? tokenList?.length / 10 : 0)}
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

    }
  </ChartWrapper>);
};

export default TokenTable;