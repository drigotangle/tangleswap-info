import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartWrapper, SkeletonWrapper, StyledTableCell } from '.';
import { IToken } from '../interfaces';
import { AppContext } from '../state';
import { StyledTableRow } from './'

interface IProps {
  tokenList: IToken[] | undefined
}

const TokenTable: FC<IProps> = (props) => {

  const { state } = useContext(AppContext)
  const { tokenList } = props
  const navigate = useNavigate()
  
  const { chain } = state   

  return (<ChartWrapper>
    {
 
    tokenList !== undefined && tokenList.length > 0

    ?

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Last Price</TableCell>
            <TableCell>Price Change</TableCell>
            <TableCell>Volume 24H</TableCell>
            <TableCell>TVL</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {tokenList.map((token: IToken) => (
            <StyledTableRow key={token.tokenAddress}  onClick={_ => navigate(`/${chain}/Tokens/${token.tokenAddress}`)}>
              <StyledTableCell>{token.tokenName}</StyledTableCell>
              <StyledTableCell>{token.tokenAddress}</StyledTableCell>
              <StyledTableCell>{Number(token.lastPrice).toFixed(2)}</StyledTableCell>
              <StyledTableCell>{Number((token.priceChange) / 100).toFixed(2)}%</StyledTableCell>
              <StyledTableCell>{token.volume24H}</StyledTableCell>
              <StyledTableCell>{(token.TVL?.toFixed(2)) ?? 'N/A'}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>

    }
  </ChartWrapper>);
};

export default TokenTable;