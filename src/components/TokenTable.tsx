import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import { useContext } from 'react';
import { SkeletonWrapper } from '.';
import { IToken } from '../interfaces';
import { AppContext } from '../state';
import { StyledTableRow } from './'


const TokenTable = () => {
  const { state } = useContext(AppContext)    
  // useEffect(() => {
  //   getTokens().then((res: IToken[]) => {
  //       let arr: IToken[] = res
  //       arr.sort((a: IToken, b: IToken) => {
  //           return Number(a.TVL) - Number(b.TVL)
  //       })
  //       setTokenData(dispatch, arr)
  //   })
  // }, [])

  return (

    state.tokenData.length > 0 

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
          {state.tokenData.map((token: IToken) => (
            <StyledTableRow key={token.tokenAddress}>
              <TableCell>{token.tokenName}</TableCell>
              <TableCell>{token.tokenAddress}</TableCell>
              <TableCell>{Number(token.lastPrice).toFixed(2)}</TableCell>
              <TableCell>{Number((token.priceChange) / 100).toFixed(2)}%</TableCell>
              <TableCell>{token.volume24H}</TableCell>
              <TableCell>{(token.TVL?.toFixed(2)) ?? 'N/A'}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>

  );
};

export default TokenTable;