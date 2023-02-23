import { useContext, useEffect, useState } from "react";
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getPools } from "../functions";
import { IPoolData } from "../interfaces";
import { setPoolData } from "../state/Actions";
import { AppContext } from "../state";



const PoolDataTable = () => {
  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    getPools(15).then((res: IPoolData[]) => {
        console.log(res, 'pools')
        setPoolData(dispatch, res)
    })
  }, [])

  return (

    state.poolData.length > 0 

    ?

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Volume 24H</TableCell>
            <TableCell>Volume 7D</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.poolData.map((row: IPoolData) => (
            <TableRow key={`${row.symbol0}-${row.symbol1}`}>
              <TableCell>{row.symbol0}/{row.symbol1}{" "}{row.fee / 10000}%</TableCell>
              <TableCell>{row.tvl}</TableCell>
              <TableCell>{row.volume24H}</TableCell>
              <TableCell>{row.volume7D}</TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <Skeleton variant="rectangular" width={1030} height={300}  />
    
  );
};

export default PoolDataTable;