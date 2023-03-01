import { useContext } from "react";
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead } from "@mui/material";
import { StyledTableRow } from './'
import { IPoolData } from "../interfaces";
import { AppContext } from "../state";
import { SkeletonWrapper } from ".";



const PoolDataTable = () => {
  const { state } = useContext(AppContext)

  // useEffect(() => {
  //   getPools(15).then((res: IPoolData[]) => {
  //       console.log(res, 'pools')
  //       setPoolData(dispatch, res)
  //   })
  // }, [])

  return (

    state.poolData.length > 0 

    ?

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <TableCell>Pool</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Volume 24H</TableCell>
            <TableCell>Volume 7D</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {state.poolData.map((row: IPoolData) => (
            <StyledTableRow key={`${row.symbol0}-${row.symbol1}`}>
              <TableCell>{row.symbol0}/{row.symbol1}{" "}{row.fee / 10000}%</TableCell>
              <TableCell>{row.tvl}</TableCell>
              <TableCell>{row.volume24H}</TableCell>
              <TableCell>{row.volume7D}</TableCell> 
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>
    
  );
};

export default PoolDataTable;