import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartWrapper, PriceChangeSpan, SkeletonWrapper, StyledTableCell, TokenImage } from '.';
import { IToken } from '../interfaces';
import { AppContext } from '../state';
import { StyledTableRow } from './'
import { logo, xLogo } from '../constants';

interface IProps {
  tokenList: IToken[] | any
}

const TokenTable: FC<IProps> = (props) => {

  const { state } = useContext(AppContext)
  const { tokenList } = props
  const navigate = useNavigate()

  const { chain, usdPrice } = state

  return (<ChartWrapper>
    {

      tokenList !== undefined && tokenList.length > 0

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
              {tokenList.map((token: IToken) => (
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
                    <Typography variant="h5">${(Number(token.TVL?.toFixed(2))) * usdPrice ?? 'N/A'}</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        :

        <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300} /></SkeletonWrapper>

    }
  </ChartWrapper>);
};

export default TokenTable;