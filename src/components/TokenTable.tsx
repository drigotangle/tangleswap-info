import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useContext, useEffect } from 'react';
import { getTokens } from '../functions';
import { IToken } from '../interfaces';
import { AppContext } from '../state';
import { setTokenData } from '../state/Actions';


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
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Last Price</TableCell>
            <TableCell>Price Change</TableCell>
            <TableCell>Volume 24H</TableCell>
            <TableCell>TVL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.tokenData.map((token: IToken) => (
            <TableRow key={token.tokenAddress}>
              <TableCell>{token.tokenName}</TableCell>
              <TableCell>{token.tokenAddress}</TableCell>
              <TableCell>{Number(token.lastPrice).toFixed(2)}</TableCell>
              <TableCell>{Number((token.priceChange) / 100).toFixed(2)}%</TableCell>
              <TableCell>{token.volume24H}</TableCell>
              <TableCell>{(token.TVL?.toFixed(2)) ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <Skeleton variant="rectangular" width={1030} height={300}  />

  );
};

export default TokenTable;